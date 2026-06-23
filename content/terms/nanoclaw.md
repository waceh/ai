---
id: nanoclaw
---

## 개요

NanoClaw는 OpenClaw의 경량 대안으로 소개되는 오픈소스 personal AI agent입니다. 공식 GitHub README는 에이전트를 Docker 컨테이너에서 실행해 파일시스템 격리를 제공한다고 설명합니다.

## 세부 내용

`nanocoai/nanoclaw` 저장소에 따르면 Anthropic Agents SDK 기반이며, `nanoclaw.sh` 설치 스크립트로 Node·pnpm·Docker를 구성합니다. AI Agent 그룹마다 Sandbox(기본 Docker, 선택적 Docker Sandboxes micro-VM)에서 실행되며, Guardrails·HITL과 함께 고위험 작업을 제어합니다. OpenClaw 대비 코드 규모를 줄여 fork-and-own을 목표로 합니다(README 표현).

## 검증 근거

- GitHub `nanocoai/nanoclaw`: https://github.com/nanocoai/nanoclaw
- NanoClaw 공식 사이트: https://nanoclaw.dev
- NanoClaw 설치 문서: https://docs.nanoclaw.dev/installation
