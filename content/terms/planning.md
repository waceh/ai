---
id: planning
---

### 개요

Planning은 **LLM**·**AI Agent**가 복잡한 목표를 하위 작업으로 나누고, **Tool Use** 순서를 설계하는 추론 방식입니다. CoT(생각의 연쇄)·ReAct(생각→행동→관찰)처럼 한 번에 처리하지 않고 단계를 밟습니다.

비유하면, Planning은 "여행 일정 짜기"입니다. **Prompt**에 "단계별로 생각하라"는 지시를 넣고, **Orchestration**·**Subagent**로 계획을 여러 Agent에 나눠 실행합니다. **Evaluation**으로 단계·결과 품질을 확인합니다.

유의사항: Planning ≠ Orchestration입니다. Planning은 "무엇을 어떤 순서로 할지" 생각하는 것이고, Orchestration은 여러 Agent·Subagent에 작업을 배분·조율하는 실행 계층입니다.

### 사용목적

복잡한 목표를 Tool Use 한 방에 처리하면 실패율이 높습니다. LLM이 CoT(생각의 연쇄)·ReAct(생각→행동→관찰)로 단계를 나누면 Orchestration·Subagent 분업과 맞물립니다.

### 동작/구조

목표 입력 → LLM이 하위 작업 목록 또는 다음 Tool Use 하나 선택 → 실행 결과 관찰 → Prompt에 반영 → Evaluation으로 품질 확인 → 완료까지 반복. Orchestration은 여러 Subagent에 Planning 결과를 배분합니다.

- **LLM**: Planning 추론을 수행하는 코어
- **AI Agent**: Planning·Tool Use 루프를 돌리는 시스템
- **Tool Use**: Planning 각 단계의 실행 수단
- **Prompt**: Planning 방식·제약을 적는 지시문
- **Orchestration**: 여러 Agent·Subagent에 계획 분배
- **Subagent**: Planning의 특정 하위 목표 전담
- **Evaluation**: Planning·RAG·Agent 출력 품질 측정

## 참고

- Yao et al., "ReAct" (arXiv:2210.03629): https://arxiv.org/abs/2210.03629
- Anthropic, "Building effective agents" — orchestrator-workers, prompt chaining: https://www.anthropic.com/engineering/building-effective-agents
