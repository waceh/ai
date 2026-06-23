---
id: token
---

## 개요

Token은 LLM이 텍스트를 처리하는 기본 단위이며, 대부분의 상용 API가 과금·컨텍스트 한도를 Token 기준으로 표기합니다.

## 세부 내용

OpenAI 문서는 `tiktoken`으로 문자열 Token 수를 계산하는 방법을 제공합니다. 입력·출력 Token 수가 비용과 지연을 결정하고, Context Window 크기도 Token으로 표현됩니다. Streaming은 생성된 Token을 순차 전송합니다. AI Agent는 Memory·RAG·Tool Use 결과를 Token 예산 안에서 최적화해야 합니다.

## 검증 근거

- OpenAI, "Vector embeddings" FAQ — tiktoken, cl100k_base: https://platform.openai.com/docs/guides/embeddings
