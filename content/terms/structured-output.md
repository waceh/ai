---
id: structured-output
---

### 개요

Structured Output(Structured Outputs)은 JSON Schema로 **LLM** 응답 형식을 강제해, 항상 파싱 가능한 출력을 보장하는 Claude Developer Platform 기능입니다.

비유하면, "빈칸을 자유롭게 채우게 두지 않고 정해진 서식에만 쓰게 하는 것"입니다. `output_config.format`으로 `json_schema` 타입을 지정하는 JSON 출력 방식과, **Tool Use** 도구 이름·입력값의 스키마 검증을 보장하는 `strict: true` 방식 두 가지를 제공합니다. "유효한 JSON으로 답해줘"라고 프롬프트로 부탁하는 것과 달리, 스키마를 문법(grammar)으로 컴파일해 추론 중 토큰 생성 자체를 제한합니다.

유의사항: Structured Output ≠ Prompt로 JSON을 요청하는 것입니다. Prompt 요청은 모델이 어길 수 있는 "부탁"이지만, Structured Output은 API 레벨에서 스키마를 강제해 출력이 그 형식을 벗어날 수 없게 만듭니다.

### 사용목적

응답을 그대로 파싱해 다음 시스템(DB 저장, 다른 API 호출)에 넘겨야 해서, 형식이 조금이라도 어긋나면 안 되는 파이프라인에 씁니다.

### 동작/구조

요청에 JSON Schema를 담은 `output_config.format` 포함(또는 도구 정의에 `strict: true`) → Claude가 스키마를 그래머로 컴파일 → 생성 중 각 토큰이 스키마를 만족하는 후보로만 제한됨 → object·array·string·number·boolean·null, enum, required, 중첩 객체, `$ref` 등 표준 JSON Schema 기능 지원 → 항상 스키마를 만족하는 응답 반환.

- **Tool Use**: `strict: true`가 적용되는 도구 이름·입력 스키마 대상
- **Evaluation**: 출력 형식 일치 여부를 검증하는 데 활용
- **LLM**: Structured Output이 제약을 거는 생성 대상

## 참고

- Claude Platform Docs, "Structured outputs": https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- Claude by Anthropic, "Structured outputs on the Claude Developer Platform": https://claude.com/blog/structured-outputs-on-the-claude-developer-platform
