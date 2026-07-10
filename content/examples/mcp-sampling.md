---
id: mcp-sampling
status: ready
title: "MCP 서버가 클라이언트를 거쳐 요약 요청"
source: "https://modelcontextprotocol.io/specification/2025-06-18/client/sampling"
---

## 시나리오

MCP 서버 내부 로직에서 긴 텍스트를 요약해야 하지만, 서버 자체는 LLM API 키를 관리하고 싶지 않습니다.

## 따라하기

MCP 공식 스펙 기준 Sampling 흐름:

1. 서버가 요약이 필요한 텍스트와 함께 sampling 요청(프롬프트·모델 힌트) 생성
2. 클라이언트가 요청을 받아 사용자에게 표시, 필요 시 프롬프트 수정 또는 거부 가능
3. 사용자가 승인하면 클라이언트가 자신의 LLM 접근 권한으로 실제 호출 수행
4. 클라이언트가 응답을 다시 사용자에게 확인시킴 (권장 사항)
5. 최종 승인된 결과만 서버로 반환

## 핵심 포인트

- 서버는 자체 API 키 없이 클라이언트의 모델 접근을 빌려 씁니다.
- 요청·응답 양쪽에서 사람이 확인하는 것이 스펙의 안전 권고 사항입니다.
- 이 메커니즘으로 서버가 중첩된 LLM 호출을 활용하는 에이전트적 동작을 구현할 수 있습니다.

## 참고

- Model Context Protocol Specification, "Sampling": https://modelcontextprotocol.io/specification/2025-06-18/client/sampling
