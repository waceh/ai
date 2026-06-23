---
id: subagent
---

## 개요

Subagent는 상위 에이전트가 하위 작업을 위임하는 전문 에이전트 인스턴스입니다. Cursor SDK 문서에 Subagents 기능이 공식 기재되어 있습니다.

## 세부 내용

Cursor 문서에 따르면 메인 에이전트가 Agent 도구로 named subagent를 호출하며, subagent마다 별도 prompt·model을 둘 수 있습니다. Orchestration·Planning과 함께 복잡 작업을 분할하고, Harness가 Subagent별 Sandbox·Token 예산을 나눌 수 있습니다. 부모 AI Agent는 LLM이 Subagent 결과를 통합합니다.

## 검증 근거

- Cursor Docs, "Agent Skills" 및 SDK 관련 문서 — Subagents: https://cursor.com/docs/context/skills
- Cursor help, "Build a coding agent" — SDK harness·subagents 언급: https://cursor.com/docs/help/getting-started/build-ai-coding-agent
