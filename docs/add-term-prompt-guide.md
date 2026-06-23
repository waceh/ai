# 용어 추가 프롬프트 가이드

AI 용어사전에 항목을 추가·수정할 때, 에이전트(Cursor 등)에 넘길 프롬프트 작성법입니다.

최종 수정: 2026-06-23

---

## 목적

- `data/glossary-index.json`, `content/terms/*.md`, `content/examples/*.md`를 프로젝트 규칙에 맞게 한 번에 반영
- 본문 구조·연결 용어·FACT-ONLY 예시를 빠뜨리지 않기

로컬 편집·배포 방법은 [README.md](../README.md)를 참고합니다.

---

## 추가 시 건드리는 파일

| 파일 | 역할 |
|------|------|
| `data/glossary-index.json` | `id`, `name`, `category`, `oneLine`, `connections` |
| `content/terms/{id}.md` | 세부 설명 본문 |
| `content/examples/{id}.md` | 실무 예시 (`status: draft` \| `ready`) |
| `glossary-bundle.js` | GitHub Pages·`file://` 확인용 (빌드 산출물) |

`category` 값: `core` · `agent` · `env`

---

## 세부 설명 본문 구조 (`content/terms/{id}.md`)

상단 `## 개요`·`## 세부 내용` 래퍼는 쓰지 않습니다.

```markdown
---
id: example-id
---

### 개요

(정의 1~2문단 + 비유 + **유의사항:** 한 문단)

### 사용목적

(왜 쓰는지, 언제 필요한지)

### 동작/구조

(동작 요약 + 관련 개념 bullet)

- **연결용어명**: 짧은 설명

## 참고

- 공식 문서 제목 — URL
```

### 연결 용어(connections) 규칙

- `glossary-index.json`의 `connections`는 **다른 용어의 `id`** 배열입니다.
- 본문 인라인 링크는 **`name` 문자열**로 매칭됩니다.  
  예: `"tool-use"` → 본문에 `Tool Use` 또는 `**Tool Use**` 포함 필요.
- `개요` + `사용목적` + `동작/구조` 구간에 connections의 **모든 `name`**이 들어가야 합니다.

---

## 예시 파일 (`content/examples/{id}.md`)

```markdown
---
id: example-id
status: ready
title: "예시 제목"
source: "https://..."
---

## 시나리오

## 따라하기

## 핵심 포인트

## 참고
```

- `status: ready`일 때만 UI에 표시됩니다.
- **FACT-ONLY**: API·패키지·메서드는 공식 문서·소스에서 확인된 것만 사용합니다.
- 확인되지 않으면 가상 API를 만들지 말고 본문에 **「확인된 공식 기능이 없다」**고 적습니다.

---

## 프롬프트 템플릿

### 용어 1개 추가 (본문 + 예시)

아래 블록을 복사한 뒤 `[...]`만 채워서 사용합니다.

```text
이 프로젝트(AI Agent & Ecosystem Glossary)에 용어 1개를 추가해줘.

[용어 정보]
- id: (kebab-case, 예: prompt-cache)
- name: (표시명, 예: Prompt Cache)
- englishName: (영문 정식명)
- category: core | agent | env
- oneLine: (목록 한 줄 정의, 한국어)
- connections: (기존 용어 id 배열, 예: ["llm", "prompt", "token"])

[작업]
1. data/glossary-index.json에 항목 추가
2. content/terms/{id}.md 작성 (### 개요 / ### 사용목적 / ### 동작/구조 / ## 참고)
3. connections의 name이 개요+사용목적+동작/구조에 모두 포함되게 작성
4. content/examples/{id}.md 작성 (status: ready, FACT-ONLY)
5. 새 용어와 connections로 묶인 기존 용어 본문·connections 보강이 필요하면 함께 수정
6. connections 검증 후 node scripts/build-bundle.js 실행

[제약]
- FACT-ONLY: 공식 문서·소스에서 확인된 API·패키지만
- 주니어가 읽기 쉬운 한국어, 장황한 소제목 금지
- 유의사항은 ### 개요 안에 "유의사항:" 접두어로 통합
```

### 본문만 먼저 (예시는 나중)

```text
용어 "{name}" (id: {id})를 glossary에 추가해줘.
index.json + content/terms/{id}.md만 작성하고,
content/examples/{id}.md는 scaffold만 (status: draft).

category: {core|agent|env}
oneLine: ...
connections: [...]

본문 구조: ### 개요 / ### 사용목적 / ### 동작/구조 / ## 참고
connections name은 본문에 전부 포함.
```

### 여러 용어 한꺼번에

```text
용어 N개를 추가해줘. 각각 index + terms + examples(status: ready)까지.

| id | name | category | connections |
|----|------|----------|-------------|
| ... | ... | ... | id1, id2 |

공통: 본문 구조 동일, FACT-ONLY 예시, connections 검증, build-bundle.js
```

### 기존 용어 수정

```text
content/terms/{id}.md 의 {섹션}을 수정해줘.

- 구조 유지: ### 개요 / ### 사용목적 / ### 동작/구조 / ## 참고
- connections name 누락 없게
- md 직접 수정 후 node scripts/build-bundle.js
```

---

## 채워 넣은 예시 (가상 용어)

```text
용어를 추가해줘.

id: prompt-cache
name: Prompt Cache
englishName: Prompt Caching
category: core
oneLine: 반복되는 system/user 프롬프트를 캐시해 지연·비용을 줄이는 기능
connections: ["llm", "prompt", "token", "context-window"]

Anthropic Prompt caching 공식 문서만 근거로 본문·예시 작성.
문서에 없는 API·메서드는 쓰지 말 것.

작업 후 build-bundle.js 실행.
```

---

## 작업 후 검증

### 로컬 (빌드 없이)

```bash
python3 -m http.server 8000
```

브라우저: http://localhost:8000

- [ ] 좌측 목록에 새 용어 표시
- [ ] 상단 우측 연관 태그(2줄) 표시
- [ ] 본문에서 connections 용어 클릭 시 이동
- [ ] 예시 `status: ready`면 예시 섹션 표시

### 배포 전

```bash
node scripts/build-bundle.js
```

`glossary-bundle.js`를 커밋한 뒤 push합니다.

---

## 자주 하는 실수

| 실수 | 결과 |
|------|------|
| `connections`에 id만 넣고 본문에 `name` 미포함 | 인라인 링크 안 생김 |
| `id`와 파일명 불일치 (`tool_use` vs `tool-use.md`) | 로드 실패 |
| 예시에 미확인 API 이름 작성 | FACT-ONLY 위반 |
| `build-bundle.js` 생략 후 GitHub 배포 | Pages에서 새 용어·예시 미반영 |

---

## 관련 스크립트

```bash
# 예시 플레이스홀더만 생성 (파일 없을 때)
node scripts/scaffold-examples.js

# index + terms + examples → glossary-bundle.js
node scripts/build-bundle.js
```

`scripts/term-details-enriched.js`는 일괄 본문 소스로 쓸 수 있으나, 단일 용어 추가 시에는 `content/terms/{id}.md`를 직접 편집하는 편이 단순합니다.
