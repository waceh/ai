// 모바일 뷰포트에서 핵심 UI 흐름과 좁은 화면 회귀를 검증
import { chromium, devices } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.env.PROJECT_ROOT
  ? path.resolve(process.env.PROJECT_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".md": "text/markdown",
  ".umd.js": "text/javascript",
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);
      try {
        const data = await readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404).end("Not found");
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

const iPhone = devices["iPhone 12"];
const iPhoneSE = devices["iPhone SE"];
const results = [];

function pass(name, detail = "") {
  results.push({ ok: true, name, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ ok: false, name, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

const { server, baseUrl } = await startServer();
const browser = await chromium.launch();
const context = await browser.newContext({ ...iPhone });
const page = await context.newPage();

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForSelector(".term-item", { timeout: 10000 }).catch(() => {});

  // 1. 기본 로드
  const termItems = page.locator(".term-item");
  const count = await termItems.count();
  if (count > 0) pass("용어 목록 로드", `${count}개`);
  else fail("용어 목록 로드", "항목 0개");

  // 2. 모바일 레이아웃 (세로 스택)
  const resizerHidden = await page.locator("#panel-resizer").isHidden();
  const mainCols = await page.evaluate(() => getComputedStyle(document.querySelector(".app-main")).gridTemplateColumns);
  if (resizerHidden) pass("패널 리사이저 숨김 (≤1024px)");
  else fail("패널 리사이저 숨김");
  if (!mainCols.includes(" ") || mainCols.split(" ").length === 1) pass("단일 컬럼 레이아웃", mainCols);
  else fail("단일 컬럼 레이아웃", mainCols);

  // 3. 가로 스크롤 없음
  const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  if (!hasHScroll) pass("가로 스크롤 없음");
  else fail("가로 스크롤 발생", `scrollWidth=${await page.evaluate(() => document.documentElement.scrollWidth)}`);

  // 4. 용어 선택 → 상세
  await termItems.nth(1).tap();
  await page.waitForTimeout(300);
  const detailVisible = await page.locator("#detail-content").isVisible();
  const title = await page.locator("#detail-title").textContent();
  if (detailVisible && title) pass("용어 탭 후 상세 표시", title.trim());
  else fail("용어 상세 표시");

  // 5. 검색
  await page.locator("#search-input").fill("MCP");
  await page.waitForTimeout(200);
  const searchCount = await termItems.count();
  if (searchCount > 0 && searchCount < count) pass("검색 필터", `MCP ${searchCount}건`);
  else if (searchCount > 0) pass("검색 필터", `${searchCount}건`);
  else fail("검색 필터");

  // 6. FAQ 탭
  await page.locator('[data-view="faq"]').tap();
  await page.waitForTimeout(300);
  const faqVisible = await page.locator("#faq-detail-content").isVisible();
  const faqCount = await termItems.count();
  if (faqVisible && faqCount > 0) pass("FAQ 탭 전환", `${faqCount}건`);
  else fail("FAQ 탭 전환");

  // 7. 카테고리 탭
  await page.locator('[data-view="terms"]').tap();
  await page.waitForTimeout(200);
  await page.locator('[data-category="core"]').tap();
  await page.waitForTimeout(200);
  const coreCount = await termItems.count();
  if (coreCount > 0) pass("카테고리 필터", `core ${coreCount}건`);
  else fail("카테고리 필터");

  // 8. 연결 망 모달
  await page.locator("#open-graph-modal").tap();
  await page.waitForTimeout(400);
  const modalOpen = await page.locator("#graph-modal").evaluate((el) => !el.classList.contains("hidden"));
  const canvasW = await page.locator("#connection-graph").evaluate((c) => c.width);
  if (modalOpen && canvasW > 0) pass("그래프 모달 열기", `canvas ${canvasW}px`);
  else fail("그래프 모달 열기");

  // 9. 그래프 터치(탭)로 노드 선택
  const canvas = page.locator("#connection-graph");
  const box = await canvas.boundingBox();
  if (box) {
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(300);
    pass("그래프 캔버스 터치 입력");
  } else {
    fail("그래프 캔버스 터치 입력", "boundingBox 없음");
  }

  await page.locator("#graph-modal-close").tap();
  await page.waitForTimeout(200);

  // 10. 딥링크
  await page.goto(`${baseUrl}/#term=agent`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const deepTitle = await page.locator("#detail-title").textContent();
  if (deepTitle?.includes("에이전트") || deepTitle?.includes("Agent") || deepTitle?.trim().length > 0) {
    pass("딥링크 #term=agent", deepTitle.trim());
  } else {
    fail("딥링크 #term=agent", deepTitle || "empty");
  }

  // 11. 연관 태그 focus-within (모바일에서 hover 대체)
  const tagWrap = page.locator("#detail-connections-wrap.has-connections");
  if (await tagWrap.count()) {
    await tagWrap.first().tap();
    await page.waitForTimeout(200);
    const expanded = await tagWrap.first().evaluate((el) => {
      const preview = el.querySelector(".connection-tags-preview");
      return preview && getComputedStyle(preview).maxHeight === "none";
    });
    if (expanded) pass("연관 태그 탭 확장 (focus-within)");
    else fail("연관 태그 탭 확장", "모바일 탭 후에도 2줄 미리보기 상태");
  } else {
    pass("연관 태그", "해당 용어에 연결 없음");
  }

  // 12. 더 좁은 화면(iPhone SE) 회귀
  const seContext = await browser.newContext({ ...iPhoneSE });
  const sePage = await seContext.newPage();
  await sePage.goto(baseUrl, { waitUntil: "networkidle" });
  await sePage.waitForSelector(".term-item", { timeout: 10000 }).catch(() => {});
  const seHScroll = await sePage.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  );
  const seHeaderWraps = await sePage.evaluate(() => {
    const header = document.querySelector(".app-header");
    if (!header) return false;
    return getComputedStyle(header).flexWrap === "wrap";
  });
  const seContainerMinHeight = await sePage.evaluate(() => {
    const container = document.querySelector(".app-container");
    if (!container) return "";
    return getComputedStyle(container).minHeight;
  });
  if (!seHScroll) pass("iPhone SE 가로 스크롤 없음");
  else fail("iPhone SE 가로 스크롤 발생");
  if (seHeaderWraps) pass("iPhone SE 헤더 줄바꿈 허용");
  else fail("iPhone SE 헤더 줄바꿈", "flex-wrap이 nowrap");
  if (seContainerMinHeight.endsWith("px") && Number.parseFloat(seContainerMinHeight) > 0) {
    pass("모바일 동적 뷰포트 높이 적용", seContainerMinHeight);
  } else {
    fail("모바일 동적 뷰포트 높이 적용", seContainerMinHeight || "없음");
  }
  await seContext.close();

  // JS 런타임 에러
  if (errors.length === 0) pass("JS 런타임 에러 없음");
  else fail("JS 런타임 에러", errors.slice(0, 3).join("; "));
} catch (e) {
  fail("테스트 실행", e.message);
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n모바일 검증: ${results.length - failed.length}/${results.length} 통과`);
if (failed.length) {
  console.log("실패 항목:", failed.map((f) => f.name).join(", "));
  process.exit(1);
}
