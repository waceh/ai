---
id: memory
---

## 개요

Memory는 에이전트가 세션 맥락·과거 정보를 유지하는 저장·검색 계층입니다. Anthropic은 augmented LLM의 구성 요소 중 하나로 memory를 나열합니다.

## 세부 내용

단기 맥락은 Context Window 안의 최근 메시지로 유지됩니다. 장기 저장은 Embeddings로 Vector DB에 넣고 RAG처럼 검색하는 패턴이 Lewis et al.(2020) RAG 프레임워크와 연결됩니다. AI Agent·Harness는 LLM 호출마다 Token 예산 안에서 어떤 Memory를 Prompt에 넣을지 선택합니다.

## 검증 근거

- Anthropic, "Building effective agents" — augmented LLM(memory): https://www.anthropic.com/engineering/building-effective-agents
- Lewis et al., RAG (arXiv:2005.11401): https://arxiv.org/abs/2005.11401
