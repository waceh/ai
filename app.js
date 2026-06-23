// 소스: data/glossary-index.json + content/terms/*.md
// 배포: node scripts/build-bundle.js → glossary-bundle.js (서버 없이 동작)

let glossaryData = [];
const glossaryById = new Map();
const descriptionRawCache = new Map();
const descriptionPlainCache = new Map();
const CONTENT_BASE = "content/terms";
const EXAMPLES_BASE = "content/examples";
const QNA_BASE = "content/qna";

const exampleCache = new Map();

let qnaData = [];
const qnaById = new Map();

const qnaRawCache = new Map();
const qnaPlainCache = new Map();

let markedReady = false;

function cacheDescription(id, raw) {
  descriptionRawCache.set(id, raw);
  descriptionPlainCache.set(id, markdownToPlainText(raw));
  return raw;
}

function buildGlossaryIndex() {
  glossaryById.clear();
  glossaryData.forEach((term) => {
    term._connectionSet = new Set(term.connections);
    glossaryById.set(term.id, term);
  });
}

function initGlossaryFromBundle() {
  const bundle = window.__GLOSSARY__;
  if (!bundle?.index) return false;

  glossaryData = bundle.index;
  buildGlossaryIndex();

  if (bundle.descriptions) {
    Object.entries(bundle.descriptions).forEach(([id, raw]) => {
      cacheDescription(id, raw);
    });
  }
  if (bundle.examples) {
    Object.entries(bundle.examples).forEach(([id, raw]) => {
      exampleCache.set(id, raw);
    });
  }
  if (bundle.qnaIndex) {
    qnaData = bundle.qnaIndex;
    buildQnaIndex();
    if (bundle.qnaArticles) {
      Object.entries(bundle.qnaArticles).forEach(([id, raw]) => {
        cacheQnaContent(id, raw);
      });
    }
  }
  return true;
}

async function initGlossaryFromFetch() {
  const res = await fetch("data/glossary-index.json");
  if (!res.ok) throw new Error(`index HTTP ${res.status}`);
  glossaryData = await res.json();
  buildGlossaryIndex();
}

function buildQnaIndex() {
  qnaById.clear();
  qnaData.forEach((item) => {
    qnaById.set(item.id, item);
  });
}

function cacheQnaContent(id, raw) {
  qnaRawCache.set(id, raw);
  qnaPlainCache.set(id, markdownToPlainText(raw));
  return raw;
}

async function initQnaFromFetch() {
  const res = await fetch("data/qna-index.json");
  if (!res.ok) throw new Error(`qna index HTTP ${res.status}`);
  qnaData = await res.json();
  buildQnaIndex();
}

async function initQna() {
  if (window.__GLOSSARY__?.qnaIndex) {
    qnaData = window.__GLOSSARY__.qnaIndex;
    buildQnaIndex();
    if (window.__GLOSSARY__.qnaArticles) {
      Object.entries(window.__GLOSSARY__.qnaArticles).forEach(([id, raw]) => {
        cacheQnaContent(id, raw);
      });
    }
    return;
  }
  if (!isLocalDevHost()) {
    if (await loadBundleScript() && window.__GLOSSARY__?.qnaIndex) {
      qnaData = window.__GLOSSARY__.qnaIndex;
      buildQnaIndex();
      if (window.__GLOSSARY__.qnaArticles) {
        Object.entries(window.__GLOSSARY__.qnaArticles).forEach(([id, raw]) => {
          cacheQnaContent(id, raw);
        });
      }
      return;
    }
  }
  await initQnaFromFetch();
}

