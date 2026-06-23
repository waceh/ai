---
id: embeddings
status: ready
title: "OpenAI embeddings.create 호출"
source: "https://github.com/openai/openai-cookbook/blob/main/examples/Using_embeddings.ipynb"
---

## 시나리오

문서 검색·유사도 비교·RAG의 첫 단계는 텍스트를 벡터로 바꾸는 것입니다. **Embeddings** API가 이를 담당합니다.

## 따라하기

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI()

embedding = client.embeddings.create(
    input="Your text goes here",
    model="text-embedding-3-small",
).data[0].embedding
print(len(embedding))
```

Cookbook은 대량 요청 시 `input=[text]` 배치와 `tenacity` 재시도 패턴도 보여 줍니다 (`Using_embeddings.ipynb`).

## 핵심 포인트

- 공식 메서드: `client.embeddings.create` (OpenAI Python SDK).
- 반환: `.data[0].embedding` — float 리스트.
- RAG·Memory·Vector DB는 모두 Embeddings 출력을 저장·검색합니다.

## 참고

- OpenAI Cookbook, Using embeddings: https://github.com/openai/openai-cookbook/blob/main/examples/Using_embeddings.ipynb
- OpenAI Embeddings guide: https://platform.openai.com/docs/guides/embeddings
