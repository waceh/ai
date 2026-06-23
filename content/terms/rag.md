---
id: rag
---

### 개요

RAG(Retrieval-Augmented Generation, 검색증강생성)는 **LLM**이 답하기 전에 외부 지식에서 관련 정보를 찾아 **Prompt**에 넣고 생성하는 패턴입니다. 2020년 Meta(Facebook AI Research) 논문에서 제안되었습니다. LLM만 쓰면 학습 종료 시점(cutoff) 이후 뉴스·사내 wiki·PDF를 모르거나, 아는 척 잘못 답할 수 있습니다.

비유하면, RAG는 "모르는 문제를 백과사전에서 찾아 본 뒤 자기 말로 설명하기" 또는 "시험 전 교과서 해당 페이지를 펼쳐 놓고 답하기"에 가깝습니다. **Embeddings**·**Vector DB**로 의미가 비슷한 청크를 고르고, **Memory**·Context Window 안에 근거를 실어 보냅니다.

유의사항: RAG ≠ Fine-tuning입니다. RAG는 검색으로 런타임에 근거를 넣고, Fine-tuning은 모델 가중치를 바꿉니다. RAG도 환각을 완전히 없애지는 못합니다—검색 결과를 무시하거나 빈틈을 지어낼 수 있습니다. 검색 품질이 나쁘면(GIGO) 답도 나빠집니다.

### 사용목적

LLM의 cutoff·사전 학습 범위 밖 정보를 다루려는 목적입니다. 매번 모델을 재학습하는 것은 비용이 크고, 초기 "검색 Tool"만 붙이는 방식은 키워드가 단순해 관련 문서를 못 찾는 경우가 많았습니다. RAG는 질문 분석 → 검색 → 순위화 → 생성을 파이프라인으로 묶어, 사내 문서·최신 공지·전문 DB처럼 **학습 데이터에 없던 지식**을 답에 반영합니다. 출처 링크를 함께 보여 주면 사용자가 직접 검증할 수도 있습니다.

### 동작/구조

전형적인 흐름은 네 단계입니다.

1. **인덱싱(사전 준비)**: 문서를 청크로 나누고 **Embeddings**로 벡터화해 **Vector DB**에 저장합니다. 청크 크기(대략 수백 토큰)가 너무 작으면 문맥이 끊기고, 너무 크면 관련 없는 내용이 섞입니다.
2. **검색(Retrieval)**: 질문도 Embeddings로 바꾼 뒤, 코사인 유사도 등으로 가까운 청크 top-k를 찾습니다. 키워드 검색과 달리 "자동차 고장"과 "차량 수리"처럼 표현이 달라도 의미가 가까우면 매칭됩니다.
3. **순위화(Ranking)**: 후보가 많으면 상위 몇 개만 고릅니다. 재순위(ReRank) 모델을 쓰기도 합니다.
4. **생성(Generation)**: 선별한 청크를 **Prompt**에 넣고 **LLM**을 호출합니다. 단순 복사가 아니라 질문 의도에 맞게 재구성하는 단계입니다.

Agent **Memory**·Evaluation·Observability와 연동하면 어떤 청크가 답에 쓰였는지 추적할 수 있습니다.

- **LLM**: RAG로 보강된 Prompt를 받아 생성
- **Embeddings**: RAG 검색용 의미 벡터
- **Vector DB**: RAG 청크·Embeddings 저장소
- **Prompt**: 검색 결과가 들어가는 지시·컨텍스트
- **Memory**: RAG·Vector DB를 Agent 장기 맥락에 활용

## 참고

- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (arXiv:2005.11401): https://arxiv.org/abs/2005.11401
- Meta AI Research publication page: https://ai.meta.com/research/publications/retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks/
