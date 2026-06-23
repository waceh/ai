---
id: guardrails
status: ready
title: "Cursor Hook으로 Prompt 제출 전 검사"
source: "https://cursor.com/docs/context/skills"
---

## 시나리오

LLM·Tool Use가 민감 정보·위험 명령을 생성할 수 있습니다. **Guardrails**는 Prompt·도구 호출 전후에 정책을 적용합니다.

## 따라하기

### A. 워크플로 패턴 (Anthropic 공식 글)

Anthropic "Building effective agents"는 Guardrails를 **병렬 검증 워크플로** 예시로 설명합니다. 단일 API 이름은 제공하지 않습니다.

### B. Cursor Hooks (공식 이벤트명 확인됨)

Cursor는 `beforeSubmitPrompt`, `preToolUse`, `beforeMCPExecution` 등 Hook 이벤트를 문서화합니다. 프로젝트 루트에 `.cursor/hooks.json`:

```json
{
  "version": 1,
  "hooks": {
    "beforeSubmitPrompt": [
      {
        "command": ".cursor/hooks/check-prompt.sh"
      }
    ]
  }
}
```

`beforeSubmitPrompt`의 matcher 값 `UserPromptSubmit`은 Cursor Hooks 문서에 명시되어 있습니다.

**확인된 공식 기능이 없는 부분**: 범용 "Guardrails" 전용 단일 오픈소스 API는 이 예시에서 확인하지 못했습니다. 제품별 Hook·정책 엔진을 사용하세요.

## 핵심 포인트

- Guardrails ≠ HITL. Guardrails는 자동 규칙, HITL은 사람 승인입니다.
- Cursor `preToolUse` / `beforeMCPExecution`으로 Tool Use·MCP 호출을 게이트할 수 있습니다.
- Prompt 설계(`system`)와 허용 도구 목록이 Guardrails 효과를 좌우합니다.

## 참고

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
- Cursor Docs, "Agent Skills" (Hooks 교차 링크): https://cursor.com/docs/context/skills
