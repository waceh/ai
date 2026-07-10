import { state } from "./state.js";

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
    history.replaceState(null, "", next);
  }
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
  window.addEventListener("hashchange", () => {
    applyDeepLinkRoute({ syncHash: false });
  });
}
