---
id: agent
---

### 개요

AI Agent는 **LLM**을 두뇌로 두고, 목표를 해석한 뒤 **Planning**·**Tool Use**·**Memory**를 반복해 스스로 작업을 진행하는 시스템입니다. 한 번의 질문-답변으로 끝나지 않고, 검색·코드 실행·승인 요청까지 이어집니다.

비유하면, LLM만 있는 것은 "조언만 하는 전문가"이고 Agent는 "일까지 대신 하는 비서"입니다. 비서는 **Harness**가 제공하는 실행 환경 위에서 **Skills**·**MCP**로 손(도구)을 뻗습니다.

GUI에서 자율 동작하는 **지능형 에이전트**가 넓은 의미의 AI Agent입니다. 코딩 에이전트(Cursor Agent, Claude Code), Computer/Browser Use(OpenAI CUA, Claude Computer Use), Deep Research(Manus)처럼 목적별 에이전트가 먼저 상용화되었습니다.

유의사항: Agent ≠ LLM입니다. LLM은 추론·생성만 하고, Agent는 루프·도구·메모리·안전 장치가 붙은 전체 시스템입니다. **OpenClaw**·**NanoClaw**는 이런 Agent를 빠르게 만드는 프레임워크이며, **Orchestration**·**Subagent**는 복잡한 일을 여러 Agent로 나눌 때 씁니다.

### 사용목적

2024년 **MCP** 공개·2025년 OpenAI·Google 채택으로 에이전트·외부 도구 연결 표준이 잡히면서, 2025년 **OpenClaw** 같은 오픈소스 프레임워크까지 등장했습니다.

한 번의 Prompt 응답으로 끝나지 않고, 검색·코드 실행·승인 요청 등을 반복해야 할 때 Agent 패턴이 필요합니다. Orchestration·Subagent로 역할을 나누면 복잡한 업무를 분업할 수 있습니다.

### 동작/구조

사용자 목표 → LLM이 Planning으로 단계 설계 → Tool Use·MCP·Skills로 외부 행동 → 결과를 Memory에 반영 → 다음 단계 판단을 반복합니다. Harness가 Sandbox·Guardrails·HITL·Observability를 통해 루프를 감쌉니다.

- **LLM**: Agent의 추론·생성 코어
- **Harness**: Agent 실행 루프·권한·안전·관측을 담당하는 실행 계층
- **Skills**: 특정 업무 절차·도구 묶음을 Agent에 확장
- **Planning**: 문제 분해·행동 순서 설계
- **Memory**: 세션·장기 맥락 유지
- **Tool Use**: LLM이 함수·API 호출을 선언
- **MCP**: Agent와 외부 데이터·도구를 연결하는 오픈 표준
- **Orchestration**: 여러 Agent·Subagent 작업 분배
- **Subagent**: Orchestration 아래 특정 하위 목표 전담 Agent
- **OpenClaw**: Skills·MCP 플러그인을 붙이는 범용 Agent 프레임워크
- **NanoClaw**: Sandbox 격리 중심의 경량·고보안 Agent 프레임워크

## 참고

- Anthropic, "Building effective agents" — agents 정의·autonomous agent 루프: https://www.anthropic.com/engineering/building-effective-agents
- Cursor Docs, "Build a coding agent" — harness = model + tools + instructions: https://cursor.com/docs/help/getting-started/build-ai-coding-agent