function isLocalDevHost() {
  return location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

function loadBundleScript() {
  return new Promise((resolve) => {
    if (window.__GLOSSARY__) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "glossary-bundle.js";
    script.onload = () => resolve(Boolean(window.__GLOSSARY__));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function initGlossary() {
  // 로컬(localhost): md/json 수정 후 새로고침만 하면 됨 (빌드 불필요)
  if (!isLocalDevHost()) {
    if (initGlossaryFromBundle()) return;
    if (await loadBundleScript() && initGlossaryFromBundle()) return;
  }
  await initGlossaryFromFetch();
}

function stripFrontmatter(raw) {
  let body = raw.trim();
  if (body.startsWith("---")) {
    const end = body.indexOf("---", 3);
    if (end !== -1) body = body.slice(end + 3).trim();
  }
  return body;
}

function initMarked() {
  if (markedReady) return typeof marked !== "undefined";
  if (typeof marked === "undefined") return false;
  marked.setOptions({
    gfm: true,
    headerIds: false,
    mangle: false,
  });
  markedReady = true;
  return true;
}

function markdownToPlainText(raw) {
  const body = stripFrontmatter(raw);
  if (initMarked()) {
    const div = document.createElement("div");
    div.innerHTML = marked.parse(body);
    return (div.textContent || "").replace(/\s+/g, " ").trim();
  }
  return body.replace(/[#*|`>|[\]-]/g, " ");
}

function linkifyGlossaryTerms(root, linkableIds) {
  const skipTags = new Set(["CODE", "PRE", "BUTTON", "A", "SCRIPT", "STYLE"]);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      let parent = node.parentElement;
      while (parent && parent !== root) {
        if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        parent = parent.parentElement;
      }
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const holder = document.createElement("span");
    renderInlineContent(node.textContent, linkableIds, holder);
    if (!holder.childNodes.length) return;
    const frag = document.createDocumentFragment();
    while (holder.firstChild) frag.appendChild(holder.firstChild);
    node.parentNode.replaceChild(frag, node);
  });
}

function applyMarkdownClasses(root) {
  const inExample = root.classList.contains("example-markdown");
  root.querySelectorAll("h2").forEach((el) => {
    el.classList.add(inExample ? "example-section-title" : "desc-section-title");
  });
  root.querySelectorAll("h3").forEach((el) => {
    el.classList.add(inExample ? "example-subsection-title" : "desc-subsection-title");
  });
  root.querySelectorAll("p").forEach((el) => {
    if (!el.classList.contains("example-title") && !el.classList.contains("example-source")) {
      el.classList.add("desc-paragraph");
    }
  });
  root.querySelectorAll("ul").forEach((el) => {
    if (!el.classList.contains("evidence-list")) el.classList.add("desc-bullet-list");
  });
  root.querySelectorAll("ol").forEach((el) => el.classList.add("desc-numbered-list"));
  root.querySelectorAll("table").forEach((table) => {
    if (table.closest(".md-table-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "md-table-wrap";
    table.classList.add("md-table");
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
  root.querySelectorAll("code").forEach((code) => {
    if (code.parentElement?.tagName !== "PRE") code.classList.add("inline-code");
  });
  root.querySelectorAll("pre").forEach((pre) => {
    if (!pre.classList.contains("example-code")) pre.classList.add("example-code");
  });
}

function applyEvidenceSection(root) {
  root.querySelectorAll("h2.desc-section-title").forEach((h2) => {
    if (h2.textContent.trim() !== "참고") return;
    let sib = h2.nextElementSibling;
    while (sib && (sib.tagName === "UL" || sib.tagName === "OL")) {
      sib.classList.remove("desc-bullet-list", "desc-numbered-list");
      sib.classList.add("evidence-list");
      sib.querySelectorAll("li").forEach((li) => {
        const text = li.textContent;
        li.replaceChildren();
        renderEvidenceItem(text, li);
      });
      sib = sib.nextElementSibling;
    }
  });
}

function renderMarkdownContent(raw, linkableIds, container, options = {}) {
  container.replaceChildren();
  const body = stripFrontmatter(raw);

  if (!initMarked()) {
    const fallback = document.createElement("p");
    fallback.className = "desc-error";
    fallback.textContent = "마크다운 렌더러를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.";
    container.appendChild(fallback);
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = options.wrapperClass || "markdown-body";
  wrapper.innerHTML = marked.parse(body);
  applyMarkdownClasses(wrapper);
  if (options.evidenceSection !== false) {
    applyEvidenceSection(wrapper);
  }
  linkifyGlossaryTerms(wrapper, linkableIds);
  container.appendChild(wrapper);
}

async function loadTermExample(id) {
  if (exampleCache.has(id)) return exampleCache.get(id);

  const bundled = window.__GLOSSARY__?.examples?.[id];
  if (bundled) {
    exampleCache.set(id, bundled);
    return bundled;
  }

  const res = await fetch(`${EXAMPLES_BASE}/${id}.md`);
  if (!res.ok) return null;
  const raw = await res.text();
  exampleCache.set(id, raw);
  return raw;
}

function parseExampleFrontmatter(raw) {
  let body = raw.trim();
  const meta = { status: "draft", title: "", source: "" };

  if (body.startsWith("---")) {
    const end = body.indexOf("---", 3);
    if (end !== -1) {
      const front = body.slice(3, end).trim();
      body = body.slice(end + 3).trim();
      front.split("\n").forEach((line) => {
        const colon = line.indexOf(":");
        if (colon === -1) return;
        const key = line.slice(0, colon).trim();
        let value = line.slice(colon + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (key in meta) meta[key] = value;
      });
    }
  }

  return { meta, body };
}

function isExampleReady(meta, body) {
  if (meta.status === "ready") return true;
  const stripped = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\(작성 예정\)/g, "")
    .replace(/# 예시 코드 또는 명령 \(작성 예정\)/g, "")
    .trim();
  const withoutHeadings = stripped.replace(/^#+\s.*$/gm, "").trim();
  return withoutHeadings.length > 80;
}

function renderExample(raw, termId, linkableIds, container) {
  container.replaceChildren();

  if (!raw) {
    const box = document.createElement("div");
    box.className = "example-placeholder";
    box.innerHTML = `<p>예시 파일이 없습니다.</p><p class="example-placeholder-hint"><code>content/examples/${termId}.md</code>를 생성하세요.</p>`;
    container.appendChild(box);
    return;
  }

  const { meta, body } = parseExampleFrontmatter(raw);

  if (!isExampleReady(meta, body)) {
    const box = document.createElement("div");
    box.className = "example-placeholder";
    box.innerHTML = `
      <p>이 용어의 실무 예시를 준비 중입니다.</p>
      <p class="example-placeholder-hint"><code>content/examples/${termId}.md</code>에 시나리오·코드·단계를 작성한 뒤 frontmatter <code>status: ready</code>로 변경하세요.</p>
    `;
    container.appendChild(box);
    return;
  }

  if (meta.title) {
    const title = document.createElement("p");
    title.className = "example-title";
    title.textContent = meta.title;
    container.appendChild(title);
  }

  const bodyHost = document.createElement("div");
  bodyHost.className = "term-example-body";
  container.appendChild(bodyHost);
  renderMarkdownContent(body, linkableIds, bodyHost, {
    wrapperClass: "markdown-body example-markdown",
    evidenceSection: false,
  });

  if (meta.source) {
    const src = document.createElement("p");
    src.className = "example-source";
    if (/^https?:\/\//.test(meta.source)) {
      const a = document.createElement("a");
      a.href = meta.source;
      a.textContent = meta.source;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      src.append("출처: ");
      src.appendChild(a);
    } else {
      src.textContent = `출처: ${meta.source}`;
    }
    container.appendChild(src);
  }
}

async function loadQnaContent(id) {
  if (qnaRawCache.has(id)) return qnaRawCache.get(id);

  const bundled = window.__GLOSSARY__?.qnaArticles?.[id];
  if (bundled) return cacheQnaContent(id, bundled);

  const res = await fetch(`${QNA_BASE}/${id}.md`);
  if (!res.ok) throw new Error(`qna HTTP ${res.status}`);
  return cacheQnaContent(id, await res.text());
}

function preloadAllQna() {
  if (window.__GLOSSARY__?.qnaArticles) return;

  qnaData.forEach((item) => {
    loadQnaContent(item.id)
      .then(() => {
        if (searchQuery && currentViewMode === "qna") renderQnaList();
      })
      .catch(() => {});
  });
}

async function loadTermDescription(id) {
  if (descriptionRawCache.has(id)) return descriptionRawCache.get(id);

  const bundled = window.__GLOSSARY__?.descriptions?.[id];
  if (bundled) return cacheDescription(id, bundled);

  const res = await fetch(`${CONTENT_BASE}/${id}.md`);
  if (!res.ok) throw new Error(`description HTTP ${res.status}`);
  return cacheDescription(id, await res.text());
}

function preloadAllDescriptions() {
  if (window.__GLOSSARY__?.descriptions) return;

  glossaryData.forEach((term) => {
    loadTermDescription(term.id)
      .then(() => {
        if (searchQuery) renderTermList();
      })
      .catch(() => {});
  });
}

const EVIDENCE_URL_RE = /(https?:\/\/[^\s)]+)/;

function renderEvidenceItem(text, container) {
  const match = text.match(EVIDENCE_URL_RE);
  if (!match) {
    container.textContent = text;
    return;
  }

  const url = match[1].replace(/[.,;]+$/, "");
  const before = text.slice(0, match.index).replace(/:\s*$/, "").trim();
  const after = text.slice(match.index + match[0].length).replace(/^\s*[—–-]\s*/, "").trim();

  if (before) {
    const label = document.createElement("span");
    label.className = "evidence-label";
    label.textContent = before;
    container.appendChild(label);
  }

  const link = document.createElement("a");
  link.href = url;
  link.textContent = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "evidence-link";
  container.appendChild(link);

  if (after) {
    const note = document.createElement("span");
    note.className = "evidence-note";
    note.textContent = after;
    container.appendChild(note);
  }
}

// ==========================================================================
// Linked text rendering (connections → inline links)
// ==========================================================================
function buildLinkNeedles(linkableIds) {
  const needles = [];
  const seen = new Set();

  linkableIds.forEach((id) => {
    const term = glossaryById.get(id);
    if (!term) return;

    const labels = [term.name];
    if (term.englishName && term.englishName !== term.name) {
      term.englishName.split("/").forEach((part) => {
        const trimmed = part.trim();
        if (trimmed) labels.push(trimmed);
      });
    }
    if (term.aliases) {
      labels.push(...term.aliases);
    }

    labels.forEach((label) => {
      const key = `${id}::${label}`;
      if (!seen.has(key)) {
        seen.add(key);
        needles.push({ id, label });
      }
    });
  });

  return needles;
}

function renderInlineContent(text, linkableIds, container) {
  container.replaceChildren();
  if (!text) return;

  const needles = buildLinkNeedles(linkableIds);
  let cursor = 0;

  while (cursor < text.length) {
    let nearest = null;

    if (text.startsWith("**", cursor)) {
      const close = text.indexOf("**", cursor + 2);
      if (close !== -1) {
        nearest = {
          kind: "bold",
          index: cursor,
          end: close + 2,
          inner: text.slice(cursor + 2, close),
        };
      }
    }

    if (text[cursor] === "`") {
      const close = text.indexOf("`", cursor + 1);
      if (close !== -1) {
        const candidate = {
          kind: "code",
          index: cursor,
          end: close + 1,
          inner: text.slice(cursor + 1, close),
        };
        if (
          !nearest ||
          candidate.index < nearest.index ||
          (candidate.index === nearest.index && candidate.end > nearest.end)
        ) {
          nearest = candidate;
        }
      }
    }

    for (let i = 0; i < needles.length; i++) {
      const needle = needles[i];
      const idx = text.indexOf(needle.label, cursor);
      if (idx === -1) continue;
      if (
        !nearest ||
        idx < nearest.index ||
        (idx === nearest.index && needle.label.length > nearest.end - nearest.index)
      ) {
        nearest = {
          kind: "link",
          index: idx,
          end: idx + needle.label.length,
          id: needle.id,
          label: needle.label,
        };
      }
    }

    if (!nearest) {
      container.appendChild(document.createTextNode(text.slice(cursor)));
      break;
    }

    if (nearest.index > cursor) {
      container.appendChild(document.createTextNode(text.slice(cursor, nearest.index)));
    }

    if (nearest.kind === "bold") {
      const strong = document.createElement("strong");
      renderInlineContent(nearest.inner, linkableIds, strong);
      container.appendChild(strong);
    } else if (nearest.kind === "code") {
      const code = document.createElement("code");
      code.className = "inline-code";
      code.textContent = nearest.inner;
      container.appendChild(code);
    } else if (nearest.kind === "link") {
      const link = document.createElement("button");
      link.type = "button";
      link.className = "inline-term-link";
      link.textContent = nearest.label;
      link.addEventListener("click", (e) => {
        e.stopPropagation();
        selectTerm(nearest.id);
      });
      container.appendChild(link);
    }

    cursor = nearest.end;
  }
}

function renderLinkedText(text, linkableIds, container) {
  renderInlineContent(text, linkableIds, container);
}

// Category metadata
const categoryMeta = {
  core: { name: "코어 엔진", color: "#06b6d4" },
  agent: { name: "에이전트/도구", color: "#8b5cf6" },
  env: { name: "환경/보안", color: "#10b981" }
};

const qnaCategoryMeta = {
  "how-it-works": { name: "동작 원리", color: "#38bdf8" },
  models: { name: "모델·제품", color: "#a855f7" },
};

// State Variables
let currentViewMode = "terms";
let currentSelectedId = null;
let currentSelectedQnaId = null;
let currentCategoryFilter = "all";
let currentQnaCategoryFilter = "all";
let searchQuery = "";

// Canvas variables
const canvas = document.getElementById("connection-graph");
const ctx = canvas.getContext("2d");
const graphModal = document.getElementById("graph-modal");
let graphModalOpen = false;
let graphLayoutReady = false;
let nodes = [];
let links = [];
let isDragging = false;
let draggedNode = null;
let hoveredNode = null;

// Canvas — static layout (no continuous physics loop)
let drawScheduled = false;
let resizeTimer = null;
const MAX_LAYOUT_ITERATIONS = 100;
const LAYOUT_DPR_CAP = 2;
const damping = 0.82;
const kAttraction = 0.05;
const kRepulsion = 1500;
const kGravity = 0.02;
const restLength = 130;

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  const appMain = document.querySelector(".app-main");
  try {
    await initGlossary();
    await initQna();
    initMarked();
  } catch (err) {
    console.error(err);
    if (appMain) {
      appMain.innerHTML =
        '<p class="load-error">용어 목록을 불러오지 못했습니다. 로컬에서는 <code>python3 -m http.server 8000</code>으로 연 뒤 <code>http://localhost:8000</code>에서 확인해 주세요.</p>';
    }
    return;
  }

  initUI();
  updateListPanelChrome();
  renderTermList();
  if (glossaryData.length > 0) {
    selectTerm(glossaryData[0].id);
  }
  initGraph();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (graphModalOpen) {
        resizeCanvas();
        requestRedraw();
      }
    }, 200);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestRedraw();
  });

  preloadAllDescriptions();
  preloadAllQna();
});

function initUI() {
  const searchInput = document.getElementById("search-input");
  const tabButtons = document.querySelectorAll("#category-tabs .tab-btn");
  const qnaTabButtons = document.querySelectorAll("#qna-category-tabs .tab-btn");
  const viewModeButtons = document.querySelectorAll(".view-mode-btn");
  const resetBtn = document.getElementById("reset-graph");
  const openGraphBtn = document.getElementById("open-graph-modal");
  const closeGraphBtn = document.getElementById("graph-modal-close");
  const graphBackdrop = document.getElementById("graph-modal-backdrop");

  initCategoryTabsDrag();
  initGraphModal(openGraphBtn, closeGraphBtn, graphBackdrop);
  initPanelResizer();

  viewModeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setViewMode(btn.dataset.view);
    });
  });

  // Search
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    if (currentViewMode === "qna") {
      renderQnaList();
    } else {
      renderTermList();
    }
  });

  // Category Tabs (terms)
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategoryFilter = btn.dataset.category;
      renderTermList();
    });
  });

  // Category Tabs (Q&A)
  qnaTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      qnaTabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentQnaCategoryFilter = btn.dataset.qnaCategory;
      renderQnaList();
    });
  });

  resetBtn.addEventListener("click", () => {
    if (!graphLayoutReady) {
      ensureGraphLayout();
      return;
    }
    setupGraphPositions();
    syncGraphSelection();
    requestRedraw();
  });
}

