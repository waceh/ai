---
id: autogen
status: ready
title: "AssistantAgent로 도구 쓰는 에이전트 만들기"
source: "https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/quickstart.html"
---

## 시나리오

여러 **AI Agent**가 대화하며 협업하는 구조를 빠르게 시작하려면, **AutoGen**의 `AssistantAgent`에 모델과 도구 함수만 지정합니다.

## 따라하기

1. AgentChat과 확장 패키지를 설치합니다.

```bash
pip install -U "autogen-agentchat" "autogen-ext[openai,azure]"
```

2. 모델 클라이언트와 도구 함수를 지정해 Agent를 만듭니다.

```python
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(model="gpt-4o")

async def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    return f"The weather in {city} is 73 degrees and Sunny."

agent = AssistantAgent(
    name="weather_agent",
    model_client=model_client,
    tools=[get_weather],
    system_message="You are a helpful assistant.",
)
```

3. Agent를 실행하고 스트리밍 응답을 받습니다.

```python
async def main() -> None:
    await agent.run_stream(task="What is the weather in New York?")
    await model_client.close()

await main()
```

## 핵심 포인트

- `AssistantAgent`에 `tools` 목록을 넘기면 Agent가 필요할 때 그 함수를 Tool Use로 호출합니다.
- `run_stream`은 응답을 실시간 스트리밍으로 받고, `run`은 완료된 결과를 한 번에 받습니다.
- AutoGen은 현재 유지보수 모드이며, Microsoft는 신규 프로젝트에는 후속작인 Microsoft Agent Framework를 권장합니다.

## 참고

- AutoGen Quickstart: https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/quickstart.html
