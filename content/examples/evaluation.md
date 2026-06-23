---
id: evaluation
status: ready
title: "Evaluator-Optimizer 워크플로"
source: "https://www.anthropic.com/engineering/building-effective-agents"
---

## 시나리오

Agent 출력이 요구사항을 만족하는지 자동으로 검증하려면 **Evaluation** 루프가 필요합니다.

## 따라하기

Anthropic "Building effective agents"의 **evaluator-optimizer** 패턴:

1. **Generator** LLM이 초안 생성
2. **Evaluator** LLM이 기준(정확성·형식·안전)으로 채점·피드백
3. 점수 미달 시 Generator가 수정 → 2번 반복

의사 코드:

```text
draft = generator(user_task)
feedback = evaluator(draft, rubric)
while not feedback.passed:
    draft = generator(user_task, feedback)
    feedback = evaluator(draft, rubric)
return draft
```

Agent Skills 사이트에는 스킬 품질 평가 가이드(`evaluating-skills`)가 별도로 있습니다.

**확인된 공식 기능이 없는 부분**: 범용 `evaluate()` 단일 API는 Anthropic/OpenAI 공식 SDK에서 확인되지 않았습니다.

## 핵심 포인트

- Evaluation은 Planning·RAG·Fine-tuning 효과를 검증하는 데 씁니다.
- Evaluator는 별도 Prompt(또는 별도 모델)로 구현합니다.
- Observability 로그와 함께 오프라인 벤치마크 세트를 운영하세요.

## 참고

- Anthropic, "Building effective agents" (evaluator-optimizer): https://www.anthropic.com/engineering/building-effective-agents
- Agent Skills, "Evaluating skills": https://agentskills.io/skill-creation/evaluating-skills.md
