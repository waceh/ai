export const CONTENT_BASE = "content/terms";
export const EXAMPLES_BASE = "content/examples";
export const FAQ_BASE = "content/faq";

export const categoryMeta = {
  core: { name: "코어 엔진", color: "#06b6d4" },
  agent: { name: "에이전트/도구", color: "#8b5cf6" },
  env: { name: "환경/보안", color: "#10b981" },
};

export const faqCategoryMeta = {
  "how-it-works": { name: "동작 원리", color: "#38bdf8" },
  models: { name: "모델·제품", color: "#a855f7" },
};

export const SIDEBAR_WIDTH_STORAGE_KEY = "glossary-sidebar-width";
export const SIDEBAR_MIN_PX = 200;
export const SIDEBAR_MAX_PX = 480;
export const SIDEBAR_STEP_PX = 12;

export const MAX_LAYOUT_ITERATIONS = 100;
export const LAYOUT_DPR_CAP = 2;
export const damping = 0.82;
export const kAttraction = 0.05;
export const kRepulsion = 1500;
export const kGravity = 0.02;
export const restLength = 130;

export const EVIDENCE_URL_RE = /(https?:\/\/[^\s)]+)/;
