---
id: agent-sdk
status: ready
title: "Python으로 커스텀 코딩 에이전트 만들기"
source: "https://platform.claude.com/docs/en/agent-sdk/overview"
---

## 시나리오

CLI가 아니라 자체 백엔드 서비스 안에서, Claude Code와 동일한 파일 읽기·명령 실행 능력을 가진 에이전트를 돌리고 싶습니다.

## 따라하기

Anthropic 공식 문서 기준 개념 흐름:

1. Python 3.10+ 환경에 Agent SDK 패키지 설치
2. 허용할 도구·권한·MCP 서버를 설정해 에이전트 인스턴스 생성
3. 작업 프롬프트 전달
4. SDK 내장 도구(파일 읽기, 명령 실행, 코드 편집)가 자동으로 Tool Use 루프 처리
5. 결과를 애플리케이션 로직에서 받아 처리

**확인된 공식 기능이 없는 부분**: 구체적인 함수 시그니처는 SDK 버전마다 다를 수 있어, 정확한 API는 설치한 버전의 공식 문서를 확인해야 합니다.

## 핵심 포인트

- Agent SDK는 Claude Code를 움직이는 것과 같은 도구·루프·컨텍스트 관리를 코드로 제공합니다.
- 별도로 Tool Use 실행기를 직접 구현하지 않아도 됩니다.
- MCP 서버를 도구로 연결해 외부 데이터·기능을 확장할 수 있습니다.

## 참고

- Anthropic, "Agent SDK overview": https://platform.claude.com/docs/en/agent-sdk/overview
- anthropics/claude-agent-sdk-python: https://github.com/anthropics/claude-agent-sdk-python
