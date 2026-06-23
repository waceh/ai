---
id: orchestration
---

## 개요

Orchestration은 여러 LLM 호출·도구·워커를 조율해 하나의 작업을 완료하는 계층입니다. Anthropic 공식 문서는 "orchestrator-workers" workflow를 정의합니다.

## 세부 내용

중앙 LLM이 작업을 동적으로 분해해 worker LLM에 위임하고 결과를 합성합니다. AI Agent·Subagent·Planning과 결합되며, Harness가 전체 루프·Observability를 통합합니다. MCP·Skills를 팀 단위로 공유하는 패턴도 제품 문서에서 설명됩니다.

## 검증 근거

- Anthropic, "Building effective agents" — orchestrator-workers workflow: https://www.anthropic.com/engineering/building-effective-agents
