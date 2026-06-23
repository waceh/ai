---
id: sandbox
---

## 개요

Sandbox는 에이전트·도구가 실행되는 격리된 환경입니다. 제품마다 구현이 다르며, 단일 표준 API 이름은 확인되지 않았습니다.

## 세부 내용

NanoClaw 공식 문서는 Docker를 기본 런타임으로, Docker Sandboxes를 추가 격리 옵션으로 설명합니다. OpenClaw 문서는 agent sandbox·`agents.defaults.sandbox.docker` 설정을 제공합니다. Harness 설계에서 Sandbox는 Tool Use로 실행되는 셸·파일 작업의 경계를 만드는 역할이며, Guardrails와 함께 다층 방어에 쓰입니다.

## 검증 근거

- NanoClaw Docs, "Installation" — Docker only supported runtime: https://docs.nanoclaw.dev/installation
- OpenClaw Docs, "Skills" — sandbox sync·`setupCommand`: https://docs.openclaw.ai/tools/skills
