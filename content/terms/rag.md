---
id: rag
---

## 개요

RAG(Retrieval-Augmented Generation)는 검색으로 가져온 문서를 생성 모델 입력에 넣어 답변을 보강하는 방법입니다. Lewis et al.(2020)이 parametric·non-parametric memory를 결합한 fine-tuning 레시피로 정의했습니다.

## 세부 내용

질의를 Embeddings로 표현해 Vector DB에서 관련 passage를 찾고, 검색 결과를 Prompt에 포함해 LLM에 전달합니다. 학습 데이터에 없는 사내 문서·최신 정보를 AI Agent에 공급할 때 쓰이며, Memory·Observability와 함께 환각 완화 패턴으로 설명됩니다.

## 검증 근거

- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (arXiv:2005.11401): https://arxiv.org/abs/2005.11401
- Meta AI Research publication page: https://ai.meta.com/research/publications/retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks/
