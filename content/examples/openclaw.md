---
id: openclaw
status: ready
title: "openclaw onboard으로 첫 설치"
source: "https://github.com/openclaw/openclaw/blob/main/README.md"
---

## 시나리오

Harness·MCP·Skills를 처음부터 짜기 부담스러울 때 **OpenClaw**로 게이트웨이·워크스페이스·채널·스킬을 CLI 마법사로 설정할 수 있습니다.

## 따라하기

1. OpenClaw README에 따르면 권장 설치 경로는 터미널에서 `openclaw onboard`입니다.

```bash
openclaw onboard
```

2. 마법사가 게이트웨이, 워크스페이스, 채널, 스킬 설정을 단계별로 안내합니다 (README, "Preferred setup").

3. Skills는 `SKILL.md`가 있는 디렉터리에서 로드됩니다. 우선순위는 OpenClaw Docs "Skills" 표를 참고하세요 (예: `<workspace>/skills`가 가장 높음).

```text
<workspace>/skills/research/SKILL.md
```

## 핵심 포인트

- 공식 CLI 진입점: `openclaw onboard` (README).
- Skills는 `SKILL.md` + YAML frontmatter 형식 (Agent Skills 사양과 호환).
- MCP 플러그인·채널 연동은 OpenClaw Docs에서 제품별로 확인하세요.

## 참고

- OpenClaw README: https://github.com/openclaw/openclaw/blob/main/README.md
- OpenClaw Getting Started: https://docs.openclaw.ai/start/getting-started
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills
