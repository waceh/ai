---
id: aws-bedrock
status: ready
title: "Converse API로 Bedrock FM 호출"
source: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html"
---

## 시나리오

AWS에서 Claude 등 Foundation Model을 쓰려면 **AWS Bedrock** `bedrock-runtime` 클라이언트로 추론 API를 호출합니다. Agent·RAG를 붙이기 전에 최소 대화 호출부터 확인합니다.

## 따라하기

1. AWS 자격 증명과 Bedrock 모델 액세스(콘솔에서 모델 활성화)를 준비합니다.

2. 공식 개요 문서의 **Converse API** 예제를 실행합니다.

```python
import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")
response = client.converse(
    modelId="anthropic.claude-3-sonnet-20240229-v1:0",
    messages=[
        {
            "role": "user",
            "content": [{"text": "Can you explain the features of Amazon Bedrock?"}],
        }
    ],
)
print(response)
```

3. 모델별 JSON body가 필요하면 **InvokeModel**을 사용합니다 (동일 개요 문서 예제 참고).

## 핵심 포인트

- Bedrock은 FM 호스팅·IAM·과금을 담당하는 AWS 관리형 서비스입니다.
- `converse`는 대화형 호출의 통합 API입니다.
- **AWS Knowledge Base**·Agents·Guardrails는 Bedrock 위 부가 구성요소입니다.

## 참고

- Amazon Bedrock 개요: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
- Converse API: https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html
