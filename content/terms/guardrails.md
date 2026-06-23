---
id: guardrails
---

### 개요

Guardrails는 **Harness** 루프에서 **Prompt**·**Tool Use** 입·출력을 정책으로 검사하는 안전 장치입니다. LLM은 잘못된 Tool Use·민감 데이터 유출·위험 명령을 생성할 수 있어, 허용 도구·PII 패턴·명령 화이트리스트를 적용합니다.

비유하면, Guardrails는 "출입 통제 + 금지어 필터"입니다. 자동 판단이 어려운 경우 **HITL**로 사람에게 넘깁니다. **NanoClaw**는 Guardrails를 프레임워크 기본 패턴으로 포함합니다.

**인공지능 정렬(Alignment)**은 모델이 유해·편향·환각 출력을 내지 않도록 인간 가치에 맞추는 학습·정책 계층입니다. **Guardrails**는 런타임 **Harness**에서 Prompt·**Tool Use** 입출력을 규칙으로 검사하는 실무 장치에 가깝습니다.

유의사항: Guardrails ≠ HITL입니다. Guardrails는 규칙 기반 자동 검사이고, HITL은 사람이 최종 승인·거부하는 체크포인트입니다. Prompt 설계와 Tool Use 허용 목록이 Guardrails 효과를 좌우합니다.

### 사용목적

LLM은 잘못된 Tool Use·민감 데이터 유출·위험 명령을 생성할 수 있습니다. Harness는 Guardrails로 허용 도구·PII 패턴·명령 화이트리스트를 적용합니다.

### 동작/구조

User Prompt → Guardrails(입력 검사) → LLM → Tool Use 선언 → Guardrails(출력·호출 검사) → 통과 시 Sandbox 실행, 실패 시 차단 또는 HITL 에스컬레이션. NanoClaw는 Guardrails를 프레임워크 기본 패턴으로 포함합니다.

- **Harness**: Guardrails를 루프에 장착하는 실행 계층
- **NanoClaw**: Guardrails·Sandbox·HITL 중심 Agent 프레임워크
- **HITL**: Guardrails만으로 판단 어려운 Tool Use를 사람에게 넘김
- **Prompt**: Guardrails가 검사하는 입력·시스템 지시의 원천
- **Tool Use**: Guardrails가 허용·거부하는 행동 단위

## 참고

- Anthropic, "Building effective agents" — guardrails parallelization 예시: https://www.anthropic.com/engineering/building-effective-agents
