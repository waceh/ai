---
id: token
---

### 개요

Token은 **LLM**이 텍스트를 처리·과금하는 최소 단위입니다. 입력 문자열은 Tokenizer로 Token ID 시퀀스로 바뀌고, **Context Window** 크기·API 요금·**Memory**에 넣을 수 있는 텍스트량을 Token으로 계산합니다.

비유하면, Token은 "LLM이 읽는 글자 조각"입니다. 영어는 대략 4글자당 1 Token, 한국어는 더 많이 쓰이는 편입니다. Tool Use JSON·RAG 청크·대화 히스토리 모두 Token을 소비합니다.

LLM은 텍스트를 **토큰화**해 처리하며, 멀티모달 LLM은 이미지·오디오 등도 토큰 단위로 학습합니다. **Context Window**·API 과금·**Streaming** 청크 모두 Token 기준입니다.

유의사항: Token ≠ 글자 수입니다. 같은 문장도 Tokenizer·언어에 따라 Token 수가 다릅니다. **Streaming**은 생성 Token을 순차 전송해 체감 지연을 줄입니다.

### 사용목적

Context Window 크기·API 요금·Memory에 넣을 수 있는 텍스트량을 Token으로 계산합니다. Streaming은 생성 Token을 순차 전송해 체감 지연을 줄입니다.

### 동작/구조

입력 문자열 → Tokenizer → Token ID 시퀀스 → LLM 처리 → 출력 Token 생성. Tool Use JSON·RAG 청크·대화 히스토리 모두 Token을 소비하며 Memory 요약은 Token 예산을 아끼는 기법입니다.

- **LLM**: Token 시퀀스를 입력·출력
- **Context Window**: 수용 가능한 Token 총량
- **Streaming**: 출력 Token을 실시간 전달
- **Memory**: Token 한도를 넘는 정보를 외부 저장

## 참고

- OpenAI, "Vector embeddings" FAQ — tiktoken, cl100k_base: https://platform.openai.com/docs/guides/embeddings
