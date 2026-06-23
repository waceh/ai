---
id: fine-tuning
---

## 개요

Fine-tuning은 사전 학습된 모델 가중치를 추가 데이터로 조정하는 방법입니다. 제공사 API·문서에 fine-tuning 엔드포인트·절차가 정의되어 있습니다.

## 세부 내용

Prompt·RAG만으로 부족할 때 도메인 데이터로 LLM을 조정합니다. Tool Use 형식·Planning 패턴을 데이터에 넣어 AI Agent 행동을 안정화할 수 있으나, 데이터 준비·Evaluation·재학습 비용이 듭니다. 구체 API 이름·파라미터는 사용 중인 모델 벤더 문서를 따릅니다.

## 검증 근거

- OpenAI fine-tuning 문서(벤더별): https://platform.openai.com/docs/guides/fine-tuning
- Anthropic 모델·학습 관련 안내는 제품 문서 별도 확인 필요 — 통합 "Harness fine-tuning" 표준은 없음
