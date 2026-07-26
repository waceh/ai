---
id: agentcore-gateway
status: ready
title: "Lambda를 MCP 도구로 노출하는 Gateway 만들기"
source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-quick-start.html"
---

## 시나리오

기존 Lambda 함수를 에이전트가 쓸 수 있는 **MCP** 도구로 바꾸려면 프로토콜 변환·인증을 직접 구현하지 않고 **AgentCore Gateway**를 씁니다. AgentCore CLI로 Gateway와 Lambda 타깃을 만들고, Strands 에이전트에서 MCP 클라이언트로 연결합니다.

## 따라하기

1. 인증 없는(개발용) Gateway와 Lambda 타깃을 프로젝트에 추가합니다.

```bash
# 인바운드 인증 없는 Gateway (테스트용으로 가장 단순)
agentcore add gateway --name TestGateway --authorizer-type NONE --runtimes MyGatewayAgent

# Lambda 함수를 타깃으로 추가
agentcore add gateway-target --name TestLambdaTarget --type lambda-function-arn \
  --lambda-arn <YOUR_LAMBDA_ARN> \
  --tool-schema-file tools.json \
  --gateway TestGateway
```

2. 프로젝트를 배포합니다.

```bash
agentcore deploy
agentcore status   # Gateway URL 확인
```

3. Strands 에이전트에서 MCP 클라이언트로 Gateway에 연결합니다 (`pip install strands-agents mcp`).

```python
from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client

gateway_url = "<YOUR_GATEWAY_URL>"  # 'agentcore status' 출력값
bedrockmodel = BedrockModel(model_id="anthropic.claude-3-7-sonnet-20250219-v1:0", streaming=True)
mcp_client = MCPClient(lambda: streamablehttp_client(gateway_url))

with mcp_client:
    tools = mcp_client.list_tools_sync()
    agent = Agent(model=bedrockmodel, tools=tools)
    response = agent("What's the weather in Seattle?")
    print(response.message)
```

4. Gateway가 응답하는지 curl로 직접 확인할 수도 있습니다.

```bash
curl -X POST YOUR_GATEWAY_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## 핵심 포인트

- Gateway는 Lambda·API를 MCP 서버(`https://<gateway-id>.gateway.bedrock-agentcore.<region>.amazonaws.com/mcp`)로 노출합니다.
- 인바운드 인증은 `--authorizer-type NONE`(개발용) 또는 `CUSTOM_JWT`(운영용, OAuth discovery URL 필요)로 설정합니다.
- 에이전트 쪽에서는 Gateway를 일반 MCP 서버처럼 `MCPClient`로 연결해 도구 목록을 받아옵니다.

## 참고

- AgentCore Gateway로 시작하기: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-quick-start.html
