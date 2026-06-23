---
id: embeddings
---

### 개요

Embeddings는 텍스트를 고정 차원의 숫자 벡터로 바꾼 **의미 표현**입니다. **RAG**·**Memory**에서 **Vector DB**에 저장하고, 질의와 의미가 가까운 청크를 찾아 **LLM** Prompt에 넣습니다.

비유하면, Embeddings는 "단어를 지도 좌표로 옮기기"입니다. 키워드가 달라도 의미가 비슷하면 벡터 거리가 가깝습니다. cosine similarity 등으로 nearest neighbor 검색을 합니다.

단어·문장을 고차원 **벡터**로 바꿔 의미 거리를 계산합니다. 아스키·일대일 매핑만으로는 맥락·동의어를 잡기 어렵고, Word2vec·CLIP처럼 속성을 벡터에 실으면 검색·분류가 쉬워집니다.

유의사항: Embeddings ≠ LLM 출력입니다. Embedding 모델(종종 LLM 벤더 API)은 검색용 벡터만 만들고, 최종 답변 생성은 별도 LLM 호출에서 일어납니다.

### 사용목적

키워드 검색만으로는 동의어·패러프레이즈를 놓치기 쉽습니다. Embeddings로 Vector DB에 저장하면 RAG·Memory에서 질의와 유사한 청크를 LLM Prompt에 넣을 수 있습니다.

### 동작/구조

텍스트 → Embedding 모델(종종 LLM 벤더 API) → 고정 차원 벡터 → Vector DB 인덱스. 질의도 Embeddings 후 cosine similarity 등으로 nearest neighbor 검색 → RAG가 LLM에 전달.

- **RAG**: Embeddings 유사도로 관련 문서 검색
- **Vector DB**: Embeddings·메타데이터 저장·검색
- **Memory**: 장기 맥락 청크를 Embeddings로 보관
- **LLM**: Embeddings로 찾은 텍스트를 Prompt로 읽음

## 참고

- OpenAI, "Vector embeddings": https://platform.openai.com/docs/guides/embeddings
