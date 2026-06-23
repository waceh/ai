---
id: prompt
status: ready
title: "system 파라미터로 행동 지시"
source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/src/anthropic/types/message_create_params.py"
---

## 시나리오

같은 질문도 "한국어로만 답해" vs "코드만 출력해"에 따라 결과가 달라집니다. **Prompt**·특히 **system** 지시가 모델 행동을 고정합니다.

## 따라하기

Anthropic `MessageCreateParams` 문서: system prompt는 top-level `system` 파라미터를 사용합니다. input messages에 `"system"` role은 없습니다.

```python
from anthropic import Anthropic

client = Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    system="You answer only in Korean. Be concise.",
    messages=[
        {"role": "user", "content": "Explain what a prompt is in one sentence."}
    ],
)
print(response)
```

Skills(`SKILL.md`)·Guardrails·RAG 검색 결과도 최종적으로 이 `system` / `user` 메시지에 합쳐집니다.

## 핵심 포인트

- Anthropic: `system`은 `messages.create`의 **최상위 인자**입니다.
- User Prompt는 `messages` 안의 `role: "user"`입니다.
- Anthropic "Building effective agents" Appendix 2에 Tool Prompt 엔지니어링 팁이 있습니다.

## 참고

- Anthropic `message_create_params.py` (`system` 필드): https://github.com/anthropics/anthropic-sdk-python/blob/main/src/anthropic/types/message_create_params.py
- Anthropic system prompts 가이드: https://docs.claude.com/en/docs/system-prompts
- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
