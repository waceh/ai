---
id: tool-choice
---

### 개요

Tool Choice(`tool_choice`)는 **Tool Use** 요청에서 Claude가 도구를 어떻게 호출할지 지정하는 API 파라미터입니다.

비유하면, "자유롭게 고르게 둘지, 반드시 하나는 쓰게 할지, 특정 도구를 못 박을지, 아예 못 쓰게 막을지 정하는 스위치"입니다. `auto`(기본값, **LLM**이 스스로 판단), `any`(도구 중 하나는 반드시 호출), `tool`(지정한 도구를 강제 호출), `none`(도구 미사용, 도구 없을 때 기본값) 네 가지 옵션이 있습니다. `disable_parallel_tool_use: true`를 함께 주면 한 응답에서 도구를 최대 하나만 호출하도록 **Orchestration** 흐름을 단순화할 수 있습니다.

유의사항: Tool Choice ≠ Tool Use입니다. Tool Use는 도구를 정의하고 호출하는 전체 메커니즘이고, Tool Choice는 그 메커니즘 안에서 "어떤 도구를 어떻게 강제할지"만 조정하는 파라미터입니다. Extended thinking과 함께 쓸 때는 `auto`·`none`만 지원됩니다.

### 사용목적

특정 상황에서 반드시 특정 도구를 쓰게 강제하거나(예: 항상 검색 먼저), 반대로 이번 턴에는 도구를 아예 못 쓰게 막고 싶을 때 씁니다.

### 동작/구조

요청에 `tools` 배열과 함께 `tool_choice` 지정 → `{"type": "auto"}`면 LLM이 자유 판단, `{"type": "any"}`면 목록 중 하나 강제, `{"type": "tool", "name": "..."}`면 특정 도구 강제, `{"type": "none"}`이면 미사용 → 필요 시 `disable_parallel_tool_use`로 병렬 호출 여부까지 조정.

- **Tool Use**: Tool Choice가 제어하는 대상 메커니즘
- **LLM**: `auto` 모드에서 스스로 판단하는 주체
- **Orchestration**: Tool Choice로 도구 호출 순서·범위를 조정하는 상위 흐름

## 참고

- Claude Platform Docs, "How tool use works": https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works
- Claude Cookbook, "Tool choice": https://platform.claude.com/cookbook/tool-use-tool-choice
