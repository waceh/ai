---
id: aws-knowledge-base
---

### 개요

AWS Knowledge Base(Amazon Bedrock Knowledge Bases)는 **AWS Bedrock** 위에서 기업 데이터를 **RAG**(Retrieval-Augmented Generation)로 연결하는 관리형 지식베이스 서비스입니다. S3·SharePoint·Confluence 등 데이터 소스를 연결하면 청킹·**Embeddings**·**Vector DB** 인덱싱·검색을 AWS가 처리합니다.

비유하면, Knowledge Base는 "사내 문서 창고 + 자동 색인 + 질문하면 관련 페이지를 꺼내 주는 사서"입니다. 앱은 `bedrock-agent-runtime`의 **Retrieve** 또는 **RetrieveAndGenerate**로 검색·생성을 한 번에 호출할 수 있습니다.

Managed Knowledge Base는 인프라를 직접 다루지 않고 빠르게 시작할 수 있고, Self-managed Knowledge Base는 OpenSearch Serverless·Aurora·Neptune 등 **Vector DB**를 직접 고르는 방식입니다.

유의사항: Knowledge Base ≠ 일반 **Vector DB**입니다. Vector DB는 벡터 저장·검색 엔진이고, Knowledge Base는 데이터 소스 연결·파싱·임베딩·검색·(선택) 재순위·**LLM** 생성까지 **RAG** 워크플로를 묶은 Bedrock 서비스입니다. **Fine-tuning**으로 모델 가중치를 바꾸는 것과도 다릅니다.

### 사용목적

**LLM** 학습 cutoff 밖의 사내 문서·위키·PDF로 답변 품질을 올리려는 목적입니다. 직접 청킹·임베딩 파이프라인·벡터 스토어를 짜기 부담스러울 때, Bedrock Knowledge Base가 인덱싱·런타임 검색 API를 제공합니다. 출처 인용(citation)이 포함된 **RetrieveAndGenerate**로 근거 있는 답변을 만들 수 있습니다.

### 동작/구조

**설정(인덱싱) 단계**

1. 데이터 소스(S3 등) 연결
2. 문서 파싱·청킹
3. **Embeddings** 모델로 벡터화
4. **Vector DB**(관리형 또는 Self-managed)에 인덱스 저장

**런타임(RAG) 단계**

1. 사용자 질의를 임베딩
2. 벡터 유사도로 관련 청크 **Retrieve**
3. (선택) 재순위(ReRank) 모델 적용
4. 청크를 **Prompt**에 넣고 **LLM** 호출 — **RetrieveAndGenerate**는 2~4를 한 API로 수행

구조화 데이터 소스는 **GenerateQuery**로 자연어 질의를 DB 쿼리 형태로 바꿀 수 있습니다. **AI Agent**·Bedrock Agents와 연동하면 에이전트가 Knowledge Base를 검색 도구로 사용합니다.

- **RAG**: Knowledge Base가 구현하는 핵심 패턴
- **AWS Bedrock**: Knowledge Base가 속한 FM·에이전트 플랫폼
- **LLM**: RetrieveAndGenerate가 호출하는 생성 모델
- **Embeddings**: 질의·문서 벡터화
- **Vector DB**: 청크·벡터 저장소(서비스가 관리 또는 고객 지정)
- **Prompt**: 검색 청크가 합쳐지는 컨텍스트
- **Memory**: 장기 맥락·세션과 함께 쓰는 외부 지식 저장소
- **AI Agent**: Knowledge Base를 도구로 호출하는 실행 주체

## 참고

- Knowledge Bases 개요: https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html
- 동작 방식: https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-it-works.html
- Retrieve / RetrieveAndGenerate: https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-retrieval.html
