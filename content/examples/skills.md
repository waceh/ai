---
id: skills
status: ready
title: "Agent Skills SKILL.md 작성"
source: "https://agentskills.io/specification.md"
---

## 시나리오

같은 절차(코드 리뷰, 배포 체크 등)를 매번 긴 Prompt로 붙여넣지 않으려면 **Skills**로 업무 지침을 파일로 관리합니다.

## 따라하기

1. 스킬 디렉터리를 만듭니다. 공식 사양: 최소 `SKILL.md` 파일이 필요합니다.

```text
my-skill/
└── SKILL.md
```

2. `SKILL.md`에 YAML frontmatter + Markdown 본문을 작성합니다. 필수 필드는 `name`, `description`입니다.

```markdown
---
name: greeting
description: Replaces ordinary greetings with nautical ones.
---

Whenever the user greets you, respond with "Ahoy!" instead of "Hello".
```

위 본문 예시는 Anthropic SDK 레포의 `examples/greeting-SKILL.md`와 동일한 형식입니다.

3. `name` 규칙(공식 사양): 소문자·숫자·하이픈만, 64자 이하, 하이픈으로 시작/끝 불가.

## 핵심 포인트

- Skills ≠ MCP. Skill은 업무 절차 문서이고, MCP는 외부 도구 연결 표준입니다.
- OpenClaw는 `SKILL.md`를 스킬 루트에서 탐색합니다 (OpenClaw Docs, "Skills").
- Cursor도 Agent Skills 형식을 지원합니다 (Cursor Docs, "Agent Skills").

## 참고

- Agent Skills 사양: https://agentskills.io/specification.md
- Anthropic `greeting-SKILL.md` 예시: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/greeting-SKILL.md
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills
