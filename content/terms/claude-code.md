---
id: claude-code
---

### 개요

Claude Code는 터미널·IDE·데스크톱 앱에서 동작하는 Anthropic의 에이전틱 코딩 도구입니다. 코드베이스를 읽고, 파일을 수정하고, 명령을 실행하고, git 워크플로를 자연어로 처리합니다.

비유하면, Claude Code는 "터미널에 상주하는 페어 프로그래머"입니다. **AI Agent** 패턴을 구체 제품으로 구현한 것으로, **Harness**(권한·루프·안전) 위에서 **MCP** 서버, **Skills**, **Hooks**로 능력을 확장하고 **Plan Mode**로 위험한 변경 전 계획을 검토하며, **CLAUDE.md**로 프로젝트 맥락을 세션마다 다시 읽습니다. 커스텀 프롬프트가 필요하면 **Custom Slash Commands**를 씁니다.

유의사항: Claude Code ≠ **Agent SDK**입니다. Claude Code는 대화형 CLI 제품이고, Agent SDK는 같은 도구·루프·컨텍스트 관리 기능을 코드로 가져와 커스텀 에이전트를 만드는 라이브러리입니다.

### 사용목적

반복 작업 자동화, 코드 설명, 대규모 리팩터링, CI 파이프라인 통합처럼 코드베이스 전체 맥락이 필요한 작업에 씁니다. Unix 철학을 따르므로 로그를 파이프로 넣거나 다른 도구와 체이닝할 수 있습니다.

### 동작/구조

사용자가 자연어로 요청 → Claude Code가 파일 읽기·Grep·Bash로 코드베이스 파악 → 필요 시 Plan Mode로 변경 계획 제시·승인 대기 → 승인 후 Edit·Bash로 실행 → Hooks가 각 단계 전후로 검증·자동화 → MCP·Skills로 외부 도구·절차 확장.

- **AI Agent**: Claude Code가 구현하는 일반 패턴
- **Harness**: Claude Code의 실행 루프·권한 계층
- **MCP**: 외부 데이터·도구 연결
- **Skills**: 특정 업무 절차 확장 모듈
- **Hooks**: 이벤트 시점에 스크립트 실행
- **Plan Mode**: 수정 전 읽기 전용 계획 단계
- **Custom Slash Commands**: 재사용 가능한 Prompt 단축 명령
- **CLAUDE.md**: 세션마다 읽히는 프로젝트 메모리 파일
- **Agent SDK**: Claude Code와 같은 능력을 코드로 쓰는 SDK

## 참고

- Anthropic, "Claude Code overview": https://code.claude.com/docs/en/overview
- anthropics/claude-code (GitHub): https://github.com/anthropics/claude-code
