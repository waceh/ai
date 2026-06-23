---
id: evaluation
---

### 개요

Evaluation은 **AI Agent**·**Planning**·**RAG**·**Prompt** 변경의 품질을 데이터셋과 점수로 측정하는 과정입니다. non-deterministic한 Agent는 Prompt·**Fine-tuning** 수정만으로도 예상치 못한 회귀를 일으킵니다.

비유하면, Evaluation은 "시험지 + 채점"입니다. 골든 QA·Tool Use 시나리오를 정의하고 Harness로 Agent를 실행한 뒤, LLM-as-judge 또는 규칙 채점으로 품질을 수치화합니다.

유의사항: Evaluation ≠ Observability입니다. Evaluation은 "좋은가?"를 점수로 묻고, **Observability**는 "무슨 일이 일어났는가?"를 trace로 기록합니다. Fine-tuning 전후 비교·CI 회귀 게이트에 Evaluation을 씁니다.

### 사용목적

Prompt·RAG·Fine-tuning·Planning 변경은 예상치 못한 회귀를 일으킵니다. Evaluation 데이터셋과 Observability trace로 AI Agent 품질을 수치화합니다.

### 동작/구조

골든 QA·Tool Use 시나리오 정의 → Harness로 Agent 실행 → LLM-as-judge 또는 규칙 채점 → Planning·RAG 근거 포함 여부 확인 → Fine-tuning·Prompt 수정 전후 비교 → CI 회귀 게이트.

- **AI Agent**: Evaluation 대상
- **Planning**: Evaluation 시나계·Tool 순서 검증
- **RAG**: 인용·근거 정확도 Evaluation
- **Observability**: Evaluation 실패 run 재현
- **Fine-tuning**: Evaluation으로 효과 검증
- **Prompt**: Evaluation 입력·기대 출력 정의

## 참고

- Anthropic, "Building effective agents" — evaluator-optimizer, automated evals: https://www.anthropic.com/engineering/building-effective-agents
