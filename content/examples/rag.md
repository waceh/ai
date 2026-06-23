---
id: rag
status: ready
title: "Embeddings 검색 후 LLM에 컨텍스트 주입"
source: "https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb"
---

## 시나리오

LLM 학습 데이터에 없는 사내 문서·최신 공지를 답하려면 **RAG**(Retrieval-Augmented Generation)로 관련 문단을 찾아 Prompt에 넣습니다.

## 따라하기

OpenAI Cookbook "Question answering using embeddings"는 2단계를 제안합니다:

1. **Search** — 라이브러리에서 관련 텍스트 검색
2. **Ask** — 검색 결과를 메시지에 넣고 GPT에 질문

최소 Embeddings 호출 (Cookbook `Using_embeddings.ipynb`):

```python
from openai import OpenAI

client = OpenAI()
embedding = client.embeddings.create(
    input="Your text goes here",
    model="text-embedding-3-small",
).data[0].embedding
print(len(embedding))
```

유사도 검색은 Cookbook `Semantic_text_search_using_embeddings.ipynb`의 `cosine_similarity` 패턴을 참고하세요. 검색된 문단을 user 메시지에 붙인 뒤 `messages.create`로 답변을 생성합니다.

## 핵심 포인트

- RAG = Retrieve(검색) + Augment(Prompt 보강) + Generate(LLM 생성).
- 원 논문: Lewis et al., arXiv:2005.11401.
- Vector DB에 저장하면 대량 문서 검색에 유리합니다 (Vector DB 용어 참고).

## 참고

- Lewis et al., RAG: https://arxiv.org/abs/2005.11401
- OpenAI Cookbook, Q&A using embeddings: https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb
- OpenAI Cookbook, Using embeddings: https://github.com/openai/openai-cookbook/blob/main/examples/Using_embeddings.ipynb
