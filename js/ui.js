import {
  categoryMeta,
  faqCategoryMeta,
  SIDEBAR_WIDTH_STORAGE_KEY,
  SIDEBAR_MIN_PX,
  SIDEBAR_MAX_PX,
  SIDEBAR_STEP_PX,
} from "./constants.js";
import { state } from "./state.js";
import { loadTermDescription, loadTermExample, loadFaqContent } from "./data.js";
import { renderLinkedText, renderMarkdownContent, renderExample } from "./markdown.js";
import {
  initGraphModal,
  ensureGraphLayout,
  setupGraphPositions,
  syncGraphSelection,
  requestRedraw,
} from "./graph.js";
import { syncDeepLink } from "./deeplink.js";

// ==========================================================================
// Connection tag chips (2줄 미리보기 + hover 팝오버)
// ==========================================================================
function createConnectionTagBtn(connId) {
  const connectedTerm = state.glossaryById.get(connId);
  if (!connectedTerm) return null;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tag-btn";
  const dotColor = categoryMeta[connectedTerm.category].color;
  btn.innerHTML = `
    <span class="tag-dot" style="background-color: ${dotColor}"></span>
    ${connectedTerm.name}
  `;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    state.selectTerm(connId);
  });
  return btn;
}

function positionConnectionPopover(wrapEl) {
  const popoverEl = wrapEl.querySelector(".connection-tags-popover");
  const popoverBodyEl = wrapEl.querySelector(".connection-tags-popover-body");
  if (!popoverEl || popoverEl.classList.contains("is-empty")) return;

  const rect = wrapEl.getBoundingClientRect();
  const gap = 2;
  const margin = 8;
  const maxPopoverHeight = Math.min(window.innerHeight * 0.5, 352);

  // preview와 동일한 줄바꿈이 나오도록, 태그가 흐르는 폭을 preview(=wrap) 폭과 맞춘다.
  // 팝오버 컨테이너 자체는 padding만큼 이 폭보다 넓게 auto-fit 시킨다(width 미지정 + left:auto + right 고정).
  if (popoverBodyEl) {
    const bodyWidth = Math.min(rect.width, window.innerWidth - margin * 2);
    popoverBodyEl.style.width = `${bodyWidth}px`;
  }
  popoverEl.style.maxHeight = `${maxPopoverHeight}px`;

  let top = rect.bottom + gap;
  const popoverHeight = popoverEl.offsetHeight || maxPopoverHeight;
  if (top + popoverHeight > window.innerHeight - margin) {
    top = Math.max(margin, rect.top - gap - popoverHeight);
  }

  let right = window.innerWidth - rect.right;
  right = Math.max(margin, Math.min(right, window.innerWidth - margin - rect.width));

  popoverEl.style.top = `${top}px`;
  popoverEl.style.right = `${right}px`;
  popoverEl.style.left = "auto";
}

function setupConnectionPopover(wrapEl) {
  if (wrapEl.dataset.popoverBound === "true") return;
  wrapEl.dataset.popoverBound = "true";
  wrapEl.setAttribute("tabindex", "0");

  let hideTimer = null;

  const hasOverflow = () => {
    const previewEl = wrapEl.querySelector(".connection-tags-preview");
    // 2줄 미리보기에 다 들어가고 생략된 태그가 없으면(=넘치지 않으면) 팝오버를 띄울 필요가 없다.
    return !!previewEl && previewEl.scrollHeight > previewEl.clientHeight + 1;
  };

  const open = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    if (!hasOverflow()) return;
    wrapEl.classList.add("is-popover-open");
    requestAnimationFrame(() => positionConnectionPopover(wrapEl));
  };

  const scheduleClose = () => {
    hideTimer = setTimeout(() => {
      wrapEl.classList.remove("is-popover-open");
      hideTimer = null;
    }, 120);
  };

  wrapEl.addEventListener("mouseenter", open);
  wrapEl.addEventListener("mouseleave", scheduleClose);
  wrapEl.addEventListener("focusin", open);
  wrapEl.addEventListener("focusout", (e) => {
    if (wrapEl.contains(e.relatedTarget)) return;
    scheduleClose();
  });

  window.addEventListener("resize", () => {
    if (wrapEl.classList.contains("is-popover-open")) {
      positionConnectionPopover(wrapEl);
    }
  });
}

