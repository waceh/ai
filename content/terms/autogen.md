---
id: autogen
---

### 개요

AutoGen은 Microsoft가 만든 오픈소스(MIT) Python 프레임워크로, 여러 **AI Agent**가 대화를 주고받으며 협업해 작업을 처리하는 멀티에이전트 패턴(AgentChat)을 제공합니다. `AssistantAgent`에 모델과 **Tool Use** 도구를 지정하면 대화형으로 작업을 수행합니다.

비유하면, AutoGen은 "에이전트끼리 채팅방에서 회의하는 구조"입니다. 두 Agent가 1:1로 대화하거나, 여러 Agent가 그룹 채팅으로 작업을 나눠 맡습니다.

유의사항: AutoGen은 현재 유지보수 모드로, 새 기능·개선은 더 이상 추가되지 않고 커뮤니티가 관리합니다. Microsoft는 새 프로젝트에는 후속작인 Microsoft Agent Framework를 쓸 것을 권장하며, 기존 AutoGen 코드베이스를 유지하거나 학습 목적으로는 여전히 쓸 수 있습니다.

### 사용목적

Agent 하나가 여러 관점(비평·실행 등)을 동시에 맡으면 역할이 섞입니다. AutoGen은 역할이 다른 여러 Agent가 서로 대화하며 검토·반박·협업하게 만들어, 다관점 검증이 필요한 작업을 처리하려는 목적으로 씁니다.

### 동작/구조

`pip install -U autogen-agentchat autogen-ext[openai,azure]`로 설치한 뒤 `AssistantAgent`에 모델 클라이언트와 도구 함수를 지정합니다. `agent.run(task=...)` 또는 `run_stream`을 호출하면 Agent가 **Tool Use**로 등록된 함수를 호출하며 작업을 수행하고, 여러 Agent를 묶으면 서로 메시지를 주고받는 그룹 대화로 확장됩니다.

- **AI Agent**: AutoGen `AssistantAgent`가 구현하는 대상
- **Tool Use**: Agent에 등록한 함수를 호출하는 동작
- **LLM**: 모델 클라이언트로 연결되는 추론 코어

## 참고

- AutoGen Quickstart: https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/quickstart.html
- AutoGen (GitHub): https://github.com/microsoft/autogen
