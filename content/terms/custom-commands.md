---
id: custom-commands
---

### 개요

Custom Slash Commands는 **Claude Code**에서 자주 쓰는 **Prompt** 템플릿을 마크다운 파일로 저장해 `/`로 시작하는 명령으로 재사용하는 기능입니다.

비유하면, "자주 쓰는 문구를 단축키로 등록"하는 것입니다. 프로젝트 전용 명령은 `.claude/commands/`에, 개인용은 `~/.claude/commands/`에 마크다운 파일로 저장하며, `$ARGUMENTS`로 실행 시 뒤에 붙는 텍스트를 받을 수 있습니다. Anthropic은 자율 트리거·번들 스크립트까지 되는 **Skills**(`.claude/skills/`)를 더 넓은 기능의 후속 형태로 권장하지만, Custom Slash Commands는 여전히 동작합니다.

유의사항: Custom Slash Commands ≠ Skills입니다. Custom Slash Commands는 `/`로 사용자가 직접 호출해야 하는 고정 Prompt 템플릿이고, Skills는 이름·설명만으로 Claude가 스스로 판단해 호출할 수도 있는 더 넓은 개념(스크립트·자원 포함)입니다.

### 사용목적

이슈 수정, 커밋 메시지 작성, 코드 리뷰처럼 매번 같은 지시문을 반복 타이핑하지 않고 짧은 명령으로 실행하고 싶을 때 씁니다.

### 동작/구조

`.claude/commands/{name}.md` 파일 작성(YAML frontmatter로 description·allowed-tools 지정 가능) → 세션에서 `/{name} 인자` 입력 → Claude Code가 파일 내용을 Prompt로 로드하고 `$ARGUMENTS`를 입력값으로 치환 → 일반 Prompt와 동일하게 처리.

- **Claude Code**: Custom Slash Commands를 실행하는 호스트
- **Prompt**: 명령 파일에 저장되는 실제 내용
- **Skills**: 자율 호출까지 지원하는 상위 확장 개념

## 참고

- Anthropic, "Slash Commands in the SDK": https://code.claude.com/docs/en/agent-sdk/slash-commands
