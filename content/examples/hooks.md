---
id: hooks
status: ready
title: "파일 수정 후 자동 포맷팅 Hook"
source: "https://code.claude.com/docs/en/hooks-guide"
---

## 시나리오

Claude Code가 파일을 수정할 때마다 매번 사람이 포맷터를 수동 실행하지 않고 자동으로 돌아가게 하고 싶습니다.

## 따라하기

Anthropic 공식 Hooks 가이드 기준:

1. `~/.claude/settings.json`(또는 프로젝트 설정)에 `hooks` 블록 추가
2. `PostToolUse` 이벤트에 포맷터 스크립트 등록
3. Claude Code가 Edit 도구를 실행할 때마다 이벤트 JSON을 스크립트 stdin으로 전달
4. 스크립트가 변경된 파일에 포맷터 실행 후 exit code로 성공 여부 반환

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{ "type": "command", "command": "npx prettier --write \"$FILE\"" }]
      }
    ]
  }
}
```

**확인된 공식 기능이 없는 부분**: 위 설정 예시의 정확한 JSON 스키마(필드명 등)는 버전에 따라 다를 수 있으므로 실제 적용 전 공식 Hooks reference를 확인해야 합니다.

## 핵심 포인트

- Hooks는 PreToolUse·PostToolUse·SessionStart·Notification·Stop 등 이벤트 시점에 실행됩니다.
- 이벤트 데이터는 JSON으로 stdin에 전달되고, 스크립트는 stdout·exit code로 응답합니다.
- 위험한 명령을 PreToolUse에서 차단하는 것도 같은 메커니즘으로 가능합니다.

## 참고

- Anthropic, "Automate actions with hooks": https://code.claude.com/docs/en/hooks-guide
