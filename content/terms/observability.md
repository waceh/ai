---
id: observability
---

### 개요

Observability는 **Harness**·**AI Agent** 실행을 추적·기록·분석하는 관측 체계입니다. LLM 호출·**Tool Use**·**RAG** query·**Vector DB** latency를 span으로 남겨, non-deterministic한 Agent 실패 원인을 찾습니다.

비유하면, Observability는 "블랙박스 + 대시보드"입니다. **Planning**·**Subagent**·RAG가 겹치면 디버깅이 어려워 **Evaluation** 데이터셋과 trace를 연결해 회귀를 감지합니다.

유의사항: Observability ≠ Evaluation입니다. Observability는 실행 중 무슨 일이 일어났는지 기록하고, Evaluation은 품질을 점수·통과율로 측정합니다. 둘을 함께 쓰면 실패 run을 재현하기 쉽습니다.

### 사용목적

Agent는 non-deterministic하고 Planning·Subagent·RAG가 겹치면 실패 원인 추적이 어렵습니다. Harness Observability와 Evaluation이 품질·비용·Vector DB hit률을 모니터링합니다.

### 동작/구조

Harness가 각 LLM 호출·Tool Use·RAG query·Vector DB latency를 span으로 기록 → 대시보드·알림 → Evaluation 데이터셋과 연결해 회귀 감지. Cursor hooks.json은 특정 Agent 이벤트에 스크립트를 거는 확장점입니다.

- **Harness**: Observability 계측을 삽입하는 실행 계층
- **AI Agent**: Observability 대상 시스템
- **RAG**: 검색·Prompt 주입 단계 trace
- **Evaluation**: Observability 로그 기반 품질 측정
- **Vector DB**: RAG·Memory 쿼리 지표 수집

## 참고

- Cursor 제품 문서 — Hooks(공식 SDK·문서 내 hooks.json): https://cursor.com/docs/context/skills (Hooks 교차 링크)
- Anthropic, "Building effective agents" — 테스트·sandbox 권고: https://www.anthropic.com/engineering/building-effective-agents