const SIDEBAR_WIDTH_STORAGE_KEY = "glossary-sidebar-width";
const SIDEBAR_MIN_PX = 200;
const SIDEBAR_MAX_PX = 480;
const SIDEBAR_STEP_PX = 12;

function clampSidebarWidth(px) {
  return Math.min(SIDEBAR_MAX_PX, Math.max(SIDEBAR_MIN_PX, px));
}

function getSidebarWidthPx() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--sidebar-width")
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? clampSidebarWidth(parsed) : 260;
}

function setSidebarWidth(px, { persist = true, markCustom = true } = {}) {
  const width = clampSidebarWidth(px);
  document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  if (markCustom) {
    document.documentElement.dataset.sidebarCustom = "true";
  }
  if (persist) {
    localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(width));
  }
  return width;
}

function resetSidebarWidth() {
  localStorage.removeItem(SIDEBAR_WIDTH_STORAGE_KEY);
  document.documentElement.style.removeProperty("--sidebar-width");
  delete document.documentElement.dataset.sidebarCustom;
}

function initPanelResizer() {
  const resizer = document.getElementById("panel-resizer");
  const appMain = document.querySelector(".app-main");
  if (!resizer || !appMain) return;

  const mobileQuery = window.matchMedia("(max-width: 1024px)");

  const updateResizerVisibility = () => {
    resizer.hidden = mobileQuery.matches;
  };

  const saved = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
  if (saved) {
    const parsed = Number(saved);
    if (Number.isFinite(parsed)) {
      const width = setSidebarWidth(parsed, { persist: false });
      resizer.setAttribute("aria-valuenow", String(width));
    }
  }

  updateResizerVisibility();
  mobileQuery.addEventListener("change", updateResizerVisibility);

  let dragging = false;

  const onPointerMove = (e) => {
    if (!dragging) return;
    const rect = appMain.getBoundingClientRect();
    const width = setSidebarWidth(e.clientX - rect.left, { persist: false });
    resizer.setAttribute("aria-valuenow", String(width));
  };

  const stopDragging = () => {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove("panel-resizing");
    resizer.classList.remove("is-dragging");
    setSidebarWidth(getSidebarWidthPx());
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", stopDragging);
    document.removeEventListener("pointercancel", stopDragging);
  };

  resizer.addEventListener("pointerdown", (e) => {
    if (mobileQuery.matches || e.button !== 0) return;
    dragging = true;
    resizer.setPointerCapture(e.pointerId);
    document.body.classList.add("panel-resizing");
    resizer.classList.add("is-dragging");
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", stopDragging);
    document.addEventListener("pointercancel", stopDragging);
    e.preventDefault();
  });

  resizer.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    let next = getSidebarWidthPx();
    if (e.key === "ArrowLeft") next -= SIDEBAR_STEP_PX;
    if (e.key === "ArrowRight") next += SIDEBAR_STEP_PX;
    if (e.key === "Home") next = SIDEBAR_MIN_PX;
    if (e.key === "End") next = SIDEBAR_MAX_PX;
    const width = setSidebarWidth(next);
    resizer.setAttribute("aria-valuenow", String(width));
    e.preventDefault();
  });

  resizer.addEventListener("dblclick", () => {
    resetSidebarWidth();
    const width = getSidebarWidthPx();
    resizer.setAttribute("aria-valuenow", String(width));
  });

  if (!resizer.getAttribute("aria-valuenow")) {
    resizer.setAttribute("aria-valuenow", String(getSidebarWidthPx()));
  }
}

