---
id: aws-bedrock
---

### 개요

AWS Bedrock(Amazon Bedrock)은 AWS에서 **LLM** 등 Foundation Model(FM)을 서버리스 API로 호출하고, 생성형 AI 애플리케이션·**AI Agent**를 구축하는 완전관리형 서비스입니다. Anthropic Claude, Amazon Nova, OpenAI 등 여러 제공사 모델을 단일 콘솔·API에서 선택할 수 있습니다.

비유하면, Bedrock은 "여러 AI 모델을 꽂아 쓰는 AWS 전용 멀티탭 콘센트"입니다. 직접 GPU 클러스터를 운영하지 않고 **Converse**·**InvokeModel**로 추론하고, **Tool Use**·**Guardrails**·**Fine-tuning**·**AWS Knowledge Base** 같은 부가 기능을 같은 플랫폼에서 붙입니다.

유의사항: Bedrock ≠ **LLM**입니다. Bedrock은 모델 호스팅·라우팅·권한·과금을 담당하는 클라우드 서비스이고, 그 안에서 특정 FM을 골라 호출합니다. **MCP**·**Harness** 같은 자체 에이전트 프레임워크와는 별개이며, Bedrock Agents·Knowledge Bases는 AWS가 제공하는 관리형 에이전트·**RAG** 구성요소입니다.

### 사용목적

온프레미스나 자체 API 키 관리 없이 엔터프라이즈 IAM·VPC·감사 로그와 함께 FM을 쓰려는 목적입니다. 챗봇·코드 보조·문서 Q&A·에이전트 프로토타입을 빠르게 올리고, 모델 교체·리전·비용을 AWS 콘솔에서 통제할 때 Bedrock을 선택합니다.

### 동작/구조

애플리케이션은 `bedrock-runtime` 클라이언트로 FM에 추론 요청을 보냅니다. 대표 API는 **Converse**(대화형 통합 API), **InvokeModel**(모델별 JSON body), OpenAI 호환 **Chat Completions**·**Responses** 등입니다. **Streaming** 응답도 지원합니다.

Bedrock 위에 올라가는 관련 구성요소:

- **Agents** — **Tool Use**·액션 그룹·**AWS Knowledge Base** 연결로 자율 워크플로
- **Knowledge Bases** — **RAG** 파이프라인(인덱싱·검색·생성)
- **Guardrails** — 입·출력 안전 정책(**Guardrails** 용어와 유사)
- **Custom model import / Fine-tuning** — 도메인 맞춤 모델

- **LLM**: Bedrock이 API로 제공하는 Foundation Model 코어
- **RAG**: **AWS Knowledge Base**를 통해 Bedrock에서 구현
- **AWS Knowledge Base**: Bedrock의 관리형 RAG 구성요소
- **Tool Use**: Bedrock Agents·Converse toolConfig로 함수 호출
- **AI Agent**: Bedrock Agents 또는 앱에서 Converse+도구 루프로 구현
- **Guardrails**: Bedrock Guardrails 정책 계층
- **Streaming**: Converse·InvokeModel 스트리밍 출력
- **Embeddings**: Amazon Titan 등 임베딩 모델 API
- **Fine-tuning**: Bedrock에서 모델 커스터마이징 옵션

## 참고

- Amazon Bedrock 개요: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
- Converse API: https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html
- InvokeModel API: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html
