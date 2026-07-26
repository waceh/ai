---
id: agentcore-gateway
---

### 개요

AgentCore Gateway는 **Bedrock AgentCore**의 완전관리형 AI 게이트웨이로, API·Lambda 함수·기존 서비스를 **MCP** 호환 도구로 변환하고, 다른 에이전트·HTTP 서비스도 하나의 보안 엔드포인트 뒤로 모읍니다. Gateway는 단순 MCP 도구 게이트웨이를 넘어, 여러 LLM 제공사로 추론 요청을 라우팅하는 통합 엔드포인트 역할도 합니다.

비유하면, Gateway는 "사내 API·도구·다른 에이전트를 하나로 묶는 관제 게이트"입니다. OpenAPI·Smithy·Lambda를 도구 입력 형식으로 지원하고, Salesforce·Slack·Jira 같은 인기 서비스는 원클릭으로 연결할 수 있습니다.

유의사항: Gateway는 인바운드 인증(에이전트 신원 확인)과 아웃바운드 인증(도구 접근용 OAuth·자격 증명)을 모두 관리형으로 처리한다는 점에서 **AgentCore Identity**와 맞닿아 있지만, Identity 자체는 별도 서비스입니다. Gateway는 그 인증 결과를 활용해 **Tool Use** 요청을 실제 API 호출로 변환합니다.

### 사용목적

에이전트가 사내 API·Lambda·다른 에이전트를 쓰려면 프로토콜 변환, 인증 처리, 도구 검색을 직접 구현해야 합니다. Gateway는 이를 몇 줄의 설정으로 대체해, 개발자가 도구 통합 인프라 대신 에이전트 로직에 집중하게 해 줍니다.

### 동작/구조

API·Lambda·기존 MCP 서버를 Gateway 타깃으로 등록하면, Gateway가 **MCP** 요청을 API 호출·Lambda 실행으로 변환(Translation)하고, 여러 타깃을 하나의 엔드포인트로 묶습니다(Composition). 요청마다 OAuth로 신원을 검증하고(Security Guard), 도구별 자격 증명을 주입하며(Secure Credential Exchange), 도구가 많을 때는 시맨틱 검색으로 적합한 도구를 찾아줍니다(Semantic Tool Selection).

- **Bedrock AgentCore**: Gateway를 서비스 중 하나로 포함하는 상위 플랫폼
- **MCP**: Gateway가 API·Lambda를 변환해 노출하는 도구 프로토콜
- **Tool Use**: 에이전트가 Gateway로 연결된 도구를 호출하는 동작
- **AgentCore Identity**: Gateway의 인바운드·아웃바운드 인증과 연동되는 자격 증명 서비스

## 참고

- Amazon Bedrock AgentCore Gateway 개요: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html
