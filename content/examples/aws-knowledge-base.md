---
id: aws-knowledge-base
status: ready
title: "RetrieveAndGenerate로 Knowledge Base RAG"
source: "https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-retrieval.html"
---

## 시나리오

사내 문서에 근거한 답변을 만들려면 **AWS Knowledge Base**에 데이터 소스를 연결한 뒤, 런타임에 검색·생성 API를 호출합니다. **RAG** 파이프라인을 직접 짜지 않고 Bedrock이 인덱싱·검색을 처리합니다.

## 따라하기

1. 콘솔 또는 API로 Knowledge Base와 데이터 소스(S3 등)를 생성·동기화합니다.

2. `bedrock-agent-runtime` 클라이언트로 **RetrieveAndGenerate**를 호출합니다 (공식 문서 패턴).

```python
import boto3

client = boto3.client("bedrock-agent-runtime", region_name="us-east-1")
response = client.retrieve_and_generate(
    input={"text": "What are the main features of this knowledge base?"},
    retrieveAndGenerateConfiguration={
        "type": "KNOWLEDGE_BASE",
        "knowledgeBaseConfiguration": {
            "knowledgeBaseId": "YOUR_KB_ID",
            "modelArn": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        },
    },
)
print(response)
```

3. 검색만 필요하면 **Retrieve** API로 청크를 받아 앱에서 **Prompt**를 직접 조립할 수 있습니다.

## 핵심 포인트

- **RetrieveAndGenerate** = Retrieve + FM 생성 + 인용(citation)을 한 번에 수행합니다.
- **Retrieve**만 쓰면 RAG 단계를 앱에서 분리·커스터마이즈할 수 있습니다.
- 인덱싱 단계에서 **Embeddings**·**Vector DB**가 Knowledge Base 내부에 구성됩니다.

## 참고

- Retrieve / RetrieveAndGenerate: https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-retrieval.html
- Knowledge Bases 개요: https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html
- 동작 방식: https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-it-works.html
