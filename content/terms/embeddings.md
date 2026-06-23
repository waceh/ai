---
id: embeddings
---

## 개요

Embeddings는 텍스트를 고차원 실수 벡터로 변환한 표현입니다. OpenAI 공식 문서는 relatedness 측정·검색·클러스터링 용도를 명시합니다.

## 세부 내용

OpenAI Embeddings API(`POST /v1/embeddings`)는 `text-embedding-3-small` 등 모델로 벡터를 반환합니다. RAG에서 질의·문서를 Vector DB에 넣어 유사 passage를 찾고, 장기 Memory 인덱싱에도 쓰입니다. LLM 본체와는 별도 embedding 모델을 쓰는 경우가 많습니다.

## 검증 근거

- OpenAI, "Vector embeddings": https://platform.openai.com/docs/guides/embeddings
