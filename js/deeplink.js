import { state } from "./state.js";

const NAVIGATION_KEY = "glossaryNavigation";
let pathExpanded = false;

function routeLabel(mode, id) {
  return mode === "faq"
    ? state.faqById.get(id)?.question || id
    : state.glossaryById.get(id)?.name || id;
}

export function visibleNavigationPath(path, expanded = false) {
  if (expanded || path.length <= 5) return path;
  return [path[0], null, ...path.slice(-4)];
}

function renderNavigationPath() {
  const list = document.getElementById("navigation-path-list");
  if (!list) return;
  list.replaceChildren();
  const entry = currentNavigation();
  const path = entry?.path || [];
  visibleNavigationPath(path, pathExpanded).forEach((route) => {
    const item = document.createElement("li");
    if (!route) {
      const expand = document.createElement("button");
      expand.type = "button";
      expand.textContent = "…";
      expand.setAttribute("aria-label", `숨겨진 이동 경로 ${path.length - 5}개 펼치기`);
      expand.setAttribute("aria-expanded", "false");
      expand.addEventListener("click", () => {
        pathExpanded = true;
        renderNavigationPath();
        list.querySelector('[data-collapse]')?.focus();
      });
      item.appendChild(expand);
    } else if (route.index === entry.index) {
      const current = document.createElement("span");
      current.textContent = route.label;
      current.setAttribute("aria-current", "page");
      item.appendChild(current);
    } else {
      const link = document.createElement("button");
      link.type = "button";
      link.textContent = route.label;
      link.addEventListener("click", () => history.go(route.index - entry.index));
      item.appendChild(link);
    }
    list.appendChild(item);
  });
  if (pathExpanded && path.length > 5) {
    const item = document.createElement("li");
    const collapse = document.createElement("button");
    collapse.type = "button";
    collapse.textContent = "접기";
    collapse.dataset.collapse = "true";
    collapse.setAttribute("aria-expanded", "true");
    collapse.addEventListener("click", () => {
      pathExpanded = false;
      renderNavigationPath();
      list.querySelector('button[aria-expanded="false"]')?.focus();
    });
    item.appendChild(collapse);
    list.appendChild(item);
  }
}

function currentNavigation() {
  const entry = history.state?.[NAVIGATION_KEY];
  return entry?.hash === location.hash && Number.isInteger(entry.index) && entry.index >= 0
    ? entry
    : null;
}

function updateBackButton() {
  pathExpanded = false;
  renderNavigationPath();
  const button = document.getElementById("navigation-back");
  if (!button) return;
  const entry = currentNavigation();
  button.disabled = !entry || entry.index === 0;
  button.title = button.disabled ? "이전 이동 이력이 없습니다" : "이전 용어 또는 FAQ로 돌아가기";
}

export function parseDeepLink() {
  const raw = location.hash.replace(/^#/, "").trim();
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  const termId = params.get("term");
  const faqId = params.get("faq");

  if (faqId && state.faqById.has(faqId)) {
    return { mode: "faq", id: faqId };
  }
  if (termId && state.glossaryById.has(termId)) {
    return { mode: "terms", id: termId };
  }
  return null;
}

export function syncDeepLink(mode, id) {
  const params = new URLSearchParams();
  if (mode === "faq") {
    params.set("faq", id);
  } else {
    params.set("term", id);
  }
  const next = `#${params.toString()}`;
  if (location.hash !== next) {
    const previous = currentNavigation();
    const index = (previous?.index ?? 0) + 1;
    const path = [...(previous?.path || []), { index, hash: next, label: routeLabel(mode, id) }];
    history.pushState({ ...history.state, [NAVIGATION_KEY]: { index, hash: next, path } }, "", next);
  }
  updateBackButton();
}

export function applyDeepLinkRoute({ syncHash = false } = {}) {
  const route = parseDeepLink();
  if (route?.mode === "faq") {
    state.selectFaq(route.id, { syncHash });
    return true;
  }
  if (route?.mode === "terms") {
    state.selectTerm(route.id, { syncHash });
    return true;
  }
  return false;
}

export function initDeepLinkListener() {
  // 첫 화면도 URL에 남겨야 해시 없이 시작했을 때 뒤로가기로 복원할 수 있다.
  if (!parseDeepLink()) {
    const params = new URLSearchParams();
    if (state.currentViewMode === "faq" && state.currentSelectedFaqId) {
      params.set("faq", state.currentSelectedFaqId);
    } else if (state.currentSelectedId) {
      params.set("term", state.currentSelectedId);
    }
    if (params.size) history.replaceState(history.state, "", `#${params}`);
  }
  if (!currentNavigation()?.path) {
    const index = currentNavigation()?.index ?? 0;
    const route = parseDeepLink();
    const path = route ? [{ index, hash: location.hash, label: routeLabel(route.mode, route.id) }] : [];
    history.replaceState({ ...history.state, [NAVIGATION_KEY]: { index, hash: location.hash, path } }, "", location.href);
  }
  updateBackButton();
  document.getElementById("navigation-back")?.addEventListener("click", () => {
    if ((currentNavigation()?.index ?? 0) > 0) history.back();
  });

  const restore = () => {
    applyDeepLinkRoute({ syncHash: false });
    updateBackButton();
  };
  window.addEventListener("popstate", restore);
  window.addEventListener("hashchange", restore);
}
