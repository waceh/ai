// History API 동작을 모사해 외부 의존성 없이 탐색 회귀를 확인한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../js/deeplink.js'), 'utf8')
  .replace(/^import .*;$/m, '').replace(/^export /gm, '');
function app(hash = '#term=hermes-agent') {
  const entries = [{ hash, state: null }];
  let cursor = 0;
  const listeners = {};
  const button = { addEventListener(event, fn) { this[event] = fn; } };
  function element() {
    return { children: [], dataset: {}, attributes: {},
      replaceChildren() { this.children = []; },
      appendChild(child) { this.children.push(child); },
      setAttribute(key, value) { this.attributes[key] = value; },
      addEventListener(event, fn) { this[event] = fn; },
      querySelector() { return null; },
    };
  }
  const pathList = element();
  const location = { hash, href: `https://example.test/${hash}` };
  const state = {
    glossaryById: new Map(['hermes-agent', 'memory', 'agent'].map(id => [id, {}])),
    faqById: new Map([['question', {}]]), currentViewMode: 'terms', currentSelectedId: 'hermes-agent',
    selectTerm(id) { this.currentViewMode = 'terms'; this.currentSelectedId = id; },
    selectFaq(id) { this.currentViewMode = 'faq'; this.currentSelectedFaqId = id; },
  };
  function move(offset) {
    cursor += offset;
    location.hash = entries[cursor].hash;
    location.href = `https://example.test/${location.hash}`;
    for (const fn of listeners.popstate || []) fn();
    for (const fn of listeners.hashchange || []) fn();
  }
  const history = {
    get state() { return entries[cursor].state; },
    pushState(value, _, url) {
      entries.splice(cursor + 1); cursor++;
      location.hash = url; entries.push({ hash: url, state: value });
    },
    replaceState(value, _, url) {
      location.hash = url.includes('#') ? url.slice(url.indexOf('#')) : '';
      location.href = `https://example.test/${location.hash}`;
      entries[cursor] = { hash: location.hash, state: value };
    }, back() { move(-1); }, forward() { move(1); }, go(offset) { move(offset); },
  };
  function reload() {
    for (const key of Object.keys(listeners)) delete listeners[key];
    const context = vm.createContext({ state, history, location, URLSearchParams,
      document: { getElementById: id => id === 'navigation-back' ? button : pathList,
        createElement: element },
      window: { addEventListener(event, fn) { (listeners[event] ||= []).push(fn); } },
    });
    vm.runInContext(source, context);
    context.applyDeepLinkRoute(); context.initDeepLinkListener();
    return context;
  }
  return { state, history, button, pathList, entries, reload, get hash() { return location.hash; } };
}
const a = app();
let api = a.reload();
assert.equal(a.button.disabled, true);
api.syncDeepLink('terms', 'memory');
assert.equal(a.button.disabled, false);
api.syncDeepLink('terms', 'memory');
assert.equal(a.entries.length, 2, '같은 항목 재선택은 이력을 추가하지 않음');
a.button.click();
assert.equal(a.state.currentSelectedId, 'hermes-agent');
assert.equal(a.button.disabled, true);
a.history.forward();
assert.equal(a.state.currentSelectedId, 'memory');
api = a.reload();
assert.equal(a.button.disabled, false, '새로고침 후 이전 이력 유지');
a.button.click();
assert.equal(a.state.currentSelectedId, 'hermes-agent');
api.syncDeepLink('faq', 'question');
assert.equal(a.entries.length, 2, '뒤로 간 뒤 새 이동은 앞으로 이력을 대체');
a.history.back();
assert.equal(a.state.currentViewMode, 'terms');
a.history.forward();
assert.equal(a.state.currentViewMode, 'faq');
assert.equal(a.state.currentSelectedFaqId, 'question');
const b = app('');
const initial = b.reload();
assert.equal(b.hash, '#term=hermes-agent', '해시 없는 첫 화면 URL 정규화');
initial.syncDeepLink('terms', 'memory');
b.button.click();
assert.equal(b.state.currentSelectedId, 'hermes-agent');
console.log('탐색 검증 통과: 이전/앞으로, 중복 선택, 새로고침, 이력 분기, FAQ, 초기 URL');

const c = app();
let paths = c.reload();
for (const id of ['memory', 'agent', 'memory', 'agent']) paths.syncDeepLink('terms', id);
assert.equal(c.pathList.children.length, 5, '5개까지 모두 표시');
paths.syncDeepLink('faq', 'question');
assert.equal(c.pathList.children.length, 6, '6개부터 시작점 + 생략 버튼 + 최근 4개');
let shown = c.pathList.children.map(item => item.children[0]);
assert.equal(shown[0].textContent, 'hermes-agent');
assert.equal(shown[1].textContent, '…');
assert.equal(shown.at(-1).attributes['aria-current'], 'page');
shown[1].click();
assert.equal(c.pathList.children.length, 7, '전체 6개와 접기 버튼 표시');
c.pathList.children.at(-1).children[0].click();
assert.equal(c.pathList.children[1].children[0].textContent, '…');
paths = c.reload();
assert.equal(c.pathList.children.length, 6, '새로고침 후 경로 유지');
c.pathList.children[2].children[0].click();
assert.equal(c.hash, '#term=agent', '이전 경로 클릭으로 해당 이력 복원');
assert.equal(c.pathList.children.length, 3);
paths.syncDeepLink('faq', 'question');
assert.equal(c.pathList.children.length, 4, '돌아간 지점부터 새 경로 연결');
console.log('탐색 경로 검증 통과: 5개 제한, 펼치기/접기, 현재 강조, 경로 복원, 새로고침, 분기');
