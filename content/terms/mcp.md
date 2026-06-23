---
id: mcp
---

### 개요

MCP(Model Context Protocol)는 2024년 Anthropic이 공개한 **AI Agent**·AI 애플리케이션과 외부 시스템을 잇는 오픈 표준 프로토콜입니다. 공식 문서는 "AI용 USB-C"에 비유합니다. 예전에는 Google Calendar, Notion, 사내 DB마다 전용 연동 코드를 따로 짜야 했는데, MCP는 **Tool Use** 대상을 tools·resources·prompts 같은 공통 규격으로 노출합니다.

비유하면, MCP **서버**는 Agent가 꺼내 쓸 수 있는 도구·데이터 창고이고, **호스트**(Claude Desktop, Cursor 등) 안의 **클라이언트**가 서버에 연결해 목록을 받아옵니다. Agent(**Harness** 포함)는 이 연결을 통해 파일·API·DB에 접근하고, **Skills**와 조합해 업무별 도구 세트를 만듭니다.

유의사항: MCP는 LLM 자체가 아니라 "맥락·도구를 주고받는 규약"입니다. 실제 함수 호출은 **Tool Use** 흐름에서 일어납니다. MCP는 에이전트 간 대화 규약(A2A 등)과도 다릅니다—한 에이전트가 외부 데이터·도구에 붙는 쪽에 초점이 있습니다. **OpenClaw** 같은 프레임워크는 MCP 플러그인을 Skills와 함께 등록해 재사용성을 높입니다.

### 사용목적

에이전트·IDE·챗봇마다 API 래퍼를 새로 짜면 Skills·Tool Use 통합 비용이 커집니다. MCP 서버를 한 번 만들면 Claude, ChatGPT, VS Code, Cursor 등 여러 **호스트**에서 같은 서버를 재사용할 수 있습니다. 로컬 파일·DB부터 원격 SaaS API까지, "한 번 연결 규격으로 통일"하려는 목적입니다.

### 동작/구조

MCP는 **호스트 → 클라이언트 → 서버** 구조입니다. 호스트(AI 애플리케이션)가 서버마다 전용 MCP 클라이언트를 두고, 클라이언트가 서버와 1:1 연결을 유지합니다. 서버는 **tools**(실행 함수), **resources**(읽기용 맥락 데이터), **prompts**(템플릿)를 노출합니다.

데이터 계층은 JSON-RPC 2.0으로 메시지를 주고받고, 전송 계층은 보통 다음 둘 중 하나입니다.

- **stdio**: 같은 머신의 로컬 프로세스(예: 파일시스템 서버)
- **Streamable HTTP**: 원격 서버(예: 클라우드에 올라간 MCP 서버)

Tool Use 호출이 오면 서버가 실제 API·파일·DB 작업을 실행하고 결과를 클라이언트→호스트→LLM으로 돌려줍니다.

- **AI Agent**: MCP 클라이언트를 통해 외부 도구를 쓰는 주체
- **Tool Use**: LLM이 MCP로 노출된 도구를 JSON 호출로 실행
- **Skills**: MCP 기반 또는 독립적인 업무 확장 모듈
- **Harness**: MCP 연결·권한·로깅을 감싸는 실행 계층
- **OpenClaw**: MCP·Skills 플러그인을 붙이는 Agent 프레임워크

## 참고

- MCP 공식 사양: https://modelcontextprotocol.io/specification/2025-06-18
- MCP 소개: https://modelcontextprotocol.io/docs/getting-started/intro
- MCP 아키텍처: https://modelcontextprotocol.io/docs/learn/architecture
- Anthropic 발표: https://www.anthropic.com/news/model-context-protocol
