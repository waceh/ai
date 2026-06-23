---
id: planning
status: ready
title: "ReAct: Thought → Action → Observation"
source: "https://arxiv.org/abs/2210.03629"
---

## 시나리오

"리포지토리 이슈를 조사해 요약해줘"처럼 여러 단계가 필요할 때 **Planning**은 문제를 나누고 순서를 정합니다.

## 따라하기

Yao et al., "ReAct" (arXiv:2210.03629)은 LLM이 추론(Thought)과 행동(Action)을 번갈아 수행하는 패턴을 제안합니다. 논문에 나온 루프 구조:

1. **Thought** — 다음에 무엇을 할지 추론
2. **Action** — 도구/API 이름 선택
3. **Action Input** — 도구 인자
4. **Observation** — 도구 실행 결과
5. 위를 반복해 최종 답 도출

Anthropic SDK `tools.py`는 이 루프의 **Action/Observation** 부분을 `tool_use` / `tool_result`로 구현합니다.

```python
# Planning(추론)은 모델 응답에 포함되고,
# Action은 stop_reason == "tool_use" 로 표현됩니다.
message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Find and summarize open issues"}],
    tools=tools,
)
```

**확인된 공식 기능이 없는 부분**: "Planning"이라는 이름의 단일 표준 API는 Anthropic/OpenAI 공식 SDK에서 확인되지 않았습니다. ReAct·CoT 등은 Prompt/루프 패턴입니다.

## 핵심 포인트

- Planning은 별도 라이브러리가 아니라 **Agent 루프 안의 추론 단계**입니다.
- ReAct 논문: https://arxiv.org/abs/2210.03629
- Anthropic은 orchestrator-workers·prompt chaining 등 **워크플로 패턴**도 문서화합니다.

## 참고

- Yao et al., ReAct: https://arxiv.org/abs/2210.03629
- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
- Anthropic `tools.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/tools.py
