---
id: fine-tuning
status: ready
title: "OpenAI fine_tuning.jobs.create"
source: "https://github.com/openai/openai-python/blob/main/src/openai/resources/fine_tuning/jobs/jobs.py"
---

## 시나리오

특정 톤·도메인 용어·출력 형식을 안정적으로 맞추려면 **Fine-tuning**으로 모델 가중치를 추가 학습합니다.

## 따라하기

1. 학습 데이터를 JSONL로 준비하고 Files API로 업로드합니다 (`purpose: fine-tune`). 업로드 API는 OpenAI API Reference "Files create"를 참고하세요.

2. Fine-tuning job 생성 (SDK docstring 예시 파라미터):

```python
from openai import OpenAI

client = OpenAI()

job = client.fine_tuning.jobs.create(
    model="gpt-4o-mini",
    training_file="file-XXXXXXXX",  # 업로드된 파일 ID
)
print(job.id)
print(job.status)
```

`jobs.create` 시그니처(소스): 필수 `model`, `training_file`; 선택 `validation_file`, `hyperparameters`, `suffix` 등.

## 핵심 포인트

- 공식 메서드: `client.fine_tuning.jobs.create`.
- 지원 모델 목록은 OpenAI Fine-tuning 가이드의 "Which models can be fine-tuned"를 확인하세요.
- Prompt 튜닝만으로 충분하면 Fine-tuning 없이 시작하는 것이 일반적입니다.

## 참고

- openai-python `fine_tuning/jobs/jobs.py`: https://github.com/openai/openai-python/blob/main/src/openai/resources/fine_tuning/jobs/jobs.py
- OpenAI Fine-tuning guide: https://platform.openai.com/docs/guides/fine-tuning
