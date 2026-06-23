---
id: harness
---

## 개요

Harness는 모델·도구·지시문을 묶어 에이전트 루프를 실행하는 런타임·오케스트레이션 계층입니다. Cursor 공식 문서는 "Every coding agent needs a harness"라고 명시하며, 모델·도구·instructions의 조합으로 정의합니다.

## 세부 내용

Harness는 사용자가 선택한 LLM과 도구·instructions를 묶어 AI Agent 루프를 실행합니다. Cursor SDK 문서에 따르면 Harness에는 컨텍스트 관리, MCP·Skills, Hooks, Subagents, 샌드박스 VM 등이 포함됩니다. Tool Use 호출은 Sandbox에서 격리 실행할 수 있고, Guardrails·HITL로 위험 행동을 제한하며, Observability로 호출을 기록하는 패턴이 문서·블로그에서 함께 설명됩니다. 단, "Harness"라는 단일 국제 표준 명세는 확인되지 않았고, 제품·문서별 용어입니다.

## 검증 근거

- Cursor Docs, "Build a coding agent": https://cursor.com/docs/help/getting-started/build-ai-coding-agent
- Cursor Docs, "Cursor SDK"(TypeScript): https://cursor.com/docs — SDK가 "same harness" 제공 (문서 내 SDK 섹션)