function renderConnectionTags(connectionIds, wrapEl) {
  if (!wrapEl) return;

  const previewEl = wrapEl.querySelector(".connection-tags-preview");
  const popoverBodyEl = wrapEl.querySelector(".connection-tags-popover-body");
  const popoverEl = wrapEl.querySelector(".connection-tags-popover");
  if (!previewEl || !popoverBodyEl) return;

  previewEl.replaceChildren();
  popoverBodyEl.replaceChildren();

  const validIds = connectionIds.filter((id) => state.glossaryById.has(id));
  validIds.forEach((connId) => {
    const previewBtn = createConnectionTagBtn(connId);
    const popoverBtn = createConnectionTagBtn(connId);
    if (previewBtn) previewEl.appendChild(previewBtn);
    if (popoverBtn) popoverBodyEl.appendChild(popoverBtn);
  });

  if (popoverEl) {
    popoverEl.classList.toggle("is-empty", validIds.length === 0);
  }
  wrapEl.classList.toggle("has-connections", validIds.length > 0);
  setupConnectionPopover(wrapEl);
}

// ==========================================================================
// UI 초기화
// ==========================================================================
export function initUI() {
  const searchInput = document.getElementById("search-input");
  const tabButtons = document.querySelectorAll("#category-tabs .tab-btn");
  const faqTabButtons = document.querySelectorAll("#faq-category-tabs .tab-btn");
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

  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    if (state.currentViewMode === "faq") {
      renderFaqList();
    } else {
      renderTermList();
    }
  });

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentCategoryFilter = btn.dataset.category;
      renderTermList();
    });
  });

  faqTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      faqTabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentFaqCategoryFilter = btn.dataset.faqCategory;
      renderFaqList();
    });
  });

  resetBtn.addEventListener("click", () => {
    if (!state.graphLayoutReady) {
      ensureGraphLayout();
      return;
    }
    setupGraphPositions();
    syncGraphSelection();
    requestRedraw();
  });
}

// ==========================================================================
// 사이드바 리사이저
// ==========================================================================
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

// ==========================================================================
// 카테고리 탭 드래그 스크롤
// ==========================================================================
function initCategoryTabsDrag() {
  document.querySelectorAll(".category-tabs").forEach((scroller) => {
    bindCategoryTabsDrag(scroller);
  });
}

function bindCategoryTabsDrag(scroller) {
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

  scroller.addEventListener(
    "click",
    (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
      isDragging = false;
    },
    true
  );
}

// ==========================================================================
// 리스트 패널 chrome / 뷰 모드
// ==========================================================================
export function updateListPanelChrome() {
  const title = document.getElementById("list-panel-title");
  const searchInput = document.getElementById("search-input");
  const termTabs = document.getElementById("category-tabs");
  const faqTabs = document.getElementById("faq-category-tabs");
  const placeholderText = document.querySelector(".placeholder-text");

  if (state.currentViewMode === "faq") {
    if (title) title.textContent = "FAQ 목록";
    if (searchInput) searchInput.placeholder = "질문 검색 (예: Opus, 프롬프트)…";
    termTabs?.classList.add("hidden");
    faqTabs?.classList.remove("hidden");
    if (placeholderText) {
      placeholderText.textContent =
        "좌측에서 궁금한 질문을 선택하세요. 관련 용어 링크로 용어집으로 이동할 수 있습니다.";
    }
  } else {
    if (title) title.textContent = "용어 목록";
    if (searchInput) searchInput.placeholder = "용어 검색 (예: MCP, 하네스)…";
    termTabs?.classList.remove("hidden");
    faqTabs?.classList.add("hidden");
    if (placeholderText) {
      placeholderText.textContent =
        "좌측 목록에서 용어를 선택하거나, 상단 「연결 망 보기」로 개념 관계를 탐색하세요.";
    }
  }
}

