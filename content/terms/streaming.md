---
id: streaming
---

## 개요

Streaming은 모델 출력을 완성 전에 부분적으로 전송하는 응답 방식입니다. Anthropic·OpenAI API 모두 스트리밍 모드를 문서화합니다.

## 세부 내용

Token이 생성되는 대로 클라이언트에 전달되어 체감 지연을 줄입니다. LLM·Tool Use 스트리밍 응답에서 중간 텍스트와 `tool_use` 이벤트를 구분해 처리해야 합니다. AI Agent UI에서 추론·도구 실행 상태를 Streaming으로 보여 주기도 합니다.

## 검증 근거

- Anthropic API primer — streaming 언급: https://platform.claude.com/docs/en/claude_api_primer
- OpenAI function calling guide — streaming tool call 이벤트: https://developers.openai.com/api/docs/guides/function-calling
