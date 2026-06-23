---
id: llm
status: ready
title: "Claude Messages API로 첫 응답 받기"
source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/README.md"
---

## 시나리오

챗봇·요약·코드 생성의 출발점은 LLM API 호출입니다. Agent·RAG·Tool Use를 붙이기 전에, 모델이 텍스트를 생성하는 최소 호출부터 확인합니다.

## 따라하기

1. Anthropic Python SDK를 설치합니다.

```bash
pip install anthropic
```

2. 환경 변수 `ANTHROPIC_API_KEY`를 설정합니다.

3. 공식 README의 `messages.create` 예제를 실행합니다.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

message = client.messages.create(
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Hello, Claude",
        }
    ],
    model="claude-opus-4-6",
)
print(message.content)
```

## 핵심 포인트

- LLM 호출의 공식 진입점은 벤더 SDK의 `messages.create`(Anthropic)입니다.
- `messages` 배열에 `role: "user"`와 `content`를 넣습니다.
- 응답 길이 상한은 `max_tokens`로 지정합니다.

## 참고

- Anthropic Python SDK README: https://github.com/anthropics/anthropic-sdk-python/blob/main/README.md
- Claude API 문서: https://platform.claude.com/docs/en/api/sdks/python
