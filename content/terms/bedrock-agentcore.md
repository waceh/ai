---
id: bedrock-agentcore
---

### 개요

Amazon Bedrock AgentCore는 **AI Agent**를 어떤 프레임워크·어떤 모델로 만들었든 안전하게 배포·운영할 수 있게 해주는 AWS의 에이전틱 플랫폼입니다. **CrewAI**·**LangGraph**·LlamaIndex·**Strands Agents** 같은 오픈소스 프레임워크와도, **AWS Bedrock** 밖의 OpenAI·Gemini 같은 모델과도 함께 쓸 수 있습니다.

비유하면, AgentCore는 "이미 만든 에이전트를 올려놓는 관제탑이 딸린 배포 플랫폼"입니다. **AgentCore Runtime**(격리 세션 실행)·**Memory**(단기·장기 기억)·**AgentCore Gateway**(API를 **MCP** 도구로 변환)·**AgentCore Identity**(인증·권한)·**Observability**·Code Interpreter·Browser 같은 모듈형 서비스로 구성되어 있고, 필요한 것만 골라 조합할 수 있습니다.

유의사항: AgentCore의 구성 요소 중 하나는 이름이 "Harness"인데, 이는 이 사전의 일반 개념 **Harness**와 달리 모델·시스템 프롬프트·도구만 지정하면 추론·**Tool Use**·**Memory** 관리를 대신 해 주는 AWS의 관리형 에이전트 루프 제품(AgentCore Harness)을 가리킵니다. 또한 AgentCore ≠ **AWS Bedrock**입니다. Bedrock은 Foundation Model을 호출하는 서비스이고, AgentCore는 그렇게 만든(또는 다른 모델로 만든) 에이전트를 실행·**Sandbox** 격리·**Guardrails**·모니터링하는 별도 계층입니다.

### 사용목적

에이전트 프로토타입을 직접 만든 뒤 프로덕션에 올리려면 세션 격리, 인증, 도구 연결, 장애 추적을 각각 직접 구축해야 합니다. AgentCore는 이 인프라 관리를 없애고, 프레임워크·모델 선택의 자유를 유지한 채 **Guardrails**·**Sandbox** 격리·**Observability**를 표준 제공해 에이전트를 안전하게 스케일업하려는 목적으로 씁니다.

### 동작/구조

에이전트 코드(자체 작성 또는 **Strands Agents**·**CrewAI**·**LangGraph** 등)를 **AgentCore Runtime**에 배포하면, 요청마다 격리된 세션에서 실행되고 **Memory** 서비스가 대화 맥락과 장기 기억을 관리합니다. **AgentCore Gateway**는 기존 API·Lambda를 **MCP** 호환 도구로 노출해 **Tool Use** 대상으로 연결하고, **AgentCore Identity**는 외부 IdP와 연동해 인증을 처리합니다. 모든 실행은 OpenTelemetry 호환 **Observability**로 추적되며, Code Interpreter·Browser 같은 **Sandbox** 도구로 코드 실행·웹 탐색을 격리해 수행합니다.

- **AI Agent**: AgentCore가 배포·운영 대상으로 삼는 자율 실행 시스템
- **AWS Bedrock**: Foundation Model을 호출하는 별도 서비스, AgentCore와 함께 쓰지만 동일하지 않음
- **Harness**: AgentCore의 관리형 에이전트 루프 구성 요소 이름과 겹치는 일반 개념
- **AgentCore Runtime**: 에이전트를 격리된 세션에서 배포·실행하는 핵심 실행 계층
- **AgentCore Gateway**: API·Lambda를 변환해 노출하는 도구 게이트웨이
- **AgentCore Identity**: 외부 IdP와 연동해 에이전트 인증·자격 증명을 관리하는 서비스
- **Strands Agents**: AgentCore CLI 기본 프레임워크로 쓰이는 AWS의 오픈소스 에이전트 구축 SDK
- **CrewAI**: AgentCore Runtime이 배포 대상으로 지원하는 멀티에이전트 프레임워크
- **LangGraph**: AgentCore Runtime이 배포 대상으로 지원하는 그래프 기반 에이전트 프레임워크
- **MCP**: Gateway가 API·Lambda를 변환해 노출하는 도구 프로토콜
- **Tool Use**: 에이전트가 Gateway로 연결된 도구를 호출하는 핵심 동작
- **Memory**: AgentCore Memory 서비스가 관리하는 단기·장기 맥락
- **Sandbox**: Code Interpreter·Browser가 코드 실행·웹 탐색을 격리하는 방식
- **Guardrails**: Policy 등으로 에이전트 행동 범위를 제한하는 정책 계층
- **Observability**: OTEL 호환 추적으로 에이전트 실행을 모니터링
- **Subagent**: 멀티 에이전트 워크플로에서 AgentCore Observability가 함께 추적하는 하위 에이전트 단위

## 참고

- Amazon Bedrock AgentCore 개요: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html
- Amazon Bedrock AgentCore GA 발표: https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available
- AgentCore 신규 기능(Harness·CLI 등): https://aws.amazon.com/blogs/machine-learning/get-to-your-first-working-agent-in-minutes-announcing-new-features-in-amazon-bedrock-agentcore/
