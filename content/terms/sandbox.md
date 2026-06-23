---
id: sandbox
---

### 개요

Sandbox는 **Harness**가 코드·파일·셸 명령을 격리된 환경(컨테이너·VM·제한 프로세스)에서 실행하는 패턴입니다. **Tool Use**로 패키지 설치·파일 삭제를 허용하면 호스트 전체가 위험해지므로, 결과만 밖으로 전달하고 세션 종료 시 환경을 폐기합니다.

비유하면, Sandbox는 "유리벽 실험실"입니다. Agent는 실험실 안에서만 일하고, **Guardrails**가 허용 명령·경로를 추가로 제한합니다. **NanoClaw**는 이 패턴을 프레임워크 기본값으로 둡니다.

유의사항: Sandbox ≠ Guardrails입니다. Sandbox는 실행 공간을 분리하고, Guardrails는 Prompt·Tool Use 내용을 정책으로 검사합니다. 둘 다 Harness·NanoClaw 루프에서 함께 쓰입니다.

### 사용목적

Tool Use로 셸·파일·패키지 설치를 허용하면 위험합니다. Harness는 Sandbox 안에서만 명령을 실행하고, Guardrails로 허용 명령·경로를 제한합니다.

### 동작/구조

Agent 요청 → Harness가 Sandbox(컨테이너·VM·제한된 프로세스) 생성 → Tool Use 결과만 밖으로 전달 → 세션 종료 시 Sandbox 폐기. NanoClaw는 이 패턴을 프레임워크 기본값으로 둡니다.

- **Harness**: Sandbox를 만들고 Tool Use를 그 안에서 실행
- **NanoClaw**: Sandbox 격리를 핵심 설계로 하는 Agent 프레임워크
- **Guardrails**: Sandbox 밖으로 나가는 Prompt·Tool Use를 추가 검사

## 참고

- NanoClaw Docs, "Installation" — Docker only supported runtime: https://docs.nanoclaw.dev/installation
- OpenClaw Docs, "Skills" — sandbox sync·`setupCommand`: https://docs.openclaw.ai/tools/skills