function setViewMode(mode) {
  if (mode !== "terms" && mode !== "faq") return;
  if (state.currentViewMode === mode) return;

  state.currentViewMode = mode;
  document.querySelectorAll(".view-mode-btn").forEach((btn) => {
    const active = btn.dataset.view === mode;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  updateListPanelChrome();

  if (mode === "faq") {
    renderFaqList();
    if (state.faqData.length > 0) {
      const keep =
        state.currentSelectedFaqId && state.faqById.has(state.currentSelectedFaqId)
          ? state.currentSelectedFaqId
          : state.faqData[0].id;
      selectFaq(keep);
    } else {
      showDetailPlaceholder();
    }
  } else {
    renderTermList();
    if (state.glossaryData.length > 0) {
      const keep =
        state.currentSelectedId && state.glossaryById.has(state.currentSelectedId)
          ? state.currentSelectedId
          : state.glossaryData[0].id;
      selectTerm(keep);
    } else {
      showDetailPlaceholder();
    }
  }
}

function showDetailPlaceholder() {
  document.getElementById("detail-placeholder")?.classList.remove("hidden");
  document.getElementById("detail-content")?.classList.add("hidden");
  document.getElementById("faq-detail-content")?.classList.add("hidden");
}

// ==========================================================================
// FAQ 목록 / 상세
// ==========================================================================
export function renderFaqList() {
  const listContainer = document.getElementById("term-list");
  listContainer.innerHTML = "";

  const filtered = state.faqData.filter((item) => {
    const matchesCategory =
      state.currentFaqCategoryFilter === "all" || item.category === state.currentFaqCategoryFilter;
    const plain = state.faqPlainCache.get(item.id) || "";
    const matchesSearch =
      item.question.toLowerCase().includes(state.searchQuery) ||
      item.summary.toLowerCase().includes(state.searchQuery) ||
      plain.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "term-list-empty";
    empty.textContent = state.searchQuery
      ? `"${state.searchQuery}"에 맞는 FAQ가 없습니다.`
      : "이 카테고리에 표시할 FAQ가 없습니다.";
    listContainer.appendChild(empty);
    return;
  }

  filtered.forEach((item) => {
    const el = document.createElement("div");
    el.className = `term-item faq-item ${item.id === state.currentSelectedFaqId ? "active" : ""}`;
    el.dataset.id = item.id;

    const catLabel = faqCategoryMeta[item.category]?.name || "FAQ";
    el.innerHTML = `
      <div class="term-item-header">
        <span class="term-name">${item.question}</span>
        <span class="term-badge badge-faq">${catLabel}</span>
      </div>
      <div class="term-desc-preview">${item.summary}</div>
    `;

    el.addEventListener("click", () => selectFaq(item.id));
    listContainer.appendChild(el);
  });
}

export function selectFaq(id, { syncHash = true } = {}) {
  if (state.currentViewMode !== "faq") {
    setViewMode("faq");
  }

  state.currentSelectedFaqId = id;

  document.querySelectorAll(".term-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.id === id);
  });

  const item = state.faqById.get(id);
  if (!item) return;

  const placeholder = document.getElementById("detail-placeholder");
  const termContent = document.getElementById("detail-content");
  const faqContent = document.getElementById("faq-detail-content");
  placeholder.classList.add("hidden");
  termContent.classList.add("hidden");
  faqContent.classList.remove("hidden");

  const badge = document.getElementById("faq-detail-category");
  const cat = faqCategoryMeta[item.category];
  badge.textContent = cat ? cat.name : "FAQ";
  badge.className = "category-badge badge-faq";

  document.getElementById("faq-detail-question").textContent = item.question;
  document.getElementById("faq-detail-summary").textContent = item.summary;

  const bodyEl = document.getElementById("faq-detail-body");
  bodyEl.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "desc-loading";
  loading.textContent = "답변을 불러오는 중…";
  bodyEl.appendChild(loading);

  loadFaqContent(id)
    .then((raw) => {
      if (state.currentSelectedFaqId !== id) return;
      renderMarkdownContent(raw, item.relatedTerms, bodyEl);
    })
    .catch(() => {
      if (state.currentSelectedFaqId !== id) return;
      bodyEl.replaceChildren();
      const err = document.createElement("p");
      err.className = "desc-error";
      err.textContent = "답변을 불러오지 못했습니다.";
      bodyEl.appendChild(err);
    });

  renderConnectionTags(item.relatedTerms || [], document.getElementById("faq-related-wrap"));

  const listElement = document.querySelector(`.term-item[data-id="${id}"]`);
  if (listElement) {
    listElement.scrollIntoView({ block: "nearest" });
  }

  if (syncHash) syncDeepLink("faq", id);
}

// ==========================================================================
// 용어 목록 / 상세
// ==========================================================================
export function renderTermList() {
  const listContainer = document.getElementById("term-list");
  listContainer.innerHTML = "";

  const filtered = state.glossaryData.filter((term) => {
    const matchesCategory =
      state.currentCategoryFilter === "all" || term.category === state.currentCategoryFilter;
    const plainDesc = state.descriptionPlainCache.get(term.id) || "";
    const matchesSearch =
      term.name.toLowerCase().includes(state.searchQuery) ||
      term.englishName.toLowerCase().includes(state.searchQuery) ||
      term.oneLine.toLowerCase().includes(state.searchQuery) ||
      plainDesc.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "term-list-empty";
    empty.textContent = state.searchQuery
      ? `"${state.searchQuery}"에 맞는 용어가 없습니다.`
      : "이 카테고리에 표시할 용어가 없습니다.";
    listContainer.appendChild(empty);
    return;
  }

  filtered.forEach((term) => {
    const item = document.createElement("div");
    item.className = `term-item ${term.id === state.currentSelectedId ? "active" : ""}`;
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

export function selectTerm(id, { syncHash = true } = {}) {
  if (state.currentViewMode !== "terms") {
    state.currentViewMode = "terms";
    document.querySelectorAll(".view-mode-btn").forEach((btn) => {
      const active = btn.dataset.view === "terms";
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    updateListPanelChrome();
    renderTermList();
  }

  state.currentSelectedId = id;

  document.querySelectorAll(".term-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.id === id);
  });

  const term = state.glossaryById.get(id);
  if (!term) return;

  const placeholder = document.getElementById("detail-placeholder");
  const content = document.getElementById("detail-content");
  const faqContent = document.getElementById("faq-detail-content");

  placeholder.classList.add("hidden");
  content.classList.remove("hidden");
  faqContent.classList.add("hidden");

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
      if (state.currentSelectedId !== id) return;
      renderMarkdownContent(raw, term.connections, descEl);
    })
    .catch(() => {
      if (state.currentSelectedId !== id) return;
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
      if (state.currentSelectedId !== id) return;
      renderExample(raw, id, term.connections, exampleEl);
    })
    .catch(() => {
      if (state.currentSelectedId !== id) return;
      renderExample(null, id, term.connections, exampleEl);
    });

  renderConnectionTags(term.connections, document.getElementById("detail-connections-wrap"));

  const listElement = document.querySelector(`.term-item[data-id="${id}"]`);
  if (listElement) {
    listElement.scrollIntoView({ block: "nearest" });
  }

  syncGraphSelection();
  requestRedraw();

  if (syncHash) syncDeepLink("terms", id);
}
