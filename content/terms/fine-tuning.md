---
id: fine-tuning
---

### 개요

Fine-tuning은 **LLM** 가중치를 특정 도메인·스타일·**Tool Use** JSON 형식에 맞게 추가 학습하는 과정입니다. 긴 **Prompt**·**RAG**만으로 브랜드 톤·특수 분류가 불안정할 때 고려합니다.

비유하면, Fine-tuning은 "이미 대학 나온 사람에게 회사 업무 교육"입니다. 예시 데이터(입력 Prompt → 기대 출력)로 모델 행동을 조정하고, **Evaluation**으로 전후 **AI Agent**·**Planning** 품질을 비교합니다.

유의사항: Fine-tuning ≠ RAG입니다. Fine-tuning은 모델 자체를 바꾸고, RAG는 검색으로 런타임 컨텍스트를 넣습니다. Prompt는 Fine-tuning과 complementary한 런타임 지시로 남습니다.

### 사용목적

긴 Prompt·RAG만으로 Tool Use JSON 형식·브랜드 톤·특수 분류가 불안정할 때 Fine-tuning을 고려합니다. Evaluation으로 Fine-tuning 전후 Agent·Planning 품질을 비교합니다.

### 동작/구조

예시 데이터(입력 Prompt → 기대 출력, Tool Use 포함 가능) 수집 → 벤더 Fine-tuning job → 새 모델 ID → AI Agent·Harness에서 해당 LLM으로 교체 → Evaluation·Observability로 회귀 확인.

- **LLM**: Fine-tuning 대상 모델
- **Prompt**: Fine-tuning과 complementary인 런타임 지시
- **Evaluation**: Fine-tuning 효과·회귀 측정
- **Tool Use**: Fine-tuning 예시에 함수 호출 형식 포함 가능

## 참고

- OpenAI fine-tuning 문서(벤더별): https://platform.openai.com/docs/guides/fine-tuning
