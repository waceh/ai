import { EVIDENCE_URL_RE } from "./constants.js";
import { state } from "./state.js";

export function stripFrontmatter(raw) {
  let body = raw.trim();
  if (body.startsWith("---")) {
    const end = body.indexOf("---", 3);
    if (end !== -1) body = body.slice(end + 3).trim();
  }
  return body;
}

export function initMarked() {
  if (state.markedReady) return typeof marked !== "undefined";
  if (typeof marked === "undefined") return false;
  marked.use({ gfm: true });
  state.markedReady = true;
  return true;
}

export function markdownToPlainText(raw) {
  const body = stripFrontmatter(raw);
  if (initMarked()) {
    const div = document.createElement("div");
    div.innerHTML = marked.parse(body);
    return (div.textContent || "").replace(/\s+/g, " ").trim();
  }
  return body.replace(/[#*|`>|[\]-]/g, " ");
}

function buildLinkNeedles(linkableIds) {
  const needles = [];
  const seen = new Set();

  linkableIds.forEach((id) => {
    const term = state.glossaryById.get(id);
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

export function renderInlineContent(text, linkableIds, container) {
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
        state.selectTerm(nearest.id);
      });
      container.appendChild(link);
    }

    cursor = nearest.end;
  }
}

export function renderLinkedText(text, linkableIds, container) {
  renderInlineContent(text, linkableIds, container);
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

export function renderMarkdownContent(raw, linkableIds, container, options = {}) {
  container.replaceChildren();
  const body = stripFrontmatter(raw);

  if (!initMarked()) {
    const fallback = document.createElement("p");
    fallback.className = "desc-error";
    fallback.textContent = "마크다운 렌더러(marked)를 불러오지 못했습니다.";
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

export function renderExample(raw, termId, linkableIds, container) {
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
