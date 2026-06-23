---
id: nanoclaw
status: ready
title: "nanoclaw.sh로 격리 Agent 설치"
source: "https://docs.nanoclaw.dev/installation"
---

## 시나리오

Agent가 호스트 파일·셸에 직접 접근하면 위험합니다. **NanoClaw**는 Agent를 Docker 컨테이너 안에서 실행하는 패턴을 기본으로 합니다.

## 따라하기

1. NanoClaw README Quick Start:

```bash
git clone https://github.com/nanocoai/nanoclaw.git nanoclaw-v2
cd nanoclaw-v2
bash nanoclaw.sh
```

2. 설치 문서에 따르면 `nanoclaw.sh`는 세 단계 체인입니다:
   - `nanoclaw.sh` — 사전 점검(RAM, GCE, root 경고 등)
   - `setup.sh` — Node 20+, pnpm, `pnpm install`
   - `pnpm run setup:auto` — 대화형 마법사(컨테이너 빌드, 인증, 채널 페어링)

3. 요구 사항(설치 문서): macOS/Linux, RAM 4GB+, Node 20+, Docker. 설치 문서는 **Docker only supported runtime**을 명시합니다.

## 핵심 포인트

- 공식 설치 진입점: `bash nanoclaw.sh` (README·설치 문서).
- Agent 러너는 **컨테이너(Bun 1.3.12)** 안에서 동작합니다 (설치 문서, "One runtime on the host, another in the container").
- OpenClaw와 달리 NanoClaw는 **OS 수준 격리(Sandbox)** 에 초점을 둡니다.

## 참고

- NanoClaw README: https://github.com/nanocoai/nanoclaw/blob/main/README.md
- NanoClaw Installation: https://docs.nanoclaw.dev/installation
