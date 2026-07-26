---
id: agentcore-identity
status: ready
title: "OAuth 2.0 사용자 동의 흐름으로 액세스 토큰 받기"
source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-getting-started-cognito.html"
---

## 시나리오

에이전트가 사용자를 대신해 외부 서비스(Google Drive·Slack·GitHub 등)에 접근하려면 OAuth 2.0 동의 흐름과 토큰 발급을 직접 구현하지 않고 **AgentCore Identity**의 자격 증명 제공자(Credential Provider)와 `@requires_access_token` 데코레이터를 씁니다.

## 따라하기

1. SDK를 설치합니다.

```bash
pip install bedrock-agentcore boto3 strands-agents pyjwt
```

2. OAuth 2.0 인가 서버(예: Cognito) 정보로 자격 증명 제공자를 만듭니다.

```bash
agentcore add credential \
  --name AgentCoreIdentityQuickStartProvider \
  --type oauth \
  --discovery-url "$ISSUER_URL" \
  --client-id "$CLIENT_ID" \
  --client-secret "$CLIENT_SECRET"
```

3. `@requires_access_token`으로 에이전트 코드에서 사용자 동의 흐름을 시작합니다.

```python
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from bedrock_agentcore.identity import requires_access_token

app = BedrockAgentCoreApp()

async def handle_auth_url(url):
    print(f"Authorization URL, please copy to your browser: {url}")

@requires_access_token(
    provider_name="AgentCoreIdentityQuickStartProvider",
    scopes=["openid"],
    auth_flow="USER_FEDERATION",
    on_auth_url=handle_auth_url,
    force_authentication=True,
    callback_url="insert_oauth2_callback_url_for_session_binding",
)
async def introspect_with_decorator(*, access_token: str):
    print("Successfully received an access token to act on behalf of your user!")

@app.entrypoint
async def agent_invocation(payload, context):
    await introspect_with_decorator()

if __name__ == "__main__":
    app.run()
```

4. 배포 후 `--user-id`·`--session-id`를 지정해 호출합니다 (session-id는 33자 이상).

```bash
agentcore invoke "TestPayload" --runtime IdentityQuickstart \
  --user-id "SampleUserID" \
  --session-id "ALongThirtyThreeCharacterMinimumSessionIdYouCanChangeThisAsYouNeed"
```

## 핵심 포인트

- Credential Provider는 에이전트가 외부 서비스에 접근할 때 쓰는 OAuth 2.0 클라이언트(발급자 URL·클라이언트 ID·시크릿)를 등록해 둔 것입니다.
- `@requires_access_token`은 사용자 동의(Authorization URL)를 받아 접근 토큰을 반환하는 데코레이터입니다.
- 프로덕션에서는 `--user-id` 대신 실제 IdP가 발급한 JWT 기반 인증 경로를 쓰는 것이 권장됩니다.

## 참고

- AgentCore Identity로 첫 인증 에이전트 만들기: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-getting-started-cognito.html
