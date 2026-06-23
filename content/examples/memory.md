---
id: memory
status: ready
title: "대화 이력을 messages 배열로 유지"
source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/messages.py"
---

## 시나리오

"아까 말한 그거"처럼 이전 맥락이 필요할 때 **Memory**는 지난 턴을 다음 요청에 포함합니다.

## 따라하기

Anthropic SDK `examples/messages.py`는 멀티턴 대화를 `messages` 배열 확장으로 보여 줍니다.

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
    model="claude-sonnet-4-5-20250929",
)

response2 = client.messages.create(
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"},
        {"role": response.role, "content": response.content},
        {"role": "user", "content": "How are you?"},
    ],
    model="claude-sonnet-4-5-20250929",
)
print(response2)
```

Context Window를 넘으면 요약·Vector DB(RAG)로 압축·검색합니다 (별도 용어 참고).

## 핵심 포인트

- 단기 Memory = 이전 `user` / `assistant` 메시지를 그대로 재전송.
- `role: "assistant"`에는 모델의 `content` 블록 전체를 넣습니다.
- 장기 Memory는 Embeddings + Vector DB 패턴과 함께 씁니다.

## 참고

- Anthropic `messages.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/messages.py
- Anthropic, "Building effective agents" (augmented LLM / memory): https://www.anthropic.com/engineering/building-effective-agents
