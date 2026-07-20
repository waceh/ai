---
id: agentify-existing-project
---

### 핵심 답변

"프로젝트를 **AI Agent**화해서 띄운다"는 두 가지를 합친 말입니다. **① Agent화**: 사람이 명령을 하나하나 쳐서 돌리던 스크립트·서비스를, **LLM**이 목표를 해석하고 **Planning**·**Tool Use**로 스스로 함수를 골라 실행하는 시스템으로 바꾸는 것. **② 띄운다**: 그렇게 만든 Agent를 한 번 쓰고 끝나는 대화가 아니라, 상시 켜져 있거나 예약대로 반복 실행되는 서비스/프로세스로 배포하는 것입니다.

### 기존 프로젝트 vs Agent화된 프로젝트

| 구분 | 기존 스크립트/서비스 | Agent화 |
|------|----------------------|---------|
| 실행 방식 | 사람이 명령·인자를 매번 지정 | 자연어 목표만 주면 LLM이 스스로 단계·도구 결정 |
| 도구 호출 | 코드 안에 하드코딩된 순서 | **Tool Use**로 상황 따라 동적 호출 |
| 확장 | 새 기능마다 코드 분기 추가 | **Skills**·**MCP** 서버 추가로 능력 확장 |
| 실행 환경 | 로컬 터미널에서 1회 실행 | **Harness** 위에서 상시·반복 실행 |
| 안전장치 | 개발자가 직접 검증 | **Guardrails**·**Sandbox**·**HITL**로 런타임 통제 |

### 어떻게 하는가 — 실전 경로

**1. 프로젝트 기능을 Tool Use로 노출**
프로젝트의 핵심 함수(빌드, 배포, DB 조회, 리포트 생성 등)를 이름·설명·JSON Schema를 가진 도구로 정의합니다. LLM이 "무엇을 언제 호출할지"만 판단하고, 실제 실행은 여전히 기존 코드가 합니다.

**2. MCP 서버로 감싸기**
프로젝트를 **MCP** 서버로 만들면 Claude Code·다른 Agent 클라이언트에서 별도 통합 코드 없이 바로 도구·데이터를 붙일 수 있습니다. 사내 API·DB를 Agent 여러 개에서 재사용하고 싶을 때 특히 유리합니다.

**3. Claude Code + CLAUDE.md + Skills로 운영**
빠르게 시작하려면 프로젝트 루트에 **CLAUDE.md**로 빌드·배포 규칙을 적어두고, 반복 작업은 Custom Slash Commands나 **Skills**로 패키징합니다. **Claude Code**를 터미널에서 실행하면 바로 "Agent화된 프로젝트 운영 콘솔"이 됩니다.

**4. 자체 서비스에 내장하려면 Agent SDK**
CLI가 아니라 자체 백엔드·봇에 상시 내장하고 싶다면 **Agent SDK**로 같은 도구·루프를 코드로 가져와 서버 프로세스로 띄웁니다. 여러 하위 작업을 나눠야 하면 **Orchestration**이 **Subagent**를 spawn하는 구조로 확장합니다.

**5. "띄운다"의 실제 형태**
- 상시 대기: Agent SDK 기반 서버 프로세스 또는 봇으로 배포
- 예약 실행: Claude Code의 스케줄 기능으로 반복 작업을 인프라에서 자동 실행
- 대화형 콘솔: Claude Code를 팀이 상시 켜두고 쓰는 CLI 세션으로 운영

**6. 안전장치는 빼먹지 않기**
자율 실행 범위가 커질수록 위험한 동작(배포, 삭제, 결제) 전에는 **HITL** 승인 체크포인트를 두고, **Guardrails**로 허용 도구·명령을 제한하며, **Sandbox**로 실행 환경을 격리합니다. **Observability**로 어떤 도구가 언제 호출됐는지 추적 가능하게 남겨둡니다.

### 예시로 보기 — 기존 Spring Boot 프로젝트를 Agent화하기

