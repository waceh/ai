import { state } from "./state.js";
import {
  initGlossary,
  initFaq,
  preloadAllDescriptions,
  preloadAllFaq,
} from "./data.js";
import { initMarked } from "./markdown.js";
import { initGraph, resizeCanvas, requestRedraw } from "./graph.js";
import {
  initUI,
  updateListPanelChrome,
  renderTermList,
  renderFaqList,
  selectTerm,
  selectFaq,
} from "./ui.js";
import { applyDeepLinkRoute, initDeepLinkListener } from "./deeplink.js";

// 모듈 간 콜백 주입 (graph/markdown/deeplink가 state를 통해 호출)
state.selectTerm = selectTerm;
state.selectFaq = selectFaq;

async function bootstrap() {
  const appMain = document.querySelector(".app-main");
  try {
    await initGlossary();
    await initFaq();
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

  // 딥링크(#term=… / #faq=…)가 있으면 해당 항목 선택, 없으면 첫 용어
  const routed = applyDeepLinkRoute({ syncHash: false });
  if (!routed && state.glossaryData.length > 0) {
    selectTerm(state.glossaryData[0].id, { syncHash: false });
  }

  initGraph();
  initDeepLinkListener();

  window.addEventListener("resize", () => {
    clearTimeout(state.resizeTimer);
    state.resizeTimer = setTimeout(() => {
      if (state.graphModalOpen) {
        resizeCanvas();
        requestRedraw();
      }
    }, 200);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestRedraw();
  });

  preloadAllDescriptions(renderTermList);
  preloadAllFaq(renderFaqList);
}

// 모듈(deferred)·file://용 번들(동적 주입) 양쪽에서 안전하게 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
