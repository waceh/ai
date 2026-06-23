---
id: same-model-across-products
---

### 핵심 답변

제품 이름(Claude, Codex, Cursor Agent 등)이 달라도 **같은 모델 ID**·**같은 API 파라미터**·**같은 messages**로 호출하면 코어 생성은 매우 비슷해질 수 있습니다. 하지만 실제 제품에서는 시스템 프롬프트·도구·맥락·**Harness**가 다르기 때문에 **사용자가 보는 최종 결과는 거의 항상 다릅니다.**

### 무엇이 같아야 "비슷한" 결과인가

아래가 모두 같을 때 API 응답 본문이 가장 가깝습니다.

- 동일 **LLM** 모델 ID (예: 같은 Anthropic 모델 문자열)
- 동일 `messages` / system 지시
- 동일 `temperature`, `max_tokens` 등 샘플링·길이 파라미터
- Tool 정의·RAG 청크·이미지 등 부가 입력 없음

이 조건을 맞추면 "모델 자체의 차이"만 비교할 수 있습니다.

### 제품마다 결과가 달라지는 이유

1. **System Prompt·정책** — 챗 앱, IDE, API 래퍼마다 기본 지시(톤, 안전, 형식)가 다릅니다.
2. **맥락 주입** — Cursor는 열린 파일·프로젝트 구조, Codex는 리포지토리·CI 맥락을 자동으로 넣을 수 있습니다. **Memory**·**RAG** 소스가 다릅니다.
3. **Tool Use·Skills·MCP** — 에이전트 제품은 도구 목록과 실행 루프가 다릅니다. 모델이 "검색 후 답변" vs "바로 답변"을 선택하는 경로가 갈립니다.
4. **Harness** — **Sandbox**, **Guardrails**, **HITL**, 로깅·재시도 정책이 최종 출력을 바꿉니다.
5. **라우팅** — UI에 표시된 이름과 실제 백엔드 모델이 1:1이 아닐 수 있습니다. 버전·리전·폴백 모델이 다를 수 있습니다.

### Claude vs Codex를 한 줄로

- **Claude**(챗/API) — 대화·문서·범용 추론에 초점.
- **Codex**(코딩 에이전트) — 코드베이스·터미널·PR 맥락과 코딩 **Tool Use**에 최적화된 **AI Agent** 스택.

이름에 같은 모델 패밀리가 쓰여도, **에이전트 Harness와 주입 맥락**이 다르면 체감 품질·스타일·행동은 달라집니다.

### 실무 체크리스트

- "같은 모델인가?" → API 요청 로그의 **model ID**를 확인하세요.
- "왜 답이 다르지?" → system prompt, RAG 청크, tool 목록, temperature를 diff하세요.
- 제품 간 품질을 비교할 때는 **Evaluation** 시나리오를 고정하고, 맥락·도구까지 통제한 뒤 비교하세요.

### 같이 보면 좋은 용어

**LLM**, **Prompt**, **Tool Use**, **AI Agent**, **Harness**, **Skills**, **MCP**, **Memory**, **RAG**