이미 돌아가고 있는 커머스 백엔드가 있다고 가정합니다. `OrderService`(주문 조회·환불), `InventoryService`(재고 조회), 그리고 이들을 감싼 `OrderController` REST API. 목표는 "고객 CS 문의가 오면 주문·배송 상태를 스스로 조회하고, 정책에 맞으면 환불까지 처리하는 **AI Agent**"를 만드는 것입니다. 새 비즈니스 로직을 다시 짜는 게 아니라, **이미 있는 서비스 메서드를 Agent가 호출할 수 있는 도구로 얇게 감싸는 것**이 핵심입니다.

**1단계 — 노출할 기능 추리기**
전부 열 필요 없습니다. `getOrderStatus(orderId)`, `getShipmentTracking(orderId)`, `refundOrder(orderId, reason)` 세 개만 골라 **Tool Use** 대상으로 정합니다. 나머지 내부 메서드는 그대로 숨겨둡니다.

**2단계 — MCP 서버로 얇게 감싸기**
Java·Spring 생태계에는 Spring AI가 유지하는 공식 MCP Java SDK가 있어, 기존 `@Service` 빈을 그대로 두고 어댑터 클래스 하나만 추가하면 됩니다.

```groovy
// build.gradle
implementation("org.springframework.ai:spring-ai-starter-mcp-server-webmvc")
```

```yaml
# application.yml
spring:
  ai:
    mcp:
      server:
        name: order-service-mcp
        protocol: STREAMABLE
```

```java
@Component
public class OrderAgentTools {

    private final OrderService orderService;

    public OrderAgentTools(OrderService orderService) {
        this.orderService = orderService; // 기존 빈 재사용, 새 로직 없음
    }

    @McpTool(name = "get_order_status", description = "주문 ID로 주문 상태와 배송 정보를 조회한다")
    public OrderStatusResponse getOrderStatus(
            @McpToolParam(description = "조회할 주문 ID", required = true) Long orderId) {
        return orderService.getOrderStatus(orderId);
    }

    @McpTool(name = "refund_order", description = "주문을 환불 처리한다. 반드시 사람 승인 후에만 호출되어야 한다")
    public RefundResult refundOrder(
            @McpToolParam(description = "환불할 주문 ID", required = true) Long orderId,
            @McpToolParam(description = "환불 사유", required = true) String reason) {
        return orderService.refund(orderId, reason);
    }
}
```

이 의존성을 추가하면 Spring Boot 앱이 기동될 때 `POST /mcp` 엔드포인트가 자동으로 열리고, 위 두 메서드가 **MCP** 툴로 노출됩니다. 컨트롤러·컨트롤러 테스트·배포 파이프라인은 손댈 필요가 없습니다.

**3단계 — Agent 클라이언트 연결**
로컬에서 Spring Boot 앱을 평소처럼 띄운 뒤(`./gradlew bootRun`), **Claude Code**에서 이 MCP 서버를 등록합니다.

```bash
claude mcp add --transport http order-service http://localhost:8080/mcp
```

이제 Claude Code 세션 안에서 "3번 주문 배송이 왜 이렇게 늦죠? 정책상 환불 가능하면 처리해줘"라고 물으면, LLM이 `get_order_status` → `get_shipment_tracking`을 스스로 호출해 상황을 파악하고, 환불이 필요하다고 판단되면 `refund_order` **Tool Use**를 선언합니다.

**4단계 — 안전장치 연결**
`refund_order`는 실제 돈이 오가므로 자동 실행시키면 안 됩니다. **Hooks**의 `PreToolUse` 이벤트로 이 도구 이름을 걸러, 호출 직전에 사람 승인을 받도록 **HITL** 체크포인트를 끼워 넣습니다. 승인 없이 실행되지 않게 하는 것이 **Guardrails**의 역할입니다.

