---
id: bedrock-agentcore-agentify
---

### 핵심 답변

**Bedrock AgentCore**는 기존 코드를 자동으로 "에이전트로 변환"해 주는 도구가 아닙니다. 실제로는 **산출물이 두 개로 분리**됩니다. **① 기존 앱은 그대로 둡니다** — Spring Boot 앱의 REST API를 **AgentCore Gateway**에 등록해 **MCP** 도구로 노출할 뿐, 코드는 손대지 않습니다. **② 완전히 새로운 "에이전트 코드"를 작성**해 그 도구들을 호출하게 하고, 그 코드를 **AgentCore Runtime**에 배포합니다. "AgentCore로 에이전트를 생성한다"는 것은 정확히 이 두 번째 산출물 — Runtime 위에 올라가는 별도의 LLM 추론 프로세스 — 을 만드는 일입니다.

### 무엇이 그대로고, 무엇을 새로 만드는가

| 구성 요소 | 기존 것을 그대로 쓰나 | 무엇으로 |
|---|---|---|
| Spring Boot 비즈니스 로직 | 예, 코드 변경 없음 | 지금 배포된 곳(EC2·ECS·EKS 등)에 그대로 유지 |
| REST API → 도구 변환 | 등록만 추가 | **AgentCore Gateway** target(OpenAPI 스펙) |
| API 인증 | 기존 API 키·OAuth 재사용 | Gateway의 outbound 인증 설정 → **AgentCore Identity** |
| LLM 추론 루프 | 새로 작성 | **Strands Agents** 같은 Agent SDK |
| 실행 환경 | 새로 배포 | **AgentCore Runtime** |

### 어디서부터 시작하나 — Spring Boot 예시로 단계별

**1단계 — Spring Boot 쪽에서 준비할 건 OpenAPI 스펙뿐**
이미 REST API가 있다면(springdoc-openapi 등으로 Swagger UI가 떠 있는 경우가 많습니다) 그 OpenAPI 3.0/3.1 스펙을 그대로 씁니다. Gateway가 요구하는 조건은 세 가지입니다: 각 오퍼레이션에 `operationId`가 있어야 하고, `servers.url`은 `https://api.example.com/v1`처럼 고정된 URL이어야 하며(동적 도메인 패턴은 SSRF 위험으로 거부됨), `oneOf`·`anyOf`·`allOf` 같은 복잡한 스키마 조합은 지원되지 않습니다.

**2단계 — Gateway를 만들고 그 스펙을 target으로 등록**

```bash
agentcore add gateway --name MyGateway --authorizer-type NONE
agentcore add gateway-target \
  --name SpringBootAPITarget \
  --type open-api-schema \
  --schema path/to/openapi-spec.json \
  --outbound-auth api-key \
  --gateway MyGateway
agentcore deploy
```

boto3로는 다음과 동일합니다.

```python
import boto3

agentcore_client = boto3.client('bedrock-agentcore-control')
target = agentcore_client.create_gateway_target(
    gatewayIdentifier="your-gateway-id",
    name="SpringBootAPITarget",
    targetConfiguration={
        "mcp": {
            "openApiSchema": {
                "s3": {"uri": "s3://your-bucket/openapi-spec.json"}
            }
        }
    },
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "API_KEY",
            "credentialProvider": {
                "apiKeyCredentialProvider": {
                    "providerArn": "arn:aws:agent-credential-provider:us-east-1:123456789012:token-vault/default/apikeycredentialprovider/abcdefghijk",
                    "credentialLocation": "HEADER",
                    "credentialParameterName": "X-API-Key",
                }
            },
        }
    ],
)
```

Gateway는 스펙의 `servers.url`로 직접 HTTP 요청을 보내는 **MCP** 서버가 됩니다. Spring Boot 앱은 Gateway가 네트워크로 도달할 수 있는 위치에 지금처럼 떠 있기만 하면 되고, 새로 옮기거나 다시 배포할 필요가 없습니다.

**3단계 — 실제로 "생성"되는 대상: 에이전트 코드**
Spring Boot 안에는 에이전트 코드가 없습니다. 별도 프로젝트에서 **Strands Agents**로 Gateway의 **MCP** 엔드포인트에 붙는 에이전트를 작성합니다.

```python
from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client

gateway_url = "<agentcore status로 확인한 Gateway URL>"
mcp_client = MCPClient(lambda: streamablehttp_client(gateway_url))

with mcp_client:
    tools = mcp_client.list_tools_sync()          # Spring Boot API가 그대로 도구 목록으로 나타남
    agent = Agent(model=BedrockModel(), tools=tools)
    print(agent("3번 주문 환불 처리해줘"))
```

**4단계 — 이 에이전트 코드를 AgentCore Runtime에 배포**

```bash
agentcore create --name SpringBootOpsAgent --defaults
# 생성된 main.py를 3단계 코드로 교체
agentcore deploy
agentcore invoke "3번 주문 환불 처리해줘"
```

여기서 새로 만들어지는 AWS 리소스는 **AgentCore Runtime** 위의 에이전트 런타임(`agentRuntimeArn`)입니다. Spring Boot 앱 쪽에는 새 리소스가 전혀 생기지 않습니다.

**5단계 — 인증이 더 필요하면 Identity를 얹는다**
2단계에서 이미 Gateway → Spring Boot API 방향 인증(API 키·OAuth)은 연결했습니다. 여기에 더해 "에이전트를 부르는 쪽"(최종 사용자)도 인증해야 한다면, **AgentCore Identity**의 인바운드 인증(Cognito 등 IdP 연동)을 Runtime·Gateway 앞단에 건다는 점만 추가하면 됩니다.

### 기존 "프로젝트를 Agent화" FAQ와 뭐가 다른가

**MCP** 서버를 직접 Spring Boot 안에 심는 방식(Spring AI MCP starter로 `@McpTool` 애노테이션 추가)도 이미 있습니다. 이번 방식과 기준은 하나입니다 — **Spring Boot 코드를 건드릴 수 있는가**.

| 기준 | Spring AI MCP 방식 | Bedrock AgentCore 방식 |
|---|---|---|
| Spring Boot 코드 변경 | 필요 (어댑터 클래스 추가) | 불필요 (OpenAPI 스펙만 있으면 됨) |
| 도구 변환·인증 처리 | 직접 구현 | **AgentCore Gateway**·**AgentCore Identity**가 관리형으로 처리 |
| 에이전트 실행 위치 | Claude Code 세션 또는 자체 서버 | **AgentCore Runtime**(서버리스, AWS 관리형) |
| 적합한 상황 | 코드 수정 가능, 대화형 세션으로 충분 | 코드 수정 불가/최소화하고 싶고, AWS 관리형 배포·관측을 쓰고 싶을 때 |

### 같이 보면 좋은 용어

**Bedrock AgentCore**, **AgentCore Gateway**, **AgentCore Runtime**, **AgentCore Identity**, **Strands Agents**, **MCP**, **Tool Use**, **AWS Bedrock**
