---
id: llm
---

## 개요

LLM(Large Language Model)은 대규모 텍스트로 학습한 언어 모델로, 자연어 이해·생성 작업의 핵심 엔진입니다. Anthropic 공식 글에서는 에이전트 시스템의 기본 구성 요소를 retrieval, tools, memory로 보강한 "augmented LLM"으로 설명합니다.

## 세부 내용

단독 LLM 호출만으로는 외부 시스템과 상호작용하지 않습니다. AI Agent는 LLM을 중심에 두고 Planning·Tool Use·RAG·Memory를 결합합니다. Token과 Context Window는 한 번에 넣을 수 있는 입력·출력 예산을 정의합니다. 도메인 적응이 필요하면 Fine-tuning을 검토할 수 있습니다.

## 검증 근거

- Anthropic, "Building effective agents" — augmented LLM, workflows vs agents: https://www.anthropic.com/engineering/building-effective-agents
