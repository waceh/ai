---
id: streaming
status: ready
title: "messages.stream으로 토큰 단위 수신"
source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/messages_stream.py"
---

## 시나리오

긴 답변을 한꺼번에 기다리면 UX가 나빠집니다. **Streaming**은 생성되는 Token을 순차적으로 받습니다.

## 따라하기

Anthropic SDK `examples/messages_stream.py`:

```python
import asyncio
from anthropic import AsyncAnthropic

client = AsyncAnthropic()

async def main() -> None:
    async with client.messages.stream(
        max_tokens=1024,
        messages=[{"role": "user", "content": "Say hello there!"}],
        model="claude-sonnet-4-5-20250929",
    ) as stream:
        async for event in stream:
            if event.type == "text":
                print(event.text, end="", flush=True)
            elif event.type == "content_block_stop":
                print()
    accumulated = await stream.get_final_message()
    print(accumulated.to_json())

asyncio.run(main())
```

Tool Use + Streaming은 `examples/tools_stream.py`의 `input_json` 이벤트를 참고하세요.

## 핵심 포인트

- 공식 API: `client.messages.stream` (AsyncAnthropic).
- `event.type == "text"`일 때 `event.text`를 출력합니다.
- OpenAI Function calling 가이드도 streaming tool call 이벤트를 문서화합니다.

## 참고

- Anthropic `messages_stream.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/messages_stream.py
- Anthropic `tools_stream.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools_stream.py
- OpenAI Function calling (streaming): https://developers.openai.com/api/docs/guides/function-calling
