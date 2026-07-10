---
id: mcp-resource
status: ready
title: "MCP 서버가 로그 파일을 Resource로 노출"
source: "https://modelcontextprotocol.io/legacy/concepts/resources"
---

## 시나리오

MCP 서버가 가진 로그 파일을 LLM이 참고 자료로 읽을 수 있게 하고 싶지만, 도구 호출처럼 부작용이 있는 동작으로 만들 필요는 없습니다.

## 따라하기

Model Context Protocol 공식 스펙 기준 흐름:

1. 서버가 `resources/list` 요청에 응답해 사용 가능한 리소스 목록(URI·이름·설명·MIME 타입) 반환
2. 클라이언트가 특정 리소스가 필요하면 `resources/read`를 해당 URI로 호출
3. 서버가 텍스트(UTF-8) 또는 바이너리(base64) 콘텐츠 반환
4. 클라이언트가 받은 내용을 LLM 컨텍스트에 포함
5. 필요하면 `resources/subscribe`로 구독해 `notifications/resources/updated`로 변경 알림 수신

## 핵심 포인트

- Resource는 URI로 식별되는 "읽기용 데이터"이며, 실행되는 Tool Use와는 다른 프리미티브입니다.
- 동적 리소스는 RFC 6570 URI 템플릿으로 구성할 수 있습니다.
- RAG 파이프라인에서 검색된 문서를 공급하는 용도로 자주 쓰입니다.

## 참고

- Model Context Protocol, "Resources": https://modelcontextprotocol.io/legacy/concepts/resources
