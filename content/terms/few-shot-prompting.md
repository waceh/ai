---
id: few-shot-prompting
---

### 개요

Few-shot Prompting(Multishot Prompting)은 **Prompt** 안에 원하는 출력 형식·톤·구조의 예시를 몇 개 넣어, Claude가 그 패턴을 따라 하도록 유도하는 프롬프트 기법입니다.

비유하면, "말로 설명하는 대신 견본을 보여주는 것"입니다. "간결하게 답해줘"라고 설명하는 대신 실제 간결한 답변 예시 2~3개를 프롬프트에 포함시키면, 원하는 형식을 더 정확하고 일관되게 얻습니다. 예시는 실제 사용 사례와 비슷해야 하고(relevant), 여러 변형·엣지 케이스를 다양하게(diverse) 담아야 의도치 않은 패턴을 학습하지 않습니다.

유의사항: Few-shot Prompting ≠ Fine-tuning입니다. Fine-tuning은 예시로 모델 가중치 자체를 학습시키는 것이고, Few-shot Prompting은 가중치를 바꾸지 않고 매 요청의 Prompt 안에만 예시를 넣어 즉석에서 패턴을 유도하는 것입니다.

### 사용목적

원하는 출력 포맷·톤을 말로 설명하기보다 예시로 보여주는 것이 더 정확할 때, 그리고 Fine-tuning 없이 빠르게 출력 일관성을 높이고 싶을 때 씁니다.

### 동작/구조

Prompt 안에 입력-출력 예시 쌍을 여러 개 배치 → Claude가 예시들의 공통 패턴(형식·톤·추론 스타일)을 추출 → 실제 질의에 그 패턴을 적용해 응답 생성 → extended thinking과 함께 쓸 때는 예시 안에 `<thinking>` 태그로 추론 과정까지 시연 가능.

- **Prompt**: Few-shot 예시가 포함되는 대상
- **Evaluation**: 예시 품질·다양성이 결과 일관성에 미치는 영향을 측정

## 참고

- Claude Platform Docs, "Prompting best practices (multishot prompting)": https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting
