---
id: claude-md
status: ready
title: "프로젝트 빌드 규칙을 CLAUDE.md에 고정하기"
source: "https://code.claude.com/docs/en/memory"
---

## 시나리오

매 세션마다 "빌드는 이 명령으로, 테스트는 저 명령으로 돌려줘"를 반복 설명하기 지쳤습니다.

## 따라하기

1. 프로젝트 루트에 `CLAUDE.md` 생성
2. 반복 설명해온 사실을 정리

```markdown
# 프로젝트 규칙

- 빌드: `./gradlew build`
- 테스트: `./gradlew test`
- Java 8 대상, Map.of/List.of 등 Java 9+ API 사용 금지
- 커밋 전 반드시 lint 통과
```

3. 새 세션에서 Claude Code가 시작 시 이 파일을 자동으로 읽음
4. 이후 응답이 파일에 적힌 규칙을 따름
5. 새로운 반복 규칙이 생기면 파일에 계속 추가

## 핵심 포인트

- CLAUDE.md는 세션 시작 시 자동으로 읽혀 Prompt 컨텍스트에 포함됩니다.
- "매번 다시 설명해야 했던 것"만 추려서 적는 것이 핵심입니다.
- 여러 사람·에이전트가 같은 프로젝트를 다룰 때 규칙 일관성을 유지합니다.

## 참고

- Anthropic, "How Claude remembers your project": https://code.claude.com/docs/en/memory
