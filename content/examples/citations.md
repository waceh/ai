---
id: citations
status: ready
title: "RAG 답변에 원문 인용 자동으로 달기"
source: "https://platform.claude.com/docs/en/build-with-claude/citations"
---

## 시나리오

사내 문서 기반 Q&A 답변에, 사용자가 실제로 어느 문서 어느 부분을 근거로 했는지 확인할 수 있게 하고 싶습니다.

## 따라하기

Claude Platform 공식 문서 기준:

1. RAG 검색으로 찾은 관련 문서를 일반 텍스트가 아닌 인용 지원 document 콘텐츠 블록으로 요청에 포함
2. 문서 블록에 `citations: {enabled: true}` 옵션 지정
3. Claude가 답변 생성 시 문서 원문을 직접 인용하며 답변 작성
4. 응답에 문장별로 문서 인덱스·문자 오프셋·인용 원문이 담긴 citation 객체 포함
5. 클라이언트가 이 정보로 답변 옆에 출처 표시(예: 각주) 렌더링

## 핵심 포인트

- Citations는 프롬프트로 "출처 밝혀줘"라고 요청하는 것보다 관련 인용 적중률이 높다고 Anthropic은 평가합니다.
- PDF·plain text 등 지원 형식의 문서에 적용할 수 있습니다.
- RAG 파이프라인의 신뢰도·검증 가능성을 높이는 용도로 Evaluation·Observability와 함께 씁니다.

## 참고

- Claude Platform Docs, "Citations": https://platform.claude.com/docs/en/build-with-claude/citations
