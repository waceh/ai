---
id: strands-agents
---

### 개요

Strands Agents는 AWS가 만든 오픈소스(Apache-2.0) Python/TypeScript SDK로, 적은 코드로 **AI Agent**를 구축하는 model-driven 접근 방식을 씁니다. `Agent` 객체에 모델과 도구 목록만 지정하면 추론·**Tool Use** 루프를 SDK가 대신 처리합니다.

비유하면, Strands Agents는 "모델에게 도구 목록만 쥐여주고 나머지는 맡기는" 최소 구성 프레임워크입니다. 기본 모델 제공자는 **AWS Bedrock**(Claude Sonnet)이며, Anthropic·OpenAI·Gemini·Ollama 등 다른 제공자로도 바로 바꿀 수 있습니다.

유의사항: Strands Agents는 **Bedrock AgentCore**를 만든 AWS의 프로젝트지만 AgentCore 전용은 아닙니다. AgentCore CLI(`agentcore create`)의 기본 프레임워크로 쓰이고 **AgentCore Runtime** 예제 코드에서도 자주 등장하지만, AgentCore 없이 로컬·다른 인프라에서도 독립적으로 동작합니다.

### 사용목적

에이전트 추론 루프·도구 호출·모델 전환을 직접 구현하면 반복 작업이 많아집니다. Strands Agents는 `Agent(tools=[...])` 한 줄로 이 루프를 대신 처리해, 대화형 어시스턴트부터 복잡한 자율 워크플로까지 빠르게 프로토타입하고 그대로 프로덕션에 배포하려는 목적으로 씁니다.

### 동작/구조

`pip install strands-agents`로 설치한 뒤 `from strands import Agent`로 에이전트를 만들고, 함수 기반 도구(내장 `calculator` 등 또는 `@tool` 데코레이터로 만든 커스텀 도구)를 `tools` 목록에 전달합니다. `agent("질문")` 호출 한 번이 모델 추론과 **Tool Use** 실행을 반복하는 루프 전체를 담당하며, 이렇게 만든 에이전트를 **AgentCore Runtime**에 배포해 서버리스로 운영할 수 있습니다.

- **AI Agent**: Strands Agents `Agent` 클래스가 구현하는 대상
- **Tool Use**: `tools` 목록으로 전달한 함수를 에이전트가 호출하는 핵심 동작
- **AWS Bedrock**: Strands Agents의 기본 모델 제공자
- **AgentCore Runtime**: Strands Agents로 만든 에이전트를 배포하는 대상 실행 계층

## 참고

- Strands Agents SDK (GitHub): https://github.com/strands-agents/sdk-python
- Strands Agents Python Quickstart: https://strandsagents.com/docs/user-guide/quickstart/python/
- Strands Agents (PyPI): https://pypi.org/project/strands-agents/
