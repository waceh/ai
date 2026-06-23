# AI Agent & Ecosystem Glossary

AI 에이전트·LLM·MCP·Harness 등 현대 AI 핵심 용어를 한곳에서 탐색하는 정적 웹 용어사전입니다. 용어 간 연결 관계를 그래프로 보여 주고, 세부 설명 본문에서 관련 용어를 클릭해 이동할 수 있습니다.

## 주요 기능

- **25개 용어** — LLM, AI Agent, MCP, Skills, RAG, Tool Use 등
- **카테고리·검색** — 탭 필터와 실시간 검색
- **연결 그래프** — 용어 간 관계 시각화
- **세부 설명** — Markdown 기반 본문(개요, 세부 내용, 검증 근거)
- **인라인 링크** — 본문에 등장하는 연결 용어를 클릭해 해당 항목으로 이동

## 기술 구성

| 구분 | 설명 |
|------|------|
| 프론트엔드 | HTML, CSS, Vanilla JavaScript (빌드 도구 없음) |
| 데이터 | `data/glossary-index.json` + `content/terms/*.md` |
| 배포 번들 | `glossary-bundle.js` (GitHub Pages용, `scripts/build-bundle.js` 생성) |
| 서버 | 불필요 (정적 파일 호스팅) |

## 프로젝트 구조

```
ai/
├── index.html              # 앱 진입점
├── app.js                  # 검색, 그래프, 용어 상세 렌더링
├── style.css
├── data/
│   └── glossary-index.json # 용어 메타데이터(id, name, category, connections 등)
├── content/terms/          # 용어별 Markdown 세부 설명
├── glossary-bundle.js      # 배포·file:// 로컬 확인용 번들
└── scripts/
    ├── build-bundle.js     # index + md → glossary-bundle.js
    └── write-term-descriptions.js  # 세부 설명 일괄 생성 스크립트
```

## 빠른 시작

로컬 확인은 두 가지 방법이 있습니다.

**방법 A — 서버 + 빌드 없음** (용어 수정·반복 작업에 적합)

```bash
python3 -m http.server 8000
```

브라우저에서 [http://localhost:8000](http://localhost:8000) 을 엽니다. `md`/`json` 수정 후 새로고침만 하면 반영됩니다.

**방법 B — 빌드 후 파일 직접 열기** (서버 없이 한 번 확인)

```bash
node scripts/build-bundle.js
```

이후 `index.html`을 브라우저에서 직접 엽니다 (`file://`). `glossary-bundle.js`가 로드되면 동작합니다. 내용을 바꿀 때마다 빌드를 다시 실행해야 합니다.

> `file://`로 열었는데 번들이 없으면 `fetch`가 실패해 화면이 뜨지 않습니다. 이 경우 방법 A를 쓰거나, 먼저 `build-bundle.js`를 실행하세요.

## 용어 추가·수정

1. `data/glossary-index.json`에 항목 추가 또는 수정 (`id`, `name`, `category`, `oneLine`, `connections`)
2. `content/terms/{id}.md`에 세부 설명 작성
3. `connections`에 넣은 용어의 `name`이 본문에 포함되어야 인라인 링크가 생성됩니다

---

## 개발시 참고 내용

`app.js`는 호스트에 따라 데이터 로딩 방식을 나눕니다.

| 호스트 | 데이터 소스 | 빌드 |
|--------|-------------|------|
| `localhost` / `127.0.0.1` | `fetch`로 `data/` + `content/terms/` 직접 읽기 | 불필요 |
| 그 외 (`file://`, GitHub Pages 등) | `glossary-bundle.js` | 필요 |

### 방법 A — 로컬에서 콘텐츠 편집할 때 (권장)

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 으로 엽니다.

- `data/glossary-index.json`, `content/terms/*.md` 를 수정
- 저장 → 새로고침만 하면 바로 반영
- `build-bundle.js`는 돌리지 않아도 됨

### 방법 B — 서버 없이 로컬에서 확인할 때

```bash
node scripts/build-bundle.js
```

`index.html`을 더블클릭하거나 브라우저에서 직접 엽니다. GitHub Pages와 같은 경로(번들)로 동작합니다. 수정할 때마다 빌드를 다시 실행해야 합니다.

### GitHub에 올릴 때

```bash
node scripts/build-bundle.js
git add glossary-bundle.js
git push
```

| 환경 | 빌드 | 확인 방법 |
|------|------|-----------|
| 로컬 편집 (`localhost`) | 불필요 | `python3 -m http.server 8000` |
| 로컬 확인 (`file://`) | 매번 | `node scripts/build-bundle.js` 후 `index.html` 열기 |
| GitHub 배포 | push 전 1회 | `node scripts/build-bundle.js` 후 커밋 |
