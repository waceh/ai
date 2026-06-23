---
id: openclaw
---

### 개요

OpenClaw는 다양한 **Skills**·**MCP** 플러그인을 붙이는 범용 **AI Agent** 프레임워크입니다. Harness·Tool Use·MCP 클라이언트를 처음부터 짜기 부담스러울 때, Skills 디렉터리·MCP 연결·sandbox sync 같은 공통 패턴을 제공합니다.

비유하면, OpenClaw는 "플러그인 꽂으면 바로 도는 Agent 키트"입니다. Agent 설정에 Skills·MCP 서버를 등록하면 런타임이 루프를 돌립니다.

유의사항: OpenClaw와 **NanoClaw**는 대비되는 선택지입니다. OpenClaw는 Skills·MCP 확장에 초점을 두고, NanoClaw는 Sandbox·Guardrails·HITL 격리에 더 무게를 둡니다.

### 사용목적

직접 Harness·Tool Use·MCP 클라이언트를 모두 짜기 부담스러울 때, OpenClaw가 Skills 디렉터리·MCP 연결·sandbox sync 같은 공통 패턴을 제공합니다.

### 동작/구조

Agent 설정에 Skills·MCP 서버를 등록하고, OpenClaw 런타임이 AI Agent 루프를 돌립니다. Skills 문서의 setupCommand·sandbox sync는 실행 환경을 Skill 요구사항에 맞춥니다.

- **AI Agent**: OpenClaw가 호스팅하는 자율 실행 시스템
- **Skills**: OpenClaw에 등록·동기화하는 업무 확장 모듈
- **MCP**: OpenClaw Agent가 연결하는 외부 도구 표준
- **NanoClaw**: Sandbox·Guardrails·HITL에 더 초점을 둔 경량 Agent 프레임워크(대비 선택지)

## 참고

- GitHub `openclaw/openclaw` README: https://github.com/openclaw/openclaw
- OpenClaw Docs: https://docs.openclaw.ai
