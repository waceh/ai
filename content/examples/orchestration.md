---
id: orchestration
status: ready
title: "Orchestrator-Workers 워크플로"
source: "https://www.anthropic.com/engineering/building-effective-agents"
---

## 시나리오

한 Agent가 조사·작성·검토를 모두 하면 품질이 떨어질 수 있습니다. **Orchestration**은 작업을 나누어 여러 Worker(또는 Subagent)에 분배합니다.

## 따라하기

Anthropic "Building effective agents"의 **orchestrator-workers** 패턴:

1. **Orchestrator** LLM이 작업을 하위 작업으로 분해
2. 각 하위 작업을 **Worker** LLM/Agent에 위임
3. Worker 결과를 Orchestrator가 취합·통합

의사 코드:

```text
User goal
  → Orchestrator: subtasks [A, B, C]
  → Worker 1: subtask A → result A
  → Worker 2: subtask B → result B
  → Orchestrator: merge → final answer
```

**확인된 공식 기능이 없는 부분**: `orchestrator.dispatch()` 같은 표준 API는 확인되지 않았습니다. LangGraph·Cursor Subagent 등 구현은 제품별 문서를 참고하세요.

## 핵심 포인트

- Orchestration은 **워크플로 패턴** 이름이지 단일 SDK 메서드가 아닙니다.
- Subagent는 Orchestration의 하위 실행 단위입니다.
- Observability로 각 Worker의 Tool Use·지연을 추적합니다.

## 참고

- Anthropic, "Building effective agents" (orchestrator-workers): https://www.anthropic.com/engineering/building-effective-agents
- Cursor Docs, "Agent Skills" (Subagents 언급): https://cursor.com/docs/context/skills
