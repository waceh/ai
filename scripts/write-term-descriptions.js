#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const termsDir = path.join(root, "content", "terms");

const terms = {
  llm: `## 개요

LLM(Large Language Model)은 대규모 텍스트로 학습한 언어 모델로, 자연어 이해·생성 작업의 핵심 엔진입니다. Anthropic 공식 글에서는 에이전트 시스템의 기본 구성 요소를 retrieval, tools, memory로 보강한 "augmented LLM"으로 설명합니다.

## 세부 내용

단독 LLM 호출만으로는 외부 시스템과 상호작용하지 않습니다. AI Agent는 LLM을 중심에 두고 Planning·Tool Use·RAG·Memory를 결합합니다. Token과 Context Window는 한 번에 넣을 수 있는 입력·출력 예산을 정의합니다. 도메인 적응이 필요하면 Fine-tuning을 검토할 수 있습니다.

## 검증 근거

- Anthropic, "Building effective agents" — augmented LLM, workflows vs agents: https://www.anthropic.com/engineering/building-effective-agents`,

  agent: `## 개요

AI Agent는 LLM이 도구 사용과 환경 피드백을 반복하며 작업을 수행하는 에이전트 시스템을 가리킵니다. Anthropic은 "workflows"(코드로 정해진 경로)와 "agents"(LLM이 프로세스·Tool Use를 동적으로 결정)를 구분합니다.

## 세부 내용

복잡한 작업에서는 Planning으로 하위 단계를 나누고, Tool Use·MCP·Skills로 외부 행동을 실행합니다. Harness가 런타임 루프·권한·컨텍스트를 감싸며, Memory로 세션 맥락을 유지합니다. Orchestration·Subagent 패턴으로 역할을 분리할 수 있고, OpenClaw·NanoClaw는 각각 자체 문서에 정의된 오픈소스 에이전트 프레임워크입니다.

## 검증 근거

- Anthropic, "Building effective agents" — agents 정의·autonomous agent 루프: https://www.anthropic.com/engineering/building-effective-agents
- Cursor Docs, "Build a coding agent" — harness = model + tools + instructions: https://cursor.com/docs/help/getting-started/build-ai-coding-agent`,

  mcp: `## 개요

MCP(Model Context Protocol)는 LLM 애플리케이션과 외부 데이터·도구를 연결하기 위한 오픈 프로토콜입니다. 공식 사양은 JSON-RPC 기반 메시지 형식과 서버·클라이언트 역할을 정의합니다.

## 세부 내용

공식 사양(2025-06-18)은 서버 기능으로 Prompts, Resources, Tools를 나열합니다. AI Agent·IDE 클라이언트가 MCP 서버(데이터베이스, 검색, 파일 등)에 연결해 컨텍스트를 주고받으며, Tool Use·Skills 구현의 통합 레이어로 쓰입니다. Harness는 MCP 세션·권한을 애플리케이션 쪽에서 관리합니다. OpenClaw 문서에도 MCP 연동이 언급됩니다.

## 검증 근거

- MCP 공식 사양: https://modelcontextprotocol.io/specification/2025-06-18
- MCP 소개: https://modelcontextprotocol.io/docs/getting-started/intro
- Anthropic 발표: https://www.anthropic.com/news/model-context-protocol`,

  skills: `## 개요

Skills는 에이전트에게 특정 업무 절차·도메인 지식을 알려 주는 파일 기반 확장입니다. Cursor 공식 문서는 Agent Skills를 "open standard"로 설명하며, OpenClaw는 \`SKILL.md\` 형식의 스킬 디렉터리를 로드합니다.

## 세부 내용

Cursor는 \`.cursor/skills/\`, \`.agents/skills/\` 등에서 \`SKILL.md\`(YAML frontmatter + 본문)를 자동 발견합니다. OpenClaw는 workspace·managed·bundled 경로 우선순위로 스킬을 로드하고, ClawHub 레지스트리에서 설치할 수 있습니다(documented CLI: \`openclaw skills install\`). AI Agent가 Skills를 선택해 Tool Use·MCP 호출로 실행하며, Harness·Prompt 빌드 과정에서 스킬 설명이 시스템 프롬프트에 주입됩니다.

## 검증 근거

- Cursor Docs, "Agent Skills": https://cursor.com/docs/context/skills
- Agent Skills 표준 사이트(Cursor 문서 링크): https://agentskills.io
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills`,

  harness: `## 개요

Harness는 모델·도구·지시문을 묶어 에이전트 루프를 실행하는 런타임·오케스트레이션 계층입니다. Cursor 공식 문서는 "Every coding agent needs a harness"라고 명시하며, 모델·도구·instructions의 조합으로 정의합니다.

## 세부 내용

Harness는 사용자가 선택한 LLM과 도구·instructions를 묶어 AI Agent 루프를 실행합니다. Cursor SDK 문서에 따르면 Harness에는 컨텍스트 관리, MCP·Skills, Hooks, Subagents, 샌드박스 VM 등이 포함됩니다. Tool Use 호출은 Sandbox에서 격리 실행할 수 있고, Guardrails·HITL로 위험 행동을 제한하며, Observability로 호출을 기록하는 패턴이 문서·블로그에서 함께 설명됩니다. 단, "Harness"라는 단일 국제 표준 명세는 확인되지 않았고, 제품·문서별 용어입니다.

## 검증 근거

- Cursor Docs, "Build a coding agent": https://cursor.com/docs/help/getting-started/build-ai-coding-agent
- Cursor Docs, "Cursor SDK"(TypeScript): https://cursor.com/docs — SDK가 "same harness" 제공 (문서 내 SDK 섹션)`,

  openclaw: `## 개요

OpenClaw는 자체 기기에서 실행하는 personal AI assistant 플랫폼입니다. 공식 README는 Gateway를 control plane으로, assistant 자체를 제품으로 설명합니다.

## 세부 내용

공식 문서·README에 따르면 WhatsApp·Telegram·Slack·Discord 등 다채널 inbox, multi-agent routing, Skills·MCP 플러그인, onboarding wizard(\`openclaw onboard\`)를 제공합니다. AI Agent 역할의 런타임 위에서 Skills를 로드하고 외부 도구와 연동합니다. 보안·격리가 중요한 경우 NanoClaw 같은 대안과 비교할 수 있습니다(각 프로젝트 공식 문서 기준).

## 검증 근거

- GitHub \`openclaw/openclaw\` README: https://github.com/openclaw/openclaw
- OpenClaw Docs: https://docs.openclaw.ai`,

  nanoclaw: `## 개요

NanoClaw는 OpenClaw의 경량 대안으로 소개되는 오픈소스 personal AI agent입니다. 공식 GitHub README는 에이전트를 Docker 컨테이너에서 실행해 파일시스템 격리를 제공한다고 설명합니다.

## 세부 내용

\`nanocoai/nanoclaw\` 저장소에 따르면 Anthropic Agents SDK 기반이며, \`nanoclaw.sh\` 설치 스크립트로 Node·pnpm·Docker를 구성합니다. AI Agent 그룹마다 Sandbox(기본 Docker, 선택적 Docker Sandboxes micro-VM)에서 실행되며, Guardrails·HITL과 함께 고위험 작업을 제어합니다. OpenClaw 대비 코드 규모를 줄여 fork-and-own을 목표로 합니다(README 표현).

## 검증 근거

- GitHub \`nanocoai/nanoclaw\`: https://github.com/nanocoai/nanoclaw
- NanoClaw 공식 사이트: https://nanoclaw.dev
- NanoClaw 설치 문서: https://docs.nanoclaw.dev/installation`,

  "tool-use": `## 개요

Tool Use(또는 function calling / tool calling)는 LLM이 구조화된 도구 호출을 생성하고, 애플리케이션이 그 결과를 다시 모델에 전달하는 패턴입니다. API는 도구 실행 자체를 대신하지 않습니다.

## 세부 내용

Anthropic Messages API는 \`tools\` 파라미터와 \`tool_use\`·\`tool_result\` 콘텐츠 블록을 정의합니다. OpenAI Chat Completions도 \`tools\`·\`tool_calls\`를 제공하며 "API will not actually execute any function calls"라고 명시합니다. Harness가 MCP·Skills에 매핑된 클라이언트 도구를 실행하고, Planning 단계에서 고른 도구를 순차 호출하며, Streaming과 함께 쓰면 중간 응답을 전송할 수 있습니다.

## 검증 근거

- Anthropic, "Tool use with Claude": https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Anthropic, "Handle tool calls": https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
- OpenAI, "Function calling": https://developers.openai.com/api/docs/guides/function-calling`,

  sandbox: `## 개요

Sandbox는 에이전트·도구가 실행되는 격리된 환경입니다. 제품마다 구현이 다르며, 단일 표준 API 이름은 확인되지 않았습니다.

## 세부 내용

NanoClaw 공식 문서는 Docker를 기본 런타임으로, Docker Sandboxes를 추가 격리 옵션으로 설명합니다. OpenClaw 문서는 agent sandbox·\`agents.defaults.sandbox.docker\` 설정을 제공합니다. Harness 설계에서 Sandbox는 Tool Use로 실행되는 셸·파일 작업의 경계를 만드는 역할이며, Guardrails와 함께 다층 방어에 쓰입니다.

## 검증 근거

- NanoClaw Docs, "Installation" — Docker only supported runtime: https://docs.nanoclaw.dev/installation
- OpenClaw Docs, "Skills" — sandbox sync·\`setupCommand\`: https://docs.openclaw.ai/tools/skills`,

  guardrails: `## 개요

Guardrails는 에이전트 입출력·도구 호출을 검사해 위험한 행동을 제한하는 정책·필터 계층을 통칭합니다. 범용 단일 표준 스펙은 확인되지 않았습니다.

## 세부 내용

Anthropic "Building effective agents"는 한 모델 인스턴스가 쿼리를 처리하고 다른 인스턴스가 부적절 콘텐츠를 검사하는 병렬 guardrails 패턴을 workflow 예시로 제시합니다. NanoClaw·Harness 문서 맥락에서는 Prompt·Tool Use 전후 검사와 결합됩니다. 고위험 액션은 HITL 승인으로 넘길 수 있습니다. 특정 상용 제품명(예: NeMo Guardrails)은 별도 벤더 문서를 따릅니다.

## 검증 근거

- Anthropic, "Building effective agents" — guardrails parallelization 예시: https://www.anthropic.com/engineering/building-effective-agents`,

  planning: `## 개요

Planning은 복잡한 목표를 하위 단계로 나누고, 추론과 행동을 반복하는 에이전트 패턴을 통칭합니다. ReAct 논문은 reasoning trace와 task-specific action을 interleaved 방식으로 생성합니다.

## 세부 내용

ReAct(ICLR 2023)는 추론이 계획을 유지·수정하고, action이 Wikipedia API 같은 외부 환경에서 정보를 모으게 한다고 설명합니다. AI Agent는 이 패턴으로 Tool Use를 반복하고, Orchestration·Subagent로 worker에 위임할 수 있습니다. LLM·Prompt 품질에 의존하며, Tool Use로 단계를 실행하고 Evaluation으로 품질을 측정합니다.

## 검증 근거

- Yao et al., "ReAct" (arXiv:2210.03629): https://arxiv.org/abs/2210.03629
- Anthropic, "Building effective agents" — orchestrator-workers, prompt chaining: https://www.anthropic.com/engineering/building-effective-agents`,

  memory: `## 개요

Memory는 에이전트가 세션 맥락·과거 정보를 유지하는 저장·검색 계층입니다. Anthropic은 augmented LLM의 구성 요소 중 하나로 memory를 나열합니다.

## 세부 내용

단기 맥락은 Context Window 안의 최근 메시지로 유지됩니다. 장기 저장은 Embeddings로 Vector DB에 넣고 RAG처럼 검색하는 패턴이 Lewis et al.(2020) RAG 프레임워크와 연결됩니다. AI Agent·Harness는 LLM 호출마다 Token 예산 안에서 어떤 Memory를 Prompt에 넣을지 선택합니다.

## 검증 근거

- Anthropic, "Building effective agents" — augmented LLM(memory): https://www.anthropic.com/engineering/building-effective-agents
- Lewis et al., RAG (arXiv:2005.11401): https://arxiv.org/abs/2005.11401`,

  hitl: `## 개요

HITL(Human-in-the-Loop)은 에이전트가 자율 실행하되, 특정 시점에 사람의 판단·승인을 끼워 넣는 제어 방식입니다. 범용 프로토콜 이름은 확인되지 않았습니다.

## 세부 내용

Anthropic agent 문서는 실행 중 checkpoint에서 human feedback을 받거나 blocker에서 멈추는 흐름을 설명합니다. Harness 정책으로 고위험 Tool Use(배포·결제·대량 삭제 등) 직전에 확인 UI를 두는 패턴이 제품별로 구현됩니다. Guardrails가 자동 차단한 경우와 사람이 예외 승인하는 경우를 구분합니다.

## 검증 근거

- Anthropic, "Building effective agents" — human feedback at checkpoints: https://www.anthropic.com/engineering/building-effective-agents`,

  rag: `## 개요

RAG(Retrieval-Augmented Generation)는 검색으로 가져온 문서를 생성 모델 입력에 넣어 답변을 보강하는 방법입니다. Lewis et al.(2020)이 parametric·non-parametric memory를 결합한 fine-tuning 레시피로 정의했습니다.

## 세부 내용

질의를 Embeddings로 표현해 Vector DB에서 관련 passage를 찾고, 검색 결과를 Prompt에 포함해 LLM에 전달합니다. 학습 데이터에 없는 사내 문서·최신 정보를 AI Agent에 공급할 때 쓰이며, Memory·Observability와 함께 환각 완화 패턴으로 설명됩니다.

## 검증 근거

- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (arXiv:2005.11401): https://arxiv.org/abs/2005.11401
- Meta AI Research publication page: https://ai.meta.com/research/publications/retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks/`,

  prompt: `## 개요

Prompt는 모델에 전달하는 지시·역할·제약·대화 맥락을 통칭합니다. Anthropic Messages API는 system·user·assistant 역할 메시지 구조를 사용합니다.

## 세부 내용

System Prompt에 역할·금지 사항을 두고, AI Agent가 사용자 입력·Tool Use 결과·RAG 검색문을 이어 붙입니다. Planning·Skills 사용법·Guardrails 규칙을 Prompt에 명시하면 LLM 행동이 안정됩니다. Fine-tuning 없이도 도메인 적응의 첫 단계로 쓰이며, Anthropic은 tool 정의 자체도 prompt engineering 대상으로 권장합니다.

## 검증 근거

- Anthropic, "Building effective agents" — Appendix 2 Prompt engineering your tools: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic API primer — messages·tool use: https://platform.claude.com/docs/en/claude_api_primer`,

  "context-window": `## 개요

Context Window는 모델이 한 번의 API 호출에서 처리할 수 있는 입력(및 관련 제한) 범위를 말합니다. 제공사·모델마다 토큰 한도가 문서화되어 있습니다.

## 세부 내용

대화 히스토리·Prompt·Tool Use 결과·RAG 청크가 모두 Token 예산을 소비합니다. LLM·모델마다 문서화된 한도가 있으며, Memory를 Context Window에 얼마나 넣을지가 AI Agent·Harness 설계의 핵심입니다.

## 검증 근거

- OpenAI Embeddings guide — 모델별 max input(예: 8192 tokens): https://platform.openai.com/docs/guides/embeddings
- Anthropic tool use docs — 입력 토큰·tools 파라미터 과금: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview`,

  token: `## 개요

Token은 LLM이 텍스트를 처리하는 기본 단위이며, 대부분의 상용 API가 과금·컨텍스트 한도를 Token 기준으로 표기합니다.

## 세부 내용

OpenAI 문서는 \`tiktoken\`으로 문자열 Token 수를 계산하는 방법을 제공합니다. 입력·출력 Token 수가 비용과 지연을 결정하고, Context Window 크기도 Token으로 표현됩니다. Streaming은 생성된 Token을 순차 전송합니다. AI Agent는 Memory·RAG·Tool Use 결과를 Token 예산 안에서 최적화해야 합니다.

## 검증 근거

- OpenAI, "Vector embeddings" FAQ — tiktoken, cl100k_base: https://platform.openai.com/docs/guides/embeddings`,

  embeddings: `## 개요

Embeddings는 텍스트를 고차원 실수 벡터로 변환한 표현입니다. OpenAI 공식 문서는 relatedness 측정·검색·클러스터링 용도를 명시합니다.

## 세부 내용

OpenAI Embeddings API(\`POST /v1/embeddings\`)는 \`text-embedding-3-small\` 등 모델로 벡터를 반환합니다. RAG에서 질의·문서를 Vector DB에 넣어 유사 passage를 찾고, 장기 Memory 인덱싱에도 쓰입니다. LLM 본체와는 별도 embedding 모델을 쓰는 경우가 많습니다.

## 검증 근거

- OpenAI, "Vector embeddings": https://platform.openai.com/docs/guides/embeddings`,

  "vector-db": `## 개요

Vector DB는 embedding 벡터를 저장·유사도 검색하는 데이터베이스·서비스를 통칭합니다. 단일 공식 표준 API 이름은 확인되지 않았습니다.

## 세부 내용

OpenAI 문서는 많은 벡터를 빠르게 검색할 때 vector database 사용을 권장합니다. RAG·Memory 파이프라인에서 Embeddings로 인덱싱한 벡터를 저장·검색합니다. Harness·Observability와 연동해 어떤 문서가 검색됐는지 추적하는 것이 운영 품질에 도움이 됩니다.

## 검증 근거

- OpenAI, "Vector embeddings" FAQ — vector database 권장: https://platform.openai.com/docs/guides/embeddings
- Lewis et al., RAG — dense vector index: https://arxiv.org/abs/2005.11401`,

  "fine-tuning": `## 개요

Fine-tuning은 사전 학습된 모델 가중치를 추가 데이터로 조정하는 방법입니다. 제공사 API·문서에 fine-tuning 엔드포인트·절차가 정의되어 있습니다.

## 세부 내용

Prompt·RAG만으로 부족할 때 도메인 데이터로 LLM을 조정합니다. Tool Use 형식·Planning 패턴을 데이터에 넣어 AI Agent 행동을 안정화할 수 있으나, 데이터 준비·Evaluation·재학습 비용이 듭니다. 구체 API 이름·파라미터는 사용 중인 모델 벤더 문서를 따릅니다.

## 검증 근거

- OpenAI fine-tuning 문서(벤더별): https://platform.openai.com/docs/guides/fine-tuning
- Anthropic 모델·학습 관련 안내는 제품 문서 별도 확인 필요 — 통합 "Harness fine-tuning" 표준은 없음`,

  orchestration: `## 개요

Orchestration은 여러 LLM 호출·도구·워커를 조율해 하나의 작업을 완료하는 계층입니다. Anthropic 공식 문서는 "orchestrator-workers" workflow를 정의합니다.

## 세부 내용

중앙 LLM이 작업을 동적으로 분해해 worker LLM에 위임하고 결과를 합성합니다. AI Agent·Subagent·Planning과 결합되며, Harness가 전체 루프·Observability를 통합합니다. MCP·Skills를 팀 단위로 공유하는 패턴도 제품 문서에서 설명됩니다.

## 검증 근거

- Anthropic, "Building effective agents" — orchestrator-workers workflow: https://www.anthropic.com/engineering/building-effective-agents`,

  subagent: `## 개요

Subagent는 상위 에이전트가 하위 작업을 위임하는 전문 에이전트 인스턴스입니다. Cursor SDK 문서에 Subagents 기능이 공식 기재되어 있습니다.

## 세부 내용

Cursor 문서에 따르면 메인 에이전트가 Agent 도구로 named subagent를 호출하며, subagent마다 별도 prompt·model을 둘 수 있습니다. Orchestration·Planning과 함께 복잡 작업을 분할하고, Harness가 Subagent별 Sandbox·Token 예산을 나눌 수 있습니다. 부모 AI Agent는 LLM이 Subagent 결과를 통합합니다.

## 검증 근거

- Cursor Docs, "Agent Skills" 및 SDK 관련 문서 — Subagents: https://cursor.com/docs/context/skills
- Cursor help, "Build a coding agent" — SDK harness·subagents 언급: https://cursor.com/docs/help/getting-started/build-ai-coding-agent`,

  streaming: `## 개요

Streaming은 모델 출력을 완성 전에 부분적으로 전송하는 응답 방식입니다. Anthropic·OpenAI API 모두 스트리밍 모드를 문서화합니다.

## 세부 내용

Token이 생성되는 대로 클라이언트에 전달되어 체감 지연을 줄입니다. LLM·Tool Use 스트리밍 응답에서 중간 텍스트와 \`tool_use\` 이벤트를 구분해 처리해야 합니다. AI Agent UI에서 추론·도구 실행 상태를 Streaming으로 보여 주기도 합니다.

## 검증 근거

- Anthropic API primer — streaming 언급: https://platform.claude.com/docs/en/claude_api_primer
- OpenAI function calling guide — streaming tool call 이벤트: https://developers.openai.com/api/docs/guides/function-calling`,

  observability: `## 개요

Observability는 에이전트의 Prompt·Tool Use·검색 호출을 로그·트레이스로 기록·분석하는 운영 계층입니다. 범용 에이전트 표준 스펙은 확인되지 않았습니다.

## 세부 내용

Cursor SDK 문서는 Hooks(\`.cursor/hooks.json\`)로 AI Agent 루프를 관찰·제어할 수 있다고 설명합니다. Harness에 계측을 심어 디버깅·Evaluation·비용 분석에 활용하고, RAG·Vector DB 검색 결과·Guardrails·HITL 차단 이벤트를 함께 남기는 패턴이 운영 모범 사례로 제시됩니다.

## 검증 근거

- Cursor 제품 문서 — Hooks(공식 SDK·문서 내 hooks.json): https://cursor.com/docs/context/skills (Hooks 교차 링크)
- Anthropic, "Building effective agents" — 테스트·sandbox 권고: https://www.anthropic.com/engineering/building-effective-agents`,

  evaluation: `## 개요

Evaluation은 에이전트·RAG·Planning 출력 품질을 데이터셋·벤치마크로 측정하는 활동입니다. Anthropic workflow 문서에 evaluator-optimizer·automated evals 예시가 있습니다.

## 세부 내용

골든 데이터셋으로 AI Agent·RAG·Planning 출력의 답변 정확도·Tool Use 성공률을 점수화합니다. Fine-tuning 전후·Prompt 변경 시 회귀를 잡고, Observability 로그에서 실패 케이스를 샘플링합니다. 단일 공식 "Agent Evaluation" API 표준은 확인되지 않았으며, 벤더·프로젝트별 eval 도구를 사용합니다.

## 검증 근거

- Anthropic, "Building effective agents" — evaluator-optimizer, automated evals: https://www.anthropic.com/engineering/building-effective-agents`,
};

for (const [id, body] of Object.entries(terms)) {
  const file = path.join(termsDir, `${id}.md`);
  const content = `---\nid: ${id}\n---\n\n${body.trim()}\n`;
  fs.writeFileSync(file, content);
  console.log("wrote", id);
}

console.log("done", Object.keys(terms).length);
