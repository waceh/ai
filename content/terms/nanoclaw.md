---
id: nanoclaw
---

### 개요

NanoClaw는 **Sandbox** 격리·**Guardrails**·**HITL**을 핵심으로 하는 경량 **AI Agent** 프레임워크입니다. Agent가 셸·파일·네트워크에 접근할 때 사고를 줄이려면, 실행을 컨테이너 안에 가두고 사람 승인을 거치는 패턴이 필요합니다.

비유하면, NanoClaw는 "금고 안에서만 일하는 Agent"입니다. 설치 문서는 Docker only supported runtime을 명시하며, **Harness**와 유사한 LLM·Tool Use 루프를 격리 환경에서 돌립니다.

유의사항: NanoClaw ≠ OpenClaw입니다. **OpenClaw**는 Skills·MCP 플러그인 확장에, NanoClaw는 보안·격리 실행에 초점을 둡니다. 둘 다 AI Agent를 호스팅하지만 설계 우선순위가 다릅니다.

### 사용목적

Agent가 셸·파일·네트워크에 접근할 때 사고를 줄이려면 Sandbox 격리와 사람 승인(HITL)이 필요합니다. NanoClaw 설치 문서는 Docker only supported runtime을 명시합니다.

### 동작/구조

AI Agent 루프는 Harness와 유사하게 LLM·Tool Use를 반복하지만, 실행은 Sandbox 컨테이너 안에서만 일어납니다. Guardrails가 Prompt·Tool Use를 검사하고, 고위험 작업은 HITL 체크포인트를 거칩니다.

- **AI Agent**: NanoClaw가 호스팅하는 격리 실행 Agent
- **Sandbox**: NanoClaw의 핵심 실행 격리 환경(Docker)
- **Guardrails**: Agent 행동·Tool Use 제한 정책
- **HITL**: 위험 Tool Use 전 사람 승인
- **OpenClaw**: Skills·MCP 확장에 초점을 둔 대안 Agent 프레임워크

## 참고

- GitHub `nanocoai/nanoclaw`: https://github.com/nanocoai/nanoclaw
- NanoClaw 공식 사이트: https://nanoclaw.dev
- NanoClaw 설치 문서: https://docs.nanoclaw.dev/installation
