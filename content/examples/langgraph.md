---
id: langgraph
status: ready
title: "StateGraph로 최소 그래프 만들기"
source: "https://docs.langchain.com/oss/python/langgraph/overview"
---

## 시나리오

에이전트 실행 흐름에 조건 분기·재시도가 필요해지면, 단순 반복 루프 대신 **LangGraph**의 `StateGraph`로 노드·엣지 그래프를 명시적으로 설계합니다.

## 따라하기

1. LangGraph를 설치합니다.

```bash
pip install -U langgraph
```

2. 상태를 정의하고, 상태를 받아 갱신하는 노드 함수를 작성합니다.

```python
from langgraph.graph import StateGraph, MessagesState, START, END

def mock_llm(state: MessagesState):
    return {"messages": [{"role": "ai", "content": "hello world"}]}

graph = StateGraph(MessagesState)
graph.add_node(mock_llm)
graph.add_edge(START, "mock_llm")
graph.add_edge("mock_llm", END)
```

3. `.compile()`로 실행 가능한 그래프를 만든 뒤 `invoke()`로 실행합니다.

```python
app = graph.compile()
result = app.invoke({"messages": [{"role": "user", "content": "hi!"}]})
print(result)
```

## 핵심 포인트

- `StateGraph`는 빌더일 뿐이며, `.compile()`을 호출해야 `invoke()`·`stream()`·`ainvoke()`로 실행할 수 있습니다.
- 노드는 상태를 입력받아 갱신된 상태(또는 갱신할 필드)를 반환하는 함수입니다.
- `add_edge`로 노드 간 연결을 정의하며, 조건부 엣지를 쓰면 상태에 따라 다음 노드를 분기할 수 있습니다.

## 참고

- LangGraph Overview: https://docs.langchain.com/oss/python/langgraph/overview
