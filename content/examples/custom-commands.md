---
id: custom-commands
status: ready
title: "이슈 번호로 수정 요청하는 /fix-issue 명령"
source: "https://code.claude.com/docs/en/agent-sdk/slash-commands"
---

## 시나리오

"이슈 123 고쳐줘"를 매번 길게 설명하지 않고, 짧은 슬래시 명령으로 반복 실행하고 싶습니다.

## 따라하기

1. 프로젝트에 `.claude/commands/fix-issue.md` 파일 생성
2. 파일 안에 프롬프트 템플릿 작성, `$ARGUMENTS`로 인자 받기

```markdown
---
description: "GitHub 이슈 번호를 받아 수정 계획을 세운다"
---

이슈 번호 $ARGUMENTS 의 내용을 확인하고, 관련 코드를 찾아 수정 계획을 세워줘.
```

3. 세션에서 `/fix-issue 123` 입력
4. Claude Code가 파일 내용을 로드하고 `$ARGUMENTS`를 `123`으로 치환해 실행

## 핵심 포인트

- 프로젝트 전용 명령은 `.claude/commands/`, 개인용은 `~/.claude/commands/`에 저장합니다.
- `$ARGUMENTS`로 실행 시 뒤에 붙는 텍스트를 받습니다.
- 자율 트리거까지 필요하면 Skills(`.claude/skills/`)로 옮기는 것이 Anthropic 권장 방향입니다.

## 참고

- Anthropic, "Slash Commands in the SDK": https://code.claude.com/docs/en/agent-sdk/slash-commands
