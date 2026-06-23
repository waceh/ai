---
id: vector-db
---

## 개요

Vector DB는 embedding 벡터를 저장·유사도 검색하는 데이터베이스·서비스를 통칭합니다. 단일 공식 표준 API 이름은 확인되지 않았습니다.

## 세부 내용

OpenAI 문서는 많은 벡터를 빠르게 검색할 때 vector database 사용을 권장합니다. RAG·Memory 파이프라인에서 Embeddings로 인덱싱한 벡터를 저장·검색합니다. Harness·Observability와 연동해 어떤 문서가 검색됐는지 추적하는 것이 운영 품질에 도움이 됩니다.

## 검증 근거

- OpenAI, "Vector embeddings" FAQ — vector database 권장: https://platform.openai.com/docs/guides/embeddings
- Lewis et al., RAG — dense vector index: https://arxiv.org/abs/2005.11401