function initGraphModal(openBtn, closeBtn, backdrop) {
  if (!graphModal) return;

  const open = () => {
    graphModal.classList.remove("hidden");
    document.body.classList.add("graph-modal-open");
    graphModalOpen = true;
    requestAnimationFrame(() => {
      ensureGraphLayout();
    });
  };

  const close = () => {
    graphModal.classList.add("hidden");
    document.body.classList.remove("graph-modal-open");
    graphModalOpen = false;
  };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && graphModalOpen) close();
  });
}

function initCategoryTabsDrag() {
  const scroller = document.getElementById("category-tabs");
  if (!scroller) return;

  const DRAG_THRESHOLD = 8;
  let pointerActive = false;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  let activePointerId = null;

  scroller.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerActive = true;
    isDragging = false;
    activePointerId = e.pointerId;
    startX = e.clientX;
    scrollStart = scroller.scrollLeft;
  });

  scroller.addEventListener("pointermove", (e) => {
    if (!pointerActive || e.pointerId !== activePointerId) return;

    const dx = e.clientX - startX;
    if (!isDragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      isDragging = true;
      scroller.classList.add("is-dragging");
      scroller.setPointerCapture(e.pointerId);
    }

    scroller.scrollLeft = scrollStart - dx;
    e.preventDefault();
  });

  const endPointer = (e) => {
    if (!pointerActive || e.pointerId !== activePointerId) return;
    pointerActive = false;

    if (isDragging) {
      scroller.classList.remove("is-dragging");
      if (scroller.hasPointerCapture(e.pointerId)) {
        scroller.releasePointerCapture(e.pointerId);
      }
    }

    activePointerId = null;
  };

  scroller.addEventListener("pointerup", endPointer);
  scroller.addEventListener("pointercancel", endPointer);

  scroller.addEventListener("click", (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
    isDragging = false;
  }, true);
}

