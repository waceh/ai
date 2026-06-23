#!/usr/bin/env node
/**
 * FACT-ONLY: content/examples/*.md — 공식 문서·공식 소스에서 확인된 API·명령만 사용.
 * node scripts/write-examples.js && node scripts/build-bundle.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const examplesDir = path.join(root, "content", "examples");

const EXAMPLES = {
  llm: {
    title: "Claude Messages API로 첫 응답 받기",
    source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/README.md",
    body: `## 시나리오

챗봇·요약·코드 생성의 출발점은 LLM API 호출입니다. Agent·RAG·Tool Use를 붙이기 전에, 모델이 텍스트를 생성하는 최소 호출부터 확인합니다.

## 따라하기

1. Anthropic Python SDK를 설치합니다.

\`\`\`bash
pip install anthropic
\`\`\`

2. 환경 변수 \`ANTHROPIC_API_KEY\`를 설정합니다.

3. 공식 README의 \`messages.create\` 예제를 실행합니다.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

message = client.messages.create(
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Hello, Claude",
        }
    ],
    model="claude-opus-4-6",
)
print(message.content)
\`\`\`

## 핵심 포인트

- LLM 호출의 공식 진입점은 벤더 SDK의 \`messages.create\`(Anthropic)입니다.
- \`messages\` 배열에 \`role: "user"\`와 \`content\`를 넣습니다.
- 응답 길이 상한은 \`max_tokens\`로 지정합니다.

## 참고

- Anthropic Python SDK README: https://github.com/anthropics/anthropic-sdk-python/blob/main/README.md
- Claude API 문서: https://platform.claude.com/docs/en/api/sdks/python`,
  },

  agent: {
    title: "Tool Use 루프로 Agent 동작 재현",
    source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py",
    body: `## 시나리오

한 번의 답변으로 끝나지 않고, 모델이 도구를 고른 뒤 결과를 받아 다시 추론해야 할 때 **AI Agent** 패턴이 필요합니다. 아래는 공식 SDK 예제에 나온 최소 Tool Use 루프입니다.

## 따라하기

1. \`anthropic\` 패키지를 설치합니다.

\`\`\`bash
pip install anthropic
\`\`\`

2. 공식 \`examples/tools.py\` 흐름을 따릅니다: (1) 도구 정의 → (2) 첫 \`messages.create\` → (3) \`stop_reason == "tool_use"\`이면 \`tool_result\`를 넣어 재호출.

\`\`\`python
from anthropic import Anthropic
from anthropic.types import ToolParam, MessageParam

client = Anthropic()

user_message: MessageParam = {
    "role": "user",
    "content": "What is the weather in SF?",
}
tools: list[ToolParam] = [
    {
        "name": "get_weather",
        "description": "Get the weather for a specific location",
        "input_schema": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
        },
    }
]

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[user_message],
    tools=tools,
)

assert message.stop_reason == "tool_use"
tool = next(c for c in message.content if c.type == "tool_use")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[
        user_message,
        {"role": message.role, "content": message.content},
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool.id,
                    "content": [{"type": "text", "text": "The weather is 73f"}],
                }
            ],
        },
    ],
    tools=tools,
)
print(response)
\`\`\`

3. (선택) Anthropic SDK에는 \`beta.agents\`·\`beta.sessions\` API도 있습니다. \`examples/agents.py\`를 참고하세요.

## 핵심 포인트

- Agent = LLM + **반복 루프** + Tool Use 결과 피드백입니다.
- \`stop_reason\`이 \`"tool_use"\`이면 모델이 도구 호출을 요청한 상태입니다.
- \`tool_result\` 블록으로 실행 결과를 다시 넣어야 최종 답변이 이어집니다.

## 참고

- Anthropic SDK \`examples/tools.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py
- Anthropic SDK \`examples/agents.py\` (beta Agents API): https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/agents.py
- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents`,
  },

  mcp: {
    title: "MCP 파일시스템 서버 연결",
    source: "https://github.com/modelcontextprotocol/servers/blob/main/README.md",
    body: `## 시나리오

Agent마다 API 래퍼를 새로 만들 대신, **MCP** 서버 하나로 파일·Git·시간 같은 도구를 표준 규격으로 노출할 수 있습니다.

## 따라하기

### A. 클라이언트 설정 (공식 servers README)

MCP 클라이언트 설정에 파일시스템 서버를 등록합니다. 공식 README에 나온 패키지명과 인자를 그대로 사용합니다.

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    }
  }
}
\`\`\`

\`/path/to/allowed/files\`는 서버가 접근할 수 있는 디렉터리로 바꿉니다.

### B. Anthropic SDK + MCP (공식 예제)

\`anthropic[mcp]\`와 Python 3.10+가 필요합니다. 공식 \`examples/mcp_tool_runner.py\` 흐름:

\`\`\`bash
pip install "anthropic[mcp]"
\`\`\`

\`\`\`python
# 요약: StdioServerParameters로 @modelcontextprotocol/server-filesystem 실행
# → mcp ClientSession.initialize()
# → list_tools() → async_mcp_tool() 변환
# → client.beta.messages.tool_runner(...) 루프
\`\`\`

전체 코드는 레포의 \`examples/mcp_tool_runner.py\`를 복사해 실행하세요.

## 핵심 포인트

- MCP 서버 npm 패키지: \`@modelcontextprotocol/server-filesystem\` (공식 servers README).
- Anthropic 연동 헬퍼: \`anthropic.lib.tools.mcp.async_mcp_tool\` (\`mcp_tool_runner.py\`).
- MCP는 **도구 연결 규약**이며, LLM 호출 자체는 별도입니다.

## 참고

- MCP servers README: https://github.com/modelcontextprotocol/servers/blob/main/README.md
- MCP 사양: https://modelcontextprotocol.io/specification/2025-06-18
- Anthropic \`mcp_tool_runner.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/mcp_tool_runner.py`,
  },

  skills: {
    title: "Agent Skills SKILL.md 작성",
    source: "https://agentskills.io/specification.md",
    body: `## 시나리오

같은 절차(코드 리뷰, 배포 체크 등)를 매번 긴 Prompt로 붙여넣지 않으려면 **Skills**로 업무 지침을 파일로 관리합니다.

## 따라하기

1. 스킬 디렉터리를 만듭니다. 공식 사양: 최소 \`SKILL.md\` 파일이 필요합니다.

\`\`\`text
my-skill/
└── SKILL.md
\`\`\`

2. \`SKILL.md\`에 YAML frontmatter + Markdown 본문을 작성합니다. 필수 필드는 \`name\`, \`description\`입니다.

\`\`\`markdown
---
name: greeting
description: Replaces ordinary greetings with nautical ones.
---

Whenever the user greets you, respond with "Ahoy!" instead of "Hello".
\`\`\`

위 본문 예시는 Anthropic SDK 레포의 \`examples/greeting-SKILL.md\`와 동일한 형식입니다.

3. \`name\` 규칙(공식 사양): 소문자·숫자·하이픈만, 64자 이하, 하이픈으로 시작/끝 불가.

## 핵심 포인트

- Skills ≠ MCP. Skill은 업무 절차 문서이고, MCP는 외부 도구 연결 표준입니다.
- OpenClaw는 \`SKILL.md\`를 스킬 루트에서 탐색합니다 (OpenClaw Docs, "Skills").
- Cursor도 Agent Skills 형식을 지원합니다 (Cursor Docs, "Agent Skills").

## 참고

- Agent Skills 사양: https://agentskills.io/specification.md
- Anthropic \`greeting-SKILL.md\` 예시: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/greeting-SKILL.md
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills`,
  },

  harness: {
    title: "Harness = 모델 + 도구 + 지시문",
    source: "https://cursor.com/docs/help/getting-started/build-ai-coding-agent",
    body: `## 시나리오

LLM만으로는 파일 수정·셸 실행이 불가능합니다. **Harness**는 모델 호출, 도구 실행, 시스템 지시를 한 루프로 묶는 실행 계층입니다.

## 따라하기

Cursor 공식 문서 "Build a coding agent"는 Harness를 다음처럼 정의합니다:

> harness = **model** + **tools** + **instructions**

실무에서 Harness가 담당하는 일(문서·SDK 예제 기준):

1. **모델**: \`messages.create\` 등 LLM API 호출 (Anthropic SDK README).
2. **도구**: Tool Use·MCP·파일/셸 도구 목록을 모델에 전달 (\`examples/tools.py\`).
3. **지시문**: \`system\` 파라미터·Skills·프로젝트 규칙 (Anthropic \`message_create_params\`의 \`system\` 필드).

아래는 Harness의 "모델 + 지시문" 부분만 분리한 최소 예시입니다.

\`\`\`python
from anthropic import Anthropic

client = Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    system="You are a coding assistant. Answer concisely.",
    messages=[{"role": "user", "content": "What is a harness in AI agents?"}],
)
print(response)
\`\`\`

**확인된 공식 기능이 없는 부분**: Cursor Harness 전용 단일 API 클래스명·메서드는 이 예시 범위에서 별도로 확인하지 못했습니다. Cursor SDK 상세는 Cursor Docs의 SDK 섹션을 참고하세요.

## 핵심 포인트

- Harness는 제품마다 구현이 다르지만, 공통적으로 **루프·권한·도구 연결**을 담당합니다.
- Anthropic SDK 예제는 Harness의 도구 부분을 \`tools=\`와 \`tool_result\` 교환으로 보여 줍니다.
- Sandbox·Guardrails·HITL은 Harness 위에 얹는 안전·관측 계층입니다.

## 참고

- Cursor, "Build a coding agent": https://cursor.com/docs/help/getting-started/build-ai-coding-agent
- Anthropic \`tools.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py
- Anthropic \`system\` 파라미터: https://github.com/anthropics/anthropic-sdk-python/blob/main/src/anthropic/types/message_create_params.py`,
  },

  openclaw: {
    title: "openclaw onboard으로 첫 설치",
    source: "https://github.com/openclaw/openclaw/blob/main/README.md",
    body: `## 시나리오

Harness·MCP·Skills를 처음부터 짜기 부담스러울 때 **OpenClaw**로 게이트웨이·워크스페이스·채널·스킬을 CLI 마법사로 설정할 수 있습니다.

## 따라하기

1. OpenClaw README에 따르면 권장 설치 경로는 터미널에서 \`openclaw onboard\`입니다.

\`\`\`bash
openclaw onboard
\`\`\`

2. 마법사가 게이트웨이, 워크스페이스, 채널, 스킬 설정을 단계별로 안내합니다 (README, "Preferred setup").

3. Skills는 \`SKILL.md\`가 있는 디렉터리에서 로드됩니다. 우선순위는 OpenClaw Docs "Skills" 표를 참고하세요 (예: \`<workspace>/skills\`가 가장 높음).

\`\`\`text
<workspace>/skills/research/SKILL.md
\`\`\`

## 핵심 포인트

- 공식 CLI 진입점: \`openclaw onboard\` (README).
- Skills는 \`SKILL.md\` + YAML frontmatter 형식 (Agent Skills 사양과 호환).
- MCP 플러그인·채널 연동은 OpenClaw Docs에서 제품별로 확인하세요.

## 참고

- OpenClaw README: https://github.com/openclaw/openclaw/blob/main/README.md
- OpenClaw Getting Started: https://docs.openclaw.ai/start/getting-started
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills`,
  },

  nanoclaw: {
    title: "nanoclaw.sh로 격리 Agent 설치",
    source: "https://docs.nanoclaw.dev/installation",
    body: `## 시나리오

Agent가 호스트 파일·셸에 직접 접근하면 위험합니다. **NanoClaw**는 Agent를 Docker 컨테이너 안에서 실행하는 패턴을 기본으로 합니다.

## 따라하기

1. NanoClaw README Quick Start:

\`\`\`bash
git clone https://github.com/nanocoai/nanoclaw.git nanoclaw-v2
cd nanoclaw-v2
bash nanoclaw.sh
\`\`\`

2. 설치 문서에 따르면 \`nanoclaw.sh\`는 세 단계 체인입니다:
   - \`nanoclaw.sh\` — 사전 점검(RAM, GCE, root 경고 등)
   - \`setup.sh\` — Node 20+, pnpm, \`pnpm install\`
   - \`pnpm run setup:auto\` — 대화형 마법사(컨테이너 빌드, 인증, 채널 페어링)

3. 요구 사항(설치 문서): macOS/Linux, RAM 4GB+, Node 20+, Docker. 설치 문서는 **Docker only supported runtime**을 명시합니다.

## 핵심 포인트

- 공식 설치 진입점: \`bash nanoclaw.sh\` (README·설치 문서).
- Agent 러너는 **컨테이너(Bun 1.3.12)** 안에서 동작합니다 (설치 문서, "One runtime on the host, another in the container").
- OpenClaw와 달리 NanoClaw는 **OS 수준 격리(Sandbox)** 에 초점을 둡니다.

## 참고

- NanoClaw README: https://github.com/nanocoai/nanoclaw/blob/main/README.md
- NanoClaw Installation: https://docs.nanoclaw.dev/installation`,
  },

  "tool-use": {
    title: "Tool Use: 선언 → 실행 → tool_result",
    source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py",
    body: `## 시나리오

LLM이 "서울 날씨 알려줘"라는 요청을 받았을 때, 직접 날씨를 알지 못하면 **Tool Use**로 \`get_weather\` 같은 함수 호출을 **선언**합니다.

## 따라하기

1. \`tools\` 배열에 JSON Schema 형태의 \`input_schema\`를 정의합니다.

2. \`messages.create(..., tools=tools)\`를 호출합니다.

3. 응답 \`content\`에서 \`type == "tool_use"\` 블록을 찾고, 실제 함수를 실행한 뒤 \`tool_result\`를 다음 요청에 넣습니다.

\`\`\`python
from anthropic import Anthropic

client = Anthropic()
tools = [
    {
        "name": "get_weather",
        "description": "Get the weather for a specific location",
        "input_schema": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
        },
    }
]

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What is the weather in SF?"}],
    tools=tools,
)

tool = next(c for c in message.content if c.type == "tool_use")
# tool.name, tool.input 으로 실제 API/함수 실행 후 tool_result 전달
\`\`\`

전체 루프는 \`examples/tools.py\`를 참고하세요.

## 핵심 포인트

- Tool Use는 MCP·Skills와 함께 쓰입니다. MCP가 도구를 노출하고, LLM이 \`tool_use\`로 호출을 선언합니다.
- OpenAI는 동일 개념을 "Function calling"으로 문서화합니다.
- \`stop_reason == "tool_use"\`가 도구 호출 신호입니다.

## 참고

- Anthropic \`tools.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py
- Anthropic Tool use 문서: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- OpenAI Function calling: https://developers.openai.com/api/docs/guides/function-calling`,
  },

  sandbox: {
    title: "Docker 컨테이너로 Agent 실행 격리",
    source: "https://docs.nanoclaw.dev/installation",
    body: `## 시나리오

Tool Use로 \`rm -rf\`·패키지 설치 같은 명령을 허용하면 호스트가 위험해집니다. **Sandbox**는 명령을 격리 환경(컨테이너 등)에서만 실행합니다.

## 따라하기

### NanoClaw (공식 설치 문서)

NanoClaw는 Agent를 Docker 컨테이너에서 실행합니다. 설치 문서 요약:

- 호스트: Node 20+ + pnpm으로 서비스(\`node dist/index.js\`) 실행
- Agent 컨테이너: Bun 1.3.12, \`container/Dockerfile\` 기반
- 에이전트 소스는 이미지에 bake하지 않고 \`container/agent-runner/src\`를 read-only 마운트

\`\`\`bash
bash nanoclaw.sh
\`\`\`

### Anthropic Managed Agents (공식 SDK 예제 주석)

\`managed-agents-self-hosted-sandbox-worker.py\`는 다음을 명시합니다:

> Security model: the worker executes bash and file operations directly on the host. **Run inside a container or other isolation boundary you control.**

즉, Sandbox는 프레임워크 기본값(NanoClaw)이거나, 직접 구현 시 **컨테이너 경계**를 두라는 공식 권고(Anthropic SDK)입니다.

## 핵심 포인트

- Sandbox = 실행 공간 분리. Guardrails = 입·출력 정책 검사 (별개).
- NanoClaw: Docker가 공식 지원 런타임입니다.
- OpenClaw Skills 문서에는 \`setupCommand\`·sandbox sync가 언급됩니다 (스킬 환경 맞춤).

## 참고

- NanoClaw Installation: https://docs.nanoclaw.dev/installation
- Anthropic \`managed-agents-self-hosted-sandbox-worker.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/managed-agents-self-hosted-sandbox-worker.py
- OpenClaw Docs, "Skills": https://docs.openclaw.ai/tools/skills`,
  },

  guardrails: {
    title: "Cursor Hook으로 Prompt 제출 전 검사",
    source: "https://cursor.com/docs/context/skills",
    body: `## 시나리오

LLM·Tool Use가 민감 정보·위험 명령을 생성할 수 있습니다. **Guardrails**는 Prompt·도구 호출 전후에 정책을 적용합니다.

## 따라하기

### A. 워크플로 패턴 (Anthropic 공식 글)

Anthropic "Building effective agents"는 Guardrails를 **병렬 검증 워크플로** 예시로 설명합니다. 단일 API 이름은 제공하지 않습니다.

### B. Cursor Hooks (공식 이벤트명 확인됨)

Cursor는 \`beforeSubmitPrompt\`, \`preToolUse\`, \`beforeMCPExecution\` 등 Hook 이벤트를 문서화합니다. 프로젝트 루트에 \`.cursor/hooks.json\`:

\`\`\`json
{
  "version": 1,
  "hooks": {
    "beforeSubmitPrompt": [
      {
        "command": ".cursor/hooks/check-prompt.sh"
      }
    ]
  }
}
\`\`\`

\`beforeSubmitPrompt\`의 matcher 값 \`UserPromptSubmit\`은 Cursor Hooks 문서에 명시되어 있습니다.

**확인된 공식 기능이 없는 부분**: 범용 "Guardrails" 전용 단일 오픈소스 API는 이 예시에서 확인하지 못했습니다. 제품별 Hook·정책 엔진을 사용하세요.

## 핵심 포인트

- Guardrails ≠ HITL. Guardrails는 자동 규칙, HITL은 사람 승인입니다.
- Cursor \`preToolUse\` / \`beforeMCPExecution\`으로 Tool Use·MCP 호출을 게이트할 수 있습니다.
- Prompt 설계(\`system\`)와 허용 도구 목록이 Guardrails 효과를 좌우합니다.

## 참고

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
- Cursor Docs, "Agent Skills" (Hooks 교차 링크): https://cursor.com/docs/context/skills`,
  },

  planning: {
    title: "ReAct: Thought → Action → Observation",
    source: "https://arxiv.org/abs/2210.03629",
    body: `## 시나리오

"리포지토리 이슈를 조사해 요약해줘"처럼 여러 단계가 필요할 때 **Planning**은 문제를 나누고 순서를 정합니다.

## 따라하기

Yao et al., "ReAct" (arXiv:2210.03629)은 LLM이 추론(Thought)과 행동(Action)을 번갈아 수행하는 패턴을 제안합니다. 논문에 나온 루프 구조:

1. **Thought** — 다음에 무엇을 할지 추론
2. **Action** — 도구/API 이름 선택
3. **Action Input** — 도구 인자
4. **Observation** — 도구 실행 결과
5. 위를 반복해 최종 답 도출

Anthropic SDK \`tools.py\`는 이 루프의 **Action/Observation** 부분을 \`tool_use\` / \`tool_result\`로 구현합니다.

\`\`\`python
# Planning(추론)은 모델 응답에 포함되고,
# Action은 stop_reason == "tool_use" 로 표현됩니다.
message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Find and summarize open issues"}],
    tools=tools,
)
\`\`\`

**확인된 공식 기능이 없는 부분**: "Planning"이라는 이름의 단일 표준 API는 Anthropic/OpenAI 공식 SDK에서 확인되지 않았습니다. ReAct·CoT 등은 Prompt/루프 패턴입니다.

## 핵심 포인트

- Planning은 별도 라이브러리가 아니라 **Agent 루프 안의 추론 단계**입니다.
- ReAct 논문: https://arxiv.org/abs/2210.03629
- Anthropic은 orchestrator-workers·prompt chaining 등 **워크플로 패턴**도 문서화합니다.

## 참고

- Yao et al., ReAct: https://arxiv.org/abs/2210.03629
- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
- Anthropic \`tools.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py`,
  },

  memory: {
    title: "대화 이력을 messages 배열로 유지",
    source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/messages.py",
    body: `## 시나리오

"아까 말한 그거"처럼 이전 맥락이 필요할 때 **Memory**는 지난 턴을 다음 요청에 포함합니다.

## 따라하기

Anthropic SDK \`examples/messages.py\`는 멀티턴 대화를 \`messages\` 배열 확장으로 보여 줍니다.

\`\`\`python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}],
    model="claude-sonnet-4-5-20250929",
)

response2 = client.messages.create(
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"},
        {"role": response.role, "content": response.content},
        {"role": "user", "content": "How are you?"},
    ],
    model="claude-sonnet-4-5-20250929",
)
print(response2)
\`\`\`

Context Window를 넘으면 요약·Vector DB(RAG)로 압축·검색합니다 (별도 용어 참고).

## 핵심 포인트

- 단기 Memory = 이전 \`user\` / \`assistant\` 메시지를 그대로 재전송.
- \`role: "assistant"\`에는 모델의 \`content\` 블록 전체를 넣습니다.
- 장기 Memory는 Embeddings + Vector DB 패턴과 함께 씁니다.

## 참고

- Anthropic \`messages.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/messages.py
- Anthropic, "Building effective agents" (augmented LLM / memory): https://www.anthropic.com/engineering/building-effective-agents`,
  },

  hitl: {
    title: "고위험 Tool Use 전 사람 승인 체크포인트",
    source: "https://www.anthropic.com/engineering/building-effective-agents",
    body: `## 시나리오

프로덕션 배포·결제·데이터 삭제처럼 되돌리기 어려운 작업은 **HITL**(Human-in-the-Loop)로 사람 승인을 받습니다.

## 따라하기

Anthropic "Building effective agents"는 체크포인트에서 **human feedback**을 받는 패턴을 권장합니다. 의사 코드 흐름:

1. Agent가 Tool Use를 선언 (\`stop_reason == "tool_use"\`)
2. Harness/Guardrails가 위험 등급 판단
3. 고위험이면 실행을 **일시 정지**하고 UI·알림으로 사람에게 전달
4. 승인 시에만 실제 도구 실행 → \`tool_result\` 전달
5. 거부 시 취소 또는 대안 Planning

**확인된 공식 기능이 없는 부분**: Anthropic/OpenAI SDK에 \`hitl.approve()\` 같은 전용 메서드는 확인되지 않았습니다. HITL은 **애플리케이션·Harness 구현 패턴**입니다.

NanoClaw·OpenClaw 등 프레임워크별 승인 UI는 각 제품 문서를 참고하세요.

## 핵심 포인트

- HITL ≠ Guardrails. Guardrails는 자동 규칙, HITL은 사람 판단입니다.
- Tool Use 선언 지점이 승인 체크포인트로 적합합니다.
- Sandbox와 함께 쓰면 승인 전 호스트 노출을 줄일 수 있습니다.

## 참고

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
- Anthropic \`tools.py\` (Tool Use 선언 지점): https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py`,
  },

  rag: {
    title: "Embeddings 검색 후 LLM에 컨텍스트 주입",
    source: "https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb",
    body: `## 시나리오

LLM 학습 데이터에 없는 사내 문서·최신 공지를 답하려면 **RAG**(Retrieval-Augmented Generation)로 관련 문단을 찾아 Prompt에 넣습니다.

## 따라하기

OpenAI Cookbook "Question answering using embeddings"는 2단계를 제안합니다:

1. **Search** — 라이브러리에서 관련 텍스트 검색
2. **Ask** — 검색 결과를 메시지에 넣고 GPT에 질문

최소 Embeddings 호출 (Cookbook \`Using_embeddings.ipynb\`):

\`\`\`python
from openai import OpenAI

client = OpenAI()
embedding = client.embeddings.create(
    input="Your text goes here",
    model="text-embedding-3-small",
).data[0].embedding
print(len(embedding))
\`\`\`

유사도 검색은 Cookbook \`Semantic_text_search_using_embeddings.ipynb\`의 \`cosine_similarity\` 패턴을 참고하세요. 검색된 문단을 user 메시지에 붙인 뒤 \`messages.create\`로 답변을 생성합니다.

## 핵심 포인트

- RAG = Retrieve(검색) + Augment(Prompt 보강) + Generate(LLM 생성).
- 원 논문: Lewis et al., arXiv:2005.11401.
- Vector DB에 저장하면 대량 문서 검색에 유리합니다 (Vector DB 용어 참고).

## 참고

- Lewis et al., RAG: https://arxiv.org/abs/2005.11401
- OpenAI Cookbook, Q&A using embeddings: https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb
- OpenAI Cookbook, Using embeddings: https://github.com/openai/openai-cookbook/blob/main/examples/Using_embeddings.ipynb`,
  },

  prompt: {
    title: "system 파라미터로 행동 지시",
    source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/src/anthropic/types/message_create_params.py",
    body: `## 시나리오

같은 질문도 "한국어로만 답해" vs "코드만 출력해"에 따라 결과가 달라집니다. **Prompt**·특히 **system** 지시가 모델 행동을 고정합니다.

## 따라하기

Anthropic \`MessageCreateParams\` 문서: system prompt는 top-level \`system\` 파라미터를 사용합니다. input messages에 \`"system"\` role은 없습니다.

\`\`\`python
from anthropic import Anthropic

client = Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    system="You answer only in Korean. Be concise.",
    messages=[
        {"role": "user", "content": "Explain what a prompt is in one sentence."}
    ],
)
print(response)
\`\`\`

Skills(\`SKILL.md\`)·Guardrails·RAG 검색 결과도 최종적으로 이 \`system\` / \`user\` 메시지에 합쳐집니다.

## 핵심 포인트

- Anthropic: \`system\`은 \`messages.create\`의 **최상위 인자**입니다.
- User Prompt는 \`messages\` 안의 \`role: "user"\`입니다.
- Anthropic "Building effective agents" Appendix 2에 Tool Prompt 엔지니어링 팁이 있습니다.

## 참고

- Anthropic \`message_create_params.py\` (\`system\` 필드): https://github.com/anthropics/anthropic-sdk-python/blob/main/src/anthropic/types/message_create_params.py
- Anthropic system prompts 가이드: https://docs.claude.com/en/docs/system-prompts
- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents`,
  },

  "context-window": {
    title: "tiktoken으로 입력 길이 확인",
    source: "https://github.com/openai/tiktoken/blob/main/README.md",
    body: `## 시나리오

너무 긴 문서를 한 번에 넣으면 API가 거부하거나 앞부분이 잘립니다. **Context Window** 한도를 넘기 전에 Token 수를 확인합니다.

## 따라하기

1. \`tiktoken\` 설치 (OpenAI 공식 토크나이저):

\`\`\`bash
pip install tiktoken
\`\`\`

2. README 예제로 Token 수를 셉니다:

\`\`\`python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")
text = "긴 문서 본문..."
tokens = enc.encode(text)
print(len(tokens))
\`\`\`

3. Anthropic 호출 시 \`max_tokens\`는 **출력** 상한입니다. 입력 한도는 모델별 Context Window 문서를 확인하세요.

OpenAI Embeddings 가이드: \`text-embedding-3-small\` 등 모델별 max input tokens가 문서화되어 있습니다 (예: 8192 tokens).

## 핵심 포인트

- Context Window = 모델이 한 번에 처리할 수 있는 Token 상한 (입력+출력 합산 정책은 벤더별로 확인).
- \`tiktoken.encoding_for_model()\`은 OpenAI 모델용 (README).
- 한도 초과 시 RAG·요약으로 입력을 줄입니다.

## 참고

- tiktoken README: https://github.com/openai/tiktoken/blob/main/README.md
- OpenAI Embeddings guide (모델별 max input): https://platform.openai.com/docs/guides/embeddings
- Anthropic Tool use docs (입력 Token 과금): https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview`,
  },

  token: {
    title: "tiktoken encode / decode",
    source: "https://github.com/openai/tiktoken/blob/main/README.md",
    body: `## 시나리오

API 과금·Context Window 계산은 글자 수가 아니라 **Token** 수 기준입니다.

## 따라하기

\`\`\`python
import tiktoken

enc = tiktoken.get_encoding("o200k_base")
assert enc.decode(enc.encode("hello world")) == "hello world"

enc = tiktoken.encoding_for_model("gpt-4o")
tokens = enc.encode("hello world")
print(tokens)
print(enc.decode(tokens))
\`\`\`

위 코드는 tiktoken README의 공식 예제와 동일합니다.

OpenAI Cookbook "How to count tokens with tiktoken"에 모델별 encoding 표가 있습니다:

| Encoding | OpenAI models |
|----------|---------------|
| \`o200k_base\` | gpt-4o, gpt-4o-mini |
| \`cl100k_base\` | gpt-4-turbo, gpt-4, gpt-3.5-turbo, text-embedding-3-small 등 |

## 핵심 포인트

- Token은 LLM이 실제로 보는 텍스트 단위입니다.
- 같은 문장도 모델·encoding마다 Token 수가 다릅니다.
- Streaming도 Token 단위로 출력이 전달됩니다.

## 참고

- tiktoken README: https://github.com/openai/tiktoken/blob/main/README.md
- OpenAI Cookbook, count tokens: https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb`,
  },

  embeddings: {
    title: "OpenAI embeddings.create 호출",
    source: "https://github.com/openai/openai-cookbook/blob/main/examples/Using_embeddings.ipynb",
    body: `## 시나리오

문서 검색·유사도 비교·RAG의 첫 단계는 텍스트를 벡터로 바꾸는 것입니다. **Embeddings** API가 이를 담당합니다.

## 따라하기

\`\`\`bash
pip install openai
\`\`\`

\`\`\`python
from openai import OpenAI

client = OpenAI()

embedding = client.embeddings.create(
    input="Your text goes here",
    model="text-embedding-3-small",
).data[0].embedding
print(len(embedding))
\`\`\`

Cookbook은 대량 요청 시 \`input=[text]\` 배치와 \`tenacity\` 재시도 패턴도 보여 줍니다 (\`Using_embeddings.ipynb\`).

## 핵심 포인트

- 공식 메서드: \`client.embeddings.create\` (OpenAI Python SDK).
- 반환: \`.data[0].embedding\` — float 리스트.
- RAG·Memory·Vector DB는 모두 Embeddings 출력을 저장·검색합니다.

## 참고

- OpenAI Cookbook, Using embeddings: https://github.com/openai/openai-cookbook/blob/main/examples/Using_embeddings.ipynb
- OpenAI Embeddings guide: https://platform.openai.com/docs/guides/embeddings`,
  },

  "vector-db": {
    title: "OpenAI Vector Store 생성",
    source: "https://github.com/openai/openai-python/blob/main/src/openai/resources/vector_stores/vector_stores.py",
    body: `## 시나리오

수천 개 문서의 Embedding을 메모리 리스트로만 들고 있으면 검색이 느려집니다. **Vector DB**는 벡터 유사도 검색에 최적화된 저장소입니다.

## 따라하기

OpenAI API는 \`vector_stores\` 리소스를 제공합니다. Python SDK:

\`\`\`python
from openai import OpenAI

client = OpenAI()

vector_store = client.vector_stores.create(
    name="product-faq",
    description="FAQ documents for support bot",
)
print(vector_store.id)
\`\`\`

\`create\` 파라미터(소스 docstring): \`name\`, \`description\`, \`file_ids\`, \`chunking_strategy\`, \`expires_after\`, \`metadata\` 등.

파일을 먼저 업로드한 뒤 \`file_ids\`로 연결하는 전체 흐름은 OpenAI API Reference의 Files·Vector stores 섹션을 따르세요.

## 핵심 포인트

- OpenAI 공식: \`client.vector_stores.create\` (openai-python 소스).
- RAG 파이프라인: Embeddings 생성 → Vector store 저장 → 유사도 검색 → LLM Prompt.
- Pinecone·Weaviate 등 서드파티 Vector DB는 각 제품 공식 문서를 참고하세요.

## 참고

- openai-python \`vector_stores.py\`: https://github.com/openai/openai-python/blob/main/src/openai/resources/vector_stores/vector_stores.py
- OpenAI Vector embeddings FAQ: https://platform.openai.com/docs/guides/embeddings
- Lewis et al., RAG: https://arxiv.org/abs/2005.11401`,
  },

  "fine-tuning": {
    title: "OpenAI fine_tuning.jobs.create",
    source: "https://github.com/openai/openai-python/blob/main/src/openai/resources/fine_tuning/jobs/jobs.py",
    body: `## 시나리오

특정 톤·도메인 용어·출력 형식을 안정적으로 맞추려면 **Fine-tuning**으로 모델 가중치를 추가 학습합니다.

## 따라하기

1. 학습 데이터를 JSONL로 준비하고 Files API로 업로드합니다 (\`purpose: fine-tune\`). 업로드 API는 OpenAI API Reference "Files create"를 참고하세요.

2. Fine-tuning job 생성 (SDK docstring 예시 파라미터):

\`\`\`python
from openai import OpenAI

client = OpenAI()

job = client.fine_tuning.jobs.create(
    model="gpt-4o-mini",
    training_file="file-XXXXXXXX",  # 업로드된 파일 ID
)
print(job.id)
print(job.status)
\`\`\`

\`jobs.create\` 시그니처(소스): 필수 \`model\`, \`training_file\`; 선택 \`validation_file\`, \`hyperparameters\`, \`suffix\` 등.

## 핵심 포인트

- 공식 메서드: \`client.fine_tuning.jobs.create\`.
- 지원 모델 목록은 OpenAI Fine-tuning 가이드의 "Which models can be fine-tuned"를 확인하세요.
- Prompt 튜닝만으로 충분하면 Fine-tuning 없이 시작하는 것이 일반적입니다.

## 참고

- openai-python \`fine_tuning/jobs/jobs.py\`: https://github.com/openai/openai-python/blob/main/src/openai/resources/fine_tuning/jobs/jobs.py
- OpenAI Fine-tuning guide: https://platform.openai.com/docs/guides/fine-tuning`,
  },

  orchestration: {
    title: "Orchestrator-Workers 워크플로",
    source: "https://www.anthropic.com/engineering/building-effective-agents",
    body: `## 시나리오

한 Agent가 조사·작성·검토를 모두 하면 품질이 떨어질 수 있습니다. **Orchestration**은 작업을 나누어 여러 Worker(또는 Subagent)에 분배합니다.

## 따라하기

Anthropic "Building effective agents"의 **orchestrator-workers** 패턴:

1. **Orchestrator** LLM이 작업을 하위 작업으로 분해
2. 각 하위 작업을 **Worker** LLM/Agent에 위임
3. Worker 결과를 Orchestrator가 취합·통합

의사 코드:

\`\`\`text
User goal
  → Orchestrator: subtasks [A, B, C]
  → Worker 1: subtask A → result A
  → Worker 2: subtask B → result B
  → Orchestrator: merge → final answer
\`\`\`

**확인된 공식 기능이 없는 부분**: \`orchestrator.dispatch()\` 같은 표준 API는 확인되지 않았습니다. LangGraph·Cursor Subagent 등 구현은 제품별 문서를 참고하세요.

## 핵심 포인트

- Orchestration은 **워크플로 패턴** 이름이지 단일 SDK 메서드가 아닙니다.
- Subagent는 Orchestration의 하위 실행 단위입니다.
- Observability로 각 Worker의 Tool Use·지연을 추적합니다.

## 참고

- Anthropic, "Building effective agents" (orchestrator-workers): https://www.anthropic.com/engineering/building-effective-agents
- Cursor Docs, "Agent Skills" (Subagents 언급): https://cursor.com/docs/context/skills`,
  },

  subagent: {
    title: "Cursor subagentStart Hook",
    source: "https://cursor.com/docs/context/skills",
    body: `## 시나리오

복잡한 조사·리뷰를 메인 Agent와 분리하려면 **Subagent**에 위임합니다. Cursor는 Task 도구로 Subagent를 실행하며, Hook으로 시작·종료를 제어할 수 있습니다.

## 따라하기

Cursor Hooks 문서에 따르면 \`subagentStart\` / \`subagentStop\` 이벤트가 있습니다. matcher 예: \`generalPurpose\`, \`explore\`, \`shell\`.

\`\`\`json
{
  "version": 1,
  "hooks": {
    "subagentStart": [
      {
        "command": ".cursor/hooks/log-subagent.sh",
        "matcher": "generalPurpose"
      }
    ]
  }
}
\`\`\`

\`version\`, \`hooks\`, \`command\`, \`matcher\` 필드는 Cursor Hooks 스키마에 정의되어 있습니다.

**확인된 공식 기능이 없는 부분**: 범용 OSS "Subagent" 라이브러리 API는 이 예시에서 확인하지 못했습니다. Cursor·Anthropic beta Agents 등 제품별 API를 사용하세요.

## 핵심 포인트

- Subagent = Orchestration 아래 특정 하위 목표 전담 Agent.
- Cursor: \`subagentStart\` Hook으로 실행 전 감사·차단 가능.
- Anthropic SDK \`examples/agents.py\`는 beta Agents/Sessions API를 보여 줍니다.

## 참고

- Cursor Docs, "Agent Skills": https://cursor.com/docs/context/skills
- Anthropic \`examples/agents.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/agents.py`,
  },

  streaming: {
    title: "messages.stream으로 토큰 단위 수신",
    source: "https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/messages_stream.py",
    body: `## 시나리오

긴 답변을 한꺼번에 기다리면 UX가 나빠집니다. **Streaming**은 생성되는 Token을 순차적으로 받습니다.

## 따라하기

Anthropic SDK \`examples/messages_stream.py\`:

\`\`\`python
import asyncio
from anthropic import AsyncAnthropic

client = AsyncAnthropic()

async def main() -> None:
    async with client.messages.stream(
        max_tokens=1024,
        messages=[{"role": "user", "content": "Say hello there!"}],
        model="claude-sonnet-4-5-20250929",
    ) as stream:
        async for event in stream:
            if event.type == "text":
                print(event.text, end="", flush=True)
            elif event.type == "content_block_stop":
                print()
    accumulated = await stream.get_final_message()
    print(accumulated.to_json())

asyncio.run(main())
\`\`\`

Tool Use + Streaming은 \`examples/tools_stream.py\`의 \`input_json\` 이벤트를 참고하세요.

## 핵심 포인트

- 공식 API: \`client.messages.stream\` (AsyncAnthropic).
- \`event.type == "text"\`일 때 \`event.text\`를 출력합니다.
- OpenAI Function calling 가이드도 streaming tool call 이벤트를 문서화합니다.

## 참고

- Anthropic \`messages_stream.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/messages_stream.py
- Anthropic \`tools_stream.py\`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools_stream.py
- OpenAI Function calling (streaming): https://developers.openai.com/api/docs/guides/function-calling`,
  },

  observability: {
    title: "Cursor postToolUse Hook으로 도구 호출 로깅",
    source: "https://cursor.com/docs/context/skills",
    body: `## 시나리오

Agent가 어떤 Tool Use를 했는지 모르면 디버깅이 어렵습니다. **Observability**는 루프 안 이벤트를 기록·추적합니다.

## 따라하기

Cursor Hooks의 \`postToolUse\` 이벤트는 도구 실행 **후**에 실행됩니다. matcher로 \`Shell\`, \`Read\`, \`MCP: ...\` 등 도구 타입을 필터할 수 있습니다.

\`\`\`json
{
  "version": 1,
  "hooks": {
    "postToolUse": [
      {
        "command": ".cursor/hooks/log-tool.sh"
      }
    ]
  }
}
\`\`\`

Hook 스크립트는 stdin으로 JSON을 받고 stdout으로 JSON을 반환합니다 (Cursor Hooks 문서).

Anthropic "Building effective agents"는 프로덕션 전 **테스트·sandbox** 환경에서 관측할 것을 권고합니다.

**확인된 공식 기능이 없는 부분**: AI Agent 범용 표준 Observability API(예: 단일 \`trace.span()\`)는 이 예시에서 확인하지 못했습니다.

## 핵심 포인트

- Harness 루프마다 Tool Use·Latency·오류를 남깁니다.
- Cursor: \`postToolUse\`, \`postToolUseFailure\`, \`afterShellExecution\` 등.
- Evaluation·Vector DB 검색 품질도 Observability 대상입니다.

## 참고

- Cursor Docs, "Agent Skills" (Hooks): https://cursor.com/docs/context/skills
- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents`,
  },

  evaluation: {
    title: "Evaluator-Optimizer 워크플로",
    source: "https://www.anthropic.com/engineering/building-effective-agents",
    body: `## 시나리오

Agent 출력이 요구사항을 만족하는지 자동으로 검증하려면 **Evaluation** 루프가 필요합니다.

## 따라하기

Anthropic "Building effective agents"의 **evaluator-optimizer** 패턴:

1. **Generator** LLM이 초안 생성
2. **Evaluator** LLM이 기준(정확성·형식·안전)으로 채점·피드백
3. 점수 미달 시 Generator가 수정 → 2번 반복

의사 코드:

\`\`\`text
draft = generator(user_task)
feedback = evaluator(draft, rubric)
while not feedback.passed:
    draft = generator(user_task, feedback)
    feedback = evaluator(draft, rubric)
return draft
\`\`\`

Agent Skills 사이트에는 스킬 품질 평가 가이드(\`evaluating-skills\`)가 별도로 있습니다.

**확인된 공식 기능이 없는 부분**: 범용 \`evaluate()\` 단일 API는 Anthropic/OpenAI 공식 SDK에서 확인되지 않았습니다.

## 핵심 포인트

- Evaluation은 Planning·RAG·Fine-tuning 효과를 검증하는 데 씁니다.
- Evaluator는 별도 Prompt(또는 별도 모델)로 구현합니다.
- Observability 로그와 함께 오프라인 벤치마크 세트를 운영하세요.

## 참고

- Anthropic, "Building effective agents" (evaluator-optimizer): https://www.anthropic.com/engineering/building-effective-agents
- Agent Skills, "Evaluating skills": https://agentskills.io/skill-creation/evaluating-skills.md`,
  },
};

function renderExample(id, { title, source, body }) {
  return `---
id: ${id}
status: ready
title: "${title.replace(/"/g, '\\"')}"
source: "${source}"
---

${body.trim()}
`;
}

const index = JSON.parse(
  fs.readFileSync(path.join(root, "data", "glossary-index.json"), "utf8")
);

let written = 0;
for (const term of index) {
  const ex = EXAMPLES[term.id];
  if (!ex) {
    console.error("missing example content:", term.id);
    process.exit(1);
  }
  const out = path.join(examplesDir, `${term.id}.md`);
  fs.writeFileSync(out, renderExample(term.id, ex));
  written++;
  console.log("wrote", term.id);
}

console.log(`done ${written} examples`);
