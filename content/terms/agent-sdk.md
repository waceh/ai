---
id: agent-sdk
---

### 개요

Agent SDK(Claude Agent SDK)는 **Claude Code**를 움직이는 것과 동일한 도구·에이전트 루프·컨텍스트 관리 기능을 Python·TypeScript 코드로 가져와 자체 **AI Agent**를 만드는 개발자용 SDK입니다.

비유하면, Claude Code가 "완성된 앱"이라면 Agent SDK는 "그 앱을 만든 엔진을 부품으로 파는 것"입니다. 파일 읽기·명령 실행·코드 편집 같은 내장 도구가 기본 제공되어, 직접 **Tool Use** 실행기를 구현하지 않아도 바로 Agent를 동작시킬 수 있습니다. **Harness**로서의 권한·**Sandbox** 설정도 SDK 옵션으로 제어합니다.

유의사항: Agent SDK ≠ **MCP**입니다. Agent SDK는 에이전트 자체(루프·내장 도구·권한)를 코드로 만드는 프레임워크이고, MCP는 그렇게 만든 에이전트가 외부 데이터·도구에 연결하는 프로토콜입니다. Agent SDK는 MCP 서버를 도구로 붙일 수 있습니다.

### 사용목적

CLI가 아닌 자체 애플리케이션·서비스 안에 코딩 에이전트를 내장하거나, 여러 **Subagent**를 조합한 커스텀 워크플로를 코드로 제어하고 싶을 때 씁니다.

### 동작/구조

Python(3.10+) 또는 TypeScript로 SDK를 설치 → 에이전트 인스턴스 생성 시 허용 도구·권한·MCP 서버 설정 → 프롬프트 전달 → SDK가 Tool Use·파일 읽기·명령 실행을 내부 루프로 처리 → 결과를 스트리밍 또는 최종 응답으로 반환.

- **Claude Code**: Agent SDK가 코드로 재현하는 대상 제품
- **AI Agent**: SDK로 구축하는 결과물
- **Harness**: SDK가 제공하는 실행 루프·권한 계층
- **Tool Use**: 내장 도구 호출 메커니즘
- **MCP**: SDK 에이전트가 외부 도구를 붙이는 연결 방식
- **Subagent**: 여러 에이전트를 조합할 때의 하위 단위

## 참고

- Anthropic, "Agent SDK overview": https://platform.claude.com/docs/en/agent-sdk/overview
- anthropics/claude-agent-sdk-python (GitHub): https://github.com/anthropics/claude-agent-sdk-python
