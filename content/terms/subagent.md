---
id: subagent
---

### 개요

Subagent는 **Orchestration** 아래 특정 하위 목표를 전담하는 **AI Agent** 인스턴스입니다. 하나의 **LLM** Prompt에 모든 **Skills**·**Tool Use**를 넣으면 Context Window·품질이 나빠져, **Planning**·**Harness**를 Subagent별로 분리합니다.

비유하면, Subagent는 "팀원 전문가"입니다. 상위 Orchestration Agent가 Subagent를 spawn하고, 각자 Prompt·Skills·Memory slice로 **Harness** Sandbox에서 실행한 뒤 결과를 orchestrator에 반환합니다.

유의사항: Subagent ≠ 별도 제품입니다. Subagent도 Agent의 한 종류이며, Orchestration이 생성·배분·결과를 수집합니다. LLM은 Subagent마다 동일 또는 다른 모델을 쓸 수 있습니다.

### 사용목적

하나의 LLM Prompt에 모든 Skill·Tool Use를 넣으면 Context Window·품질이 나빠집니다. Orchestration이 Subagent별 Planning·Harness를 분리해 병렬·전문화합니다.

### 동작/구조

상위 Orchestration Agent가 Subagent spawn → 각 Subagent는 자신의 Prompt·Skills·Tool Use·Memory slice → Harness Sandbox에서 실행 → 결과를 orchestrator LLM Prompt에 반환 → 통합 답변.

- **AI Agent**: Subagent도 Agent의 한 종류(하위 전문 인스턴스)
- **Orchestration**: Subagent 생성·작업 배분·결과 수집
- **Planning**: Subagent별 하위 계획
- **Harness**: Subagent 실행 루프·권한
- **LLM**: 각 Subagent의 추론 코어(동일 또는 다른 모델)

## 참고

- Cursor Docs, "Agent Skills" 및 SDK 관련 문서 — Subagents: https://cursor.com/docs/context/skills
- Cursor help, "Build a coding agent" — SDK harness·subagents 언급: https://cursor.com/docs/help/getting-started/build-ai-coding-agent
