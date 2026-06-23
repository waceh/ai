---
id: memory
---

### 개요

Memory는 **AI Agent**·**LLM**이 **Context Window** 한도를 넘는 맥락을 유지하는 메커니즘입니다. 최근 대화는 창 안에 두고, 긴 히스토리·문서는 **Embeddings**·**Vector DB**·**RAG**로 필요한 조각만 Prompt에 다시 넣습니다.

비유하면, Memory는 "책상(단기) + 서재(장기)"입니다. **Token** 예산 안에서 무엇을 책상에 올릴지 우선순위를 정합니다.

유의사항: Memory ≠ Context Window입니다. Context Window는 한 번에 볼 수 있는 Token 상한이고, Memory는 그 한도를 넘는 정보를 요약·검색·저장하는 전략 전체입니다.

### 사용목적

Context Window는 Token 한도가 있어 긴 히스토리·대량 문서를 한 번에 넣을 수 없습니다. Memory는 요약·Vector DB·RAG로 필요한 조각만 LLM Prompt에 다시 넣습니다.

### 동작/구조

단기: 최근 messages를 Context Window에 유지. 장기: 대화·문서를 Embeddings로 Vector DB에 저장 → 질의 시 유사 청크 검색(RAG) → LLM Prompt에 주입. Token 예산 안에서 Memory 내용을 우선순위화합니다.

- **LLM**: Memory에서 꺼낸 맥락을 읽는 주체
- **AI Agent**: Memory read/write를 루프에 포함
- **Context Window**: 단기 Memory 용량( Token 상한)
- **Embeddings**: Memory·RAG용 의미 벡터
- **Vector DB**: Embeddings·Memory 청크 저장·검색
- **RAG**: Memory·Vector DB 검색으로 Prompt 보강
- **Token**: Memory에 넣을 수 있는 텍스트 예산 단위

## 참고

- Anthropic, "Building effective agents" — augmented LLM(memory): https://www.anthropic.com/engineering/building-effective-agents
- Lewis et al., RAG (arXiv:2005.11401): https://arxiv.org/abs/2005.11401
