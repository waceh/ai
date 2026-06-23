---
id: prompt-request-flow
---

### 핵심 답변

프롬프트 한 줄을 보냈다고 해서 **LLM**이 곧바로 최종 답만 돌려주는 구조는 아닙니다. 사용자가 입력한 문장(**User Prompt**)은 그대로 모델에 들어가지 않고, 앱·**Harness**가 **System Prompt**, 대화 **Memory**, **RAG** 검색 결과, Tool 정의(JSON Schema) 등과 합쳐 `messages` 배열을 만든 뒤 API로 보냅니다.

그다음 텍스트는 **Token**으로 쪼개져 **Context Window** 한도 안에서 **LLM**이 "다음 토큰" 확률을 반복 계산합니다. 응답이 일반 문장이면 여기서 끝날 수 있지만, **AI Agent** 모드에서는 모델이 **Tool Use**를 선언하고, 런타임이 실제 검색·파일·API를 실행한 결과를 다시 `messages`에 넣은 후 **같은 파이프라인을 반복**합니다. 채팅 UI에 보이는 "한 번의 답변" 뒤에 LLM 호출이 여러 번 숨어 있는 경우가 흔합니다.

### 단순 채팅 vs Agent 모드

| 구분 | 단순 채팅 | Agent 모드 |
|------|-----------|------------|
| LLM 호출 횟수 | 보통 1회(스트리밍 1세션) | 1회 이상, Tool마다 추가 호출 |
| Tool Use | 없거나 제한적 | 검색·셸·파일·MCP 등 반복 |
| 사용자 체감 | 질문 → 답변 | 질문 → (중간 작업) → 답변 |
| 비용·지연 | 상대적으로 낮음 | Token·호출 수만큼 증가 |

Cursor Agent, Claude Code, Codex 같은 제품은 대화형 챗봇보다 오른쪽(Agent)에 가깝습니다. 열린 파일·프로젝트 맥락이 **Prompt**에 자동 주입되고, **Skills**·**MCP**로 도구 목록이 붙습니다.

### 단계별 흐름

1. **입력 조립**
   - **System Prompt**: 역할, 톤, 금지 사항, 출력 형식.
   - **User Prompt**: 사용자가 친 질문·지시.
   - **대화 히스토리**: 이전 user/assistant 메시지(**Memory**의 단기 저장).
   - **RAG 청크**: Vector DB 검색으로 가져온 근거 문단(있을 때).
   - **Tool 정의**: 함수 이름, 설명, JSON Schema(Agent/API에서).
   - 이들이 벤더 API 형식(예: Anthropic `messages`, OpenAI `messages` + `tools`)으로 합쳐집니다.

2. **토큰화**
   - 모든 문자열·도구 JSON이 **Token** ID 시퀀스로 변환됩니다.
   - 합계가 **Context Window**를 넘으면 오래된 히스토리 삭제, 요약, RAG 청크 축소 등으로 잘립니다.
   - 잘린 맥락은 모델이 "모른다"고 답하거나 환각할 수 있어, 긴 대화·대용량 코드 붙여넣기 시 주의가 필요합니다.

3. **추론(Inference)**
   - **LLM**이 다음 Token 확률 분포를 계산하고 하나(또는 샘플링으로 하나)를 선택합니다.
   - **Streaming**이면 선택된 Token을 생성할 때마다 클라이언트로 전송해 타이핑처럼 보이게 합니다.
   - `temperature`, `top_p` 등이 같아도 non-deterministic하게 조금씩 달라질 수 있습니다.

4. **도구 분기**
   - 모델 출력이 일반 텍스트(`assistant` 메시지)면 사용자에게 전달하고 종료할 수 있습니다.
   - `tool_use` / `tool_calls`(벤더별 이름)가 나오면 **Harness**가 **Guardrails** 검사 후 실제 함수를 실행합니다.
   - 실행은 **Sandbox**·**MCP** 서버·**Skills** 스크립트·사내 API 등 경로를 탑니다.
   - 결과는 `tool_result` 형태로 `messages`에 append되고, 모델은 "방금 도구가 돌려준 값"을 읽은 뒤 다음 행동을 결정합니다.
   - 고위험 작업(파일 삭제, 배포 등)은 **HITL**로 사람 승인을 거칠 수 있습니다.

