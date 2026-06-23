---
id: streaming
---

### 개요

Streaming은 **LLM** API가 출력 **Token**·중간 **Tool Use** 이벤트를 생성과 동시에 순차 전송하는 방식입니다. 전체 생성이 끝날 때까지 수십 초 blank UI를 보여 주는 대신, **AI Agent**가 "일하고 있다"는 피드백을 줄 수 있습니다.

비유하면, Streaming은 "라이브 중계"입니다. 클라이언트가 stream=true(또는 동등 옵션)로 호출하면 delta Token이 SSE/WebSocket으로 전달되고, Harness가 완료 후 최종 messages를 확정합니다.

전체 응답을 기다리지 않고 생성 **Token**·중간 이벤트를 순차 전송합니다. 대화형 서비스(**ChatGPT** 등)에서 체감 지연을 줄이며, **Tool Use** 호출 chunk도 스트림으로 노출될 수 있습니다.

유의사항: Streaming ≠ Tool Use입니다. Streaming은 전송 방식이고, Tool Use는 LLM이 함수 호출 JSON을 내는 행위입니다. 다만 Streaming 모드에서 tool call 이벤트도 chunk로 노출될 수 있습니다.

### 사용목적

전체 Tool Use·생성이 끝날 때까지 수십 초 blank UI는 체감 품질이 나쁩니다. Streaming으로 Token·중간 Tool Use 이벤트를 보내면 AI Agent가 "일하고 있다"는 피드백을 줄 수 있습니다.

### 동작/구조

클라이언트가 stream=true(또는 동등 옵션)로 LLM API 호출 → 서버가 delta Token SSE/WebSocket 전송 → Tool Use chunk도 이벤트로 전달 → Harness가 완료 후 최종 messages 확정.

- **LLM**: Streaming Token 생성 주체
- **Token**: Streaming의 전송 단위
- **Tool Use**: Streaming tool call 이벤트로 노출 가능
- **AI Agent**: Streaming UX를 제공하는 대화·실행 시스템

## 참고

- Anthropic API primer — streaming 언급: https://platform.claude.com/docs/en/claude_api_primer
- OpenAI function calling guide — streaming tool call 이벤트: https://developers.openai.com/api/docs/guides/function-calling
