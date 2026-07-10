---
id: few-shot-prompting
status: ready
title: "예시로 응답 형식을 고정하기"
source: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting"
---

## 시나리오

고객 문의를 항상 "요약 / 감정 / 대응 방안" 세 줄 형식으로 답하게 하고 싶은데, 말로 설명해도 형식이 자꾸 흐트러집니다.

## 따라하기

Anthropic 공식 프롬프트 엔지니어링 가이드 기준 접근:

```text
다음 형식으로 고객 문의를 분석해줘.

예시 1)
문의: "배송이 너무 늦어요"
요약: 배송 지연 불만
감정: 부정적
대응 방안: 배송 조회 링크 안내 + 지연 사과

예시 2)
문의: "이 기능 정말 편하네요"
요약: 기능 만족 후기
감정: 긍정적
대응 방안: 감사 인사, 추가 기능 안내

이제 아래 문의를 같은 형식으로 분석해줘.
문의: "환불이 왜 안 되나요?"
```

## 핵심 포인트

- 형식을 말로 설명하기보다 예시를 보여주는 편이 일관성이 높습니다.
- 예시는 실제 사용 사례와 비슷하고(relevant), 다양한 경우(diverse)를 포함해야 합니다.
- Extended thinking과 함께 쓰면 예시 안 `<thinking>` 태그로 추론 스타일까지 시연할 수 있습니다.

## 참고

- Claude Platform Docs, "Prompting best practices (multishot prompting)": https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting
