---
id: langgraph
---

### 개요

LangGraph는 LangChain Inc가 만든 오픈소스(MIT) Python/JS 프레임워크로, **AI Agent**의 실행 흐름을 노드(단계)와 엣지(연결)로 이루어진 그래프로 표현해 상태를 유지하며 반복·분기시킵니다. LangChain 없이도 독립적으로 쓸 수 있습니다.

비유하면, LangGraph는 "흐름도로 짜는 에이전트"입니다. 각 노드가 **LLM** 호출이나 **Tool Use** 실행을 맡고, 엣지가 다음에 어떤 노드로 갈지 정하며, 조건에 따라 되돌아가거나 분기할 수 있습니다.

유의사항: `StateGraph`는 빌더일 뿐이라 `.compile()`을 호출해야 `invoke()`·`stream()`으로 실행 가능한 그래프가 됩니다. **AgentCore Runtime**은 LangGraph로 만든 에이전트도 배포 대상 프레임워크로 명시적으로 지원합니다.

### 사용목적

**Planning** 단계가 복잡해지고 되돌아가기(재시도)·조건 분기가 필요해지면, 단순 반복 루프만으로는 흐름을 표현하기 어렵습니다. LangGraph는 이런 흐름을 그래프로 명시적으로 설계해 상태 관리·재개가 가능한 에이전트를 만들려는 목적으로 씁니다.

### 동작/구조

`pip install -U langgraph`로 설치한 뒤 `StateGraph(State)`에 노드(함수)와 `add_edge`로 연결을 정의하고 `.compile()`로 실행 가능한 그래프를 만듭니다. `graph.invoke(...)`를 호출하면 `START`에서 시작해 엣지를 따라 노드를 실행하며 상태를 누적하고, `END`에 도달하면 종료합니다.

- **AI Agent**: LangGraph 그래프가 구현하는 실행 흐름의 대상
- **LLM**: 각 노드에서 호출되는 추론 코어
- **Tool Use**: 노드 안에서 실행되는 도구 호출 동작
- **Planning**: LangGraph의 그래프·조건 분기로 표현되는 추론 단계 설계
- **AgentCore Runtime**: LangGraph로 만든 에이전트를 배포할 수 있는 실행 계층

## 참고

- LangGraph Overview: https://docs.langchain.com/oss/python/langgraph/overview
- LangGraph (GitHub): https://github.com/langchain-ai/langgraph
