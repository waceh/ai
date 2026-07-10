---
id: confidence-calibration
---

### 개요

Confidence Calibration은 모델이 표현하는 확신도(예: "90% 확실")가 실제 정답률과 얼마나 일치하는지를 다루는 신뢰성 관행입니다.

비유하면, "일기예보가 '강수확률 90%'라고 했을 때 실제로 열 번 중 아홉 번은 비가 와야 신뢰할 수 있는 예보"인 것과 같습니다. 완벽하게 보정된(calibrated) 모델은 특정 확신도로 낸 예측들의 실제 정답 비율이 그 확신도 값과 거의 일치합니다. **AI Agent**가 여러 단계를 거치며 판단할 때, 초기 단계의 과신(overconfidence)이 뒤 단계로 그대로 전파되면 **Error Propagation** 문제가 커지므로, 언제 **HITL**로 넘길지 판단하는 근거로도 쓰입니다.

유의사항: Confidence Calibration ≠ Evaluation입니다. Evaluation은 "출력이 정답에 가까운가"를 채점하는 과정이고, Confidence Calibration은 "모델이 스스로 표현한 확신도가 그 정답률과 맞는가"를 다루는, Evaluation의 하위 관심사에 가깝습니다.

### 사용목적

Agent가 자동 진행할지 사람에게 에스컬레이션할지 결정하는 기준으로 확신도를 쓰려 할 때, 그 확신도가 실제로 믿을 만한지 점검하려는 목적입니다.

### 동작/구조

모델에 답변과 함께 확신도(수치 또는 언어적 표현)를 요청 → 골든 데이터셋으로 각 확신도 구간별 실제 정답률 집계 → 확신도와 정답률 차이(calibration error)를 측정 → 차이가 크면 임계값 조정, **Prompt** 수정 또는 **Few-shot Prompting** 예시 보강으로 보정.

**확인된 공식 기능이 없는 부분**: Claude API·SDK에 전용 `calibrate()` 메서드는 확인되지 않았습니다. Confidence Calibration은 **Evaluation** 파이프라인 위에서 직접 구현하는 관행이며, 이 프로젝트에서는 Claude Certified Architect Foundations 커리큘럼(Domain 5)에서 다루는 개념으로 정리했습니다.

- **Evaluation**: Confidence Calibration을 측정하는 상위 파이프라인
- **HITL**: 낮은 확신도일 때 에스컬레이션하는 대상
- **Observability**: 확신도·정답률 데이터를 기록·추적하는 수단
- **AI Agent**: 여러 단계 판단마다 Confidence Calibration이 필요한 대상
- **Prompt**: 보정을 위해 조정하는 대상
- **Few-shot Prompting**: 확신도 표현 패턴을 예시로 보강하는 수단

## 참고

- Anthropic, "Building effective agents" (evaluation·human checkpoints 배경): https://www.anthropic.com/engineering/building-effective-agents