**5단계 — "띄운다"의 실제 의미**
새 서버를 따로 만들 필요가 없습니다. 기존 Spring Boot 앱을 평소처럼 배포(Docker·systemd·K8s 무엇이든)하면, 그 안에 추가된 `/mcp` 엔드포인트가 상시 대기하는 Agent 진입점이 됩니다. 즉 "Agent화해서 띄운다"는 별도 인프라를 새로 짓는 게 아니라, **이미 배포되어 있는 서비스에 도구 인터페이스 한 겹을 얹는 것**에 가깝습니다.

### 프로젝트가 여러 개면? — 프런트 + Gateway + DB 백엔드 예시

Vue 프런트, 게이트웨이 역할의 Spring Boot, DB와 직접 붙는 Spring Boot 백엔드로 나뉜 구조라면 **셋 다 똑같이 Agent화하지 않습니다.** 기준은 딱 하나, **지금 있는 신뢰 경계(trust boundary)를 그대로 따르는 것**입니다. 외부 요청을 받는 진입점만 Agent 진입점으로 삼고, 내부 전용 서비스는 지금처럼 안 열어둡니다.

| 레이어 | Agent화 대상인가 | 이유 |
|--------|-----------------|------|
| Vue 프런트 | 아니오 — 채팅 UI만 추가 | LLM 호출·**Tool Use** 실행은 서버에서 돌아야 함. 브라우저에 API 키·도구 실행 권한을 두면 **Guardrails**·**Sandbox**가 있으나 마나 해짐 |
| Gateway(Spring Boot) | 예 — 여기 한 곳에 **MCP** 서버를 붙임 | 이미 외부 요청을 받는 진입점이라, Agent도 "새로운 종류의 클라이언트"로 이 문을 그대로 씀 |
| DB 백엔드(Spring Boot) | 아니오 — 지금처럼 내부 전용으로 유지 | Gateway가 이미 대신 호출해주므로, Agent가 내부망을 직접 넘나들 이유가 없음 |

**왜 Gateway 하나로 모으는가**
Gateway는 이미 `OrderServiceClient` 같은 내부 호출 클라이언트(Feign·RestClient 등)를 갖고 있습니다. 이전 Spring Boot 예시의 `OrderAgentTools`처럼, 그 클라이언트를 그대로 감싸 **MCP** 툴로 노출하면 됩니다. DB 백엔드 쪽 코드는 한 줄도 안 건드립니다.

```java
// Gateway 프로젝트 안에서
@Component
public class OrderAgentTools {

    private final OrderServiceClient orderServiceClient; // 기존에도 쓰던 DB 백엔드 호출 클라이언트

    public OrderAgentTools(OrderServiceClient orderServiceClient) {
        this.orderServiceClient = orderServiceClient;
    }

    @McpTool(name = "get_order_status", description = "주문 상태를 조회한다")
    public OrderStatusResponse getOrderStatus(
            @McpToolParam(description = "주문 ID", required = true) Long orderId) {
        return orderServiceClient.getOrderStatus(orderId); // DB 백엔드로 그대로 위임
    }
}
```

**흐름**
Vue의 채팅 UI → Gateway의 `/mcp`(또는 채팅 엔드포인트) → LLM이 `get_order_status` **Tool Use** 판단 → Gateway가 지금까지 하던 대로 DB 백엔드 REST 호출 → 결과를 LLM이 요약해 사용자에게 답변. DB 백엔드 입장에서는 "Gateway가 호출했다"는 사실이 그대로이므로, Agent가 생겼다고 인증·방화벽 규칙을 새로 열 필요가 없습니다.

**그래도 "각각" 나누는 게 맞는 경우**
서비스들이 서로 다른 팀 소유이거나, DB 백엔드를 이 Agent 말고 다른 사내 Agent에서도 독립적으로 재사용해야 한다면 서비스별로 **MCP** 서버를 각각 두고 **Orchestration**이 서비스별 **Subagent**로 나눠 호출하는 편이 낫습니다. Claude Code는 `claude mcp add`를 여러 번 실행해 MCP 서버 여러 개를 동시에 등록할 수 있어, 이 구조도 그대로 지원됩니다. 다만 팀·서비스가 하나로 뭉쳐 있는 지금 같은 구조라면, Gateway 한 곳에 모으는 쪽이 인프라도 안 늘고 기존 신뢰 경계도 안 깨집니다.

