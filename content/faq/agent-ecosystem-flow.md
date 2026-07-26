---
id: agent-ecosystem-flow
---

### 핵심 답변

**LLM**(두뇌) → **Planning**(사고) → **Tool Use**·**MCP**(도구 연결) → **AI Agent**(행동) → **Evaluation**(평가)로 이어지는 하나의 파이프라인으로 정리할 수 있습니다. 각 단계는 이 사전에 이미 있는 용어와 1:1로 대응하고, LangGraph·CrewAI·AutoGen 같은 프레임워크는 이 파이프라인 전체를 미리 조립해 둔 완제품에 가깝습니다.

### 단계별로 뜯어보기

| 단계 | 담당 용어 | 역할 |
|------|-----------|------|
| 원인 | **LLM** | 텍스트를 이해·생성하는 추론 엔진. 그 자체로는 도구를 쓰거나 목표를 계속 추적하지 않습니다. |
| 사고 | **Planning** | CoT(단계별 사고)·ReAct(생각→행동→관찰 반복)로 목표를 하위 작업·행동 순서로 분해합니다. |
| 도구 연결 | **Tool Use** / **MCP** | Tool Use는 LLM이 "무엇을 호출할지" JSON으로 선언하는 형식(Function Calling)이고, MCP는 그 도구를 표준 프로토콜로 노출하는 층입니다. |
| 행동 | **AI Agent** / **Skills** | LLM+Planning+Tool Use를 하나의 자율 루프로 묶은 시스템이 Agent이고, Skills는 그 Agent가 쓸 수 있는 업무별 도구 묶음입니다. |
| 평가 | **Evaluation** | Agent·Planning·RAG 변경이 실제로 품질을 개선했는지 데이터셋과 점수로 검증합니다. |

이 흐름을 실제로 실행하는 컨테이너가 **Harness**입니다 — Sandbox·Guardrails·HITL·Observability로 위 파이프라인 전체를 감싸 안전하게 반복 실행합니다.

### 자주 헷갈리는 두 가지

**① OpenClaw·NanoClaw는 Claude를 개조한 모델이 아닙니다.** 이름의 "Claw"가 "Claude"와 비슷해 생기는 흔한 오해인데, 실제로는 어떤 LLM과도 붙여 쓸 수 있는 독립적인 오픈소스 자율 에이전트 프레임워크입니다. 이 사전에서는 **OpenClaw**·**NanoClaw**·**Hermes Agent**를 각각 별도 항목으로 다룹니다.

**② "Harness"는 업계에서 두 가지 다른 뜻으로 쓰입니다.** 이 사전의 **Harness**는 위 표의 "행동" 단계를 실행하는 Agent 실행 계층(Cursor의 model+tools+instructions 정의)을 가리킵니다. 반면 lm-evaluation-harness처럼 "harness"가 **모델 벤치마크 자동 실행 도구**를 뜻하는 경우도 흔합니다 — 이건 위 표의 "평가"(**Evaluation**) 단계에 해당하는 별개의 의미입니다.

### 프레임워크는 이 파이프라인의 어디를 대신해 주나

**CrewAI**·**LangGraph**·**AutoGen**·**Strands Agents** 모두 "사고→도구 연결→행동" 세 단계를 직접 구현하지 않아도 되게 해주는 완제품 프레임워크입니다. 다만 강조점이 다릅니다.

- **CrewAI**: Agent마다 역할·목표를 부여해 여러 Agent를 팀처럼 협업(Crew)시키는 데 초점
- **LangGraph**: 사고(Planning) 단계의 분기·재시도를 그래프(노드·엣지)로 명시적으로 설계하는 데 초점
- **AutoGen**: 여러 Agent가 서로 대화를 주고받으며 검증·협업하는 멀티에이전트 대화 패턴에 초점. 다만 현재 유지보수 모드라 신규 프로젝트에는 Microsoft가 후속작 사용을 권장합니다.
- **Strands Agents**: 모델·도구만 지정하면 사고→도구 호출 루프를 대신 처리하는 최소 구성 SDK. **Bedrock AgentCore** Runtime의 기본 프레임워크이기도 합니다.

어느 프레임워크를 골라도 위 다섯 단계(LLM→Planning→Tool Use→Agent→Evaluation)라는 큰 흐름 자체는 그대로입니다 — 프레임워크는 그 흐름을 얼마나 대신 짜 주느냐의 차이일 뿐입니다.

### 같이 보면 좋은 용어

**LLM**, **Planning**, **Tool Use**, **MCP**, **AI Agent**, **Skills**, **Evaluation**, **Harness**, **CrewAI**, **LangGraph**, **AutoGen**, **Strands Agents**, **OpenClaw**, **NanoClaw**, **Hermes Agent**
