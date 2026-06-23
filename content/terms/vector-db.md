---
id: vector-db
---

### 개요

Vector DB는 **Embeddings** 벡터와 메타데이터를 저장하고, 유사도 검색(ANN 인덱스)을 제공하는 데이터베이스입니다. **RAG**·**Memory**는 수천~수백만 청크에서 의미적으로 가까운 항목을 빠르게 찾을 때 Vector DB를 씁니다.

비유하면, Vector DB는 "의미 지도 색인"입니다. 일반 RDBMS LIKE 검색과 달리 패러프레이즈·동의어도 잡을 수 있습니다. **Observability**로 쿼리·히트율·지연을 추적합니다.

유의사항: Vector DB ≠ Embeddings 모델입니다. Embeddings는 벡터를 만드는 단계이고, Vector DB는 그 벡터를 저장·검색하는 저장소입니다.

### 사용목적

RAG·Agent Memory는 수천~수백만 청크에서 유사 Embeddings를 찾아야 합니다. 일반 RDBMS LIKE 검색으로는 의미 검색·규모가 부족해 Vector DB·ANN 인덱스가 필요합니다.

### 동작/구조

문서 청크 Embeddings upsert → 메타데이터(출처·날짜) 저장 → 질의 Embeddings → top-k retrieval → RAG Prompt 또는 Memory read → LLM. Harness Observability는 쿼리·히트율·지연을 기록합니다.

- **RAG**: Vector DB 검색 결과로 LLM Prompt 보강
- **Embeddings**: Vector DB에 저장되는 벡터
- **Memory**: Vector DB를 Agent 장기 저장소로 사용
- **Observability**: Vector DB 쿼리·RAG 품질 추적

## 참고

- OpenAI, "Vector embeddings" FAQ — vector database 권장: https://platform.openai.com/docs/guides/embeddings
- Lewis et al., RAG — dense vector index: https://arxiv.org/abs/2005.11401