### 실제로 띄운 뒤 뭘 할 수 있나 — 운영 오류 확인·대응 예시

Agent가 할 수 있는 일은 딱 **노출해 둔 Tool Use 범위만큼**입니다. "확인"은 조회용 도구만 있어도 거의 다 되고, "해결"은 액션용 도구가 따로 있어야 하며, **코드 버그 자체를 고치는 것은 이 비즈니스 Agent의 영역이 아닙니다.** 이 경계를 실제 장애 상황으로 풀어보면 이렇습니다.

**상황**: 오늘 오전 배포 이후 환불 API에서 500 에러가 늘고 있다는 알림이 옵니다.

**1. 진단용 도구를 하나 더 추가합니다**
지금까지는 `get_order_status`·`refund_order`만 있었습니다. 여기에 기존 로그·**Observability** 인프라(ELK·Loki 등, 이미 운영 중인 것)를 조회하는 도구를 하나 더 얹습니다. 새 로깅 시스템을 만드는 게 아니라 **기존 조회 API를 감싸는 것**입니다.

```java
@McpTool(name = "search_error_logs", description = "지정한 엔드포인트·시간 범위의 에러 로그를 검색한다")
public List<ErrorLogEntry> searchErrorLogs(
        @McpToolParam(description = "엔드포인트 경로, 예: /api/orders/refund", required = true) String endpoint,
        @McpToolParam(description = "조회 시작 시각(ISO-8601)", required = true) String since) {
    return logQueryClient.search(endpoint, since); // 기존 로그 조회 클라이언트 재사용
}
```

**2. 실제 대화 예시**

> **나**: 환불 API에서 최근 1시간 500 에러 난 것 좀 확인해줘. 원인도 같이 봐줘.
>
> **Agent**: `search_error_logs(endpoint="/api/orders/refund", since="1시간 전")` 호출 → 47건 조회.
> "지난 1시간 동안 `/api/orders/refund`에서 500 에러 47건 발생했습니다. 전부 `RefundService.java:42`의 `NullPointerException`이고, `paymentGateway.cancel()`이 `null`을 반환하는 케이스에서 터집니다. 에러 시작 시점이 오늘 오전 10시 배포와 일치합니다."
>
> **나**: 그 버그 지금 바로 고쳐줄 수 있어?
>
> **Agent**: "이 Agent에는 코드를 수정·배포하는 도구가 없습니다. `RefundService.java:42`의 null 체크 누락으로 보이니, 이 내용을 Claude Code(레포지토리 접근 권한이 있는 세션)로 넘겨 수정하는 걸 권장합니다."

**3. 왜 여기서 멈추는가**
`OrderAgentTools`에 정의된 도구는 조회(`get_order_status`)와 제한된 업무 액션(`refund_order`) 뿐, 파일을 고치고 배포하는 도구는 없습니다. **AI Agent**는 자기가 가진 Tool Use 목록 밖의 일은 못 합니다 — 이게 의도된 안전장치입니다. 실제 코드 수정은 리포지토리에 접근 권한이 있는 별도 **Claude Code** 세션의 역할이고, 방금 Agent가 찾아낸 "파일:라인 + 원인"을 그대로 붙여넣으면 이어서 고칠 수 있습니다.

**4. "해결"까지 자동화하고 싶다면**
반복되는 뻔한 장애(캐시 초기화, 특정 서비스 재시작, 알려진 롤백)라면 그 자체를 **Workflow**(정해진 runbook)로 만들어 `restart_service(name)`처럼 액션 도구로 노출할 수 있습니다. 다만 실행 전 반드시 **HITL** 승인을 거치게 하고, **Guardrails**로 실행 가능한 서비스 목록을 제한해야 합니다. 코드 버그 수정처럼 매번 다른 원인 분석이 필요한 일은 runbook화가 안 되므로, 이런 경우는 진단까지만 Agent가 하고 사람(또는 Claude Code)이 이어받는 구조가 현실적입니다.

