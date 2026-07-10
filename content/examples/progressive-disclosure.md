---
id: progressive-disclosure
status: ready
title: "대용량 참고 문서를 담은 Skill 설계"
source: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills"
---

## 시나리오

PDF 처리 Skill에 API 레퍼런스·예시 코드·트러블슈팅 문서를 모두 담고 싶지만, 매번 전체를 컨텍스트에 올리면 Token을 낭비합니다.

## 따라하기

Anthropic 공식 Agent Skills 문서 기준 3단계 구조:

1. **Discovery**: `SKILL.md`의 YAML frontmatter에 `name`·`description`만 간결하게 작성 → 세션 시작 시 이 설명만 로드(스킬당 약 30~50 Token)
2. **Activation**: 사용자 작업이 description과 매칭되면 `SKILL.md` 본문 전체를 컨텍스트에 로드
3. **Execution**: 본문에서 참조하는 `references/api-spec.md`, `scripts/extract.py` 등은 실제로 필요할 때만 추가로 읽음

```
my-skill/
├── SKILL.md          # name + description (항상 로드되는 부분은 이것만)
├── references/
│   └── api-spec.md   # 필요할 때만 로드
└── scripts/
    └── extract.py     # 실행 시점에만 로드
```

## 핵심 포인트

- Discovery 단계는 이름·설명만 로드해 Context Window 소비를 최소화합니다.
- Skill에는 방대한 문서를 담아도 되며, 쓰이지 않는 부분은 Token을 소비하지 않습니다.
- 참고 파일·스크립트는 SKILL.md 안에서 필요 시점에만 명시적으로 참조되도록 구성합니다.

## 참고

- Anthropic, "Equipping agents for the real world with Agent Skills": https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
