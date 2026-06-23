---
id: context-window
---

## 개요

Context Window는 모델이 한 번의 API 호출에서 처리할 수 있는 입력(및 관련 제한) 범위를 말합니다. 제공사·모델마다 토큰 한도가 문서화되어 있습니다.

## 세부 내용

대화 히스토리·Prompt·Tool Use 결과·RAG 청크가 모두 Token 예산을 소비합니다. LLM·모델마다 문서화된 한도가 있으며, Memory를 Context Window에 얼마나 넣을지가 AI Agent·Harness 설계의 핵심입니다.

## 검증 근거

- OpenAI Embeddings guide — 모델별 max input(예: 8192 tokens): https://platform.openai.com/docs/guides/embeddings
- Anthropic tool use docs — 입력 토큰·tools 파라미터 과금: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
