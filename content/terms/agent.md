---
id: agent
---

## 개요

AI Agent는 LLM이 도구 사용과 환경 피드백을 반복하며 작업을 수행하는 에이전트 시스템을 가리킵니다. Anthropic은 "workflows"(코드로 정해진 경로)와 "agents"(LLM이 프로세스·Tool Use를 동적으로 결정)를 구분합니다.

## 세부 내용

복잡한 작업에서는 Planning으로 하위 단계를 나누고, Tool Use·MCP·Skills로 외부 행동을 실행합니다. Harness가 런타임 루프·권한·컨텍스트를 감싸며, Memory로 세션 맥락을 유지합니다. Orchestration·Subagent 패턴으로 역할을 분리할 수 있고, OpenClaw·NanoClaw는 각각 자체 문서에 정의된 오픈소스 에이전트 프레임워크입니다.

## 검증 근거

- Anthropic, "Building effective agents" — agents 정의·autonomous agent 루프: https://www.anthropic.com/engineering/building-effective-agents
- Cursor Docs, "Build a coding agent" — harness = model + tools + instructions: https://cursor.com/docs/help/getting-started/build-ai-coding-agent
