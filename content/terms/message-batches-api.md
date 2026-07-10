---
id: message-batches-api
---

### 개요

Message Batches API는 최대 1만 건의 **LLM** 요청을 비동기로 일괄 처리해, 표준 API 가격의 50%로 처리량을 늘리는 Claude API 기능입니다.

비유하면, "당장 답장 안 받아도 되는 메일은 한꺼번에 모아 보내는 것"입니다. 각 요청은 서로 독립적으로 처리되며, 대부분의 배치는 1시간 내에 끝나지만 최대 24시간까지 걸릴 수 있고, 그 안에 끝나지 않으면 만료됩니다. 결과는 생성 후 29일간 보관됩니다. 실시간 응답이 필요한 **Streaming**과 달리, 지연을 감수하는 대신 비용과 처리량을 우선하는 방식입니다.

유의사항: Message Batches API ≠ Streaming입니다. Streaming은 한 요청의 응답을 실시간으로 토막 내어 즉시 받는 방식이고, Message Batches API는 다수의 요청을 지연 응답으로 묶어 처리해 비용을 낮추는 방식입니다. 둘은 반대되는 지연-비용 트레이드오프를 가집니다.

### 사용목적

실시간 응답이 필요 없는 대량 작업(문서 일괄 요약, 데이터셋 라벨링, 대규모 Evaluation 실행)에서 비용을 절반으로 줄이고 싶을 때 씁니다.

### 동작/구조

여러 Messages 요청을 하나의 배치로 제출 → 서버가 각 요청을 독립적으로 비동기 처리 → 클라이언트가 배치 상태를 폴링 → 처리 완료(또는 24시간 경과) 시 결과 조회 가능 → 결과는 29일간 보관, 이후 만료.

- **LLM**: 배치로 처리되는 요청의 대상
- **Streaming**: 실시간 응답이라는 반대 축의 처리 방식
- **Token**: 배치 처리에서도 동일하게 소비·과금되는 단위

## 참고

- Claude Platform Docs, "Batch processing": https://platform.claude.com/docs/en/build-with-claude/batch-processing
- Claude by Anthropic, "Introducing the Message Batches API": https://claude.com/blog/message-batches-api
