---
id: prompt
---

## 개요

Prompt는 모델에 전달하는 지시·역할·제약·대화 맥락을 통칭합니다. Anthropic Messages API는 system·user·assistant 역할 메시지 구조를 사용합니다.

## 세부 내용

System Prompt에 역할·금지 사항을 두고, AI Agent가 사용자 입력·Tool Use 결과·RAG 검색문을 이어 붙입니다. Planning·Skills 사용법·Guardrails 규칙을 Prompt에 명시하면 LLM 행동이 안정됩니다. Fine-tuning 없이도 도메인 적응의 첫 단계로 쓰이며, Anthropic은 tool 정의 자체도 prompt engineering 대상으로 권장합니다.

## 검증 근거

- Anthropic, "Building effective agents" — Appendix 2 Prompt engineering your tools: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic API primer — messages·tool use: https://platform.claude.com/docs/en/claude_api_primer
