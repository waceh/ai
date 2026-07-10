---
id: hooks
---

### 개요

Hooks는 **Claude Code**의 생명주기 특정 시점(도구 실행 전후, 세션 시작 등)에 사용자 스크립트를 실행해 Agent 동작을 자동화·통제하는 확장 지점입니다.

비유하면, Hooks는 "특정 순간마다 울리는 알람에 연결된 자동화 스위치"입니다. 이벤트가 발생하면 Claude Code가 이벤트 데이터를 JSON으로 스크립트 stdin에 전달하고, 스크립트는 stdout·exit code로 다음 행동(허용·차단·메시지 주입)을 알립니다. **PreToolUse**는 **Tool Use** 실행 전에, **PostToolUse**는 실행 후에 발동하며, **Guardrails** 규칙을 코드로 강제하는 수단으로도 쓰입니다.

유의사항: Hooks ≠ Guardrails입니다. Guardrails는 일반적인 안전 규칙·정책 개념이고, Hooks는 Claude Code가 제공하는 구체적인 이벤트 훅 메커니즘으로 그 규칙을 실제로 실행합니다.

### 사용목적

파일 수정 후 자동 포맷팅, 위험한 명령 사전 차단, 세션 시작 시 컨텍스트 주입, 작업 완료 알림처럼 사람이 매번 반복하기 번거로운 절차를 자동화할 때 씁니다.

### 동작/구조

이벤트 발생(SessionStart·PreToolUse·PostToolUse·Notification·Stop 등) → Claude Code가 이벤트 JSON을 설정된 스크립트 stdin으로 전달 → 스크립트가 로직 실행 → exit code·stdout으로 허용/차단/추가 컨텍스트를 Claude Code에 반환 → Agent 루프가 그 결과를 반영해 계속 진행.

- **Claude Code**: Hooks를 실행하는 호스트 제품
- **AI Agent**: Hooks가 감싸는 실행 루프의 주체
- **Guardrails**: Hooks로 강제되는 안전 규칙 개념
- **Tool Use**: PreToolUse·PostToolUse가 감시하는 대상 행동
- **Observability**: Hooks 로그가 관측 데이터로 활용됨

## 참고

- Anthropic, "Automate actions with hooks": https://code.claude.com/docs/en/hooks-guide
