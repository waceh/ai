---
id: hitl
---

### 개요

HITL(Human-in-the-Loop)은 **Harness** 루프에서 고위험 **Tool Use** 전 사람 승인·거부를 받는 체크포인트입니다. **Guardrails**만으로는 비즈니스 맥락·예외를 모두 자동 판단하기 어렵습니다.

비유하면, HITL은 "중요 서명 전 최종 확인"입니다. Agent가 Tool Use를 선언하면 Harness·Guardrails가 위험 등급을 판단하고, 필요 시 UI·알림으로 사람에게 넘깁니다.

학습 단계의 **RLHF**는 인간이 답변 순위·점수를 매겨 모델을 정렬하는 방식입니다. 런타임 **HITL**은 **Harness**가 고위험 **Tool Use** 전에 사람 승인을 받는 운영 패턴으로, RLHF와 목적·시점이 다릅니다.

유의사항: HITL ≠ Guardrails입니다. Guardrails는 규칙 자동 검사, HITL은 사람이 맥락을 보고 결정합니다. NanoClaw 등 보안 프레임워크는 HITL을 기본 시나리오로 다룹니다.

### 사용목적

Guardrails만으로는 비즈니스 맥락·예외를 모두 자동 판단하기 어렵습니다. Harness는 HITL 체크포인트에서 Tool Use를 일시 정지하고 승인 후 재개합니다.

### 동작/구조

Agent가 Tool Use 선언 → Harness·Guardrails가 위험 등급 판단 → HITL 필요 시 UI·알림으로 사람에게 전달 → 승인 시 Sandbox에서 실행, 거부 시 취소 또는 대안 Planning. NanoClaw 등 보안 프레임워크는 HITL을 기본 시나리오로 다룹니다.

- **Harness**: HITL 체크포인트를 루프에 삽입
- **Guardrails**: HITL이 필요한 Tool Use를 분류
- **Tool Use**: HITL 승인 대상이 되는 Agent 행동

## 참고

- Anthropic, "Building effective agents" — human feedback at checkpoints: https://www.anthropic.com/engineering/building-effective-agents
