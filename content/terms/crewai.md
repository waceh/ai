---
id: crewai
---

### 개요

CrewAI는 **AI Agent**마다 역할(role)·목표(goal)·배경(backstory)을 부여해 여러 Agent가 팀처럼 협업하며 작업을 완수하게 하는 오픈소스(MIT) Python 프레임워크입니다. 개별 Agent에게 **Tool Use**로 쓸 도구를 지정하고, 여러 Task를 Crew로 묶어 순차·계층 프로세스로 실행합니다.

비유하면, CrewAI는 "역할극 하는 팀 빌더"입니다. `researcher`·`writer`처럼 역할을 나눠 각자 Task를 맡기고, `Process.sequential`·`Process.hierarchical`로 실행 순서를 정합니다.

유의사항: 여러 Agent를 정해진 순서·계층으로 실행하는 Crew와 달리, Flow는 조건 분기·상태 관리가 필요한 복잡한 다단계 파이프라인에 씁니다. **AgentCore Runtime**은 CrewAI로 만든 에이전트도 배포 대상 프레임워크로 명시적으로 지원합니다.

### 사용목적

Agent 하나가 모든 역할을 다 하게 하면 프롬프트가 비대해지고 결과가 불안정해집니다. CrewAI는 역할별로 Agent를 나누고 Task·Crew로 조합해, 복잡한 워크플로를 여러 전문 Agent의 협업으로 나눠 처리하려는 목적으로 씁니다.

### 동작/구조

`pip install crewai`로 설치한 뒤 `Agent`(역할·목표·도구)·`Task`(작업 정의)·`Crew`(Agent+Task 묶음, 실행 프로세스)를 정의합니다. `crew.kickoff()`를 호출하면 지정한 Process(sequential·hierarchical)에 따라 각 Agent가 맡은 Task를 실행하고, Agent에 지정된 도구는 **Tool Use**로 호출됩니다.

- **AI Agent**: CrewAI의 `Agent` 클래스가 구현하는 대상
- **Tool Use**: Agent에 지정한 도구를 호출하는 동작
- **AgentCore Runtime**: CrewAI로 만든 에이전트를 배포할 수 있는 실행 계층

## 참고

- CrewAI Quickstart: https://docs.crewai.com/v1.14.7/en/quickstart
- CrewAI (PyPI): https://pypi.org/project/crewai/
