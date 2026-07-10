---
id: mcp-resource
---

### 개요

MCP Resource는 **MCP** 서버가 파일 내용·DB 레코드·API 응답 같은 데이터를 URI로 노출해, 클라이언트가 읽어서 LLM 컨텍스트로 쓸 수 있게 하는 세 가지 MCP 프리미티브 중 하나입니다.

비유하면, Resource는 "서버가 열람 가능하게 걸어둔 참고 자료실"입니다. 서버는 `resources/list`로 목록을, `resources/read`로 특정 URI의 내용을 제공하며, 각 리소스는 URI·이름·설명·MIME 타입을 가집니다. 이는 서버가 실행하는 동작인 **Tool Use**나 서버가 제안하는 **Prompt** 템플릿과는 다른, "읽기용 데이터"에 특화된 프리미티브입니다.

유의사항: MCP Resource ≠ Tool Use입니다. Tool Use는 LLM이 함수를 "호출"해 부작용을 일으키는 것이고, Resource는 클라이언트가 데이터를 "읽어서" 컨텍스트에 넣는 것입니다. **RAG** 파이프라인에서 검색 결과를 공급하는 용도로 자주 쓰입니다.

### 사용목적

MCP 서버가 가진 문서·레코드·로그를 LLM이 참고하도록 넘기고 싶지만, 굳이 도구 호출 형태로 감쌀 필요는 없을 때 씁니다.

### 동작/구조

클라이언트가 `resources/list`로 서버의 리소스 목록 조회 → 필요한 URI로 `resources/read` 호출 → 서버가 텍스트 또는 base64 바이너리 콘텐츠 반환 → 클라이언트가 이를 LLM 컨텍스트에 포함 → 동적 리소스는 URI 템플릿(RFC 6570)으로 구성하고, 구독 시 `resources/subscribe`로 변경 알림도 받을 수 있음.

- **MCP**: Resource가 속한 프로토콜
- **Tool Use**: Resource와 대비되는 "실행" 프리미티브
- **RAG**: Resource로 공급된 데이터를 근거로 활용하는 패턴

## 참고

- Model Context Protocol, "Resources": https://modelcontextprotocol.io/legacy/concepts/resources
