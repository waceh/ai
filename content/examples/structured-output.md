---
id: structured-output
status: ready
title: "JSON Schema로 응답 형식 강제하기"
source: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
---

## 시나리오

Claude 응답을 그대로 DB에 저장해야 해서, 필드 이름·타입이 조금이라도 어긋나면 안 됩니다.

## 따라하기

Claude Platform 공식 문서 기준:

```json
{
  "output_config": {
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "priority": { "type": "number" }
        },
        "required": ["title", "priority"]
      }
    }
  }
}
```

Python/TypeScript SDK에서는 Pydantic 모델(`client.messages.parse()`) 또는 Zod 스키마로도 같은 결과를 얻을 수 있습니다.

## 핵심 포인트

- 스키마는 그래머로 컴파일되어 토큰 생성 자체를 제한하므로, "please return valid JSON" 프롬프트보다 신뢰도가 높습니다.
- 도구 이름·입력값 검증에는 `strict: true`를 씁니다.
- Sonnet 4.5·Opus 4.5·Haiku 4.5 등에서 정식 제공(GA)됩니다.

## 참고

- Claude Platform Docs, "Structured outputs": https://platform.claude.com/docs/en/build-with-claude/structured-outputs