5. **반복**
   - 3~4를 목표 달성, 최대 턴 수, 타임아웃, 사용자 중단까지 반복합니다.
   - 이 루프 전체가 **AI Agent**의 기본 형태입니다. **Planning**이 길수록 중간 LLM 호출·Tool Use가 늘어납니다.

### messages가 쌓이는 모습 (예시)

아래는 개념적 순서입니다. 실제 필드명은 Anthropic/OpenAI 등 벤더마다 다릅니다.

```
system: "You are a helpful assistant…"
user: "서울 날씨 알려줘"
assistant: (tool_use: get_weather, city=Seoul)
tool_result: {"temp": 22, "condition": "cloudy"}
assistant: "서울은 현재 22도, 흐림입니다."
```

사용자는 마지막 `assistant` 문장만 볼 수 있지만, 그 앞의 Tool Use·`tool_result`·추가 LLM 호출이 같은 요청 흐름 안에 포함됩니다.

### 비유

주문서(**User Prompt**)를 주방 전달 시스템(**Harness**)이 레시피 북(**System Prompt**), 재고 목록(**RAG**·**Memory**), 사용 가능한 조리도구 목록(**Tool** 정의)과 합쳐 요리사(**LLM**)에게 넘깁니다. 요리사가 "재료 추가 필요"(**Tool Use**)라고 하면 창고 직원이 창고(**MCP**/API)에서 가져와 다시 요리하고, 위생·안전 담당(**Guardrails**)이 위험한 지시는 막습니다. 완성 dish가 나올 때까지 이 과정이 반복될 수 있습니다.

### 자주 헷갈리는 점

- **Prompt ≠ 전체 요청** — 화면에 친 한 줄만이 아니라, 시스템 지시·히스토리·검색 청크·도구 정의까지 합친 것이 모델 입력입니다.
- **LLM은 검색·실행을 직접 하지 않음** — 날씨 API, DB, 파일 읽기는 **Tool Use** + **Harness** + **MCP**/**Skills**가 수행합니다. 모델은 "호출할지·무엇을 호출할지"를 텍스트/JSON으로 **선언**합니다.
- **Streaming은 "빨리 답하는 것"과 "한 번에 끝나는 것"을 구분하지 않음** — Token이 먼저 보여도 Agent는 뒤에서 Tool을 돌리고 다시 추론할 수 있습니다.
- **같은 질문, 다른 제품** — Cursor와 Claude 챗은 System Prompt·주입 맥락·도구 세트가 달라 결과가 달라질 수 있습니다. (자세한 비교는 FAQ 「제품이 달라도 같은 모델이면 결과가 같나요?」 참고)

### 실무에서 확인하는 방법

- **몇 번 호출됐는지** — API 로그, **Observability** trace에서 `messages.create` / `chat.completions` 횟수를 봅니다.
- **무엇이 들어갔는지** — system, user, tool 목록, RAG 청크 길이를 diff합니다. "프롬프트는 안 바꿨는데 답이 달라졌다"면 대부분 여기가 원인입니다.
- **왜 느린지** — Tool 실행(네트워크·셸)·Context Window 초과로 인한 잘림·재시도·긴 Planning을 의심합니다.
- **비용** — 입력·출력 **Token** 합 × 호출 횟수. Agent는 단순 채팅보다 빠르게 늘어납니다.

### 같이 보면 좋은 용어

**Prompt**, **LLM**, **Token**, **Context Window**, **Tool Use**, **AI Agent**, **Harness**, **Streaming**, **RAG**, **Memory**, **MCP**, **Skills**, **Guardrails**
