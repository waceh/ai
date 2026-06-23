---
id: mcp
---

### 개요

MCP(Model Context Protocol)는 **AI Agent**와 외부 데이터·도구를 연결하는 오픈 표준 프로토콜입니다. "에이전트용 USB-C"처럼, 각 서비스마다 다른 연결 방식 대신 하나의 규격으로 **Tool Use** 대상을 노출합니다.

비유하면, MCP 서버는 Agent가 쓸 수 있는 도구 상자입니다. Agent(**Harness** 포함)는 클라이언트로 서버에 연결해 tools·resources 목록을 받고, **Skills**와 함께 업무별 도구 세트를 구성합니다.

유의사항: MCP는 LLM 자체가 아니라 "도구 연결 규약"입니다. 실제 함수 호출은 **Tool Use** 흐름에서 일어나며, **OpenClaw** 같은 프레임워크는 MCP 플러그인을 Skills와 함께 등록해 재사용성을 높입니다.

### 사용목적

에이전트마다 API 래퍼를 새로 짜면 Skills·Tool Use 통합 비용이 커집니다. MCP 서버 하나를 만들면 여러 Agent·Harness에서 재사용할 수 있습니다.

### 동작/구조

MCP 클라이언트(AI Agent 또는 Harness)가 MCP 서버에 연결해 tools·resources 목록을 받고, Tool Use 호출 시 서버가 실제 API·파일 작업을 실행합니다. OpenClaw 등 프레임워크는 MCP 플러그인을 Skills와 함께 등록합니다.

- **AI Agent**: MCP 클라이언트로 외부 도구를 사용하는 주체
- **Tool Use**: LLM이 MCP로 노출된 도구를 JSON 호출로 실행
- **Skills**: MCP 기반 또는 독립적인 업무 확장 모듈
- **Harness**: MCP 연결·권한·로깅을 감싸는 실행 계층
- **OpenClaw**: MCP·Skills 플러그인을 붙이는 Agent 프레임워크

## 참고

- MCP 공식 사양: https://modelcontextprotocol.io/specification/2025-06-18
- MCP 소개: https://modelcontextprotocol.io/docs/getting-started/intro
- Anthropic 발표: https://www.anthropic.com/news/model-context-protocol
