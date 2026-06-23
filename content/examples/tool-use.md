---
id: tool-use
status: ready
title: "Tool Use: 선언 → 실행 → tool_result"
source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py"
---

## 시나리오

LLM이 "서울 날씨 알려줘"라는 요청을 받았을 때, 직접 날씨를 알지 못하면 **Tool Use**로 `get_weather` 같은 함수 호출을 **선언**합니다.

## 따라하기

1. `tools` 배열에 JSON Schema 형태의 `input_schema`를 정의합니다.

2. `messages.create(..., tools=tools)`를 호출합니다.

3. 응답 `content`에서 `type == "tool_use"` 블록을 찾고, 실제 함수를 실행한 뒤 `tool_result`를 다음 요청에 넣습니다.

```python
from anthropic import Anthropic

client = Anthropic()
tools = [
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
    messages=[{"role": "user", "content": "What is the weather in SF?"}],
    tools=tools,
)

tool = next(c for c in message.content if c.type == "tool_use")
# tool.name, tool.input 으로 실제 API/함수 실행 후 tool_result 전달
```

전체 루프는 `examples/tools.py`를 참고하세요.

## 핵심 포인트

- Tool Use는 MCP·Skills와 함께 쓰입니다. MCP가 도구를 노출하고, LLM이 `tool_use`로 호출을 선언합니다.
- OpenAI는 동일 개념을 "Function calling"으로 문서화합니다.
- `stop_reason == "tool_use"`가 도구 호출 신호입니다.

## 참고

- Anthropic `tools.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py
- Anthropic Tool use 문서: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- OpenAI Function calling: https://developers.openai.com/api/docs/guides/function-calling
