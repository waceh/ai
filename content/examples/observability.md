---
id: observability
status: ready
title: "Cursor postToolUse Hook으로 도구 호출 로깅"
source: "https://cursor.com/docs/context/skills"
---

## 시나리오

Agent가 어떤 Tool Use를 했는지 모르면 디버깅이 어렵습니다. **Observability**는 루프 안 이벤트를 기록·추적합니다.

## 따라하기

Cursor Hooks의 `postToolUse` 이벤트는 도구 실행 **후**에 실행됩니다. matcher로 `Shell`, `Read`, `MCP: ...` 등 도구 타입을 필터할 수 있습니다.

```json
{
  "version": 1,
  "hooks": {
    "postToolUse": [
      {
        "command": ".cursor/hooks/log-tool.sh"
      }
    ]
  }
}
```

Hook 스크립트는 stdin으로 JSON을 받고 stdout으로 JSON을 반환합니다 (Cursor Hooks 문서).

Anthropic "Building effective agents"는 프로덕션 전 **테스트·sandbox** 환경에서 관측할 것을 권고합니다.

**확인된 공식 기능이 없는 부분**: AI Agent 범용 표준 Observability API(예: 단일 `trace.span()`)는 이 예시에서 확인하지 못했습니다.

## 핵심 포인트

- Harness 루프마다 Tool Use·Latency·오류를 남깁니다.
- Cursor: `postToolUse`, `postToolUseFailure`, `afterShellExecution` 등.
- Evaluation·Vector DB 검색 품질도 Observability 대상입니다.

## 참고

- Cursor Docs, "Agent Skills" (Hooks): https://cursor.com/docs/context/skills
- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
