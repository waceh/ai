---
id: progressive-disclosure
---

### 개요

Progressive Disclosure는 **Skills**가 이름·설명만 먼저 로드하고, 실제로 필요할 때만 본문·스크립트·참고 자료를 불러와 **Context Window**를 아끼는 3단계 설계 원칙입니다.

비유하면, "목차만 보다가 필요한 챕터만 펼쳐 읽는 매뉴얼"입니다. 1단계 Discovery에서는 각 Skill의 이름·설명(스킬당 약 30~50 **Token**)만 시작 시 로드하고, 2단계 Activation에서 작업이 그 설명과 맞으면 전체 SKILL.md 지침을 컨텍스트에 로드하며, 3단계 Execution에서 필요한 스크립트·참고 파일만 추가로 읽습니다.

유의사항: Progressive Disclosure ≠ Context Window 자체입니다. Context Window는 LLM이 한 번에 볼 수 있는 한도라는 자원이고, Progressive Disclosure는 그 한정된 자원을 아끼기 위해 Skills가 콘텐츠를 단계적으로만 노출하는 전략입니다.

### 사용목적

Skill 안에 방대한 문서·예시·스크립트를 담아도 쓰지 않는 내용까지 항상 Token을 소비하지 않도록 하려는 목적입니다. 이 덕분에 Skill 하나에 담을 수 있는 컨텍스트 양은 사실상 무제한에 가깝습니다.

### 동작/구조

세션 시작 시 설치된 모든 Skill의 이름·설명만 로드 → 사용자 작업이 특정 Skill 설명과 매칭되면 해당 SKILL.md 전체를 컨텍스트에 로드 → 실행 중 필요한 참고 파일·스크립트만 추가로 읽어들임 → 사용하지 않는 Skill·자료는 끝까지 Context Window에 들어오지 않음.

- **Skills**: Progressive Disclosure가 적용되는 대상
- **Context Window**: 아껴야 하는 유한 자원
- **Token**: Discovery 단계에서 최소로 소비되는 단위

## 참고

- Anthropic, "Equipping agents for the real world with Agent Skills": https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
