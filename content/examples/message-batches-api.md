---
id: message-batches-api
status: ready
title: "대량 문서 요약을 배치로 절반 비용에 처리"
source: "https://platform.claude.com/docs/en/build-with-claude/batch-processing"
---

## 시나리오

수천 건의 문서를 실시간이 아니어도 되니 한꺼번에 저렴하게 요약하고 싶습니다.

## 따라하기

Claude Platform 공식 문서 기준 흐름:

1. 각 문서에 대한 Messages 요청을 최대 1만 건까지 하나의 배치로 묶어 제출
2. 서버가 각 요청을 독립적으로 비동기 처리 (대부분 1시간 내 완료, 최대 24시간)
3. 클라이언트가 배치 상태를 주기적으로 폴링
4. 처리 완료 시 각 요청 결과를 조회
5. 결과는 생성 후 29일간 보관

## 핵심 포인트

- 표준 API 가격의 50%로 처리되어 대량 작업 비용을 크게 줄입니다.
- 실시간 응답이 필요하면 Message Batches API 대신 Streaming을 씁니다.
- 24시간 내 처리되지 않은 배치는 만료되므로 재시도 로직이 필요할 수 있습니다.

## 참고

- Claude Platform Docs, "Batch processing": https://platform.claude.com/docs/en/build-with-claude/batch-processing
- Claude by Anthropic, "Introducing the Message Batches API": https://claude.com/blog/message-batches-api