function updateListPanelChrome() {
  const title = document.getElementById("list-panel-title");
  const searchInput = document.getElementById("search-input");
  const termTabs = document.getElementById("category-tabs");
  const qnaTabs = document.getElementById("qna-category-tabs");
  const placeholderText = document.querySelector(".placeholder-text");

  if (currentViewMode === "qna") {
    if (title) title.textContent = "Q&A 목록";
    if (searchInput) searchInput.placeholder = "질문 검색 (예: Opus, 프롬프트)…";
    termTabs?.classList.add("hidden");
    qnaTabs?.classList.remove("hidden");
    if (placeholderText) {
      placeholderText.textContent =
        "좌측에서 궁금한 질문을 선택하세요. 관련 용어 링크로 용어집으로 이동할 수 있습니다.";
    }
  } else {
    if (title) title.textContent = "용어 목록";
    if (searchInput) searchInput.placeholder = "용어 검색 (예: MCP, 하네스)…";
    termTabs?.classList.remove("hidden");
    qnaTabs?.classList.add("hidden");
    if (placeholderText) {
      placeholderText.textContent =
        "좌측 목록에서 용어를 선택하거나, 상단 「연결 망 보기」로 개념 관계를 탐색하세요.";
    }
  }
}

function setViewMode(mode) {
  if (mode !== "terms" && mode !== "qna") return;
  if (currentViewMode === mode) return;

  currentViewMode = mode;
  document.querySelectorAll(".view-mode-btn").forEach((btn) => {
    const active = btn.dataset.view === mode;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  updateListPanelChrome();

  if (mode === "qna") {
    renderQnaList();
    if (qnaData.length > 0) {
      const keep =
        currentSelectedQnaId && qnaById.has(currentSelectedQnaId)
          ? currentSelectedQnaId
          : qnaData[0].id;
      selectQna(keep);
    } else {
      showDetailPlaceholder();
    }
  } else {
    renderTermList();
    if (glossaryData.length > 0) {
      const keep =
        currentSelectedId && glossaryById.has(currentSelectedId)
          ? currentSelectedId
          : glossaryData[0].id;
      selectTerm(keep);
    } else {
      showDetailPlaceholder();
    }
  }
}

function showDetailPlaceholder() {
  document.getElementById("detail-placeholder")?.classList.remove("hidden");
  document.getElementById("detail-content")?.classList.add("hidden");
  document.getElementById("qna-detail-content")?.classList.add("hidden");
}

function renderQnaList() {
  const listContainer = document.getElementById("term-list");
  listContainer.innerHTML = "";

  const filtered = qnaData.filter((item) => {
    const matchesCategory =
      currentQnaCategoryFilter === "all" || item.category === currentQnaCategoryFilter;
    const plain = qnaPlainCache.get(item.id) || "";
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery) ||
      item.summary.toLowerCase().includes(searchQuery) ||
      plain.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "term-list-empty";
    empty.textContent = searchQuery
      ? `"${searchQuery}"에 맞는 Q&A가 없습니다.`
      : "이 카테고리에 표시할 Q&A가 없습니다.";
    listContainer.appendChild(empty);
    return;
  }

  filtered.forEach((item) => {
    const el = document.createElement("div");
    el.className = `term-item qna-item ${item.id === currentSelectedQnaId ? "active" : ""}`;
    el.dataset.id = item.id;

    const catLabel = qnaCategoryMeta[item.category]?.name || "Q&A";
    el.innerHTML = `
      <div class="term-item-header">
        <span class="term-name">${item.question}</span>
        <span class="term-badge badge-qna">${catLabel}</span>
      </div>
      <div class="term-desc-preview">${item.summary}</div>
    `;

    el.addEventListener("click", () => selectQna(item.id));
    listContainer.appendChild(el);
  });
}

function selectQna(id) {
  if (currentViewMode !== "qna") {
    setViewMode("qna");
  }

  currentSelectedQnaId = id;

  document.querySelectorAll(".term-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.id === id);
  });

  const item = qnaById.get(id);
  if (!item) return;

  const placeholder = document.getElementById("detail-placeholder");
  const termContent = document.getElementById("detail-content");
  const qnaContent = document.getElementById("qna-detail-content");

  placeholder.classList.add("hidden");
  termContent.classList.add("hidden");
  qnaContent.classList.remove("hidden");

  const badge = document.getElementById("qna-detail-category");
  const cat = qnaCategoryMeta[item.category];
  badge.textContent = cat ? cat.name : "Q&A";
  badge.className = "category-badge badge-qna";

  document.getElementById("qna-detail-question").textContent = item.question;
  document.getElementById("qna-detail-summary").textContent = item.summary;

  const bodyEl = document.getElementById("qna-detail-body");
  bodyEl.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "desc-loading";
  loading.textContent = "답변을 불러오는 중…";
  bodyEl.appendChild(loading);

  loadQnaContent(id)
    .then((raw) => {
      if (currentSelectedQnaId !== id) return;
      renderMarkdownContent(raw, item.relatedTerms, bodyEl);
    })
    .catch(() => {
      if (currentSelectedQnaId !== id) return;
      bodyEl.replaceChildren();
      const err = document.createElement("p");
      err.className = "desc-error";
      err.textContent = "답변을 불러오지 못했습니다.";
      bodyEl.appendChild(err);
    });

  const row1El = document.getElementById("qna-related-row-1");
  const row2El = document.getElementById("qna-related-row-2");
  row1El.innerHTML = "";
  row2El.innerHTML = "";

  const relatedIds = (item.relatedTerms || []).filter((tid) => glossaryById.has(tid));
  const splitAt = Math.ceil(relatedIds.length / 2);
  const rows = [relatedIds.slice(0, splitAt), relatedIds.slice(splitAt)];

  rows.forEach((ids, rowIndex) => {
    const container = rowIndex === 0 ? row1El : row2El;
    ids.forEach((termId) => {
      const term = glossaryById.get(termId);
      if (!term) return;

      const btn = document.createElement("button");
      btn.className = "tag-btn";
      const dotColor = categoryMeta[term.category].color;
      btn.innerHTML = `
        <span class="tag-dot" style="background-color: ${dotColor}"></span>
        ${term.name}
      `;
      btn.addEventListener("click", () => selectTerm(termId));
      container.appendChild(btn);
    });
  });

  const listElement = document.querySelector(`.term-item[data-id="${id}"]`);
  if (listElement) {
    listElement.scrollIntoView({ block: "nearest" });
  }
}

function renderTermList() {
  const listContainer = document.getElementById("term-list");
  listContainer.innerHTML = "";

  const filtered = glossaryData.filter(term => {
    const matchesCategory = currentCategoryFilter === "all" || term.category === currentCategoryFilter;
    const plainDesc = descriptionPlainCache.get(term.id) || "";
    const matchesSearch = term.name.toLowerCase().includes(searchQuery) ||
                          term.englishName.toLowerCase().includes(searchQuery) ||
                          term.oneLine.toLowerCase().includes(searchQuery) ||
                          plainDesc.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "term-list-empty";
    empty.textContent = searchQuery
      ? `"${searchQuery}"에 맞는 용어가 없습니다.`
      : "이 카테고리에 표시할 용어가 없습니다.";
    listContainer.appendChild(empty);
    return;
  }

  filtered.forEach(term => {
    const item = document.createElement("div");
    item.className = `term-item ${term.id === currentSelectedId ? 'active' : ''}`;
    item.dataset.id = term.id;
    
    const catLabel = categoryMeta[term.category].name;
    const catBadgeClass = `badge-${term.category}`;

    item.innerHTML = `
      <div class="term-item-header">
        <span class="term-name">${term.name}</span>
        <span class="term-badge ${catBadgeClass}">${catLabel}</span>
      </div>
      <div class="term-desc-preview">${term.oneLine}</div>
    `;

    item.addEventListener("click", () => selectTerm(term.id));
    listContainer.appendChild(item);
  });
}

function selectTerm(id) {
  if (currentViewMode !== "terms") {
    currentViewMode = "terms";
    document.querySelectorAll(".view-mode-btn").forEach((btn) => {
      const active = btn.dataset.view === "terms";
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    updateListPanelChrome();
    renderTermList();
  }

  currentSelectedId = id;
  
  document.querySelectorAll(".term-item").forEach(item => {
    if (item.dataset.id === id) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  const term = glossaryById.get(id);
  if (!term) return;

  const placeholder = document.getElementById("detail-placeholder");
  const content = document.getElementById("detail-content");
  const qnaContent = document.getElementById("qna-detail-content");
  
  placeholder.classList.add("hidden");
  content.classList.remove("hidden");
  qnaContent.classList.add("hidden");
  
  const badge = document.getElementById("detail-category");
  badge.textContent = categoryMeta[term.category].name;
  badge.className = `category-badge badge-${term.category}`;

  document.getElementById("detail-title").textContent = term.name;
  document.getElementById("detail-english-title").textContent = term.englishName;
  renderLinkedText(term.oneLine, term.connections, document.getElementById("detail-one-line"));

  const descEl = document.getElementById("detail-description");
  descEl.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "desc-loading";
  loading.textContent = "세부 설명을 불러오는 중…";
  descEl.appendChild(loading);

  loadTermDescription(id)
    .then((raw) => {
      if (currentSelectedId !== id) return;
      renderMarkdownContent(raw, term.connections, descEl);
    })
    .catch(() => {
      if (currentSelectedId !== id) return;
      descEl.replaceChildren();
      const err = document.createElement("p");
      err.className = "desc-error";
      err.textContent = "세부 설명을 불러오지 못했습니다.";
      descEl.appendChild(err);
    });

  const exampleEl = document.getElementById("detail-example");
  exampleEl.replaceChildren();
  const exampleLoading = document.createElement("p");
  exampleLoading.className = "desc-loading";
  exampleLoading.textContent = "예시를 불러오는 중…";
  exampleEl.appendChild(exampleLoading);

  loadTermExample(id)
    .then((raw) => {
      if (currentSelectedId !== id) return;
      renderExample(raw, id, term.connections, exampleEl);
    })
    .catch(() => {
      if (currentSelectedId !== id) return;
      renderExample(null, id, term.connections, exampleEl);
    });

  const row1El = document.getElementById("detail-connections-row-1");
  const row2El = document.getElementById("detail-connections-row-2");
  row1El.innerHTML = "";
  row2El.innerHTML = "";

  const connectionIds = term.connections.filter((connId) => glossaryById.has(connId));
  const splitAt = Math.ceil(connectionIds.length / 2);
  const rows = [connectionIds.slice(0, splitAt), connectionIds.slice(splitAt)];

  rows.forEach((ids, rowIndex) => {
    const container = rowIndex === 0 ? row1El : row2El;
    ids.forEach((connId) => {
      const connectedTerm = glossaryById.get(connId);
      if (!connectedTerm) return;

      const btn = document.createElement("button");
      btn.className = "tag-btn";
      const dotColor = categoryMeta[connectedTerm.category].color;
      btn.innerHTML = `
      <span class="tag-dot" style="background-color: ${dotColor}"></span>
      ${connectedTerm.name}
    `;
      btn.addEventListener("click", () => selectTerm(connId));
      container.appendChild(btn);
    });
  });

  const listElement = document.querySelector(`.term-item[data-id="${id}"]`);
  if (listElement) {
    listElement.scrollIntoView({ block: "nearest" });
  }

  syncGraphSelection();
  requestRedraw();
}

function syncGraphSelection() {
  if (!currentSelectedId) return;
  nodes.forEach((n) => {
    n.isSelected = n.id === currentSelectedId;
    ctx.font = n.isSelected ? "bold 11px Outfit, Noto Sans KR" : "10px Outfit, Noto Sans KR";
    n.labelWidth = ctx.measureText(n.name).width;
  });
}

// ==========================================================================
// Canvas & Physics Loop
// ==========================================================================
function initGraph() {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);
  canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd);
  canvas.addEventListener("touchcancel", onTouchEnd);
}

function ensureGraphLayout() {
  resizeCanvas();
  const container = canvas.parentNode;
  if (!container || container.clientWidth < 16) return;

  if (!graphLayoutReady) {
    setupGraphPositions();
    graphLayoutReady = true;
  } else {
    syncGraphSelection();
    requestRedraw();
  }
}

function requestRedraw() {
  if (document.hidden) return;
  if (drawScheduled) return;
  drawScheduled = true;
  requestAnimationFrame(() => {
    drawScheduled = false;
    if (!document.hidden) drawGraph();
  });
}

function resizeCanvas() {
  const container = canvas.parentNode;
  const dpr = Math.min(window.devicePixelRatio || 1, LAYOUT_DPR_CAP);
  const width = container.clientWidth;
  const height = container.clientHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Color Utility - Caches color translations during initialization
function hexToRgba(hex, alpha) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setupGraphPositions() {
  const dpr = Math.min(window.devicePixelRatio || 1, LAYOUT_DPR_CAP);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const centerX = width / 2;
  const centerY = height / 2;

  // Build nodes with pre-cached colors
  nodes = glossaryData.map((term, index) => {
    const angle = (index / glossaryData.length) * Math.PI * 2;
    const r = Math.min(width, height) * 0.32;
    const color = categoryMeta[term.category].color;
    return {
      id: term.id,
      name: term.name,
      category: term.category,
      color: color,
      // Pre-calculate colors to save string operations in draw loop
      colorGlow: hexToRgba(color, 0.16),
      colorBorderLight: hexToRgba(color, 0.4),
      colorBorderDim: hexToRgba(color, 0.2),
      colorFillDim: hexToRgba("#0f172a", 0.3),
      x: centerX + Math.cos(angle) * r + (Math.random() - 0.5) * 10,
      y: centerY + Math.sin(angle) * r + (Math.random() - 0.5) * 10,
      vx: 0,
      vy: 0,
      radius: term.id === 'agent' ? 28 : 20,
      isSelected: term.id === currentSelectedId,
      labelWidth: 0
    };
  });

  nodes.forEach((node) => {
    ctx.font = node.isSelected ? "bold 11px Outfit, Noto Sans KR" : "10px Outfit, Noto Sans KR";
    node.labelWidth = ctx.measureText(node.name).width;
  });

  // Build links with cached node references
  links = [];
  glossaryData.forEach(term => {
    term.connections.forEach(connId => {
      const linkKey = [term.id, connId].sort().join("-");
      if (!links.some(l => l.key === linkKey)) {
        const sourceNode = nodes.find(n => n.id === term.id);
        const targetNode = nodes.find(n => n.id === connId);
        
        if (sourceNode && targetNode) {
          links.push({
            source: term.id,
            target: connId,
            sourceNode: sourceNode,
            targetNode: targetNode,
            key: linkKey
          });
        }
      }
    });
  });

  runLayoutToCompletion();
}

function runLayoutToCompletion() {
  for (let i = 0; i < MAX_LAYOUT_ITERATIONS; i++) {
    updatePhysics();
    let energy = 0;
    for (let j = 0; j < nodes.length; j++) {
      const n = nodes[j];
      energy += n.vx * n.vx + n.vy * n.vy;
    }
    if (energy < 0.05) break;
  }
  nodes.forEach((n) => {
    n.vx = 0;
    n.vy = 0;
  });
}

function getActiveHighlightId() {
  return hoveredNode ? hoveredNode.id : currentSelectedId;
}

function getActiveConnections() {
  const id = getActiveHighlightId();
  if (!id) return null;
  const term = glossaryById.get(id);
  return term ? term._connectionSet : null;
}

function updatePhysics() {
  const dpr = Math.min(window.devicePixelRatio || 1, LAYOUT_DPR_CAP);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const centerX = width / 2;
  const centerY = height / 2;

  // 1. Attraction along links (Using cached node references)
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const s = link.sourceNode;
    const t = link.targetNode;

    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (dist - restLength) * kAttraction;
    
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    
    s.vx += fx;
    s.vy += fy;
    t.vx -= fx;
    t.vy -= fy;
  }

  // 2. Repulsion between all nodes
  const nLen = nodes.length;
  for (let i = 0; i < nLen; i++) {
    const n1 = nodes[i];
    for (let j = i + 1; j < nLen; j++) {
      const n2 = nodes[j];
      
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      if (dist < 260) {
        const force = kRepulsion / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        
        n1.vx -= fx;
        n1.vy -= fy;
        n2.vx += fx;
        n2.vy += fy;
      }
    }
  }

  // 3. Gravity & position updates
  for (let i = 0; i < nLen; i++) {
    const node = nodes[i];
    if (node === draggedNode) continue;

    // Center pull
    node.vx += (centerX - node.x) * kGravity;
    node.vy += (centerY - node.y) * kGravity;

    node.x += node.vx;
    node.y += node.vy;
    node.vx *= damping;
    node.vy *= damping;

    // Viewport boundaries
    const pad = node.radius + 15;
    if (node.x < pad) { node.x = pad; node.vx = 0; }
    else if (node.x > width - pad) { node.x = width - pad; node.vx = 0; }
    
    if (node.y < pad) { node.y = pad; node.vy = 0; }
    else if (node.y > height - pad) { node.y = height - pad; node.vy = 0; }
  }
}

function drawGraph() {
  const dpr = Math.min(window.devicePixelRatio || 1, LAYOUT_DPR_CAP);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  
  ctx.clearRect(0, 0, width, height);

  const activeNodeId = getActiveHighlightId();
  const activeNodeConnections = getActiveConnections();

  // 1. Draw Links (No expensive shadowBlur!)
  const lLen = links.length;
  for (let i = 0; i < lLen; i++) {
    const link = links[i];
    const s = link.sourceNode;
    const t = link.targetNode;

    let isLinkActive = false;
    let isLinkDimmed = false;

    if (activeNodeId) {
      if (link.source === activeNodeId || link.target === activeNodeId) {
        isLinkActive = true;
      } else {
        isLinkDimmed = true;
      }
    }

    if (isLinkActive) {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = isLinkDimmed ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }
  }

  const nLen = nodes.length;

  for (let i = 0; i < nLen; i++) {
    const node = nodes[i];
    let isNodeDimmed = false;

    if (activeNodeId) {
      if (node.id !== activeNodeId && (!activeNodeConnections || !activeNodeConnections.has(node.id))) {
        isNodeDimmed = true;
      }
    }

    const opacity = isNodeDimmed ? 0.2 : 1.0;
    const isSelected = node.isSelected;
    const isHovered = node === hoveredNode;

    if (isSelected || isHovered) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = node.colorGlow;
      ctx.fill();
    }

    // Outer circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.strokeStyle = isSelected ? node.color : (isNodeDimmed ? node.colorBorderDim : node.colorBorderLight);
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.stroke();

    // Central fill
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius - 1.5, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? node.color : (isNodeDimmed ? node.colorFillDim : "rgba(15, 23, 42, 0.9)");
    ctx.fill();

    // Label Text
    ctx.font = isSelected ? "bold 11px Outfit, Noto Sans KR" : "10px Outfit, Noto Sans KR";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const labelY = node.y + (node.radius + 15);
    
    ctx.fillStyle = `rgba(7, 10, 19, ${0.7 * opacity})`;
    ctx.fillRect(node.x - node.labelWidth / 2 - 4, labelY - 6, node.labelWidth + 8, 12);

    ctx.fillStyle = isSelected ? "#ffffff" : `rgba(248, 250, 252, ${opacity})`;
    ctx.fillText(node.name, node.x, labelY);
  }
}

// ==========================================================================
// Mouse Event Handlers
// ==========================================================================
function getCanvasPos(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function getMousePos(e) {
  return getCanvasPos(e.clientX, e.clientY);
}

function getTouchPos(e) {
  const touch = e.touches[0] || e.changedTouches[0];
  return getCanvasPos(touch.clientX, touch.clientY);
}

function onPointerDown(x, y) {
  const hit = findNodeAt(x, y);
  if (hit) {
    isDragging = true;
    draggedNode = hit;
    selectTerm(hit.id);
  }
}

function onPointerMove(x, y) {
  if (isDragging && draggedNode) {
    draggedNode.x = x;
    draggedNode.y = y;
    requestRedraw();
    return;
  }

  const hit = findNodeAt(x, y);
  if (hit !== hoveredNode) {
    hoveredNode = hit;
    canvas.style.cursor = hit ? "pointer" : "grab";
    requestRedraw();
  }
}

function onPointerUp() {
  isDragging = false;
  draggedNode = null;
}

function onMouseDown(e) {
  const m = getMousePos(e);
  onPointerDown(m.x, m.y);
}

function onMouseMove(e) {
  const m = getMousePos(e);
  onPointerMove(m.x, m.y);
}

function onMouseUp() {
  onPointerUp();
}

function onTouchStart(e) {
  if (e.touches.length !== 1) return;
  e.preventDefault();
  const m = getTouchPos(e);
  onPointerDown(m.x, m.y);
}

function onTouchMove(e) {
  if (e.touches.length !== 1) return;
  e.preventDefault();
  const m = getTouchPos(e);
  onPointerMove(m.x, m.y);
}

function onTouchEnd(e) {
  onPointerUp();
}

function findNodeAt(x, y) {
  const nLen = nodes.length;
  for (let i = 0; i < nLen; i++) {
    const node = nodes[i];
    const dx = node.x - x;
    const dy = node.y - y;
    const distSq = dx * dx + dy * dy; // Distance squared is faster than Math.sqrt
    const radiusThreshold = node.radius + 12;
    if (distSq < radiusThreshold * radiusThreshold) {
      return node;
    }
  }
  return null;
}
