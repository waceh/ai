---
id: plan-mode
status: ready
title: "DB 마이그레이션 전 Plan Mode로 계획 검토"
source: "https://code.claude.com/docs/en/overview"
---

## 시나리오

프로덕션 DB 스키마를 바꾸는 마이그레이션을, 실수 없이 미리 검토받고 진행하고 싶습니다.

## 따라하기

1. 세션에서 Shift+Tab을 두 번 눌러 Plan Mode 진입(또는 `/plan`)
2. 요청: "users 테이블에 NOT NULL 컬럼 추가하는 마이그레이션 계획 세워줘"
3. Plan Mode 동안 Claude Code는 Read·Grep으로 기존 스키마·마이그레이션 파일만 조사(쓰기 없음)
4. 조사 결과를 바탕으로 구체적 실행 계획(백필 전략, 락 영향 등) 제시
5. 계획을 검토 후 승인하면 일반 모드로 전환되어 실제 마이그레이션 파일 생성

```bash
claude --permission-mode plan "users 테이블 마이그레이션 계획 세워줘"
```

## 핵심 포인트

- Plan Mode에서는 Read/Grep/Glob 같은 읽기 전용 도구만 쓰고 파일을 바꾸지 않습니다.
- 다중 파일·고위험 작업 전에 계획을 먼저 승인받는 용도로 적합합니다.
- `claude --permission-mode plan`으로 세션 시작부터 기본값을 Plan Mode로 둘 수 있습니다.

## 참고

- Anthropic, "Claude Code overview": https://code.claude.com/docs/en/overview
