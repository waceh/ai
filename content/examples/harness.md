---
id: harness
status: ready
title: "Harness = 모델 + 도구 + 지시문"
source: "https://cursor.com/docs/help/getting-started/build-ai-coding-agent"
---

## 시나리오

LLM만으로는 파일 수정·셸 실행이 불가능합니다. **Harness**는 모델 호출, 도구 실행, 시스템 지시를 한 루프로 묶는 실행 계층입니다.

## 따라하기

Cursor 공식 문서 "Build a coding agent"는 Harness를 다음처럼 정의합니다:

> harness = **model** + **tools** + **instructions**

실무에서 Harness가 담당하는 일(문서·SDK 예제 기준):

1. **모델**: `messages.create` 등 LLM API 호출 (Anthropic SDK README).
2. **도구**: Tool Use·MCP·파일/셸 도구 목록을 모델에 전달 (`examples/tools.py`).
3. **지시문**: `system` 파라미터·Skills·프로젝트 규칙 (Anthropic `message_create_params`의 `system` 필드).

아래는 Harness의 "모델 + 지시문" 부분만 분리한 최소 예시입니다.

```python
from anthropic import Anthropic

client = Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    system="You are a coding assistant. Answer concisely.",
    messages=[{"role": "user", "content": "What is a harness in AI agents?"}],
)
print(response)
```

**확인된 공식 기능이 없는 부분**: Cursor Harness 전용 단일 API 클래스명·메서드는 이 예시 범위에서 별도로 확인하지 못했습니다. Cursor SDK 상세는 Cursor Docs의 SDK 섹션을 참고하세요.

## 핵심 포인트

- Harness는 제품마다 구현이 다르지만, 공통적으로 **루프·권한·도구 연결**을 담당합니다.
- Anthropic SDK 예제는 Harness의 도구 부분을 `tools=`와 `tool_result` 교환으로 보여 줍니다.
- Sandbox·Guardrails·HITL은 Harness 위에 얹는 안전·관측 계층입니다.

## 참고

- Cursor, "Build a coding agent": https://cursor.com/docs/help/getting-started/build-ai-coding-agent
- Anthropic `tools.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py
- Anthropic `system` 파라미터: https://github.com/anthropics/anthropic-sdk-python/blob/main/src/anthropic/types/message_create_params.py
