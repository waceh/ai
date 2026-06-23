---
id: hitl
---

## 개요

HITL(Human-in-the-Loop)은 에이전트가 자율 실행하되, 특정 시점에 사람의 판단·승인을 끼워 넣는 제어 방식입니다. 범용 프로토콜 이름은 확인되지 않았습니다.

## 세부 내용

Anthropic agent 문서는 실행 중 checkpoint에서 human feedback을 받거나 blocker에서 멈추는 흐름을 설명합니다. Harness 정책으로 고위험 Tool Use(배포·결제·대량 삭제 등) 직전에 확인 UI를 두는 패턴이 제품별로 구현됩니다. Guardrails가 자동 차단한 경우와 사람이 예외 승인하는 경우를 구분합니다.

## 검증 근거

- Anthropic, "Building effective agents" — human feedback at checkpoints: https://www.anthropic.com/engineering/building-effective-agents
