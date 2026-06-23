---
id: tool-use
---

## 개요

Tool Use(또는 function calling / tool calling)는 LLM이 구조화된 도구 호출을 생성하고, 애플리케이션이 그 결과를 다시 모델에 전달하는 패턴입니다. API는 도구 실행 자체를 대신하지 않습니다.

## 세부 내용

Anthropic Messages API는 `tools` 파라미터와 `tool_use`·`tool_result` 콘텐츠 블록을 정의합니다. OpenAI Chat Completions도 `tools`·`tool_calls`를 제공하며 "API will not actually execute any function calls"라고 명시합니다. Harness가 MCP·Skills에 매핑된 클라이언트 도구를 실행하고, Planning 단계에서 고른 도구를 순차 호출하며, Streaming과 함께 쓰면 중간 응답을 전송할 수 있습니다.

## 검증 근거

- Anthropic, "Tool use with Claude": https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Anthropic, "Handle tool calls": https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
- OpenAI, "Function calling": https://developers.openai.com/api/docs/guides/function-calling