### "이 페이지 기능이 이상해요" 같은 프런트 문의는 어디로, 어떻게

**어디에 문의하나** — 채널은 하나, Vue 프런트에 붙인 채팅 창구입니다. Agent 루프는 서버(Gateway)에서 돌고 프런트는 그 요청을 그대로 넘기는 창구일 뿐이므로, 사용자는 "`http://aaa.bb.com/dd/ee.html`에서 저장 버튼 눌러도 반응이 없어요"처럼 자연어로 말하면 됩니다. 별도 티켓 양식이나 필드를 새로 만들 필요는 없습니다 — LLM이 문장에서 URL·증상을 알아서 뽑아냅니다.

**문의 정확도를 높이려면 현재 페이지 컨텍스트를 자동으로 실어 보내세요**
사용자가 URL을 매번 직접 안 적어도 되도록, 채팅 위젯이 요청을 보낼 때 현재 `pageUrl`·로그인 사용자 ID 같은 걸 자동으로 같이 첨부하는 게 실무 방식입니다. 새 기능이 아니라 **Prompt** 조립 단계에서 몇 필드 끼워 넣는 것뿐입니다.

```json
{
  "message": "저장 버튼 눌러도 반응이 없어요",
  "context": { "pageUrl": "http://aaa.bb.com/dd/ee.html", "userId": "12345" }
}
```

**Agent가 실제로 뭘 참고해서 답하나 — 여기서도 경계는 노출된 도구입니다**

| 문제 유형 | 참고 가능한가 | 근거 |
|-----------|---------------|------|
| 백엔드 API 에러(500, 타임아웃) | 가능 | `search_error_logs`로 해당 시간대·엔드포인트 로그 조회 |
| 데이터 상태 이상(주문 상태 안 바뀜 등) | 가능 | `get_order_status` 같은 도메인 조회 도구 |
| 순수 프런트엔드 버그(버튼 무반응, 화면 깨짐) | 도구 없이는 불가능 | 서버 쪽 Agent는 브라우저 안에서 무슨 일이 있었는지 볼 수 없음 |

세 번째 줄이 실무에서 자주 놓치는 부분입니다. `/dd/ee.html`이라는 URL 자체는 Agent에게 아무 의미가 없습니다 — 이 URL이 어떤 화면·어떤 API를 부르는지 미리 알려주지 않으면요. 채워 넣는 방법은 두 가지입니다.

1. **라우트-API 매핑을 MCP Resource로 등록**: "`/dd/ee.html` = 주문 상세 화면, 내부적으로 `GET /api/orders/{id}` 호출"처럼 정리한 문서를 **MCP Resource**로 노출해두면, Agent가 URL을 받았을 때 이 문서를 **RAG**처럼 참고해 어떤 API·로그를 조회해야 할지 스스로 찾습니다.
2. **프런트 에러 트래킹 도구 추가**: Sentry 같은 프런트 에러 수집 시스템이 이미 있다면, 그 조회 API도 `search_frontend_errors(pageUrl, since)` 같은 도구로 하나 더 얹습니다. 그래야 JS 콘솔 에러·렌더링 실패까지 참고할 수 있습니다.

둘 다 없으면 Agent는 "이 화면 자체의 문제인지 판단할 자료가 없습니다"라고 솔직하게 답하는 것이 맞습니다. 근거 없이 추측하게 두면 안 됩니다 — 이 경우엔 사람이 URL·재현 방법을 들고 프런트 레포 접근 권한이 있는 **Claude Code**로 넘겨 직접 코드를 보는 것이 다음 단계입니다.

### 같이 보면 좋은 용어

**AI Agent**, **Harness**, **Agent SDK**, **Claude Code**, **MCP**, **MCP Resource**, **Tool Use**, **Workflow**, **Skills**, **Orchestration**, **Subagent**, **Guardrails**, **Sandbox**, **HITL**, **Hooks**, **Observability**, **Prompt**, **RAG**
