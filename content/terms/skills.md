---
id: skills
---

## 개요

Skills는 에이전트에게 특정 업무 절차·도메인 지식을 알려 주는 파일 기반 확장입니다. Cursor 공식 문서는 Agent Skills를 "open standard"로 설명하며, OpenClaw는 `SKILL.md` 형식의 스킬 디렉터리를 로드합니다.

## 세부 내용

Cursor는 `.cursor/skills/`, `.agents/skills/` 등에서 `SKILL.md`(YAML frontmatter + 본문)를 자동 발견합니다. OpenClaw는 workspace·managed·bundled 경로 우선순위로 스킬을 로드하고, ClawHub 레지스트리에서 설치할 수 있습니다(documented CLI: `openclaw skills install`). AI Agent가 Skills를 선택해 Tool Use·MCP 호출로 실행하며, Harness·Prompt 빌드 과정에서 스킬 설명이 시스템 프롬프트에 주입됩니다.

## 검증 근거

- Cursor Docs, "Agent Skills": https://cursor.com/docs/context/skills
- Agent Skills 표준 사이트(Cursor 문서 링크): https://agentskills.io
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills
