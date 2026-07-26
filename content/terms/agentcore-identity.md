---
id: agentcore-identity
---

### 개요

AgentCore Identity는 AI 에이전트와 자동화 워크로드를 위한 **Bedrock AgentCore**의 신원·자격 증명 관리 서비스입니다. 에이전트가 사용자를 대신해 AWS 리소스와 서드파티 서비스에 접근할 때 필요한 인증·인가·자격 증명 관리를 제공하면서 보안 통제와 감사 추적을 유지합니다.

비유하면, Identity는 "에이전트용 사원증 발급·출입 관리 시스템"입니다. 에이전트 신원은 업계 표준 워크로드 아이덴티티 패턴과 호환되는 특수 속성을 가진 워크로드 아이덴티티로 구현됩니다.

유의사항: Identity는 인바운드 인증(누가 에이전트를 호출했는지 검증)과 아웃바운드 인증(에이전트가 외부 서비스에 접근할 자격 증명)을 모두 다루며, Amazon Cognito·Okta·Microsoft Azure Entra ID·Auth0 같은 기존 IdP와 연동합니다. **AgentCore Runtime**과 **AgentCore Gateway** 양쪽에 네이티브로 통합되어 있어, 별도로 인증 로직을 다시 짤 필요가 없습니다.

### 사용목적

에이전트마다 인증·자격 증명 관리를 직접 구현하면 사용자 마이그레이션이나 별도 인증 흐름을 새로 만들어야 합니다. Identity는 기존 IdP·자격 증명 제공자와 호환되는 관리형 서비스로 이 부담을 없애, 에이전트가 안전하게 AWS·서드파티 리소스에 접근하게 합니다.

### 동작/구조

에이전트가 **AgentCore Runtime**에서 실행되거나 **AgentCore Gateway**를 통해 도구를 호출할 때, Identity가 워크로드 아이덴티티로 요청을 인증하고, 인바운드 JWT 인가자로 호출자를 검증합니다. 아웃바운드 요청에는 자격 증명 제공자(Credential Provider)를 통해 토큰을 발급·관리해 서드파티 서비스 접근을 중개합니다.

- **Bedrock AgentCore**: Identity를 서비스 중 하나로 포함하는 상위 플랫폼
- **AgentCore Runtime**: Identity가 인증을 제공하는 에이전트 실행 계층
- **AgentCore Gateway**: Identity의 인바운드·아웃바운드 인증과 연동되는 도구 게이트웨이

## 참고

- Amazon Bedrock AgentCore Identity 개요: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html
