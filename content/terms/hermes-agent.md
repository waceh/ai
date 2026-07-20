---
id: hermes-agent
---

### 개요

Hermes Agent는 Nous Research가 만든 오픈소스(MIT License) 범용 **AI Agent**입니다. "The Agent That Grows With You"를 표방하며, Telegram·Discord·Slack·WhatsApp·Signal·Email·CLI 등 여러 플랫폼에 걸쳐 하나의 지속 **Memory**로 대화·작업 맥락을 이어갑니다.

비유하면, Hermes Agent는 "채널을 옮겨도 나를 계속 기억하는 비서"입니다. 대화 채널이 바뀌어도 학습한 내용·**Skills**·해결 방법을 그대로 유지합니다.

Connect(다중 플랫폼 연결)·Remember(학습·Skills 자동 생성)·Schedule(자연어 스케줄링)·Delegate(격리 **Subagent**로 작업 분산)·Search(웹 검색·브라우저 자동화)·Experiment(local·Docker·SSH·Daytona·Singularity·Modal 등 다중 백엔드 실행) 6가지 축으로 기능을 구성합니다.

유의사항: Hermes Agent는 **OpenClaw**·**NanoClaw**와 마찬가지로 범용 Agent 프레임워크지만 초점이 다릅니다. OpenClaw는 Skills·MCP 플러그인 확장에, NanoClaw는 Sandbox·Guardrails·HITL 격리에 무게를 두는 반면, Hermes Agent는 여러 채널에 걸친 지속 Memory와 격리 Subagent 위임에 무게를 둡니다.

### 사용목적

여러 메신저·채널에서 따로따로 봇을 관리하면 맥락(학습 내용, 해결한 문제, Skills)이 채널마다 끊깁니다. Hermes Agent는 단일 Memory로 이 문제를 해결하고, 반복 업무는 자연어 스케줄링으로, 무거운 작업은 격리된 Subagent로 위임합니다.

### 동작/구조

사용자가 어느 채널에서 요청하든 같은 Memory·**Tool Use** 루프를 공유합니다. 병렬로 처리할 작업은 "own conversations, terminals, and Python RPC scripts"를 가진 격리 Subagent로 분리되어, 컨테이너 강화·네임스페이스 격리 위에서 실행됩니다. **MCP** 서버 연결과 도구 필터링을 지원하고, **Skills**는 agentskills.io 형식과 호환되어 절차적 메모리로 자동 생성·재사용됩니다.

- **AI Agent**: Hermes Agent가 구현하는 자율 실행 시스템
- **MCP**: Hermes Agent가 연결하는 외부 도구·서버 표준
- **Skills**: 자동 생성·재사용되는 절차적 메모리, agentskills.io 호환
- **Sandbox**: Docker·SSH·Daytona·Singularity·Modal 등 격리 백엔드로 작업 실행
- **Subagent**: Delegate 기능으로 분리되는 독립 대화·터미널 실행 단위
- **Tool Use**: Hermes Agent 루프가 함수·API 호출을 선언하는 기반 기술
- **OpenClaw**: Skills·MCP 플러그인 확장에 초점을 둔 대안 Agent 프레임워크
- **NanoClaw**: Sandbox·Guardrails·HITL 격리에 초점을 둔 대안 Agent 프레임워크

## 참고

- Hermes Agent 공식 사이트: https://hermes-agent.nousresearch.com/
- Hermes Agent Docs: https://hermes-agent.nousresearch.com/docs
- GitHub `NousResearch/hermes-agent`: https://github.com/NousResearch/hermes-agent
