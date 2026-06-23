---
id: planning
---

## 개요

Planning은 복잡한 목표를 하위 단계로 나누고, 추론과 행동을 반복하는 에이전트 패턴을 통칭합니다. ReAct 논문은 reasoning trace와 task-specific action을 interleaved 방식으로 생성합니다.

## 세부 내용

ReAct(ICLR 2023)는 추론이 계획을 유지·수정하고, action이 Wikipedia API 같은 외부 환경에서 정보를 모으게 한다고 설명합니다. AI Agent는 이 패턴으로 Tool Use를 반복하고, Orchestration·Subagent로 worker에 위임할 수 있습니다. LLM·Prompt 품질에 의존하며, Tool Use로 단계를 실행하고 Evaluation으로 품질을 측정합니다.

## 검증 근거

- Yao et al., "ReAct" (arXiv:2210.03629): https://arxiv.org/abs/2210.03629
- Anthropic, "Building effective agents" — orchestrator-workers, prompt chaining: https://www.anthropic.com/engineering/building-effective-agents
