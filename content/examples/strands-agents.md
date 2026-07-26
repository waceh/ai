---
id: strands-agents
status: ready
title: "Strands Agents 최소 예제와 모델 제공자 전환"
source: "https://strandsagents.com/docs/user-guide/quickstart/python/"
---

## 시나리오

에이전트 추론 루프·도구 호출을 직접 구현하지 않고, **Strands Agents**로 몇 줄만에 도구를 쓰는 에이전트를 만듭니다. 기본 모델 제공자(**AWS Bedrock**)에서 다른 제공자로 바꾸는 방법도 함께 확인합니다.

## 따라하기

1. SDK와 커뮤니티 도구 패키지를 설치합니다.

```bash
pip install strands-agents strands-agents-tools
```

2. 내장 도구를 붙인 최소 에이전트를 만듭니다.

```python
from strands import Agent
from strands_tools import calculator, current_time

agent = Agent(tools=[calculator, current_time])
agent("What is 25 * 48?")
```

3. 모델을 문자열 ID로 바로 지정하거나, Provider 인스턴스로 세부 설정할 수 있습니다.

```python
# 문자열로 지정
agent = Agent(model="global.anthropic.claude-sonnet-4-6")

# Provider 인스턴스로 세부 설정 (리전 등)
from strands.models import BedrockModel
model = BedrockModel(model_id="anthropic.claude-3-7-sonnet-20250219-v1:0", region_name="us-west-2")
agent = Agent(model=model)
```

## 핵심 포인트

- `Agent(tools=[...])`에 함수 목록만 넘기면 추론↔도구 호출 루프를 SDK가 대신 처리합니다.
- 기본 모델 제공자는 Amazon Bedrock(Claude)이며, Anthropic·OpenAI·Gemini·Ollama 등으로 바꿀 수 있습니다.
- 커스텀 도구는 `@tool` 데코레이터로 만들며, 함수 docstring을 LLM이 도구 설명으로 사용합니다.

## 참고

- Strands Agents Python Quickstart: https://strandsagents.com/docs/user-guide/quickstart/python/
- Strands Agents SDK (GitHub): https://github.com/strands-agents/sdk-python
