---
id: llm
---

### 개요

LLM(Large Language Model)은 방대한 텍스트로 학습한 신경망으로, 다음에 올 단어(토큰)의 확률을 예측해 문장을 이어 씁니다. 챗봇·코드 생성·요약처럼 "말하기"를 담당하는 두뇌에 가깝습니다.

비유하면, LLM은 방대한 책을 읽고 문맥에 맞는 다음 문장을 짓는 작가입니다. 규칙표로 답을 고르는 챗봇과 달리, 표현이 달라도 의미를 파악해 새 문장을 만들 수 있습니다.

유의사항: LLM은 "검색 엔진"이 아닙니다. 학습 시점까지의 지식으로 추론하며, 실시간 DB 조회나 코드 실행은 **Tool Use**·**RAG**·**AI Agent** 같은 바깥 계층과 함께 쓸 때 비로소 완성됩니다. **Token**과 **Context Window** 한도도 항상 염두에 두세요.

### 사용목적

자연어 이해·생성·추론의 중심 코어로, **Planning**으로 문제를 나누고 **Tool Use**로 외부 API를 호출하며, **RAG**·**Memory**로 사실을 보강합니다. 도메인 맞춤이 필요하면 **Fine-tuning**을 검토합니다.

### 동작/구조

입력 텍스트는 **Token** 단위로 쪼개져 **Context Window** 안에서 처리됩니다. 모델은 다음 Token 확률을 예측하고, **AI Agent** 루프에서는 이 출력이 Prompt 해석, Tool Use 호출 선언, Memory 요약 등으로 이어집니다.

- **AI Agent**: LLM을 중심에 두고 Tool Use·Memory·Planning을 반복 실행하는 시스템
- **Planning**: LLM이 ReAct·CoT 등으로 단계를 설계하는 방식
- **Tool Use**: LLM이 JSON 형태로 함수·API 호출을 선언하는 기술
- **RAG**: Vector DB 검색 결과를 Prompt에 넣어 LLM 답변을 보강
- **Memory**: Context Window 한도를 넘는 맥락을 Embeddings·Vector DB 등으로 유지
- **Token**: LLM이 텍스트를 처리·과금하는 최소 단위
- **Context Window**: LLM이 한 번에 볼 수 있는 Token 상한
- **Fine-tuning**: 특정 도메인·스타일에 LLM 가중치를 추가 학습

## 참고

- Anthropic, "Building effective agents" — augmented LLM, workflows vs agents: https://www.anthropic.com/engineering/building-effective-agents
