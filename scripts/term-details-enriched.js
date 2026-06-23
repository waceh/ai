module.exports = {
  llm: `### 개요

LLM(Large Language Model)은 방대한 텍스트로 학습한 신경망으로, 다음에 올 단어(토큰)의 확률을 예측해 문장을 이어 씁니다. 챗봇·코드 생성·요약처럼 "말하기"를 담당하는 두뇌에 가깝습니다.

비유하면, LLM은 방대한 책을 읽고 문맥에 맞는 다음 문장을 짓는 작가입니다. 규칙표로 답을 고르는 챗봇과 달리, 표현이 달라도 의미를 파악해 새 문장을 만들 수 있습니다.

2023년 **ChatGPT** 성공 이후 대중화된 분야이며, 현재 대부분 **트랜스포머**·자기지도학습 기반 신경망 모델을 LLM으로 봅니다. 매개변수가 작은 SLM(small LM)은 비용·배포에 유리하고, GPT-4급 LLM은 슈퍼컴퓨터급 자원이 필요한 경우가 많습니다.

유의사항: LLM은 "검색 엔진"이 아닙니다. 학습 시점까지의 지식으로 추론하며, 실시간 DB 조회나 코드 실행은 **Tool Use**·**RAG**·**AI Agent** 같은 바깥 계층과 함께 쓸 때 비로소 완성됩니다. **Token**과 **Context Window** 한도도 항상 염두에 두세요.

### 사용목적

학습 파이프라인은 보통 사전학습 → 지도학습 미세조정(SFT) → **정렬(Alignment)** 순으로 이어지며, 후단에서 **RLHF**·**Guardrails**·**RAG**·**Tool Use**가 붙습니다.

자연어 이해·생성·추론의 중심 코어로, **Planning**으로 문제를 나누고 **Tool Use**로 외부 API를 호출하며, **RAG**·**Memory**로 사실을 보강합니다. 도메인 맞춤이 필요하면 **Fine-tuning**을 검토합니다.

### 동작/구조

입력 텍스트는 **Token** 단위로 쪼개져 **Context Window** 안에서 처리됩니다. 모델은 다음 Token 확률을 예측하고, **AI Agent** 루프에서는 이 출력이 Prompt 해석, Tool Use 호출 선언, Memory 요약 등으로 이어집니다.

- **AI Agent**: LLM을 중심에 두고 Tool Use·Memory·Planning을 반복 실행하는 시스템
- **Planning**: LLM이 ReAct·CoT 등으로 단계를 설계하는 방식
- **Tool Use**: LLM이 JSON 형태로 함수·API 호출을 선언하는 기술
- **RAG**: Vector DB 검색 결과를 Prompt에 넣어 LLM 답변을 보강
- **Memory**: Context Window 한도를 넘는 맥락을 Embeddings·Vector DB 등으로 유지
- **Token**: LLM이 텍스트를 처리·과금하는 최소 단위
- **Context Window**: LLM이 한 번에 볼 수 있는 Token 상한
- **Fine-tuning**: 특정 도메인·스타일에 LLM 가중치를 추가 학습

## 참고

- Anthropic, "Building effective agents" — augmented LLM, workflows vs agents: https://www.anthropic.com/engineering/building-effective-agents`,

  agent: `### 개요

AI Agent는 **LLM**을 두뇌로 두고, 목표를 해석한 뒤 **Planning**·**Tool Use**·**Memory**를 반복해 스스로 작업을 진행하는 시스템입니다. 한 번의 질문-답변으로 끝나지 않고, 검색·코드 실행·승인 요청까지 이어집니다.

비유하면, LLM만 있는 것은 "조언만 하는 전문가"이고 Agent는 "일까지 대신 하는 비서"입니다. 비서는 **Harness**가 제공하는 실행 환경 위에서 **Skills**·**MCP**로 손(도구)을 뻗습니다.

GUI에서 자율 동작하는 **지능형 에이전트**가 넓은 의미의 AI Agent입니다. 코딩 에이전트(Cursor Agent, Claude Code), Computer/Browser Use(OpenAI CUA, Claude Computer Use), Deep Research(Manus)처럼 목적별 에이전트가 먼저 상용화되었습니다.

유의사항: Agent ≠ LLM입니다. LLM은 추론·생성만 하고, Agent는 루프·도구·메모리·안전 장치가 붙은 전체 시스템입니다. **OpenClaw**·**NanoClaw**는 이런 Agent를 빠르게 만드는 프레임워크이며, **Orchestration**·**Subagent**는 복잡한 일을 여러 Agent로 나눌 때 씁니다.

### 사용목적

2024년 **MCP** 공개·2025년 OpenAI·Google 채택으로 에이전트·외부 도구 연결 표준이 잡히면서, 2025년 **OpenClaw** 같은 오픈소스 프레임워크까지 등장했습니다.

한 번의 Prompt 응답으로 끝나지 않고, 검색·코드 실행·승인 요청 등을 반복해야 할 때 Agent 패턴이 필요합니다. Orchestration·Subagent로 역할을 나누면 복잡한 업무를 분업할 수 있습니다.

### 동작/구조

사용자 목표 → LLM이 Planning으로 단계 설계 → Tool Use·MCP·Skills로 외부 행동 → 결과를 Memory에 반영 → 다음 단계 판단을 반복합니다. Harness가 Sandbox·Guardrails·HITL·Observability를 통해 루프를 감쌉니다.

- **LLM**: Agent의 추론·생성 코어
- **Harness**: Agent 실행 루프·권한·안전·관측을 담당하는 실행 계층
- **Skills**: 특정 업무 절차·도구 묶음을 Agent에 확장
- **Planning**: 문제 분해·행동 순서 설계
- **Memory**: 세션·장기 맥락 유지
- **Tool Use**: LLM이 함수·API 호출을 선언
- **MCP**: Agent와 외부 데이터·도구를 연결하는 오픈 표준
- **Orchestration**: 여러 Agent·Subagent 작업 분배
- **Subagent**: Orchestration 아래 특정 하위 목표 전담 Agent
- **OpenClaw**: Skills·MCP 플러그인을 붙이는 범용 Agent 프레임워크
- **NanoClaw**: Sandbox 격리 중심의 경량·고보안 Agent 프레임워크

## 참고

- Anthropic, "Building effective agents" — agents 정의·autonomous agent 루프: https://www.anthropic.com/engineering/building-effective-agents
- Cursor Docs, "Build a coding agent" — harness = model + tools + instructions: https://cursor.com/docs/help/getting-started/build-ai-coding-agent`,

  mcp: `### 개요

MCP(Model Context Protocol)는 2024년 Anthropic이 공개한 **AI Agent**·AI 애플리케이션과 외부 시스템을 잇는 오픈 표준 프로토콜입니다. 공식 문서는 "AI용 USB-C"에 비유합니다. 예전에는 Google Calendar, Notion, 사내 DB마다 전용 연동 코드를 따로 짜야 했는데, MCP는 **Tool Use** 대상을 tools·resources·prompts 같은 공통 규격으로 노출합니다.

비유하면, MCP **서버**는 Agent가 꺼내 쓸 수 있는 도구·데이터 창고이고, **호스트**(Claude Desktop, Cursor 등) 안의 **클라이언트**가 서버에 연결해 목록을 받아옵니다. Agent(**Harness** 포함)는 이 연결을 통해 파일·API·DB에 접근하고, **Skills**와 조합해 업무별 도구 세트를 만듭니다.

유의사항: MCP는 LLM 자체가 아니라 "맥락·도구를 주고받는 규약"입니다. 실제 함수 호출은 **Tool Use** 흐름에서 일어납니다. MCP는 에이전트 간 대화 규약(A2A 등)과도 다릅니다—한 에이전트가 외부 데이터·도구에 붙는 쪽에 초점이 있습니다. **OpenClaw** 같은 프레임워크는 MCP 플러그인을 Skills와 함께 등록해 재사용성을 높입니다.

### 사용목적

에이전트·IDE·챗봇마다 API 래퍼를 새로 짜면 Skills·Tool Use 통합 비용이 커집니다. MCP 서버를 한 번 만들면 Claude, ChatGPT, VS Code, Cursor 등 여러 **호스트**에서 같은 서버를 재사용할 수 있습니다. 로컬 파일·DB부터 원격 SaaS API까지, "한 번 연결 규격으로 통일"하려는 목적입니다.

### 동작/구조

MCP는 **호스트 → 클라이언트 → 서버** 구조입니다. 호스트(AI 애플리케이션)가 서버마다 전용 MCP 클라이언트를 두고, 클라이언트가 서버와 1:1 연결을 유지합니다. 서버는 **tools**(실행 함수), **resources**(읽기용 맥락 데이터), **prompts**(템플릿)를 노출합니다.

데이터 계층은 JSON-RPC 2.0으로 메시지를 주고받고, 전송 계층은 보통 다음 둘 중 하나입니다.

- **stdio**: 같은 머신의 로컬 프로세스(예: 파일시스템 서버)
- **Streamable HTTP**: 원격 서버(예: 클라우드에 올라간 MCP 서버)

Tool Use 호출이 오면 서버가 실제 API·파일·DB 작업을 실행하고 결과를 클라이언트→호스트→LLM으로 돌려줍니다.

- **AI Agent**: MCP 클라이언트를 통해 외부 도구를 쓰는 주체
- **Tool Use**: LLM이 MCP로 노출된 도구를 JSON 호출로 실행
- **Skills**: MCP 기반 또는 독립적인 업무 확장 모듈
- **Harness**: MCP 연결·권한·로깅을 감싸는 실행 계층
- **OpenClaw**: MCP·Skills 플러그인을 붙이는 Agent 프레임워크

## 참고

- MCP 공식 사양: https://modelcontextprotocol.io/specification/2025-06-18
- MCP 소개: https://modelcontextprotocol.io/docs/getting-started/intro
- MCP 아키텍처: https://modelcontextprotocol.io/docs/learn/architecture
- Anthropic 발표: https://www.anthropic.com/news/model-context-protocol`,

  skills: `### 개요

Skills(Agent Skills)는 **AI Agent**가 특정 업무를 수행하도록 확장하는 실행 모듈·도구 묶음입니다. SKILL.md 같은 파일에 목적·단계·필요 **Tool Use**·**MCP** 연결이 정리되어, 매번 긴 **Prompt**를 붙여넣지 않아도 됩니다.

비유하면, Skills는 "업무 매뉴얼 + 전용 도구 세트"입니다. Agent는 작업을 받으면 관련 Skill을 골라 **Harness**가 Sandbox·Guardrails 안에서 절차를 실행합니다.

Anthropic에서 시작해 표준화된 **Agent Skills**로, SKILL.md에 명령·메타데이터·선택적 스크립트를 담습니다. **Prompt**와 달리 필요할 때만 로드되어 같은 지침을 매 대화마다 반복 붙이지 않아도 됩니다.

유의사항: Skills ≠ MCP입니다. Skill은 업무 절차 전체를 담고, MCP는 그 Skill이 의존할 수 있는 외부 연결 표준입니다. **OpenClaw**·Harness는 Skills 디렉터리를 스캔해 자동 로드하는 패턴을 제공합니다.

### 사용목적

범용 에이전트를 도메인 전문가처럼 바꾸는 재사용 모듈입니다. Codex·Claude Code는 플러그인·.agents/skills/·.claude/skills/ 경로를 쓰며, skills.sh 같은 허브로 배포·설치하기도 합니다.

매번 긴 Prompt를 붙여넣지 않고, 검증된 업무 흐름(코드 리뷰, 배포 체크 등)을 Agent에 재사용할 때 Skills가 유리합니다. OpenClaw·Harness는 Skills 디렉터리를 스캔해 자동 로드합니다.

### 동작/구조

Skill 정의(SKILL.md 등)에 목적·단계·필요 Tool Use·MCP 연결이 적혀 있습니다. Agent가 작업을 받으면 관련 Skill을 선택하고, Harness가 Sandbox·Guardrails 안에서 Tool Use를 실행합니다.

- **AI Agent**: Skills를 로드·적용하는 실행 주체
- **MCP**: Skill이 의존하는 외부 도구·데이터 연결
- **Tool Use**: Skill 절차 안에서 LLM이 함수·API를 호출
- **Prompt**: Skill 지침이 System Prompt·User Prompt와 합쳐짐
- **Harness**: Skill 실행 루프·권한·관측을 담당
- **OpenClaw**: Skills·MCP를 등록·동기화하는 프레임워크

## 참고

- Cursor Docs, "Agent Skills": https://cursor.com/docs/context/skills
- Agent Skills 표준 사이트(Cursor 문서 링크): https://agentskills.io
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills`,

  harness: `### 개요

Harness(Agent Harness)는 **LLM**·**Tool Use** 실행을 **Sandbox**·**Guardrails**·**HITL**·**Observability**로 감싸는 **AI Agent** 실행 계층입니다. 모델 API만 호출하는 것과 달리, "에이전트가 안전하게 일하는 작업장" 전체를 의미합니다.

비유하면, Harness는 공장의 컨veyor belt + 안전망 + CCTV입니다. **MCP**·Skills로 연결된 도구를 쓰되, 위험 행동은 차단하고 사람 승인(**HITL**)을 받으며, 모든 호출을 기록합니다.

에이전트 분야에서는 **하네스 엔지니어링**이 Prompt·Skills·MCP와 함께 자주 언급됩니다. Agent Harness는 LLM API 한 줄이 아니라 모델·도구·지시·안전·관측을 묶는 실행 프레임입니다.

유의사항: Harness ≠ LLM·Agent입니다. Agent는 "무엇을 할지" 결정하고, Harness는 "어떻게 안전하게 실행할지"를 담당합니다. Cursor 문서는 harness를 model + tools + instructions 조합으로 설명합니다.

### 사용목적

LLM API만 호출하면 샌드박스 격리, 위험 Tool Use 승인, RAG·Vector DB 호출 추적이 빠집니다. Harness가 Guardrails·HITL·Observability를 표준 위치에 둡니다.

### 동작/구조

사용자 입력 → Prompt·Memory 조립 → LLM 호출 → Tool Use/MCP/Skills 실행(Sandbox 내부) → Guardrails 검사 → 필요 시 HITL 승인 → Observability에 기록 → 다음 턴으로 반복합니다.

- **AI Agent**: Harness 위에서 목표를 pursuit하는 논리적 시스템
- **LLM**: Harness가 반복 호출하는 추론 코어
- **MCP**: Harness가 연결·권한 관리하는 외부 도구 표준
- **Sandbox**: Harness가 코드·파일 실행을 격리하는 환경
- **Guardrails**: Prompt·Tool Use 전후 정책 검사
- **HITL**: 고위험 Tool Use 전 사람 승인
- **Observability**: Prompt·Tool Use·RAG 호출 추적
- **Tool Use**: Harness 루프의 핵심 행동 단위

## 참고

- Cursor Docs, "Build a coding agent": https://cursor.com/docs/help/getting-started/build-ai-coding-agent
- Cursor Docs, "Cursor SDK"(TypeScript): https://cursor.com/docs — SDK가 "same harness" 제공 (문서 내 SDK 섹션)`,

  openclaw: `### 개요

OpenClaw는 다양한 **Skills**·**MCP** 플러그인을 붙이는 범용 **AI Agent** 프레임워크입니다. Harness·Tool Use·MCP 클라이언트를 처음부터 짜기 부담스러울 때, Skills 디렉터리·MCP 연결·sandbox sync 같은 공통 패턴을 제공합니다.

비유하면, OpenClaw는 "플러그인 꽂으면 바로 도는 Agent 키트"입니다. Agent 설정에 Skills·MCP 서버를 등록하면 런타임이 루프를 돌립니다.

2025년 11월 공개된 오픈소스 자율 에이전트로, Clawdbot→Moltbot→OpenClaw로 이름이 바뀌었습니다. "실제로 일을 수행하는 AI"를 표방하며 파일·브라우저·메신저 연동 등 넓은 권한으로 작업을 실행합니다.

유의사항: OpenClaw와 **NanoClaw**는 대비되는 선택지입니다. OpenClaw는 Skills·MCP 확장에 초점을 두고, NanoClaw는 Sandbox·Guardrails·HITL 격리에 더 무게를 둡니다.

### 사용목적

기존 챗봇이 답변만 돌려주는 것과 달리, OpenClaw는 능동적으로 파일을 읽고 브라우저를 조작·테스트까지 합니다. 다만 권한이 크면 보안·의도치 않은 동작 이슈가 함께 보고됩니다.

직접 Harness·Tool Use·MCP 클라이언트를 모두 짜기 부담스러울 때, OpenClaw가 Skills 디렉터리·MCP 연결·sandbox sync 같은 공통 패턴을 제공합니다.

### 동작/구조

Agent 설정에 Skills·MCP 서버를 등록하고, OpenClaw 런타임이 AI Agent 루프를 돌립니다. Skills 문서의 setupCommand·sandbox sync는 실행 환경을 Skill 요구사항에 맞춥니다.

- **AI Agent**: OpenClaw가 호스팅하는 자율 실행 시스템
- **Skills**: OpenClaw에 등록·동기화하는 업무 확장 모듈
- **MCP**: OpenClaw Agent가 연결하는 외부 도구 표준
- **NanoClaw**: Sandbox·Guardrails·HITL에 더 초점을 둔 경량 Agent 프레임워크(대비 선택지)

## 참고

- GitHub \`openclaw/openclaw\` README: https://github.com/openclaw/openclaw
- OpenClaw Docs: https://docs.openclaw.ai`,

  nanoclaw: `### 개요

NanoClaw는 **Sandbox** 격리·**Guardrails**·**HITL**을 핵심으로 하는 경량 **AI Agent** 프레임워크입니다. Agent가 셸·파일·네트워크에 접근할 때 사고를 줄이려면, 실행을 컨테이너 안에 가두고 사람 승인을 거치는 패턴이 필요합니다.

비유하면, NanoClaw는 "금고 안에서만 일하는 Agent"입니다. 설치 문서는 Docker only supported runtime을 명시하며, **Harness**와 유사한 LLM·Tool Use 루프를 격리 환경에서 돌립니다.

**OpenClaw**가 넓은 권한·메신저 연동에 초점을 둔 반면 NanoClaw는 Docker **Sandbox**·**Guardrails**·**HITL**로 격리 실행에 초점을 둔 대안 프레임워크입니다.

유의사항: NanoClaw ≠ OpenClaw입니다. **OpenClaw**는 Skills·MCP 플러그인 확장에, NanoClaw는 보안·격리 실행에 초점을 둡니다. 둘 다 AI Agent를 호스팅하지만 설계 우선순위가 다릅니다.

### 사용목적

Agent가 셸·파일·네트워크에 접근할 때 사고를 줄이려면 Sandbox 격리와 사람 승인(HITL)이 필요합니다. NanoClaw 설치 문서는 Docker only supported runtime을 명시합니다.

### 동작/구조

AI Agent 루프는 Harness와 유사하게 LLM·Tool Use를 반복하지만, 실행은 Sandbox 컨테이너 안에서만 일어납니다. Guardrails가 Prompt·Tool Use를 검사하고, 고위험 작업은 HITL 체크포인트를 거칩니다.

- **AI Agent**: NanoClaw가 호스팅하는 격리 실행 Agent
- **Sandbox**: NanoClaw의 핵심 실행 격리 환경(Docker)
- **Guardrails**: Agent 행동·Tool Use 제한 정책
- **HITL**: 위험 Tool Use 전 사람 승인
- **OpenClaw**: Skills·MCP 확장에 초점을 둔 대안 Agent 프레임워크

## 참고

- GitHub \`nanocoai/nanoclaw\`: https://github.com/nanocoai/nanoclaw
- NanoClaw 공식 사이트: https://nanoclaw.dev
- NanoClaw 설치 문서: https://docs.nanoclaw.dev/installation`,

  "tool-use": `### 개요

Tool Use(함수 호출·Function Calling)는 **LLM**이 JSON 형태로 함수·API 호출을 선언하고, **Harness**·**MCP**·**Skills**가 실제로 실행하는 기술입니다. 모델 학습 데이터만으로는 실시간 날씨·사내 DB를 알 수 없으므로, 외부 결과를 Prompt에 다시 넣어 **Planning** 다음 단계를 이어갑니다.

비유하면, LLM이 "전화번호부에서 번호를 찾아 전화 걸기"를 하는 것입니다. 모델은 "무엇을 호출할지" JSON으로 말하고, 실행은 바깥 시스템이 담당합니다.

OpenAI CUA·Claude Computer Use·Operator처럼 LLM이 브라우저·OS를 조작하는 사례가 Tool Use의 실전 형태입니다. **MCP**는 이런 도구를 표준 프로토콜로 노출하는 층입니다.

유의사항: Tool Use ≠ MCP입니다. MCP는 도구를 노출하는 프로토콜이고, Tool Use는 LLM 출력 형식·실행 루프입니다. **Streaming** 모드에서는 Token·Tool Use 이벤트가 순차 전송됩니다.

### 사용목적

LLM 학습 데이터만으로는 실시간 날씨·사내 DB·GitHub PR 상태를 알 수 없습니다. Tool Use로 외부 시스템 결과를 Prompt에 다시 넣어 Planning 다음 단계를 이어갑니다.

### 동작/구조

도구 목록과 JSON Schema를 LLM에 제공 → 모델이 tool_calls(또는 동등 필드) 출력 → Harness/MCP/Skills가 실행 → 결과를 messages에 append → LLM이 최종 답변 또는 다음 Tool Use를 생성합니다. Streaming 모드에서는 Token·Tool Use 이벤트가 순차 전송됩니다.

- **LLM**: Tool Use 호출 JSON을 생성하는 주체
- **MCP**: Tool Use 대상 도구를 표준 프로토콜로 노출
- **Skills**: Tool Use 절차를 업무별로 묶은 모듈
- **Harness**: Tool Use 실행·권한·로깅 루프
- **Planning**: Tool Use 전후 단계를 설계하는 추론
- **Streaming**: Tool Use 이벤트를 실시간 전송

## 참고

- Anthropic, "Tool use with Claude": https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Anthropic, "Handle tool calls": https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
- OpenAI, "Function calling": https://developers.openai.com/api/docs/guides/function-calling`,

  sandbox: `### 개요

Sandbox는 **Harness**가 코드·파일·셸 명령을 격리된 환경(컨테이너·VM·제한 프로세스)에서 실행하는 패턴입니다. **Tool Use**로 패키지 설치·파일 삭제를 허용하면 호스트 전체가 위험해지므로, 결과만 밖으로 전달하고 세션 종료 시 환경을 폐기합니다.

비유하면, Sandbox는 "유리벽 실험실"입니다. Agent는 실험실 안에서만 일하고, **Guardrails**가 허용 명령·경로를 추가로 제한합니다. **NanoClaw**는 이 패턴을 프레임워크 기본값으로 둡니다.

IT에서는 "정해진 공간 안에서만 자유롭게 동작"하는 **컴퓨터 보안 샌드박스**를 뜻합니다. 악성 코드·실험 코드가 호스트 OS를 건드리지 못하게 격리하는 개념이 Agent **Harness**의 실행 격리와 맞닿습니다.

유의사항: Sandbox ≠ Guardrails입니다. Sandbox는 실행 공간을 분리하고, Guardrails는 Prompt·Tool Use 내용을 정책으로 검사합니다. 둘 다 Harness·NanoClaw 루프에서 함께 쓰입니다.

### 사용목적

Tool Use로 셸·파일·패키지 설치를 허용하면 위험합니다. Harness는 Sandbox 안에서만 명령을 실행하고, Guardrails로 허용 명령·경로를 제한합니다.

### 동작/구조

Agent 요청 → Harness가 Sandbox(컨테이너·VM·제한된 프로세스) 생성 → Tool Use 결과만 밖으로 전달 → 세션 종료 시 Sandbox 폐기. NanoClaw는 이 패턴을 프레임워크 기본값으로 둡니다.

- **Harness**: Sandbox를 만들고 Tool Use를 그 안에서 실행
- **NanoClaw**: Sandbox 격리를 핵심 설계로 하는 Agent 프레임워크
- **Guardrails**: Sandbox 밖으로 나가는 Prompt·Tool Use를 추가 검사

## 참고

- NanoClaw Docs, "Installation" — Docker only supported runtime: https://docs.nanoclaw.dev/installation
- OpenClaw Docs, "Skills" — sandbox sync·\`setupCommand\`: https://docs.openclaw.ai/tools/skills`,

  guardrails: `### 개요

Guardrails는 **Harness** 루프에서 **Prompt**·**Tool Use** 입·출력을 정책으로 검사하는 안전 장치입니다. LLM은 잘못된 Tool Use·민감 데이터 유출·위험 명령을 생성할 수 있어, 허용 도구·PII 패턴·명령 화이트리스트를 적용합니다.

비유하면, Guardrails는 "출입 통제 + 금지어 필터"입니다. 자동 판단이 어려운 경우 **HITL**로 사람에게 넘깁니다. **NanoClaw**는 Guardrails를 프레임워크 기본 패턴으로 포함합니다.

**인공지능 정렬(Alignment)**은 모델이 유해·편향·환각 출력을 내지 않도록 인간 가치에 맞추는 학습·정책 계층입니다. **Guardrails**는 런타임 **Harness**에서 Prompt·**Tool Use** 입출력을 규칙으로 검사하는 실무 장치에 가깝습니다.

유의사항: Guardrails ≠ HITL입니다. Guardrails는 규칙 기반 자동 검사이고, HITL은 사람이 최종 승인·거부하는 체크포인트입니다. Prompt 설계와 Tool Use 허용 목록이 Guardrails 효과를 좌우합니다.

### 사용목적

LLM은 잘못된 Tool Use·민감 데이터 유출·위험 명령을 생성할 수 있습니다. Harness는 Guardrails로 허용 도구·PII 패턴·명령 화이트리스트를 적용합니다.

### 동작/구조

User Prompt → Guardrails(입력 검사) → LLM → Tool Use 선언 → Guardrails(출력·호출 검사) → 통과 시 Sandbox 실행, 실패 시 차단 또는 HITL 에스컬레이션. NanoClaw는 Guardrails를 프레임워크 기본 패턴으로 포함합니다.

- **Harness**: Guardrails를 루프에 장착하는 실행 계층
- **NanoClaw**: Guardrails·Sandbox·HITL 중심 Agent 프레임워크
- **HITL**: Guardrails만으로 판단 어려운 Tool Use를 사람에게 넘김
- **Prompt**: Guardrails가 검사하는 입력·시스템 지시의 원천
- **Tool Use**: Guardrails가 허용·거부하는 행동 단위

## 참고

- Anthropic, "Building effective agents" — guardrails parallelization 예시: https://www.anthropic.com/engineering/building-effective-agents`,

  planning: `### 개요

Planning은 **LLM**·**AI Agent**가 복잡한 목표를 하위 작업으로 나누고, **Tool Use** 순서를 설계하는 추론 방식입니다. CoT(생각의 연쇄)·ReAct(생각→행동→관찰)처럼 한 번에 처리하지 않고 단계를 밟습니다.

비유하면, Planning은 "여행 일정 짜기"입니다. **Prompt**에 "단계별로 생각하라"는 지시를 넣고, **Orchestration**·**Subagent**로 계획을 여러 Agent에 나눠 실행합니다. **Evaluation**으로 단계·결과 품질을 확인합니다.

복잡한 목표는 한 번에 답하지 않고 단계를 밟습니다. 에이전트 역사 초기에는 AutoGPT(2024)·Microsoft Magentic-One(2024)처럼 목표 분해·연속 실행을 시도한 사례가 등장했습니다. 학술적으로는 ReAct·CoT가 대표 패턴입니다.

유의사항: Planning ≠ Orchestration입니다. Planning은 "무엇을 어떤 순서로 할지" 생각하는 것이고, Orchestration은 여러 Agent·Subagent에 작업을 배분·조율하는 실행 계층입니다.

### 사용목적

복잡한 목표를 Tool Use 한 방에 처리하면 실패율이 높습니다. LLM이 CoT(생각의 연쇄)·ReAct(생각→행동→관찰)로 단계를 나누면 Orchestration·Subagent 분업과 맞물립니다.

### 동작/구조

목표 입력 → LLM이 하위 작업 목록 또는 다음 Tool Use 하나 선택 → 실행 결과 관찰 → Prompt에 반영 → Evaluation으로 품질 확인 → 완료까지 반복. Orchestration은 여러 Subagent에 Planning 결과를 배분합니다.

- **LLM**: Planning 추론을 수행하는 코어
- **AI Agent**: Planning·Tool Use 루프를 돌리는 시스템
- **Tool Use**: Planning 각 단계의 실행 수단
- **Prompt**: Planning 방식·제약을 적는 지시문
- **Orchestration**: 여러 Agent·Subagent에 계획 분배
- **Subagent**: Planning의 특정 하위 목표 전담
- **Evaluation**: Planning·RAG·Agent 출력 품질 측정

## 참고

- Yao et al., "ReAct" (arXiv:2210.03629): https://arxiv.org/abs/2210.03629
- Anthropic, "Building effective agents" — orchestrator-workers, prompt chaining: https://www.anthropic.com/engineering/building-effective-agents`,

  memory: `### 개요

Memory는 **AI Agent**·**LLM**이 **Context Window** 한도를 넘는 맥락을 유지하는 메커니즘입니다. 최근 대화는 창 안에 두고, 긴 히스토리·문서는 **Embeddings**·**Vector DB**·**RAG**로 필요한 조각만 Prompt에 다시 넣습니다.

비유하면, Memory는 "책상(단기) + 서재(장기)"입니다. **Token** 예산 안에서 무엇을 책상에 올릴지 우선순위를 정합니다.

LLM은 **Context Window** 한도 때문에 긴 대화·문서를 한 번에 못 봅니다. **RAG**·**Embeddings**·**Vector DB**는 장기 기억을 외부에 두고 필요한 조각만 다시 **Prompt**에 넣는 Memory 전략입니다.

유의사항: Memory ≠ Context Window입니다. Context Window는 한 번에 볼 수 있는 Token 상한이고, Memory는 그 한도를 넘는 정보를 요약·검색·저장하는 전략 전체입니다.

### 사용목적

Context Window는 Token 한도가 있어 긴 히스토리·대량 문서를 한 번에 넣을 수 없습니다. Memory는 요약·Vector DB·RAG로 필요한 조각만 LLM Prompt에 다시 넣습니다.

### 동작/구조

단기: 최근 messages를 Context Window에 유지. 장기: 대화·문서를 Embeddings로 Vector DB에 저장 → 질의 시 유사 청크 검색(RAG) → LLM Prompt에 주입. Token 예산 안에서 Memory 내용을 우선순위화합니다.

- **LLM**: Memory에서 꺼낸 맥락을 읽는 주체
- **AI Agent**: Memory read/write를 루프에 포함
- **Context Window**: 단기 Memory 용량( Token 상한)
- **Embeddings**: Memory·RAG용 의미 벡터
- **Vector DB**: Embeddings·Memory 청크 저장·검색
- **RAG**: Memory·Vector DB 검색으로 Prompt 보강
- **Token**: Memory에 넣을 수 있는 텍스트 예산 단위

## 참고

- Anthropic, "Building effective agents" — augmented LLM(memory): https://www.anthropic.com/engineering/building-effective-agents
- Lewis et al., RAG (arXiv:2005.11401): https://arxiv.org/abs/2005.11401`,

  hitl: `### 개요

HITL(Human-in-the-Loop)은 **Harness** 루프에서 고위험 **Tool Use** 전 사람 승인·거부를 받는 체크포인트입니다. **Guardrails**만으로는 비즈니스 맥락·예외를 모두 자동 판단하기 어렵습니다.

비유하면, HITL은 "중요 서명 전 최종 확인"입니다. Agent가 Tool Use를 선언하면 Harness·Guardrails가 위험 등급을 판단하고, 필요 시 UI·알림으로 사람에게 넘깁니다.

학습 단계의 **RLHF**는 인간이 답변 순위·점수를 매겨 모델을 정렬하는 방식입니다. 런타임 **HITL**은 **Harness**가 고위험 **Tool Use** 전에 사람 승인을 받는 운영 패턴으로, RLHF와 목적·시점이 다릅니다.

유의사항: HITL ≠ Guardrails입니다. Guardrails는 규칙 자동 검사, HITL은 사람이 맥락을 보고 결정합니다. NanoClaw 등 보안 프레임워크는 HITL을 기본 시나리오로 다룹니다.

### 사용목적

Guardrails만으로는 비즈니스 맥락·예외를 모두 자동 판단하기 어렵습니다. Harness는 HITL 체크포인트에서 Tool Use를 일시 정지하고 승인 후 재개합니다.

### 동작/구조

Agent가 Tool Use 선언 → Harness·Guardrails가 위험 등급 판단 → HITL 필요 시 UI·알림으로 사람에게 전달 → 승인 시 Sandbox에서 실행, 거부 시 취소 또는 대안 Planning. NanoClaw 등 보안 프레임워크는 HITL을 기본 시나리오로 다룹니다.

- **Harness**: HITL 체크포인트를 루프에 삽입
- **Guardrails**: HITL이 필요한 Tool Use를 분류
- **Tool Use**: HITL 승인 대상이 되는 Agent 행동

## 참고

- Anthropic, "Building effective agents" — human feedback at checkpoints: https://www.anthropic.com/engineering/building-effective-agents`,

  rag: `### 개요

RAG(Retrieval-Augmented Generation, 검색증강생성)는 **LLM**이 답하기 전에 외부 지식에서 관련 정보를 찾아 **Prompt**에 넣고 생성하는 패턴입니다. 2020년 Meta(Facebook AI Research) 논문에서 제안되었습니다. LLM만 쓰면 학습 종료 시점(cutoff) 이후 뉴스·사내 wiki·PDF를 모르거나, 아는 척 잘못 답할 수 있습니다.

비유하면, RAG는 "모르는 문제를 백과사전에서 찾아 본 뒤 자기 말로 설명하기" 또는 "시험 전 교과서 해당 페이지를 펼쳐 놓고 답하기"에 가깝습니다. **Embeddings**·**Vector DB**로 의미가 비슷한 청크를 고르고, **Memory**·Context Window 안에 근거를 실어 보냅니다.

유의사항: RAG ≠ Fine-tuning입니다. RAG는 검색으로 런타임에 근거를 넣고, Fine-tuning은 모델 가중치를 바꿉니다. RAG도 환각을 완전히 없애지는 못합니다—검색 결과를 무시하거나 빈틈을 지어낼 수 있습니다. 검색 품질이 나쁘면(GIGO) 답도 나빠집니다.

### 사용목적

LLM의 cutoff·사전 학습 범위 밖 정보를 다루려는 목적입니다. 매번 모델을 재학습하는 것은 비용이 크고, 초기 "검색 Tool"만 붙이는 방식은 키워드가 단순해 관련 문서를 못 찾는 경우가 많았습니다. RAG는 질문 분석 → 검색 → 순위화 → 생성을 파이프라인으로 묶어, 사내 문서·최신 공지·전문 DB처럼 **학습 데이터에 없던 지식**을 답에 반영합니다. 출처 링크를 함께 보여 주면 사용자가 직접 검증할 수도 있습니다.

### 동작/구조

전형적인 흐름은 네 단계입니다.

1. **인덱싱(사전 준비)**: 문서를 청크로 나누고 **Embeddings**로 벡터화해 **Vector DB**에 저장합니다. 청크 크기(대략 수백 토큰)가 너무 작으면 문맥이 끊기고, 너무 크면 관련 없는 내용이 섞입니다.
2. **검색(Retrieval)**: 질문도 Embeddings로 바꾼 뒤, 코사인 유사도 등으로 가까운 청크 top-k를 찾습니다. 키워드 검색과 달리 "자동차 고장"과 "차량 수리"처럼 표현이 달라도 의미가 가까우면 매칭됩니다.
3. **순위화(Ranking)**: 후보가 많으면 상위 몇 개만 고릅니다. 재순위(ReRank) 모델을 쓰기도 합니다.
4. **생성(Generation)**: 선별한 청크를 **Prompt**에 넣고 **LLM**을 호출합니다. 단순 복사가 아니라 질문 의도에 맞게 재구성하는 단계입니다.

Agent **Memory**·Evaluation·Observability와 연동하면 어떤 청크가 답에 쓰였는지 추적할 수 있습니다.

- **LLM**: RAG로 보강된 Prompt를 받아 생성
- **Embeddings**: RAG 검색용 의미 벡터
- **Vector DB**: RAG 청크·Embeddings 저장소
- **Prompt**: 검색 결과가 들어가는 지시·컨텍스트
- **Memory**: RAG·Vector DB를 Agent 장기 맥락에 활용

## 참고

- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (arXiv:2005.11401): https://arxiv.org/abs/2005.11401
- Meta AI Research publication page: https://ai.meta.com/research/publications/retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks/`,

  prompt: `### 개요

Prompt는 **LLM**·**AI Agent**에 전달하는 지시·질문·컨텍스트 묶음입니다. System Prompt(역할·규칙) + User Prompt(질문) + **RAG** 검색 결과 + Tool 정의가 messages로 합쳐집니다.

비유하면, Prompt는 "배우에게 주는 대본 + 무대 설정"입니다. 같은 LLM이라도 Prompt에 따라 **Tool Use** 여부·톤·**Planning** 깊이가 달라지고, **Skills**·**Guardrails** 정책이 Prompt 계층에 쌓입니다.

잘 쓴 Prompt가 출력 품질을 크게 좌우합니다. 이를 체계적으로 다루는 분야를 **프롬프트 엔지니어링**이라 부르며, In-Context Learning 때문에 예시·맥락 배치가 결과에 큰 영향을 줍니다.

유의사항: Prompt ≠ Skills입니다. Skills는 재사용 가능한 업무 절차 모듈이고, Skill 지침이 Prompt에 병합되어 LLM에 전달됩니다. Guardrails는 Prompt 입·출력을 검사합니다.

### 사용목적

같은 LLM이라도 Prompt에 따라 Tool Use 여부·톤·RAG 인용 방식·Planning 깊이가 달라집니다. Skills·System Prompt·Guardrails 정책이 Prompt 계층에 쌓입니다.

### 동작/구조

System Prompt(역할·규칙) + User Prompt(질문) + RAG 검색 결과 + Tool 정의가 messages로 LLM에 전달됩니다. Planning은 Prompt에 "단계별로 생각하라"는 지시로 유도되고, Guardrails는 Prompt 입·출력을 검사합니다.

- **LLM**: Prompt를 읽고 Token을 생성
- **AI Agent**: Prompt·Memory·Tool 결과를 누적해 루프
- **Guardrails**: Prompt 내용·Tool Use 출력 검사
- **RAG**: Prompt에 검색 근거 청크 삽입
- **Planning**: Prompt 지시로 추론·단계 분해 유도
- **Skills**: Skill 지침이 Prompt에 병합

## 참고

- Anthropic, "Building effective agents" — Appendix 2 Prompt engineering your tools: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic API primer — messages·tool use: https://platform.claude.com/docs/en/claude_api_primer`,

  "context-window": `### 개요

Context Window는 **LLM**이 한 번의 호출에서 처리할 수 있는 **Token** 총량의 상한입니다. messages·Tool 정의·**RAG** 청크·**Memory** 요약이 모두 Token으로 환산되어 이 범위를 채웁니다.

비유하면, Context Window는 "한 장에 쓸 수 있는 원고지 매수"입니다. 한도를 넘기면 API 오류 또는 앞부분 잘림이 발생하므로, Memory·RAG로 필요한 조각만 넣어야 **AI Agent**가 안정적으로 동작합니다.

모델이 한 번에 처리하는 입력·출력 길이는 성능·비용의 핵심 제약입니다. **Token**으로 환산된 상한을 넘으면 잘림·오류가 나므로 **Memory**·**RAG**로 필요한 부분만 채웁니다.

유의사항: Context Window ≠ Memory입니다. Context Window는 즉시 LLM이 보는 Token 상한이고, Memory는 그 밖의 맥락을 저장·검색해 다시 창에 넣는 전략입니다.

### 사용목적

한도를 넘기면 API 오류 또는 앞부분 잘림이 발생합니다. Memory·RAG로 필요한 조각만 넣고, Token 예산을 관리해야 AI Agent가 안정적으로 동작합니다.

### 동작/구조

messages·Tool 정의·RAG 청크가 모두 Token으로 환산되어 Context Window를 채웁니다. LLM은 이 범위 안에서만 Attention하며, 초과분은 잘라내거나 요약 Memory로 옮깁니다.

- **LLM**: Context Window 한도가 정해진 처리 주체
- **Memory**: Context Window를 넘는 맥락을 외부·Vector DB에 보관
- **Token**: Context Window를 채우는 최소 단위
- **RAG**: Context Window 안에 넣을 관련 청크만 선별

## 참고

- OpenAI Embeddings guide — 모델별 max input(예: 8192 tokens): https://platform.openai.com/docs/guides/embeddings
- Anthropic tool use docs — 입력 토큰·tools 파라미터 과금: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview`,

  token: `### 개요

Token은 **LLM**이 텍스트를 처리·과금하는 최소 단위입니다. 입력 문자열은 Tokenizer로 Token ID 시퀀스로 바뀌고, **Context Window** 크기·API 요금·**Memory**에 넣을 수 있는 텍스트량을 Token으로 계산합니다.

비유하면, Token은 "LLM이 읽는 글자 조각"입니다. 영어는 대략 4글자당 1 Token, 한국어는 더 많이 쓰이는 편입니다. Tool Use JSON·RAG 청크·대화 히스토리 모두 Token을 소비합니다.

LLM은 텍스트를 **토큰화**해 처리하며, 멀티모달 LLM은 이미지·오디오 등도 토큰 단위로 학습합니다. **Context Window**·API 과금·**Streaming** 청크 모두 Token 기준입니다.

유의사항: Token ≠ 글자 수입니다. 같은 문장도 Tokenizer·언어에 따라 Token 수가 다릅니다. **Streaming**은 생성 Token을 순차 전송해 체감 지연을 줄입니다.

### 사용목적

Context Window 크기·API 요금·Memory에 넣을 수 있는 텍스트량을 Token으로 계산합니다. Streaming은 생성 Token을 순차 전송해 체감 지연을 줄입니다.

### 동작/구조

입력 문자열 → Tokenizer → Token ID 시퀀스 → LLM 처리 → 출력 Token 생성. Tool Use JSON·RAG 청크·대화 히스토리 모두 Token을 소비하며 Memory 요약은 Token 예산을 아끼는 기법입니다.

- **LLM**: Token 시퀀스를 입력·출력
- **Context Window**: 수용 가능한 Token 총량
- **Streaming**: 출력 Token을 실시간 전달
- **Memory**: Token 한도를 넘는 정보를 외부 저장

## 참고

- OpenAI, "Vector embeddings" FAQ — tiktoken, cl100k_base: https://platform.openai.com/docs/guides/embeddings`,

  embeddings: `### 개요

Embeddings는 텍스트를 고정 차원의 숫자 벡터로 바꾼 **의미 표현**입니다. **RAG**·**Memory**에서 **Vector DB**에 저장하고, 질의와 의미가 가까운 청크를 찾아 **LLM** Prompt에 넣습니다.

비유하면, Embeddings는 "단어를 지도 좌표로 옮기기"입니다. 키워드가 달라도 의미가 비슷하면 벡터 거리가 가깝습니다. cosine similarity 등으로 nearest neighbor 검색을 합니다.

단어·문장을 고차원 **벡터**로 바꿔 의미 거리를 계산합니다. 아스키·일대일 매핑만으로는 맥락·동의어를 잡기 어렵고, Word2vec·CLIP처럼 속성을 벡터에 실으면 검색·분류가 쉬워집니다.

유의사항: Embeddings ≠ LLM 출력입니다. Embedding 모델(종종 LLM 벤더 API)은 검색용 벡터만 만들고, 최종 답변 생성은 별도 LLM 호출에서 일어납니다.

### 사용목적

키워드 검색만으로는 동의어·패러프레이즈를 놓치기 쉽습니다. Embeddings로 Vector DB에 저장하면 RAG·Memory에서 질의와 유사한 청크를 LLM Prompt에 넣을 수 있습니다.

### 동작/구조

텍스트 → Embedding 모델(종종 LLM 벤더 API) → 고정 차원 벡터 → Vector DB 인덱스. 질의도 Embeddings 후 cosine similarity 등으로 nearest neighbor 검색 → RAG가 LLM에 전달.

- **RAG**: Embeddings 유사도로 관련 문서 검색
- **Vector DB**: Embeddings·메타데이터 저장·검색
- **Memory**: 장기 맥락 청크를 Embeddings로 보관
- **LLM**: Embeddings로 찾은 텍스트를 Prompt로 읽음

## 참고

- OpenAI, "Vector embeddings": https://platform.openai.com/docs/guides/embeddings`,

  "vector-db": `### 개요

Vector DB는 **Embeddings** 벡터와 메타데이터를 저장하고, 유사도 검색(ANN 인덱스)을 제공하는 데이터베이스입니다. **RAG**·**Memory**는 수천~수백만 청크에서 의미적으로 가까운 항목을 빠르게 찾을 때 Vector DB를 씁니다.

비유하면, Vector DB는 "의미 지도 색인"입니다. 일반 RDBMS LIKE 검색과 달리 패러프레이즈·동의어도 잡을 수 있습니다. **Observability**로 쿼리·히트율·지연을 추적합니다.

**RAG** 파이프라인에서 수백만 청크의 **Embeddings**를 빠르게 찾기 위한 저장소입니다. FAISS·Pinecone·Weaviate 같은 전문 시스템으로 밀리초 단위 유사 검색을 수행합니다.

유의사항: Vector DB ≠ Embeddings 모델입니다. Embeddings는 벡터를 만드는 단계이고, Vector DB는 그 벡터를 저장·검색하는 저장소입니다.

### 사용목적

RAG·Agent Memory는 수천~수백만 청크에서 유사 Embeddings를 찾아야 합니다. 일반 RDBMS LIKE 검색으로는 의미 검색·규모가 부족해 Vector DB·ANN 인덱스가 필요합니다.

### 동작/구조

문서 청크 Embeddings upsert → 메타데이터(출처·날짜) 저장 → 질의 Embeddings → top-k retrieval → RAG Prompt 또는 Memory read → LLM. Harness Observability는 쿼리·히트율·지연을 기록합니다.

- **RAG**: Vector DB 검색 결과로 LLM Prompt 보강
- **Embeddings**: Vector DB에 저장되는 벡터
- **Memory**: Vector DB를 Agent 장기 저장소로 사용
- **Observability**: Vector DB 쿼리·RAG 품질 추적

## 참고

- OpenAI, "Vector embeddings" FAQ — vector database 권장: https://platform.openai.com/docs/guides/embeddings
- Lewis et al., RAG — dense vector index: https://arxiv.org/abs/2005.11401`,

  "fine-tuning": `### 개요

Fine-tuning은 **LLM** 가중치를 특정 도메인·스타일·**Tool Use** JSON 형식에 맞게 추가 학습하는 과정입니다. 긴 **Prompt**·**RAG**만으로 브랜드 톤·특수 분류가 불안정할 때 고려합니다.

비유하면, Fine-tuning은 "이미 대학 나온 사람에게 회사 업무 교육"입니다. 예시 데이터(입력 Prompt → 기대 출력)로 모델 행동을 조정하고, **Evaluation**으로 전후 **AI Agent**·**Planning** 품질을 비교합니다.

LLM 학습 절차에서 사전학습 다음 단계가 **지도학습 미세조정(SFT)** 입니다. 도메인 데이터로 가중치를 조정해 스타일·형식·분류를 맞추며, **RLHF**는 그다음 정렬 단계로 자주 이어집니다.

유의사항: Fine-tuning ≠ RAG입니다. Fine-tuning은 모델 자체를 바꾸고, RAG는 검색으로 런타임 컨텍스트를 넣습니다. Prompt는 Fine-tuning과 complementary한 런타임 지시로 남습니다.

### 사용목적

긴 Prompt·RAG만으로 Tool Use JSON 형식·브랜드 톤·특수 분류가 불안정할 때 Fine-tuning을 고려합니다. Evaluation으로 Fine-tuning 전후 Agent·Planning 품질을 비교합니다.

### 동작/구조

예시 데이터(입력 Prompt → 기대 출력, Tool Use 포함 가능) 수집 → 벤더 Fine-tuning job → 새 모델 ID → AI Agent·Harness에서 해당 LLM으로 교체 → Evaluation·Observability로 회귀 확인.

- **LLM**: Fine-tuning 대상 모델
- **Prompt**: Fine-tuning과 complementary인 런타임 지시
- **Evaluation**: Fine-tuning 효과·회귀 측정
- **Tool Use**: Fine-tuning 예시에 함수 호출 형식 포함 가능

## 참고

- OpenAI fine-tuning 문서(벤더별): https://platform.openai.com/docs/guides/fine-tuning`,

  orchestration: `### 개요

Orchestration은 여러 **AI Agent**·**Subagent**의 작업을 조율·분배·결과를 집계하는 실행 패턴입니다. 하나의 **LLM** **Context Window**로 대형 프로젝트 전체를 처리하기 어려울 때, **Planning** 결과를 역할별 Subagent에 나눕니다.

비유하면, Orchestration은 "프로젝트 매니저"입니다. 상위 Agent(orchestrator)가 목표를 분해하고, 각 **Harness**에서 Tool Use를 실행한 뒤 **Observability**·Evaluation으로 품질을 확인합니다.

여러 **AI Agent**·**Subagent**의 작업 순서·병렬 실행을 조율합니다. Microsoft Magentic-One·**AutoGPT**처럼 복잡 워크플로를 자동화하는 연속 에이전트가 대표 사례입니다.

유의사항: Orchestration ≠ Planning입니다. Planning은 작업 순서를 설계하고, Orchestration은 여러 Agent·Subagent에 그 계획을 배분·병렬 실행·결과 수집합니다.

### 사용목적

하나의 AI Agent·LLM Context Window로 대형 프로젝트 전체를 처리하기 어렵습니다. Orchestration이 Planning 결과를 역할별 Subagent에 배분하고 Harness 실행을 순서화합니다.

### 동작/구조

상위 Agent( orchestrator)가 목표 분해(Planning) → Subagent별 작업 큐 → 각 Harness에서 Tool Use 실행 → 결과 집계 → Observability·Evaluation으로 품질 확인 → 재시도 또는 완료.

- **AI Agent**: Orchestration이 조율하는 실행 단위
- **Subagent**: Orchestration 아래 전문 하위 Agent
- **Planning**: Orchestration이 분배할 작업 계획 생성
- **Harness**: 각 Agent·Subagent의 실행·안전 래퍼
- **Observability**: 멀티 Agent trace·병목 추적

## 참고

- Anthropic, "Building effective agents" — orchestrator-workers workflow: https://www.anthropic.com/engineering/building-effective-agents`,

  subagent: `### 개요

Subagent는 **Orchestration** 아래 특정 하위 목표를 전담하는 **AI Agent** 인스턴스입니다. 하나의 **LLM** Prompt에 모든 **Skills**·**Tool Use**를 넣으면 Context Window·품질이 나빠져, **Planning**·**Harness**를 Subagent별로 분리합니다.

비유하면, Subagent는 "팀원 전문가"입니다. 상위 Orchestration Agent가 Subagent를 spawn하고, 각자 Prompt·Skills·Memory slice로 **Harness** Sandbox에서 실행한 뒤 결과를 orchestrator에 반환합니다.

상위 **Orchestration** Agent가 spawn하는 전문 하위 **AI Agent**입니다. 코딩·리서치·브라우저 조작 등 역할별 에이전트 분화가 현실적인 상용화 경로로 여겨집니다.

유의사항: Subagent ≠ 별도 제품입니다. Subagent도 Agent의 한 종류이며, Orchestration이 생성·배분·결과를 수집합니다. LLM은 Subagent마다 동일 또는 다른 모델을 쓸 수 있습니다.

### 사용목적

하나의 LLM Prompt에 모든 Skill·Tool Use를 넣으면 Context Window·품질이 나빠집니다. Orchestration이 Subagent별 Planning·Harness를 분리해 병렬·전문화합니다.

### 동작/구조

상위 Orchestration Agent가 Subagent spawn → 각 Subagent는 자신의 Prompt·Skills·Tool Use·Memory slice → Harness Sandbox에서 실행 → 결과를 orchestrator LLM Prompt에 반환 → 통합 답변.

- **AI Agent**: Subagent도 Agent의 한 종류(하위 전문 인스턴스)
- **Orchestration**: Subagent 생성·작업 배분·결과 수집
- **Planning**: Subagent별 하위 계획
- **Harness**: Subagent 실행 루프·권한
- **LLM**: 각 Subagent의 추론 코어(동일 또는 다른 모델)

## 참고

- Cursor Docs, "Agent Skills" 및 SDK 관련 문서 — Subagents: https://cursor.com/docs/context/skills
- Cursor help, "Build a coding agent" — SDK harness·subagents 언급: https://cursor.com/docs/help/getting-started/build-ai-coding-agent`,

  streaming: `### 개요

Streaming은 **LLM** API가 출력 **Token**·중간 **Tool Use** 이벤트를 생성과 동시에 순차 전송하는 방식입니다. 전체 생성이 끝날 때까지 수십 초 blank UI를 보여 주는 대신, **AI Agent**가 "일하고 있다"는 피드백을 줄 수 있습니다.

비유하면, Streaming은 "라이브 중계"입니다. 클라이언트가 stream=true(또는 동등 옵션)로 호출하면 delta Token이 SSE/WebSocket으로 전달되고, Harness가 완료 후 최종 messages를 확정합니다.

전체 응답을 기다리지 않고 생성 **Token**·중간 이벤트를 순차 전송합니다. 대화형 서비스(**ChatGPT** 등)에서 체감 지연을 줄이며, **Tool Use** 호출 chunk도 스트림으로 노출될 수 있습니다.

유의사항: Streaming ≠ Tool Use입니다. Streaming은 전송 방식이고, Tool Use는 LLM이 함수 호출 JSON을 내는 행위입니다. 다만 Streaming 모드에서 tool call 이벤트도 chunk로 노출될 수 있습니다.

### 사용목적

전체 Tool Use·생성이 끝날 때까지 수십 초 blank UI는 체감 품질이 나쁩니다. Streaming으로 Token·중간 Tool Use 이벤트를 보내면 AI Agent가 "일하고 있다"는 피드백을 줄 수 있습니다.

### 동작/구조

클라이언트가 stream=true(또는 동등 옵션)로 LLM API 호출 → 서버가 delta Token SSE/WebSocket 전송 → Tool Use chunk도 이벤트로 전달 → Harness가 완료 후 최종 messages 확정.

- **LLM**: Streaming Token 생성 주체
- **Token**: Streaming의 전송 단위
- **Tool Use**: Streaming tool call 이벤트로 노출 가능
- **AI Agent**: Streaming UX를 제공하는 대화·실행 시스템

## 참고

- Anthropic API primer — streaming 언급: https://platform.claude.com/docs/en/claude_api_primer
- OpenAI function calling guide — streaming tool call 이벤트: https://developers.openai.com/api/docs/guides/function-calling`,

  observability: `### 개요

Observability는 **Harness**·**AI Agent** 실행을 추적·기록·분석하는 관측 체계입니다. LLM 호출·**Tool Use**·**RAG** query·**Vector DB** latency를 span으로 남겨, non-deterministic한 Agent 실패 원인을 찾습니다.

비유하면, Observability는 "블랙박스 + 대시보드"입니다. **Planning**·**Subagent**·RAG가 겹치면 디버깅이 어려워 **Evaluation** 데이터셋과 trace를 연결해 회귀를 감지합니다.

non-deterministic한 **AI Agent**는 **Planning**·**RAG**·멀티 **Subagent**가 겹치면 실패 원인 추적이 어렵습니다. **인공지능 벤치마크**가 모델 품질을 수치화한다면, Observability는 실행 trace·비용·지연을 기록하는 운영 층입니다.

유의사항: Observability ≠ Evaluation입니다. Observability는 실행 중 무슨 일이 일어났는지 기록하고, Evaluation은 품질을 점수·통과율로 측정합니다. 둘을 함께 쓰면 실패 run을 재현하기 쉽습니다.

### 사용목적

Agent는 non-deterministic하고 Planning·Subagent·RAG가 겹치면 실패 원인 추적이 어렵습니다. Harness Observability와 Evaluation이 품질·비용·Vector DB hit률을 모니터링합니다.

### 동작/구조

Harness가 각 LLM 호출·Tool Use·RAG query·Vector DB latency를 span으로 기록 → 대시보드·알림 → Evaluation 데이터셋과 연결해 회귀 감지. Cursor hooks.json은 특정 Agent 이벤트에 스크립트를 거는 확장점입니다.

- **Harness**: Observability 계측을 삽입하는 실행 계층
- **AI Agent**: Observability 대상 시스템
- **RAG**: 검색·Prompt 주입 단계 trace
- **Evaluation**: Observability 로그 기반 품질 측정
- **Vector DB**: RAG·Memory 쿼리 지표 수집

## 참고

- Cursor 제품 문서 — Hooks(공식 SDK·문서 내 hooks.json): https://cursor.com/docs/context/skills (Hooks 교차 링크)
- Anthropic, "Building effective agents" — 테스트·sandbox 권고: https://www.anthropic.com/engineering/building-effective-agents`,

  evaluation: `### 개요

Evaluation은 **AI Agent**·**Planning**·**RAG**·**Prompt** 변경의 품질을 데이터셋과 점수로 측정하는 과정입니다. non-deterministic한 Agent는 Prompt·**Fine-tuning** 수정만으로도 예상치 못한 회귀를 일으킵니다.

비유하면, Evaluation은 "시험지 + 채점"입니다. 골든 QA·Tool Use 시나리오를 정의하고 Harness로 Agent를 실행한 뒤, LLM-as-judge 또는 규칙 채점으로 품질을 수치화합니다.

**인공지능 벤치마크**는 MMLU·HumanEval 등 표준 데이터셋으로 모델·**AI Agent**·**RAG** 품질을 객관 비교합니다. 벤치 점수만으로 실사용 품질이 보장되지는 않지만, Prompt·**Fine-tuning** 변경의 회귀를 잡는 데 필수입니다.

유의사항: Evaluation ≠ Observability입니다. Evaluation은 "좋은가?"를 점수로 묻고, **Observability**는 "무슨 일이 일어났는가?"를 trace로 기록합니다. Fine-tuning 전후 비교·CI 회귀 게이트에 Evaluation을 씁니다.

### 사용목적

Prompt·RAG·Fine-tuning·Planning 변경은 예상치 못한 회귀를 일으킵니다. Evaluation 데이터셋과 Observability trace로 AI Agent 품질을 수치화합니다.

### 동작/구조

골든 QA·Tool Use 시나리오 정의 → Harness로 Agent 실행 → LLM-as-judge 또는 규칙 채점 → Planning·RAG 근거 포함 여부 확인 → Fine-tuning·Prompt 수정 전후 비교 → CI 회귀 게이트.

- **AI Agent**: Evaluation 대상
- **Planning**: Evaluation 시나계·Tool 순서 검증
- **RAG**: 인용·근거 정확도 Evaluation
- **Observability**: Evaluation 실패 run 재현
- **Fine-tuning**: Evaluation으로 효과 검증
- **Prompt**: Evaluation 입력·기대 출력 정의

## 참고

- Anthropic, "Building effective agents" — evaluator-optimizer, automated evals: https://www.anthropic.com/engineering/building-effective-agents`,

  "aws-bedrock": `### 개요

AWS Bedrock(Amazon Bedrock)은 AWS에서 **LLM** 등 Foundation Model(FM)을 서버리스 API로 호출하고, 생성형 AI 애플리케이션·**AI Agent**를 구축하는 완전관리형 서비스입니다. Anthropic Claude, Amazon Nova, OpenAI 등 여러 제공사 모델을 단일 콘솔·API에서 선택할 수 있습니다.

비유하면, Bedrock은 "여러 AI 모델을 꽂아 쓰는 AWS 전용 멀티탭 콘센트"입니다. 직접 GPU 클러스터를 운영하지 않고 **Converse**·**InvokeModel**로 추론하고, **Tool Use**·**Guardrails**·**Fine-tuning**·**AWS Knowledge Base** 같은 부가 기능을 같은 플랫폼에서 붙입니다.

유의사항: Bedrock ≠ **LLM**입니다. Bedrock은 모델 호스팅·라우팅·권한·과금을 담당하는 클라우드 서비스이고, 그 안에서 특정 FM을 골라 호출합니다. **MCP**·**Harness** 같은 자체 에이전트 프레임워크와는 별개이며, Bedrock Agents·Knowledge Bases는 AWS가 제공하는 관리형 에이전트·**RAG** 구성요소입니다.

### 사용목적

온프레미스나 자체 API 키 관리 없이 엔터프라이즈 IAM·VPC·감사 로그와 함께 FM을 쓰려는 목적입니다. 챗봇·코드 보조·문서 Q&A·에이전트 프로토타입을 빠르게 올리고, 모델 교체·리전·비용을 AWS 콘솔에서 통제할 때 Bedrock을 선택합니다.

### 동작/구조

애플리케이션은 \`bedrock-runtime\` 클라이언트로 FM에 추론 요청을 보냅니다. 대표 API는 **Converse**(대화형 통합 API), **InvokeModel**(모델별 JSON body), OpenAI 호환 **Chat Completions**·**Responses** 등입니다. **Streaming** 응답도 지원합니다.

Bedrock 위에 올라가는 관련 구성요소:

- **Agents** — **Tool Use**·액션 그룹·**AWS Knowledge Base** 연결로 자율 워크플로
- **Knowledge Bases** — **RAG** 파이프라인(인덱싱·검색·생성)
- **Guardrails** — 입·출력 안전 정책(**Guardrails** 용어와 유사)
- **Custom model import / Fine-tuning** — 도메인 맞춤 모델

- **LLM**: Bedrock이 API로 제공하는 Foundation Model 코어
- **RAG**: **AWS Knowledge Base**를 통해 Bedrock에서 구현
- **AWS Knowledge Base**: Bedrock의 관리형 RAG 구성요소
- **Tool Use**: Bedrock Agents·Converse toolConfig로 함수 호출
- **AI Agent**: Bedrock Agents 또는 앱에서 Converse+도구 루프로 구현
- **Guardrails**: Bedrock Guardrails 정책 계층
- **Streaming**: Converse·InvokeModel 스트리밍 출력
- **Embeddings**: Amazon Titan 등 임베딩 모델 API
- **Fine-tuning**: Bedrock에서 모델 커스터마이징 옵션

## 참고

- Amazon Bedrock 개요: https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
- Converse API: https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html
- InvokeModel API: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html`,

  "aws-knowledge-base": `### 개요

AWS Knowledge Base(Amazon Bedrock Knowledge Bases)는 **AWS Bedrock** 위에서 기업 데이터를 **RAG**(Retrieval-Augmented Generation)로 연결하는 관리형 지식베이스 서비스입니다. S3·SharePoint·Confluence 등 데이터 소스를 연결하면 청킹·**Embeddings**·**Vector DB** 인덱싱·검색을 AWS가 처리합니다.

비유하면, Knowledge Base는 "사내 문서 창고 + 자동 색인 + 질문하면 관련 페이지를 꺼내 주는 사서"입니다. 앱은 \`bedrock-agent-runtime\`의 **Retrieve** 또는 **RetrieveAndGenerate**로 검색·생성을 한 번에 호출할 수 있습니다.

Managed Knowledge Base는 인프라를 직접 다루지 않고 빠르게 시작할 수 있고, Self-managed Knowledge Base는 OpenSearch Serverless·Aurora·Neptune 등 **Vector DB**를 직접 고르는 방식입니다.

유의사항: Knowledge Base ≠ 일반 **Vector DB**입니다. Vector DB는 벡터 저장·검색 엔진이고, Knowledge Base는 데이터 소스 연결·파싱·임베딩·검색·(선택) 재순위·**LLM** 생성까지 **RAG** 워크플로를 묶은 Bedrock 서비스입니다. **Fine-tuning**으로 모델 가중치를 바꾸는 것과도 다릅니다.

### 사용목적

**LLM** 학습 cutoff 밖의 사내 문서·위키·PDF로 답변 품질을 올리려는 목적입니다. 직접 청킹·임베딩 파이프라인·벡터 스토어를 짜기 부담스러울 때, Bedrock Knowledge Base가 인덱싱·런타임 검색 API를 제공합니다. 출처 인용(citation)이 포함된 **RetrieveAndGenerate**로 근거 있는 답변을 만들 수 있습니다.

### 동작/구조

**설정(인덱싱) 단계**

1. 데이터 소스(S3 등) 연결
2. 문서 파싱·청킹
3. **Embeddings** 모델로 벡터화
4. **Vector DB**(관리형 또는 Self-managed)에 인덱스 저장

**런타임(RAG) 단계**

1. 사용자 질의를 임베딩
2. 벡터 유사도로 관련 청크 **Retrieve**
3. (선택) 재순위(ReRank) 모델 적용
4. 청크를 **Prompt**에 넣고 **LLM** 호출 — **RetrieveAndGenerate**는 2~4를 한 API로 수행

구조화 데이터 소스는 **GenerateQuery**로 자연어 질의를 DB 쿼리 형태로 바꿀 수 있습니다. **AI Agent**·Bedrock Agents와 연동하면 에이전트가 Knowledge Base를 검색 도구로 사용합니다.

- **RAG**: Knowledge Base가 구현하는 핵심 패턴
- **AWS Bedrock**: Knowledge Base가 속한 FM·에이전트 플랫폼
- **LLM**: RetrieveAndGenerate가 호출하는 생성 모델
- **Embeddings**: 질의·문서 벡터화
- **Vector DB**: 청크·벡터 저장소(서비스가 관리 또는 고객 지정)
- **Prompt**: 검색 청크가 합쳐지는 컨텍스트
- **Memory**: 장기 맥락·세션과 함께 쓰는 외부 지식 저장소
- **AI Agent**: Knowledge Base를 도구로 호출하는 실행 주체

## 참고

- Knowledge Bases 개요: https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html
- 동작 방식: https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-it-works.html
- Retrieve / RetrieveAndGenerate: https://docs.aws.amazon.com/bedrock/latest/userguide/kb-how-retrieval.html`,

};
