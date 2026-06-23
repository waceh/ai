---
id: mcp
---

## 개요

MCP(Model Context Protocol)는 LLM 애플리케이션과 외부 데이터·도구를 연결하기 위한 오픈 프로토콜입니다. 공식 사양은 JSON-RPC 기반 메시지 형식과 서버·클라이언트 역할을 정의합니다.

## 세부 내용

공식 사양(2025-06-18)은 서버 기능으로 Prompts, Resources, Tools를 나열합니다. AI Agent·IDE 클라이언트가 MCP 서버(데이터베이스, 검색, 파일 등)에 연결해 컨텍스트를 주고받으며, Tool Use·Skills 구현의 통합 레이어로 쓰입니다. Harness는 MCP 세션·권한을 애플리케이션 쪽에서 관리합니다. OpenClaw 문서에도 MCP 연동이 언급됩니다.

## 검증 근거

- MCP 공식 사양: https://modelcontextprotocol.io/specification/2025-06-18
- MCP 소개: https://modelcontextprotocol.io/docs/getting-started/intro
- Anthropic 발표: https://www.anthropic.com/news/model-context-protocol
