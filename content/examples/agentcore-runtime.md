---
id: agentcore-runtime
status: ready
title: "커스텀 컨테이너로 AgentCore Runtime에 배포"
source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-custom.html"
---

## 시나리오

AgentCore CLI 없이, 직접 만든 FastAPI 에이전트를 컨테이너로 패키징해 **AgentCore Runtime**에 배포하고 boto3로 호출합니다. Runtime 계약(`/invocations` POST, `/ping` GET, ARM64)만 지키면 어떤 프레임워크로 만든 에이전트든 올릴 수 있다는 점을 확인합니다.

## 따라하기

1. 프로젝트를 만들고 `/invocations`·`/ping` 엔드포인트를 구현하는 FastAPI 앱을 작성합니다 (`agent.py`).

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from strands import Agent

app = FastAPI(title="Strands Agent Server", version="1.0.0")
strands_agent = Agent()

class InvocationRequest(BaseModel):
    input: Dict[str, Any]

class InvocationResponse(BaseModel):
    output: Dict[str, Any]

@app.post("/invocations", response_model=InvocationResponse)
async def invoke_agent(request: InvocationRequest):
    user_message = request.input.get("prompt", "")
    if not user_message:
        raise HTTPException(status_code=400, detail="No prompt found in input.")
    result = strands_agent(user_message)
    return InvocationResponse(output={"message": result.message})

@app.get("/ping")
async def ping():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

2. ARM64 이미지로 빌드해 ECR에 푸시합니다.

```bash
docker buildx create --use
docker buildx build --platform linux/arm64 \
  -t account-id.dkr.ecr.us-west-2.amazonaws.com/my-strands-agent:latest --push .
```

3. boto3 `create_agent_runtime`로 배포합니다.

```python
import boto3

client = boto3.client('bedrock-agentcore-control', region_name='us-west-2')
response = client.create_agent_runtime(
    agentRuntimeName='strands_agent',
    agentRuntimeArtifact={
        'containerConfiguration': {
            'containerUri': 'account-id.dkr.ecr.us-west-2.amazonaws.com/my-strands-agent:latest'
        }
    },
    networkConfiguration={"networkMode": "PUBLIC"},
    roleArn='arn:aws:iam::account-id:role/AgentRuntimeRole',
)
print(response['agentRuntimeArn'], response['status'])
```

4. `invoke_agent_runtime`로 호출합니다.

```python
import boto3, json

agent_core_client = boto3.client('bedrock-agentcore', region_name='us-west-2')
payload = json.dumps({"input": {"prompt": "Explain machine learning in simple terms"}})

response = agent_core_client.invoke_agent_runtime(
    agentRuntimeArn='arn:aws:bedrock-agentcore:us-west-2:account-id:runtime/myStrandsAgent-suffix',
    runtimeSessionId='dfmeoagmreaklgmrkleafremoigrmtesogmtrskhmtkrlshmt',  # 33자 이상
    payload=payload,
    qualifier="DEFAULT"
)
print(json.loads(response['response'].read()))
```

## 핵심 포인트

- Runtime 계약은 프레임워크와 무관하게 `/invocations`(POST)·`/ping`(GET) 두 엔드포인트와 ARM64 이미지만 요구합니다.
- 배포는 `create_agent_runtime`, 호출은 `invoke_agent_runtime` boto3 API가 담당합니다.
- `runtimeSessionId`는 33자 이상이어야 하며, 세션을 조기 종료하려면 `stop_runtime_session`을 씁니다.

## 참고

- AgentCore CLI 없이 시작하기: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-custom.html
