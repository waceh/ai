---
id: evaluation
---

## 개요

Evaluation은 에이전트·RAG·Planning 출력 품질을 데이터셋·벤치마크로 측정하는 활동입니다. Anthropic workflow 문서에 evaluator-optimizer·automated evals 예시가 있습니다.

## 세부 내용

골든 데이터셋으로 AI Agent·RAG·Planning 출력의 답변 정확도·Tool Use 성공률을 점수화합니다. Fine-tuning 전후·Prompt 변경 시 회귀를 잡고, Observability 로그에서 실패 케이스를 샘플링합니다. 단일 공식 "Agent Evaluation" API 표준은 확인되지 않았으며, 벤더·프로젝트별 eval 도구를 사용합니다.

## 검증 근거

- Anthropic, "Building effective agents" — evaluator-optimizer, automated evals: https://www.anthropic.com/engineering/building-effective-agents
