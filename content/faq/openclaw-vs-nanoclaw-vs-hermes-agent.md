---
id: openclaw-vs-nanoclaw-vs-hermes-agent
---

### 핵심 답변

**OpenClaw**, **NanoClaw**, **Hermes Agent** 모두 범용 **AI Agent** 프레임워크지만, 우선순위가 다릅니다. OpenClaw는 **Skills**·**MCP** 플러그인 확장에, NanoClaw는 **Sandbox**·**Guardrails**·**HITL** 격리 보안에, Hermes Agent는 여러 채널에 걸친 지속 Memory와 **Subagent** 위임에 무게를 둡니다. "무엇을 안전하게 확장하느냐"가 아니라 "어디에 초점을 두느냐"가 셋을 가르는 기준입니다.

### 한눈에 비교

| 구분 | OpenClaw | NanoClaw | Hermes Agent |
|------|----------|----------|---------------|
| 초점 | Skills·MCP 플러그인 확장 | Sandbox·Guardrails·HITL 격리 | 다중 채널 지속 Memory·Subagent 위임 |
| 실행 격리 | Skills 문서의 sandbox sync | Docker (공식 문서: only supported runtime) | local·Docker·SSH·Daytona·Singularity·Modal |
| 채널 연동 | 파일·브라우저·메신저 등 넓은 권한 | 격리 실행 중심, 채널 연동은 부차적 | Telegram·Discord·Slack·WhatsApp·Signal·Email·CLI |
| Skills | `SKILL.md` 디렉터리 스캔·자동 로드 | 문서에 Skills 우선 언급 없음 | agentskills.io 호환, 절차적 메모리로 자동 생성 |
| MCP | 지원(플러그인 등록) | 지원 | 지원(Tool Gateway 통합, `hermes setup --portal`) |
| 라이선스·개발사 | 오픈소스(Clawdbot→Moltbot→OpenClaw) | 오픈소스 | MIT License, Nous Research |
| 설치 진입점 | `openclaw onboard` | `bash nanoclaw.sh` | `curl ... install.sh \| bash` + `hermes setup --portal` |

### 언제 뭘 고르나

- **OpenClaw** — Skills·MCP 플러그인을 계속 추가하며 파일·브라우저·메신저까지 넓게 다루는 범용 Agent가 필요할 때.
- **NanoClaw** — Agent가 셸·파일·네트워크에 접근해야 하는데, 사고를 줄이기 위해 Docker Sandbox·Guardrails·HITL 승인부터 갖추고 싶을 때.
- **Hermes Agent** — 하나의 Agent를 여러 메신저 채널에서 동시에 쓰면서 학습 내용·Skills를 채널 간 끊김 없이 유지하고, 무거운 작업은 격리된 Subagent로 나눠 위임하고 싶을 때.

셋 다 AI Agent를 호스팅하는 프레임워크라는 공통점은 있지만, 보안 격리(NanoClaw)·플러그인 확장(OpenClaw)·다중 채널 지속성(Hermes Agent) 중 무엇이 병목인지에 따라 선택이 갈립니다.

### 같이 보면 좋은 용어

**AI Agent**, **OpenClaw**, **NanoClaw**, **Hermes Agent**, **Skills**, **MCP**, **Sandbox**, **Guardrails**, **HITL**, **Subagent**
