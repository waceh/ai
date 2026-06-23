---
id: vector-db
status: ready
title: "OpenAI Vector Store 생성"
source: "https://github.com/openai/openai-python/blob/main/src/openai/resources/vector_stores/vector_stores.py"
---

## 시나리오

수천 개 문서의 Embedding을 메모리 리스트로만 들고 있으면 검색이 느려집니다. **Vector DB**는 벡터 유사도 검색에 최적화된 저장소입니다.

## 따라하기

OpenAI API는 `vector_stores` 리소스를 제공합니다. Python SDK:

```python
from openai import OpenAI

client = OpenAI()

vector_store = client.vector_stores.create(
    name="product-faq",
    description="FAQ documents for support bot",
)
print(vector_store.id)
```

`create` 파라미터(소스 docstring): `name`, `description`, `file_ids`, `chunking_strategy`, `expires_after`, `metadata` 등.

파일을 먼저 업로드한 뒤 `file_ids`로 연결하는 전체 흐름은 OpenAI API Reference의 Files·Vector stores 섹션을 따르세요.

## 핵심 포인트

- OpenAI 공식: `client.vector_stores.create` (openai-python 소스).
- RAG 파이프라인: Embeddings 생성 → Vector store 저장 → 유사도 검색 → LLM Prompt.
- Pinecone·Weaviate 등 서드파티 Vector DB는 각 제품 공식 문서를 참고하세요.

## 참고

- openai-python `vector_stores.py`: https://github.com/openai/openai-python/blob/main/src/openai/resources/vector_stores/vector_stores.py
- OpenAI Vector embeddings FAQ: https://platform.openai.com/docs/guides/embeddings
- Lewis et al., RAG: https://arxiv.org/abs/2005.11401
