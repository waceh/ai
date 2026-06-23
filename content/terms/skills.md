---
id: skills
---

### 개요

Skills(Agent Skills)는 **AI Agent**가 특정 업무를 수행하도록 확장하는 실행 모듈·도구 묶음입니다. SKILL.md 같은 파일에 목적·단계·필요 **Tool Use**·**MCP** 연결이 정리되어, 매번 긴 **Prompt**를 붙여넣지 않아도 됩니다.

비유하면, Skills는 "업무 매뉴얼 + 전용 도구 세트"입니다. Agent는 작업을 받으면 관련 Skill을 골라 **Harness**가 Sandbox·Guardrails 안에서 절차를 실행합니다.

Anthropic에서 시작해 표준화된 **Agent Skills**로, SKILL.md에 명령·메타데이터·선택적 스크립트를 담습니다. **Prompt**와 달리 필요할 때만 로드되어 같은 지침을 매 대화마다 반복 붙이지 않아도 됩니다.

유의사항: Skills ≠ MCP입니다. Skill은 업무 절차 전체를 담고, MCP는 그 Skill이 의존할 수 있는 외부 연결 표준입니다. **OpenClaw**·Harness는 Skills 디렉터리를 스캔해 자동 로드하는 패턴을 제공합니다.

### 사용목적

범용 에이전트를 도메인 전문가처럼 바꾸는 재사용 모듈입니다. Codex·Claude Code는 플러그인·.agents/skills/·.claude/skills/ 경로를 쓰며, skills.sh 같은 허브로 배포·설치하기도 합니다.

매번 긴 Prompt를 붙여넣지 않고, 검증된 업무 흐름(코드 리뷰, 배포 체크 등)을 Agent에 재사용할 때 Skills가 유리합니다. OpenClaw·Harness는 Skills 디렉터리를 스캔해 자동 로드합니다.

### 동작/구조

Skill 정의(SKILL.md 등)에 목적·단계·필요 Tool Use·MCP 연결이 적혀 있습니다. Agent가 작업을 받으면 관련 Skill을 선택하고, Harness가 Sandbox·Guardrails 안에서 Tool Use를 실행합니다.

- **AI Agent**: Skills를 로드·적용하는 실행 주체
- **MCP**: Skill이 의존하는 외부 도구·데이터 연결
- **Tool Use**: Skill 절차 안에서 LLM이 함수·API를 호출
- **Prompt**: Skill 지침이 System Prompt·User Prompt와 합쳐짐
- **Harness**: Skill 실행 루프·권한·관측을 담당
- **OpenClaw**: Skills·MCP를 등록·동기화하는 프레임워크

## 참고

- Cursor Docs, "Agent Skills": https://cursor.com/docs/context/skills
- Agent Skills 표준 사이트(Cursor 문서 링크): https://agentskills.io
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills
