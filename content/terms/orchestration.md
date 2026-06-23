---
id: orchestration
---

### 개요

Orchestration은 여러 **AI Agent**·**Subagent**의 작업을 조율·분배·결과를 집계하는 실행 패턴입니다. 하나의 **LLM** **Context Window**로 대형 프로젝트 전체를 처리하기 어려울 때, **Planning** 결과를 역할별 Subagent에 나눕니다.

비유하면, Orchestration은 "프로젝트 매니저"입니다. 상위 Agent(orchestrator)가 목표를 분해하고, 각 **Harness**에서 Tool Use를 실행한 뒤 **Observability**·Evaluation으로 품질을 확인합니다.

여러 **AI Agent**·**Subagent**의 작업 순서·병렬 실행을 조율합니다. Microsoft Magentic-One·**AutoGPT**처럼 복잡 워크플로를 자동화하는 연속 에이전트가 대표 사례입니다.

유의사항: Orchestration ≠ Planning입니다. Planning은 작업 순서를 설계하고, Orchestration은 여러 Agent·Subagent에 그 계획을 배분·병렬 실행·결과 수집합니다.

### 사용목적

하나의 AI Agent·LLM Context Window로 대형 프로젝트 전체를 처리하기 어렵습니다. Orchestration이 Planning 결과를 역할별 Subagent에 배분하고 Harness 실행을 순서화합니다.

### 동작/구조

상위 Agent( orchestrator)가 목표 분해(Planning) → Subagent별 작업 큐 → 각 Harness에서 Tool Use 실행 → 결과 집계 → Observability·Evaluation으로 품질 확인 → 재시도 또는 완료.

- **AI Agent**: Orchestration이 조율하는 실행 단위
- **Subagent**: Orchestration 아래 전문 하위 Agent
- **Planning**: Orchestration이 분배할 작업 계획 생성
- **Harness**: 각 Agent·Subagent의 실행·안전 래퍼
- **Observability**: 멀티 Agent trace·병목 추적

## 참고

- Anthropic, "Building effective agents" — orchestrator-workers workflow: https://www.anthropic.com/engineering/building-effective-agents
