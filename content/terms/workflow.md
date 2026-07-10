---
id: workflow
---

### 개요

Workflow는 **LLM**과 도구를 미리 정해진 코드 경로로 조립해 실행하는 시스템으로, LLM이 스스로 다음 행동과 도구 사용을 결정하는 **AI Agent**와 대비되는 패턴입니다.

비유하면, Workflow는 "정해진 순서도를 따라가는 조립 라인"이고, Agent는 "그때그때 상황 보고 판단하는 작업자"입니다. Anthropic은 가능하면 가장 단순한 해법을 찾고, 필요할 때만 복잡도를 높이라고 권장합니다 — 많은 경우 자율 Agent 대신 단계가 명확하고 도구가 제한된 Workflow, 혹은 도구가 잘 갖춰진 LLM 호출 하나만으로 충분합니다.

유의사항: Workflow ≠ Agent입니다. Workflow는 예측 가능성·일관성이 강점이고 잘 정의된 작업에 적합하며, Agent는 유연성·모델 주도 판단이 필요할 때 유리합니다. Agent는 자율 턴이 늘수록 지연·비용·초기 실수 전파 위험도 함께 커집니다. **Orchestration**은 여러 Agent·Workflow 단계를 조합해 나누는 상위 개념입니다.

### 사용목적

작업 경로를 코드로 미리 정할 수 있고 진행 상황을 검증할 수 있다면 Workflow를, 경로를 하드코딩할 수 없어 LLM이 스스로 판단해야 한다면 Agent를 선택하려는 목적입니다.

### 동작/구조

작업을 단계로 분해 → 각 단계를 고정 코드 경로(prompt chaining·routing·parallelization 등)로 연결 → 각 단계에서 LLM 호출·도구 실행 → 다음 단계로 고정 순서 진행 → 필요 시 **Planning** 요소를 일부 단계에만 제한적으로 넣어 Workflow와 Agent를 혼합.

- **AI Agent**: Workflow와 대비되는 자율 판단 패턴
- **Orchestration**: Workflow·Agent 단계를 조합하는 상위 구조
- **Planning**: Agent 쪽에 필요한 자율 계획 수립 능력

## 참고

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
