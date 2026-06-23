---
id: guardrails
---

## 개요

Guardrails는 에이전트 입출력·도구 호출을 검사해 위험한 행동을 제한하는 정책·필터 계층을 통칭합니다. 범용 단일 표준 스펙은 확인되지 않았습니다.

## 세부 내용

Anthropic "Building effective agents"는 한 모델 인스턴스가 쿼리를 처리하고 다른 인스턴스가 부적절 콘텐츠를 검사하는 병렬 guardrails 패턴을 workflow 예시로 제시합니다. NanoClaw·Harness 문서 맥락에서는 Prompt·Tool Use 전후 검사와 결합됩니다. 고위험 액션은 HITL 승인으로 넘길 수 있습니다. 특정 상용 제품명(예: NeMo Guardrails)은 별도 벤더 문서를 따릅니다.

## 검증 근거

- Anthropic, "Building effective agents" — guardrails parallelization 예시: https://www.anthropic.com/engineering/building-effective-agents
