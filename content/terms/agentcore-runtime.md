---
id: agentcore-runtime
---

### 개요

AgentCore Runtime은 **Bedrock AgentCore**가 제공하는 서버리스 실행 계층으로, 어떤 프레임워크로 만든 **AI Agent**든 격리된 세션에서 배포·확장할 수 있게 해줍니다. 요청마다 독립된 세션에서 실행되어 콜드 스타트가 빠르고, 실시간 상호작용부터 장시간 걸리는 비동기 에이전트까지 지원합니다.

비유하면, Runtime은 "에이전트 전용 서버리스 호스팅"입니다. **Strands Agents**·**CrewAI**·**LangGraph**·LlamaIndex·Google ADK·OpenAI Agents SDK 등 프레임워크와 **MCP**·A2A 같은 프로토콜을 가리지 않고, 커스텀 컨테이너도 그대로 올릴 수 있습니다.

유의사항: Runtime은 ARM64(AWS Graviton) 아키텍처에서만 동작하므로, Docker 컨테이너로 배포할 때는 이미지를 반드시 `linux/arm64`로 빌드해야 합니다. 컨테이너는 `/invocations`(POST)와 `/ping`(GET) 엔드포인트를 노출해야 합니다.

### 사용목적

직접 만든 에이전트를 프로덕션에 올리려면 세션 격리, 콜드 스타트 최적화, 인증, 장애 추적을 각각 구축해야 합니다. Runtime은 이 인프라를 관리형으로 제공해 프레임워크·모델 선택의 자유를 유지한 채 **Tool Use** 응답 지연 없이 실시간·멀티 에이전트 워크로드를 스케일업하려는 목적으로 씁니다.

### 동작/구조

에이전트 코드를 컨테이너(ECR 이미지) 또는 CodeZip으로 패키징해 `create_agent_runtime` API 또는 AgentCore CLI로 배포하면, 요청마다 독립된 세션이 생성되어 실행됩니다. 호출은 `invoke_agent_runtime` API(또는 CLI `agentcore invoke`)로 하며, `runtimeSessionId`로 세션을 구분하고 `stop_runtime_session`으로 세션을 조기 종료할 수 있습니다.

- **Bedrock AgentCore**: Runtime을 포함해 Memory·Gateway 등을 함께 제공하는 상위 플랫폼
- **AI Agent**: Runtime이 배포·실행하는 대상
- **Strands Agents**: Runtime 예제에서 자주 쓰이는 AWS의 오픈소스 에이전트 구축 SDK
- **CrewAI**: Runtime이 배포 대상으로 명시적으로 지원하는 멀티에이전트 프레임워크
- **LangGraph**: Runtime이 배포 대상으로 명시적으로 지원하는 그래프 기반 에이전트 프레임워크
- **MCP**: Runtime이 A2A와 함께 지원하는 도구·에이전트 연결 프로토콜
- **Tool Use**: Runtime 위에서 에이전트가 수행하는 핵심 동작

## 참고

- AgentCore Runtime 개요: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html
- AgentCore CLI로 시작하기: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-get-started-cli.html
- AgentCore CLI 없이 시작하기: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-custom.html
