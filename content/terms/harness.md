---
id: harness
---

### 개요

Harness(Agent Harness)는 **LLM**·**Tool Use** 실행을 **Sandbox**·**Guardrails**·**HITL**·**Observability**로 감싸는 **AI Agent** 실행 계층입니다. 모델 API만 호출하는 것과 달리, "에이전트가 안전하게 일하는 작업장" 전체를 의미합니다.

비유하면, Harness는 공장의 컨veyor belt + 안전망 + CCTV입니다. **MCP**·Skills로 연결된 도구를 쓰되, 위험 행동은 차단하고 사람 승인(**HITL**)을 받으며, 모든 호출을 기록합니다.

유의사항: Harness ≠ LLM·Agent입니다. Agent는 "무엇을 할지" 결정하고, Harness는 "어떻게 안전하게 실행할지"를 담당합니다. Cursor 문서는 harness를 model + tools + instructions 조합으로 설명합니다.

### 사용목적

LLM API만 호출하면 샌드박스 격리, 위험 Tool Use 승인, RAG·Vector DB 호출 추적이 빠집니다. Harness가 Guardrails·HITL·Observability를 표준 위치에 둡니다.

### 동작/구조

사용자 입력 → Prompt·Memory 조립 → LLM 호출 → Tool Use/MCP/Skills 실행(Sandbox 내부) → Guardrails 검사 → 필요 시 HITL 승인 → Observability에 기록 → 다음 턴으로 반복합니다.

- **AI Agent**: Harness 위에서 목표를 pursuit하는 논리적 시스템
- **LLM**: Harness가 반복 호출하는 추론 코어
- **MCP**: Harness가 연결·권한 관리하는 외부 도구 표준
- **Sandbox**: Harness가 코드·파일 실행을 격리하는 환경
- **Guardrails**: Prompt·Tool Use 전후 정책 검사
- **HITL**: 고위험 Tool Use 전 사람 승인
- **Observability**: Prompt·Tool Use·RAG 호출 추적
- **Tool Use**: Harness 루프의 핵심 행동 단위

## 참고

- Cursor Docs, "Build a coding agent": https://cursor.com/docs/help/getting-started/build-ai-coding-agent
- Cursor Docs, "Cursor SDK"(TypeScript): https://cursor.com/docs — SDK가 "same harness" 제공 (문서 내 SDK 섹션)
