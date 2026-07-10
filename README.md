# AI Agent & Ecosystem Glossary

AI 에이전트·LLM·MCP·Harness 등 현대 AI 핵심 용어를 한곳에서 탐색하는 정적 웹 용어사전입니다. 용어 간 연결 관계를 그래프로 보여 주고, 세부 설명 본문에서 관련 용어를 클릭해 이동할 수 있습니다.

DB·백엔드 없이 HTML·CSS·JavaScript와 JSON·Markdown 파일만으로 동작하며, [GitHub Pages](https://pages.github.com/) 등 정적 호스팅에 올려 둡니다.

## 주요 기능

- **용어 사전** — LLM, AI Agent, MCP, Skills, RAG, Tool Use 등 (항목은 계속 추가)
- **FAQ** — 동작 원리·모델·제품 관련 질문
- **카테고리·검색** — 탭 필터와 실시간 검색
- **연결 그래프** — 용어 간 관계 시각화
- **세부 설명** — Markdown 기반 본문(개요, 세부 내용, 참고)
- **인라인 링크** — 본문에 등장하는 연결 용어를 클릭해 해당 항목으로 이동
- **딥링크** — `#term={id}` / `#faq={id}` 해시로 특정 용어·FAQ를 URL로 공유

## 기술 구성

| 구분 | 설명 |
|------|------|
| 프론트엔드 | HTML, CSS, Vanilla JavaScript |
| 데이터 | `data/*.json` + `content/terms/*.md` + `content/faq/*.md` (파일 기반, DB 없음) |
| 호스팅 | GitHub Pages 등 정적 파일 서빙 |
| 번들 | `glossary-bundle.js` — `file://`·Pages에서 fetch 대신 쓰는 선택적 단일 파일 (`scripts/build-bundle.js`로 갱신) |

## 프로젝트 구조

```
ai/
├── index.html              # 앱 진입점 (js/main.js를 모듈로 로드)
├── js/                     # ES module 소스
│   ├── main.js             # 부트스트랩 (초기화·이벤트·딥링크)
│   ├── state.js            # 전역 가변 상태 단일 소스
│   ├── constants.js        # 카테고리·물리·경로 상수
│   ├── data.js             # 인덱스·Markdown 로딩 (fetch/번들)
│   ├── markdown.js         # 마크다운 렌더·인라인 링크·예시
│   ├── graph.js            # 연결 그래프 캔버스
│   ├── ui.js               # 목록·상세·뷰모드·리사이저·태그
│   └── deeplink.js         # URL 해시 동기화
├── style.css
├── data/
│   ├── glossary-index.json # 용어 메타데이터
│   └── faq-index.json      # FAQ 메타데이터
├── content/
│   ├── terms/              # 용어별 Markdown
│   ├── examples/           # 용어별 실무 예시 (status: draft → ready)
│   └── faq/                # FAQ 본문 Markdown
├── glossary-bundle.js      # file://용 콘텐츠 번들 (build-bundle.js 생성)
├── app.bundle.js           # file://용 코드 번들 (build-app-bundle.js 생성)
└── scripts/
    ├── build-bundle.js     # 콘텐츠 → glossary-bundle.js + app.bundle.js 함께 갱신
    ├── build-app-bundle.js # js/*.js → app.bundle.js (클래식 단일 스크립트)
    ├── write-term-descriptions.js  # term-details-enriched.js → terms/*.md
    └── scaffold-examples.js        # examples/*.md 플레이스홀더 생성
```

## 빠른 시작

**방법 A — 로컬 서버 (빌드 없음, 권장)**

```bash
python3 -m http.server 8000
```

브라우저에서 [http://localhost:8000](http://localhost:8000) 을 엽니다. `md`/`json` 수정 후 새로고침만 하면 반영됩니다.

**방법 B — `file://`로 직접 열기 (서버 없이)**

```bash
node scripts/build-bundle.js
```

이후 `index.html`을 더블클릭해 엽니다. ES module은 `file://`에서 차단되므로, 빌드가 만든 클래식 번들 `app.bundle.js`(코드) + `glossary-bundle.js`(콘텐츠)로 동작합니다. `index.html`이 `file://`을 감지해 자동으로 `app.bundle.js`를 불러옵니다.

> 방법 B는 코드(`js/*.js`)나 콘텐츠를 바꿀 때마다 `node scripts/build-bundle.js`를 다시 실행해야 합니다. 평소 개발은 방법 A가 편합니다.

## 용어 추가·수정

1. `data/glossary-index.json`에 항목 추가 또는 수정 (`id`, `name`, `category`, `oneLine`, `connections`)
2. `content/terms/{id}.md`에 세부 설명 작성
3. `connections`에 넣은 용어의 `name`이 본문에 포함되어야 인라인 링크가 생성됩니다

용어 추가 시 에이전트 프롬프트 작성법은 [docs/add-term-prompt-guide.md](docs/add-term-prompt-guide.md)를 참고합니다.

### 예시 작성

1. `node scripts/scaffold-examples.js` — `content/examples/{id}.md` 생성 (최초 1회)
2. `_TEMPLATE.md` 형식에 맞춰 시나리오·코드·단계 작성
3. frontmatter `status: ready`로 변경하면 UI에 표시됨
4. `glossary-bundle.js`를 쓰는 경우 콘텐츠 반영 후 `node scripts/build-bundle.js` 실행

## 데이터 로딩

`js/data.js`는 프로토콜에 따라 읽는 경로만 다릅니다.

| 환경 | 코드 | 데이터 |
|------|------|--------|
| `http://` / `https://` (localhost·GitHub Pages) | `js/main.js` ES module | `fetch`로 `data/`·`content/` 직접 읽기 |
| `file://` | `app.bundle.js` 클래식 번들 | `glossary-bundle.js` |

GitHub Pages(https)에서는 모듈 + `fetch`로 동작하므로 **`js/`·`data/`·`content/`를 push하면 곧바로 반영**됩니다. 별도 웹서버·CI 파이프라인은 필요 없습니다. `file://` 직접 열기만 빌드(번들)가 필요합니다.
