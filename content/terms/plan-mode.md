---
id: plan-mode
---

### 개요

Plan Mode는 **Claude Code**가 파일 쓰기·명령 실행 없이 읽기·검색·추론만 하도록 제한한 뒤, 승인 후에만 실제 변경을 진행하게 하는 권한 모드입니다.

비유하면, Plan Mode는 "공사 시작 전 설계도 먼저 승인받기"입니다. Shift+Tab 두 번 또는 `/plan`으로 진입하며, 이 상태에서는 Read·Grep·Glob·WebFetch 같은 읽기 전용 도구만 쓰고 **Tool Use**로 파일을 바꾸거나 부작용 있는 명령을 실행하지 않습니다. **Planning**으로 구체적 실행 계획을 세운 뒤 사람에게 제시하고, 승인이 나면 그제서야 Edit·Bash가 열립니다.

유의사항: Plan Mode ≠ Planning입니다. Planning은 Agent가 문제를 분해하고 행동 순서를 설계하는 일반 인지 과정이고, Plan Mode는 Claude Code가 그 계획 수립 동안 쓰기 권한을 잠그는 구체적인 실행 모드입니다.

### 사용목적

마이그레이션, 리팩터링, 인증·결제·DB 관련 변경처럼 잘못되면 비용이 큰 다중 파일 작업 전에, 실제로 무엇을 바꿀지 미리 검토받고 싶을 때 씁니다.

### 동작/구조

Plan Mode 진입 → Read·Grep·Glob·WebSearch로 코드베이스 조사(쓰기 금지) → Planning으로 변경 계획 문서화 → 사용자에게 계획 제시, **HITL** 승인 대기 → 승인 시 일반 모드로 전환해 Edit·Bash 실행, 거부 시 계획 수정.

- **Claude Code**: Plan Mode를 제공하는 호스트
- **Planning**: Plan Mode 동안 수행하는 계획 수립 활동
- **HITL**: 계획 승인/거부를 사람이 결정하는 지점

## 참고

- Anthropic, "Claude Code overview" (permission modes): https://code.claude.com/docs/en/overview
