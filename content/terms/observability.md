---
id: observability
---

## 개요

Observability는 에이전트의 Prompt·Tool Use·검색 호출을 로그·트레이스로 기록·분석하는 운영 계층입니다. 범용 에이전트 표준 스펙은 확인되지 않았습니다.

## 세부 내용

Cursor SDK 문서는 Hooks(`.cursor/hooks.json`)로 AI Agent 루프를 관찰·제어할 수 있다고 설명합니다. Harness에 계측을 심어 디버깅·Evaluation·비용 분석에 활용하고, RAG·Vector DB 검색 결과·Guardrails·HITL 차단 이벤트를 함께 남기는 패턴이 운영 모범 사례로 제시됩니다.

## 검증 근거

- Cursor 제품 문서 — Hooks(공식 SDK·문서 내 hooks.json): https://cursor.com/docs/context/skills (Hooks 교차 링크)
- Anthropic, "Building effective agents" — 테스트·sandbox 권고: https://www.anthropic.com/engineering/building-effective-agents
