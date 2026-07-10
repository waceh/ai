---
id: claude-code
status: ready
title: "코드베이스 파악 후 리팩터링 요청"
source: "https://code.claude.com/docs/en/overview"
---

## 시나리오

레거시 저장소를 처음 열어보고, 특정 모듈을 안전하게 리팩터링하고 싶습니다.

## 따라하기

1. 터미널에서 프로젝트 루트로 이동 후 `claude` 실행
2. 자연어로 요청: "이 저장소 구조를 파악하고 `auth` 모듈이 어디서 쓰이는지 알려줘"
3. Claude Code가 Grep·Glob·Read로 코드베이스 조사
4. 위험한 변경이면 **Plan Mode**로 전환해 계획만 먼저 확인: "Shift+Tab 두 번" 또는 `/plan`
5. 계획 승인 후 실제 Edit·Bash 실행 요청

```bash
claude
# 세션 안에서:
# "src/auth 모듈을 JWT 검증 로직 기준으로 리팩터링 계획을 세워줘"
```

## 핵심 포인트

- Claude Code는 코드베이스 전체 맥락을 읽고 Git 워크플로까지 자연어로 처리합니다.
- 위험한 다중 파일 변경은 Plan Mode로 먼저 검토받는 것이 안전합니다.
- MCP·Skills·Hooks로 필요에 따라 능력을 확장합니다.

## 참고

- Anthropic, "Claude Code overview": https://code.claude.com/docs/en/overview
