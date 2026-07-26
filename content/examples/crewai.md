---
id: crewai
status: ready
title: "Agent·Task·Crew로 리서치 크루 만들기"
source: "https://docs.crewai.com/v1.14.7/en/quickstart"
---

## 시나리오

역할이 다른 여러 **AI Agent**를 협업시켜 하나의 작업(예: 리서치 후 보고서 작성)을 완수하고 싶을 때, 직접 오케스트레이션 코드를 짜지 않고 **CrewAI**의 Agent·Task·Crew 추상화를 씁니다.

## 따라하기

1. CrewAI를 설치합니다.

```bash
pip install crewai
```

2. 역할·목표·도구를 가진 Agent와, 그 Agent가 수행할 Task를 정의합니다.

```python
from crewai import Agent, Crew, Process, Task
from crewai_tools import SerperDevTool

researcher = Agent(
    role="Senior Researcher",
    goal="주제에 대한 최신 정보를 정확하게 조사한다",
    backstory="다양한 산업 리서치 경험이 있는 애널리스트",
    tools=[SerperDevTool()],
)

research_task = Task(
    description="{topic}에 대해 조사하고 핵심 사실을 정리한다",
    expected_output="핵심 사실 5가지가 담긴 요약",
    agent=researcher,
)
```

3. Agent·Task를 Crew로 묶고 실행 순서를 지정합니다.

```python
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    process=Process.sequential,
)

result = crew.kickoff(inputs={"topic": "AI Agent 배포 플랫폼 동향"})
print(result)
```

## 핵심 포인트

- `Agent`는 role·goal·backstory·tools로 정의하고, `Task`는 description·expected_output·담당 Agent로 정의합니다.
- `Crew`는 Agent+Task 목록과 실행 방식(`Process.sequential`·`Process.hierarchical`)을 받아 `kickoff()`로 실행합니다.
- 조건 분기·상태 관리가 필요한 복잡한 파이프라인은 Crew 대신 Flow를 씁니다.

## 참고

- CrewAI Quickstart: https://docs.crewai.com/v1.14.7/en/quickstart
