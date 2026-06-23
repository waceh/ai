---
id: hitl
status: ready
title: "고위험 Tool Use 전 사람 승인 체크포인트"
source: "https://www.anthropic.com/engineering/building-effective-agents"
---

## 시나리오

프로덕션 배포·결제·데이터 삭제처럼 되돌리기 어려운 작업은 **HITL**(Human-in-the-Loop)로 사람 승인을 받습니다.

## 따라하기

Anthropic "Building effective agents"는 체크포인트에서 **human feedback**을 받는 패턴을 권장합니다. 의사 코드 흐름:

1. Agent가 Tool Use를 선언 (`stop_reason == "tool_use"`)
2. Harness/Guardrails가 위험 등급 판단
3. 고위험이면 실행을 **일시 정지**하고 UI·알림으로 사람에게 전달
4. 승인 시에만 실제 도구 실행 → `tool_result` 전달
5. 거부 시 취소 또는 대안 Planning

**확인된 공식 기능이 없는 부분**: Anthropic/OpenAI SDK에 `hitl.approve()` 같은 전용 메서드는 확인되지 않았습니다. HITL은 **애플리케이션·Harness 구현 패턴**입니다.

NanoClaw·OpenClaw 등 프레임워크별 승인 UI는 각 제품 문서를 참고하세요.

## 핵심 포인트

- HITL ≠ Guardrails. Guardrails는 자동 규칙, HITL은 사람 판단입니다.
- Tool Use 선언 지점이 승인 체크포인트로 적합합니다.
- Sandbox와 함께 쓰면 승인 전 호스트 노출을 줄일 수 있습니다.

## 참고

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
- Anthropic `tools.py` (Tool Use 선언 지점): https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py
