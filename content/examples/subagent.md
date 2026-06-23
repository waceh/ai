---
id: subagent
status: ready
title: "Cursor subagentStart Hook"
source: "https://cursor.com/docs/context/skills"
---

## 시나리오

복잡한 조사·리뷰를 메인 Agent와 분리하려면 **Subagent**에 위임합니다. Cursor는 Task 도구로 Subagent를 실행하며, Hook으로 시작·종료를 제어할 수 있습니다.

## 따라하기

Cursor Hooks 문서에 따르면 `subagentStart` / `subagentStop` 이벤트가 있습니다. matcher 예: `generalPurpose`, `explore`, `shell`.

```json
{
  "version": 1,
  "hooks": {
    "subagentStart": [
      {
        "command": ".cursor/hooks/log-subagent.sh",
        "matcher": "generalPurpose"
      }
    ]
  }
}
```

`version`, `hooks`, `command`, `matcher` 필드는 Cursor Hooks 스키마에 정의되어 있습니다.

**확인된 공식 기능이 없는 부분**: 범용 OSS "Subagent" 라이브러리 API는 이 예시에서 확인하지 못했습니다. Cursor·Anthropic beta Agents 등 제품별 API를 사용하세요.

## 핵심 포인트

- Subagent = Orchestration 아래 특정 하위 목표 전담 Agent.
- Cursor: `subagentStart` Hook으로 실행 전 감사·차단 가능.
- Anthropic SDK `examples/agents.py`는 beta Agents/Sessions API를 보여 줍니다.

## 참고

- Cursor Docs, "Agent Skills": https://cursor.com/docs/context/skills
- Anthropic `examples/agents.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/agents.py
