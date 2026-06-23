// 소스: data/glossary-index.json + content/terms/*.md
// 배포: node scripts/build-bundle.js → glossary-bundle.js (서버 없이 동작)

let glossaryData = [];
const glossaryById = new Map();
const descriptionCache = new Map();
const descriptionPlainCache = new Map();
const CONTENT_BASE = "content/terms";

function cacheDescription(id, raw) {
  const blocks = parseTermMarkdown(raw);
  descriptionCache.set(id, blocks);
  descriptionPlainCache.set(id, blocks.map((b) => b.text).join("\n"));
  return blocks;
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
  return true;
}

async function initGlossaryFromFetch() {
  const res = await fetch("data/glossary-index.json");
  if (!res.ok) throw new Error(`index HTTP ${res.status}`);
  glossaryData = await res.json();
  buildGlossaryIndex();
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

function parseTermMarkdown(raw) {
  let body = raw.trim();
  if (body.startsWith("---")) {
    const end = body.indexOf("---", 3);
    if (end !== -1) body = body.slice(end + 3).trim();
  }

  const blocks = [];
  const lines = body.split("\n");
  let paragraph = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
    paragraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
    } else if (trimmed === "") {
      flushParagraph();
    } else {
      paragraph.push(trimmed);
    }
  }
  flushParagraph();
  return blocks.length ? blocks : [{ type: "p", text: body }];
}

async function loadTermDescription(id) {
  if (descriptionCache.has(id)) return descriptionCache.get(id);

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

function renderLinkedBlocks(blocks, linkableIds, container) {
  container.replaceChildren();
  blocks.forEach((block) => {
    if (block.type === "h2") {
      const heading = document.createElement("h4");
      heading.className = "desc-section-title";
      heading.textContent = block.text;
      container.appendChild(heading);
    } else {
      const paragraph = document.createElement("p");
      paragraph.className = "desc-paragraph";
      renderLinkedText(block.text, linkableIds, paragraph);
      container.appendChild(paragraph);
    }
  });
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

function renderLinkedText(text, linkableIds, container) {
  container.replaceChildren();
  if (!text) return;

  const needles = buildLinkNeedles(linkableIds);
  let cursor = 0;

  while (cursor < text.length) {
    let nearest = null;

    for (let i = 0; i < needles.length; i++) {
      const needle = needles[i];
      const idx = text.indexOf(needle.label, cursor);
      if (idx === -1) continue;
      if (
        !nearest ||
        idx < nearest.index ||
        (idx === nearest.index && needle.label.length > nearest.label.length)
      ) {
        nearest = { id: needle.id, label: needle.label, index: idx };
      }
    }

    if (!nearest) {
      container.appendChild(document.createTextNode(text.slice(cursor)));
      break;
    }

    if (nearest.index > cursor) {
      container.appendChild(document.createTextNode(text.slice(cursor, nearest.index)));
    }

    const link = document.createElement("button");
    link.type = "button";
    link.className = "inline-term-link";
    link.textContent = nearest.label;
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      selectTerm(nearest.id);
    });
    container.appendChild(link);

    cursor = nearest.index + nearest.label.length;
  }
}

// Category metadata
const categoryMeta = {
  core: { name: "코어 엔진", color: "#06b6d4" },
  agent: { name: "에이전트/도구", color: "#8b5cf6" },
  env: { name: "환경/보안", color: "#10b981" }
};

// State Variables
let currentSelectedId = null;
let currentCategoryFilter = "all";
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
  } catch (err) {
    console.error(err);
    if (appMain) {
      appMain.innerHTML =
        '<p class="load-error">용어 목록을 불러오지 못했습니다. 로컬에서는 <code>python3 -m http.server 8000</code>으로 연 뒤 <code>http://localhost:8000</code>에서 확인해 주세요.</p>';
    }
    return;
  }

  initUI();
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
});

function initUI() {
  const searchInput = document.getElementById("search-input");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const resetBtn = document.getElementById("reset-graph");
  const openGraphBtn = document.getElementById("open-graph-modal");
  const closeGraphBtn = document.getElementById("graph-modal-close");
  const graphBackdrop = document.getElementById("graph-modal-backdrop");

  initCategoryTabsDrag();
  initGraphModal(openGraphBtn, closeGraphBtn, graphBackdrop);
  // Search
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTermList();
  });

  // Category Tabs
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategoryFilter = btn.dataset.category;
      renderTermList();
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
  
  placeholder.classList.add("hidden");
  content.classList.remove("hidden");
  
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
    .then((blocks) => {
      if (currentSelectedId !== id) return;
      renderLinkedBlocks(blocks, term.connections, descEl);
    })
    .catch(() => {
      if (currentSelectedId !== id) return;
      descEl.replaceChildren();
      const err = document.createElement("p");
      err.className = "desc-error";
      err.textContent = "세부 설명을 불러오지 못했습니다.";
      descEl.appendChild(err);
    });

  const tagsContainer = document.getElementById("detail-connections");
  tagsContainer.innerHTML = "";

  term.connections.forEach(connId => {
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
    tagsContainer.appendChild(btn);
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
