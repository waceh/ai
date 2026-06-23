---
id: prompt
---

### 개요

Prompt는 **LLM**·**AI Agent**에 전달하는 지시·질문·컨텍스트 묶음입니다. System Prompt(역할·규칙) + User Prompt(질문) + **RAG** 검색 결과 + Tool 정의가 messages로 합쳐집니다.

비유하면, Prompt는 "배우에게 주는 대본 + 무대 설정"입니다. 같은 LLM이라도 Prompt에 따라 **Tool Use** 여부·톤·**Planning** 깊이가 달라지고, **Skills**·**Guardrails** 정책이 Prompt 계층에 쌓입니다.

잘 쓴 Prompt가 출력 품질을 크게 좌우합니다. 이를 체계적으로 다루는 분야를 **프롬프트 엔지니어링**이라 부르며, In-Context Learning 때문에 예시·맥락 배치가 결과에 큰 영향을 줍니다.

유의사항: Prompt ≠ Skills입니다. Skills는 재사용 가능한 업무 절차 모듈이고, Skill 지침이 Prompt에 병합되어 LLM에 전달됩니다. Guardrails는 Prompt 입·출력을 검사합니다.

### 사용목적

같은 LLM이라도 Prompt에 따라 Tool Use 여부·톤·RAG 인용 방식·Planning 깊이가 달라집니다. Skills·System Prompt·Guardrails 정책이 Prompt 계층에 쌓입니다.

### 동작/구조

System Prompt(역할·규칙) + User Prompt(질문) + RAG 검색 결과 + Tool 정의가 messages로 LLM에 전달됩니다. Planning은 Prompt에 "단계별로 생각하라"는 지시로 유도되고, Guardrails는 Prompt 입·출력을 검사합니다.

- **LLM**: Prompt를 읽고 Token을 생성
- **AI Agent**: Prompt·Memory·Tool 결과를 누적해 루프
- **Guardrails**: Prompt 내용·Tool Use 출력 검사
- **RAG**: Prompt에 검색 근거 청크 삽입
- **Planning**: Prompt 지시로 추론·단계 분해 유도
- **Skills**: Skill 지침이 Prompt에 병합

## 참고

- Anthropic, "Building effective agents" — Appendix 2 Prompt engineering your tools: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic API primer — messages·tool use: https://platform.claude.com/docs/en/claude_api_primer
