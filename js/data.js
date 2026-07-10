import { CONTENT_BASE, EXAMPLES_BASE, FAQ_BASE } from "./constants.js";
import { state } from "./state.js";
import { markdownToPlainText } from "./markdown.js";

// 빌드/CI 없이 운영: GitHub Pages(https)에서는 fetch 우선, file://에서만 번들 사용.
function usesBundleFallback() {
  return location.protocol === "file:";
}

function cacheDescription(id, raw) {
  state.descriptionRawCache.set(id, raw);
  state.descriptionPlainCache.set(id, markdownToPlainText(raw));
  return raw;
}

export function buildGlossaryIndex() {
  state.glossaryById.clear();
  state.glossaryData.forEach((term) => {
    term._connectionSet = new Set(term.connections);
    state.glossaryById.set(term.id, term);
  });
}

function initGlossaryFromBundle() {
  const bundle = window.__GLOSSARY__;
  if (!bundle?.index) return false;

  state.glossaryData = [...bundle.index];
  buildGlossaryIndex();

  if (bundle.descriptions) {
    Object.entries(bundle.descriptions).forEach(([id, raw]) => {
      cacheDescription(id, raw);
    });
  }
  if (bundle.examples) {
    Object.entries(bundle.examples).forEach(([id, raw]) => {
      state.exampleCache.set(id, raw);
    });
  }
  if (bundle.faqIndex) {
    state.faqData = [...bundle.faqIndex];
    buildFaqIndex();
    if (bundle.faqArticles) {
      Object.entries(bundle.faqArticles).forEach(([id, raw]) => {
        cacheFaqContent(id, raw);
      });
    }
  }
  return true;
}

async function initGlossaryFromFetch() {
  const res = await fetch("data/glossary-index.json");
  if (!res.ok) throw new Error(`index HTTP ${res.status}`);
  state.glossaryData = await res.json();
  buildGlossaryIndex();
}

export function buildFaqIndex() {
  state.faqById.clear();
  state.faqData.forEach((item) => {
    state.faqById.set(item.id, item);
  });
}

function cacheFaqContent(id, raw) {
  state.faqRawCache.set(id, raw);
  state.faqPlainCache.set(id, markdownToPlainText(raw));
  return raw;
}

async function initFaqFromFetch() {
  const res = await fetch("data/faq-index.json");
  if (!res.ok) throw new Error(`faq index HTTP ${res.status}`);
  state.faqData = await res.json();
  buildFaqIndex();
}

function loadBundleFromFaq(bundle) {
  state.faqData = [...bundle.faqIndex];
  buildFaqIndex();
  if (bundle.faqArticles) {
    Object.entries(bundle.faqArticles).forEach(([id, raw]) => {
      cacheFaqContent(id, raw);
    });
  }
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

export async function initGlossary() {
  if (usesBundleFallback()) {
    if (initGlossaryFromBundle()) return;
    if ((await loadBundleScript()) && initGlossaryFromBundle()) return;
  }
  await initGlossaryFromFetch();
}

export async function initFaq() {
  if (usesBundleFallback()) {
    if (window.__GLOSSARY__?.faqIndex) {
      loadBundleFromFaq(window.__GLOSSARY__);
      return;
    }
    if ((await loadBundleScript()) && window.__GLOSSARY__?.faqIndex) {
      loadBundleFromFaq(window.__GLOSSARY__);
      return;
    }
  }
  await initFaqFromFetch();
}

export async function loadTermExample(id) {
  if (state.exampleCache.has(id)) return state.exampleCache.get(id);

  const bundled = window.__GLOSSARY__?.examples?.[id];
  if (bundled) {
    state.exampleCache.set(id, bundled);
    return bundled;
  }

  const res = await fetch(`${EXAMPLES_BASE}/${id}.md`);
  if (!res.ok) return null;
  const raw = await res.text();
  state.exampleCache.set(id, raw);
  return raw;
}

export async function loadFaqContent(id) {
  if (state.faqRawCache.has(id)) return state.faqRawCache.get(id);

  const bundled = window.__GLOSSARY__?.faqArticles?.[id];
  if (bundled) return cacheFaqContent(id, bundled);

  const res = await fetch(`${FAQ_BASE}/${id}.md`);
  if (!res.ok) throw new Error(`faq HTTP ${res.status}`);
  return cacheFaqContent(id, await res.text());
}

export async function loadTermDescription(id) {
  if (state.descriptionRawCache.has(id)) return state.descriptionRawCache.get(id);

  const bundled = window.__GLOSSARY__?.descriptions?.[id];
  if (bundled) return cacheDescription(id, bundled);

  const res = await fetch(`${CONTENT_BASE}/${id}.md`);
  if (!res.ok) throw new Error(`description HTTP ${res.status}`);
  return cacheDescription(id, await res.text());
}

export function preloadAllFaq(onUpdated) {
  if (window.__GLOSSARY__?.faqArticles) return;

  state.faqData.forEach((item) => {
    loadFaqContent(item.id)
      .then(() => {
        if (state.searchQuery && state.currentViewMode === "faq") onUpdated();
      })
      .catch(() => {});
  });
}

export function preloadAllDescriptions(onUpdated) {
  if (window.__GLOSSARY__?.descriptions) return;

  state.glossaryData.forEach((term) => {
    loadTermDescription(term.id)
      .then(() => {
        if (state.searchQuery) onUpdated();
      })
      .catch(() => {});
  });
}
