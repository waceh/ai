// 앱 전역 가변 상태 단일 소스.
// ESM에서 import 바인딩은 읽기 전용이므로, 재할당이 필요한 값은
// 개별 `export let`이 아니라 이 객체의 속성으로 둔다.
export const state = {
  // 데이터
  glossaryData: [],
  glossaryById: new Map(),
  descriptionRawCache: new Map(),
  descriptionPlainCache: new Map(),
  exampleCache: new Map(),

  faqData: [],
  faqById: new Map(),
  faqRawCache: new Map(),
  faqPlainCache: new Map(),

  markedReady: false,

  // UI 선택/필터
  currentViewMode: "terms",
  currentSelectedId: null,
  currentSelectedFaqId: null,
  currentCategoryFilter: "all",
  currentFaqCategoryFilter: "all",
  searchQuery: "",

  // 그래프
  graphModalOpen: false,
  graphLayoutReady: false,
  nodes: [],
  links: [],
  isDragging: false,
  draggedNode: null,
  hoveredNode: null,
  drawScheduled: false,
  resizeTimer: null,

  // 모듈 간 콜백 (ui.js에서 주입)
  /** @type {(id: string, options?: { syncHash?: boolean }) => void} */
  selectTerm: () => {},
  /** @type {(id: string, options?: { syncHash?: boolean }) => void} */
  selectFaq: () => {},
};
