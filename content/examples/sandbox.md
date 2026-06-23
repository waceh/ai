---
id: sandbox
status: ready
title: "Docker 컨테이너로 Agent 실행 격리"
source: "https://docs.nanoclaw.dev/installation"
---

## 시나리오

Tool Use로 `rm -rf`·패키지 설치 같은 명령을 허용하면 호스트가 위험해집니다. **Sandbox**는 명령을 격리 환경(컨테이너 등)에서만 실행합니다.

## 따라하기

### NanoClaw (공식 설치 문서)

NanoClaw는 Agent를 Docker 컨테이너에서 실행합니다. 설치 문서 요약:

- 호스트: Node 20+ + pnpm으로 서비스(`node dist/index.js`) 실행
- Agent 컨테이너: Bun 1.3.12, `container/Dockerfile` 기반
- 에이전트 소스는 이미지에 bake하지 않고 `container/agent-runner/src`를 read-only 마운트

```bash
bash nanoclaw.sh
```

### Anthropic Managed Agents (공식 SDK 예제 주석)

`managed-agents-self-hosted-sandbox-worker.py`는 다음을 명시합니다:

> Security model: the worker executes bash and file operations directly on the host. **Run inside a container or other isolation boundary you control.**

즉, Sandbox는 프레임워크 기본값(NanoClaw)이거나, 직접 구현 시 **컨테이너 경계**를 두라는 공식 권고(Anthropic SDK)입니다.

## 핵심 포인트

- Sandbox = 실행 공간 분리. Guardrails = 입·출력 정책 검사 (별개).
- NanoClaw: Docker가 공식 지원 런타임입니다.
- OpenClaw Skills 문서에는 `setupCommand`·sandbox sync가 언급됩니다 (스킬 환경 맞춤).

## 참고

- NanoClaw Installation: https://docs.nanoclaw.dev/installation
- Anthropic `managed-agents-self-hosted-sandbox-worker.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/managed-agents-self-hosted-sandbox-worker.py
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills
