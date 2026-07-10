---
id: confidence-calibration
status: ready
title: "확신도 구간별 정답률 점검하기"
source: "https://www.anthropic.com/engineering/building-effective-agents"
---

## 시나리오

Agent가 "80% 확신" 이하로 답하면 사람에게 넘기도록 설계했는데, 실제로 그 80%가 믿을 만한 수치인지 확인하고 싶습니다.

## 따라하기

일반적인 Calibration 점검 절차(공식 전용 API 없음, 자체 구현 패턴):

1. 골든 데이터셋으로 Agent에 답변 + 확신도(수치 또는 "높음/중간/낮음") 요청
2. 확신도 구간별(예: 90~100%, 70~90% 등)로 실제 정답률 집계
3. 확신도와 실제 정답률 차이(calibration error)를 표로 확인
4. 차이가 크면 에스컬레이션 임계값 조정, 또는 Prompt·Few-shot Prompting 예시 보강

**확인된 공식 기능이 없는 부분**: Claude API·SDK에 전용 calibration 측정 엔드포인트는 없습니다. 위 절차는 Evaluation 파이프라인을 직접 구성해 구현해야 합니다.

## 핵심 포인트

- "확신도 90% = 실제 정답률 90%"에 가까울수록 잘 보정된 것입니다.
- 과신(overconfidence)은 Multi-Agent 시스템에서 오류 전파 위험을 키웁니다.
- HITL 에스컬레이션 임계값을 정할 때 Calibration 데이터를 근거로 삼습니다.

## 참고

- Anthropic, "Building effective agents": https://www.anthropic.com/engineering/building-effective-agents
