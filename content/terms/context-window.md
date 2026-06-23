---
id: context-window
---

### 개요

Context Window는 **LLM**이 한 번의 호출에서 처리할 수 있는 **Token** 총량의 상한입니다. messages·Tool 정의·**RAG** 청크·**Memory** 요약이 모두 Token으로 환산되어 이 범위를 채웁니다.

비유하면, Context Window는 "한 장에 쓸 수 있는 원고지 매수"입니다. 한도를 넘기면 API 오류 또는 앞부분 잘림이 발생하므로, Memory·RAG로 필요한 조각만 넣어야 **AI Agent**가 안정적으로 동작합니다.

유의사항: Context Window ≠ Memory입니다. Context Window는 즉시 LLM이 보는 Token 상한이고, Memory는 그 밖의 맥락을 저장·검색해 다시 창에 넣는 전략입니다.

### 사용목적

한도를 넘기면 API 오류 또는 앞부분 잘림이 발생합니다. Memory·RAG로 필요한 조각만 넣고, Token 예산을 관리해야 AI Agent가 안정적으로 동작합니다.

### 동작/구조

messages·Tool 정의·RAG 청크가 모두 Token으로 환산되어 Context Window를 채웁니다. LLM은 이 범위 안에서만 Attention하며, 초과분은 잘라내거나 요약 Memory로 옮깁니다.

- **LLM**: Context Window 한도가 정해진 처리 주체
- **Memory**: Context Window를 넘는 맥락을 외부·Vector DB에 보관
- **Token**: Context Window를 채우는 최소 단위
- **RAG**: Context Window 안에 넣을 관련 청크만 선별

## 참고

- OpenAI Embeddings guide — 모델별 max input(예: 8192 tokens): https://platform.openai.com/docs/guides/embeddings
- Anthropic tool use docs — 입력 토큰·tools 파라미터 과금: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
