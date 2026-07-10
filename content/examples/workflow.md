---
id: workflow
status: ready
title: "언제 Agent 대신 Workflow를 쓸지 판단하기"
source: "https://www.anthropic.com/engineering/building-effective-agents"
---

## 시나리오

고객 문의 분류 + 정형화된 답변 작성 작업을 자동화하려는데, 자율 Agent를 쓸지 고정 Workflow를 쓸지 고민입니다.

## 따라하기

Anthropic "Building effective agents" 공식 가이드 기준 판단 흐름:

1. 작업 경로를 미리 코드로 정할 수 있는가? → 가능하면 Workflow(prompt chaining, routing 등)
2. 진행 상황을 중간에 검증할 수 있는가? → 가능하면 Workflow, 불확실하면 Agent 고려
3. LLM이 스스로 다음 행동·도구를 결정해야 하는 개방형 문제인가? → 그렇다면 Agent
4. 항상 가장 단순한 해법(단일 LLM 호출 또는 고정 Workflow)부터 시작하고, 필요할 때만 복잡도(Agent)를 추가

의사 코드(routing workflow 예):

```text
category = router_llm(user_message)  # 고정 분류
if category == "billing":
    response = billing_prompt_chain(user_message)
elif category == "technical":
    response = technical_prompt_chain(user_message)
```

## 핵심 포인트

- Workflow는 예측 가능성·일관성이 강점, Agent는 유연성이 강점입니다.
- Anthropic은 가능한 가장 단순한 패턴(단일 호출 또는 Workflow)부터 시작하라고 권장합니다.
- Agent는 자율 턴이 늘수록 지연·비용·오류 전파 위험이 함께 커집니다.

## 참고

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
