---
id: agent
status: ready
title: "Tool Use 루프로 Agent 동작 재현"
source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py"
---

## 시나리오

한 번의 답변으로 끝나지 않고, 모델이 도구를 고른 뒤 결과를 받아 다시 추론해야 할 때 **AI Agent** 패턴이 필요합니다. 아래는 공식 SDK 예제에 나온 최소 Tool Use 루프입니다.

## 따라하기

1. `anthropic` 패키지를 설치합니다.

```bash
pip install anthropic
```

2. 공식 `examples/tools.py` 흐름을 따릅니다: (1) 도구 정의 → (2) 첫 `messages.create` → (3) `stop_reason == "tool_use"`이면 `tool_result`를 넣어 재호출.

```python
from anthropic import Anthropic
from anthropic.types import ToolParam, MessageParam

client = Anthropic()

user_message: MessageParam = {
    "role": "user",
    "content": "What is the weather in SF?",
}
tools: list[ToolParam] = [
    {
        "name": "get_weather",
        "description": "Get the weather for a specific location",
        "input_schema": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
        },
    }
]

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[user_message],
    tools=tools,
)

assert message.stop_reason == "tool_use"
tool = next(c for c in message.content if c.type == "tool_use")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[
        user_message,
        {"role": message.role, "content": message.content},
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool.id,
                    "content": [{"type": "text", "text": "The weather is 73f"}],
                }
            ],
        },
    ],
    tools=tools,
)
print(response)
```

3. (선택) Anthropic SDK에는 `beta.agents`·`beta.sessions` API도 있습니다. `examples/agents.py`를 참고하세요.

## 핵심 포인트

- Agent = LLM + **반복 루프** + Tool Use 결과 피드백입니다.
- `stop_reason`이 `"tool_use"`이면 모델이 도구 호출을 요청한 상태입니다.
- `tool_result` 블록으로 실행 결과를 다시 넣어야 최종 답변이 이어집니다.

## 참고

- Anthropic SDK `examples/tools.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py
- Anthropic SDK `examples/agents.py` (beta Agents API): https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/agents.py
- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
