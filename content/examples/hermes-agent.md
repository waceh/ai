---
id: hermes-agent
status: ready
title: "install.sh로 Hermes Agent 설치·Portal 연동"
source: "https://hermes-agent.nousresearch.com/docs"
---

## 시나리오

**MCP**·**Skills**·**Subagent** 위임을 처음부터 직접 짜기 부담스러울 때, Hermes Agent 공식 설치 스크립트로 CLI를 깔고 Nous Portal OAuth로 모델·Tool Gateway를 한 번에 연결할 수 있습니다.

## 따라하기

1. Linux·macOS·WSL2·Termux(Android)에서는 공식 설치 스크립트를 씁니다.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Windows(native)는 PowerShell 설치 스크립트를 씁니다.

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

2. 초기 설정은 `hermes setup --portal` 명령으로 진행합니다. Nous Portal OAuth를 통해 모델과 4가지 Tool Gateway를 함께 연동합니다.

```bash
hermes setup --portal
```

3. **MCP** 서버 연결은 공식 문서 "Use MCP with Hermes" 가이드를 따르고, **Skills**는 agentskills.io 호환 형식으로 자동 생성·재사용됩니다.

## 핵심 포인트

- 공식 설치 진입점: `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash` (Linux/macOS/WSL2/Termux), Windows는 `install.ps1` (공식 문서).
- 초기 설정 명령: `hermes setup --portal` — OAuth로 모델 + Tool Gateway 연동 (공식 문서).
- 격리 실행 백엔드는 문서에 "local, Docker, SSH, Daytona, Singularity, Modal" 6가지로 명시되어 있습니다.
- **MCP**·**Skills** 모두 공식 지원 기능입니다 (Docs, "MCP Integration" / "Skills System").

## 참고

- Hermes Agent 설치 안내: https://hermes-agent.nousresearch.com/
- Hermes Agent Docs: https://hermes-agent.nousresearch.com/docs
- GitHub `NousResearch/hermes-agent`: https://github.com/NousResearch/hermes-agent
