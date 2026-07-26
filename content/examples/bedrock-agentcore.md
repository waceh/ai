---
id: bedrock-agentcore
status: ready
title: "AgentCore CLI로 에이전트 배포·호출"
source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html"
---

## 시나리오

Strands Agents로 만든 에이전트를 로컬 프로토타입에서 AWS 프로덕션으로 옮기려면 세션 격리·엔드포인트 관리를 직접 구축하지 않고 **Bedrock AgentCore** Runtime에 배포합니다. AgentCore CLI(`agentcore`)로 프로젝트 생성부터 로컬 테스트, 배포, 호출까지 진행합니다.

## 따라하기

1. AgentCore CLI를 설치합니다 (Node.js 20+ 필요, npm 패키지로 배포됨).

```bash
npm install -g @aws/agentcore
agentcore --help
```

2. 에이전트 프로젝트를 생성합니다 (Strands + Bedrock 기본값).

```bash
agentcore create --name MyAgent --defaults
```

3. AWS에 배포하기 전에 로컬 개발 서버로 먼저 테스트합니다.

```bash
cd MyAgent
agentcore dev
```

새 터미널에서 프롬프트를 전달합니다.

```bash
agentcore dev "Hello, tell me a joke"
```

4. AgentCore Runtime에 배포합니다.

```bash
agentcore deploy
```

5. 배포된 에이전트를 CLI로 호출합니다.

```bash
agentcore invoke "Tell me a joke"
```

6. boto3로 프로그래밍 방식으로 호출합니다 (ARN은 `agentcore status`로 확인).

```python
import json
import uuid
import boto3

agent_arn = "Agent ARN"
prompt = "Tell me a joke"

# Initialize the Amazon Bedrock AgentCore client
agent_core_client = boto3.client('bedrock-agentcore')

# Prepare the payload
payload = json.dumps({"prompt": prompt}).encode()

# Invoke the agent
response = agent_core_client.invoke_agent_runtime(
    agentRuntimeArn=agent_arn,
    runtimeSessionId=str(uuid.uuid4()),
    payload=payload,
    qualifier="DEFAULT"
)

content = []
for chunk in response.get("response", []):
    content.append(chunk.decode('utf-8'))
print(json.loads(''.join(content)))
```

## 핵심 포인트

- `agentcore create`는 Strands Agents·LangChain/LangGraph·Google ADK·OpenAI Agents 프레임워크를 지원하며 Python 프로젝트를 스캐폴딩합니다.
- `agentcore dev`는 로컬에서 AgentCore Runtime 환경을 재현해 배포 전에 검증하게 해 줍니다.
- 배포된 에이전트는 `agentcore invoke` CLI 또는 boto3 `invoke_agent_runtime` API로 호출합니다.
- AgentCore Runtime은 ARM64(AWS Graviton)에서 동작하므로 Container 빌드를 쓸 때는 이미지도 ARM64여야 합니다.

## 참고

- AgentCore CLI로 시작하기: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html
- Amazon Bedrock AgentCore 개요: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html
