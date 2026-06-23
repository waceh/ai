---
id: rag
---

### 개요

RAG(Retrieval-Augmented Generation)는 **Embeddings**·**Vector DB**로 관련 문서 청크를 찾아 **Prompt**에 넣고 **LLM**이 답변하는 패턴입니다. LLM만 쓰면 학습 시점 이후 사실·내부 wiki·PDF를 모릅니다.

비유하면, RAG는 "시험 전 교과서 해당 페이지를 펼쳐 놓고 답하기"입니다. **Memory**·Context Window 한도 안에서 근거 있는 답이 가능합니다.

유의사항: RAG ≠ Fine-tuning입니다. RAG는 검색으로 런타임에 근거를 넣고, Fine-tuning은 모델 가중치 자체를 바꿉니다. Prompt에 어떤 청크를 넣을지가 품질을 좌우합니다.

### 사용목적

LLM만 쓰면 학습 시점 이후 사실·내부 wiki·PDF 내용을 모릅니다. Vector DB에서 Embeddings 유사도로 청크를 찾아 Prompt에 넣으면 Memory·Context Window 한도 안에서 근거 있는 답이 가능합니다.

### 동작/구조

문서 청크 → Embeddings → Vector DB 저장. 질의 시 질문 Embeddings → Vector DB top-k 검색 → 검색 결과를 Prompt context로 LLM 호출 → 답변 생성. Agent Memory·Evaluation·Observability와 연동해 품질을 추적합니다.

- **LLM**: RAG로 보강된 Prompt를 받아 생성
- **Embeddings**: RAG 검색용 의미 벡터
- **Vector DB**: RAG 청크·Embeddings 저장소
- **Prompt**: 검색 결과가 들어가는 지시·컨텍스트
- **Memory**: RAG·Vector DB를 Agent 장기 맥락에 활용

## 참고

- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (arXiv:2005.11401): https://arxiv.org/abs/2005.11401
- Meta AI Research publication page: https://ai.meta.com/research/publications/retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks/
