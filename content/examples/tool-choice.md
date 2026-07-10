---
id: tool-choice
status: ready
title: "특정 도구를 강제 호출하기"
source: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"
---

## 시나리오

사용자 질문에 답하기 전 항상 `search_docs` 도구를 먼저 호출하게 강제하고 싶습니다.

## 따라하기

Claude API 공식 문서 기준:

```json
{
  "tools": [{ "name": "search_docs", "input_schema": { "...": "..." } }],
  "tool_choice": { "type": "tool", "name": "search_docs" }
}
```

- `{"type": "auto"}`: Claude가 도구 사용 여부를 스스로 판단(기본값)
- `{"type": "any"}`: 도구 중 하나는 반드시 호출
- `{"type": "tool", "name": "search_docs"}`: 지정한 도구를 강제 호출
- `{"type": "none"}`: 도구 미사용

병렬 호출을 막으려면 `tool_choice`에 `disable_parallel_tool_use: true`를 추가합니다.

## 핵심 포인트

- Extended thinking과 함께 쓸 때는 `auto`·`none`만 지원됩니다.
- `any`/`tool`은 반드시 하나 이상의 도구 호출을 강제하므로 무한 루프에 주의합니다.
- Tool Choice는 도구 정의 자체가 아니라 "호출 방식"만 제어합니다.

## 참고

- Claude Platform Docs, "How tool use works": https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works
