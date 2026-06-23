---
id: tool-use
---

### 개요

Tool Use(함수 호출·Function Calling)는 **LLM**이 JSON 형태로 함수·API 호출을 선언하고, **Harness**·**MCP**·**Skills**가 실제로 실행하는 기술입니다. 모델 학습 데이터만으로는 실시간 날씨·사내 DB를 알 수 없으므로, 외부 결과를 Prompt에 다시 넣어 **Planning** 다음 단계를 이어갑니다.

비유하면, LLM이 "전화번호부에서 번호를 찾아 전화 걸기"를 하는 것입니다. 모델은 "무엇을 호출할지" JSON으로 말하고, 실행은 바깥 시스템이 담당합니다.

OpenAI CUA·Claude Computer Use·Operator처럼 LLM이 브라우저·OS를 조작하는 사례가 Tool Use의 실전 형태입니다. **MCP**는 이런 도구를 표준 프로토콜로 노출하는 층입니다.

유의사항: Tool Use ≠ MCP입니다. MCP는 도구를 노출하는 프로토콜이고, Tool Use는 LLM 출력 형식·실행 루프입니다. **Streaming** 모드에서는 Token·Tool Use 이벤트가 순차 전송됩니다.

### 사용목적

LLM 학습 데이터만으로는 실시간 날씨·사내 DB·GitHub PR 상태를 알 수 없습니다. Tool Use로 외부 시스템 결과를 Prompt에 다시 넣어 Planning 다음 단계를 이어갑니다.

### 동작/구조

도구 목록과 JSON Schema를 LLM에 제공 → 모델이 tool_calls(또는 동등 필드) 출력 → Harness/MCP/Skills가 실행 → 결과를 messages에 append → LLM이 최종 답변 또는 다음 Tool Use를 생성합니다. Streaming 모드에서는 Token·Tool Use 이벤트가 순차 전송됩니다.

- **LLM**: Tool Use 호출 JSON을 생성하는 주체
- **MCP**: Tool Use 대상 도구를 표준 프로토콜로 노출
- **Skills**: Tool Use 절차를 업무별로 묶은 모듈
- **Harness**: Tool Use 실행·권한·로깅 루프
- **Planning**: Tool Use 전후 단계를 설계하는 추론
- **Streaming**: Tool Use 이벤트를 실시간 전송

## 참고

- Anthropic, "Tool use with Claude": https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Anthropic, "Handle tool calls": https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
- OpenAI, "Function calling": https://developers.openai.com/api/docs/guides/function-calling
