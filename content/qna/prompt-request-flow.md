---
id: prompt-request-flow
---

### 핵심 답변

프롬프트 한 줄을 보냈다고 해서 LLM이 바로 "답"만 돌려주는 구조가 아닙니다. 앱이 **Prompt**를 messages로 조립한 뒤 **Token**으로 쪼개 **Context Window** 안에서 **LLM**이 다음 토큰을 예측하고, **AI Agent**라면 **Tool Use** 결과를 다시 넣으며 루프를 돌 수 있습니다.

### 단계별 흐름

1. **입력 조립** — System Prompt(역할·규칙), User Prompt(질문), 대화 히스토리, **RAG** 검색 청크, Tool 정의(JSON Schema)가 하나의 요청 payload로 합쳐집니다.
2. **토큰화** — 텍스트·도구 JSON이 **Token** ID 시퀀스로 바뀝니다. Context Window를 넘으면 잘리거나 요약됩니다.
3. **추론(Inference)** — LLM이 다음 Token 확률을 계산합니다. **Streaming**이면 생성되는 Token을 순차 전송합니다.
4. **도구 분기** — 응답이 일반 텍스트면 종료. `tool_use`(또는 동등 신호)이면 **Harness**·런타임이 실제 API·파일·DB를 실행하고 결과를 `tool_result` 메시지로 append합니다.
5. **반복** — 3~4를 목표 달성·턴 한도·사용자 중단까지 반복합니다. 이것이 **AI Agent** 루프의 기본 형태입니다.

### 비유

주문서(**Prompt**)를 주방 전달 시스템이 레시피·재고 목록·안전 규칙과 합쳐 요리사(**LLM**)에게 넘기고, 요리사가 "재료 추가 필요"(**Tool Use**)라고 하면 창고에서 가져와 다시 요리하는 과정과 비슷합니다.

### 자주 헷갈리는 점

- **Prompt ≠ 전체 요청**입니다. 같은 User Prompt라도 System Prompt·RAG·Memory 내용이 바뀌면 결과가 달라집니다.
- **LLM은 검색·실행을 직접 하지 않습니다.** Tool Use·**MCP**·**Skills**·**Harness**가 실행 계층입니다.
- 채팅 UI에 보이는 "한 번의 답변" 뒤에도 Agent 모드에서는 여러 번의 LLM 호출이 숨어 있을 수 있습니다.

### 같이 보면 좋은 용어

**Prompt**, **LLM**, **Token**, **Context Window**, **Tool Use**, **AI Agent**, **Harness**, **Streaming**
