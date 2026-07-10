import {
  categoryMeta,
  MAX_LAYOUT_ITERATIONS,
  LAYOUT_DPR_CAP,
  damping,
  kAttraction,
  kRepulsion,
  kGravity,
  restLength,
} from "./constants.js";
import { state } from "./state.js";

const canvas = document.getElementById("connection-graph");
const ctx = canvas.getContext("2d");
const graphModal = document.getElementById("graph-modal");

export function initGraph() {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);
  canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd);
  canvas.addEventListener("touchcancel", onTouchEnd);
}

export function initGraphModal(openBtn, closeBtn, backdrop) {
  if (!graphModal) return;

  const open = () => {
    graphModal.classList.remove("hidden");
    document.body.classList.add("graph-modal-open");
    state.graphModalOpen = true;
    requestAnimationFrame(() => {
      ensureGraphLayout();
    });
  };

  const close = () => {
    graphModal.classList.add("hidden");
    document.body.classList.remove("graph-modal-open");
    state.graphModalOpen = false;
  };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.graphModalOpen) close();
  });
}

export function ensureGraphLayout() {
  resizeCanvas();
  const container = canvas.parentNode;
  if (!container || container.clientWidth < 16) return;

  if (!state.graphLayoutReady) {
    setupGraphPositions();
    state.graphLayoutReady = true;
  } else {
    syncGraphSelection();
    requestRedraw();
  }
}

export function requestRedraw() {
  if (document.hidden) return;
  if (state.drawScheduled) return;
  state.drawScheduled = true;
  requestAnimationFrame(() => {
    state.drawScheduled = false;
    if (!document.hidden) drawGraph();
  });
}

export function resizeCanvas() {
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

export function syncGraphSelection() {
  if (!state.currentSelectedId) return;
  state.nodes.forEach((n) => {
    n.isSelected = n.id === state.currentSelectedId;
    ctx.font = n.isSelected ? "bold 11px Outfit, Noto Sans KR" : "10px Outfit, Noto Sans KR";
    n.labelWidth = ctx.measureText(n.name).width;
  });
}

export function setupGraphPositions() {
  const dpr = Math.min(window.devicePixelRatio || 1, LAYOUT_DPR_CAP);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const centerX = width / 2;
  const centerY = height / 2;

  state.nodes = state.glossaryData.map((term, index) => {
    const angle = (index / state.glossaryData.length) * Math.PI * 2;
    const r = Math.min(width, height) * 0.32;
    const color = categoryMeta[term.category].color;
    return {
      id: term.id,
      name: term.name,
      category: term.category,
      color,
      colorGlow: hexToRgba(color, 0.16),
      colorBorderLight: hexToRgba(color, 0.4),
      colorBorderDim: hexToRgba(color, 0.2),
      colorFillDim: hexToRgba("#0f172a", 0.3),
      x: centerX + Math.cos(angle) * r + (Math.random() - 0.5) * 10,
      y: centerY + Math.sin(angle) * r + (Math.random() - 0.5) * 10,
      vx: 0,
      vy: 0,
      radius: term.id === "agent" ? 28 : 20,
      isSelected: term.id === state.currentSelectedId,
      labelWidth: 0,
    };
  });

  state.nodes.forEach((node) => {
    ctx.font = node.isSelected ? "bold 11px Outfit, Noto Sans KR" : "10px Outfit, Noto Sans KR";
    node.labelWidth = ctx.measureText(node.name).width;
  });

  state.links = [];
  state.glossaryData.forEach((term) => {
    term.connections.forEach((connId) => {
      const linkKey = [term.id, connId].sort().join("-");
      if (!state.links.some((l) => l.key === linkKey)) {
        const sourceNode = state.nodes.find((n) => n.id === term.id);
        const targetNode = state.nodes.find((n) => n.id === connId);

        if (sourceNode && targetNode) {
          state.links.push({
            source: term.id,
            target: connId,
            sourceNode,
            targetNode,
            key: linkKey,
          });
        }
      }
    });
  });

  runLayoutToCompletion();
  requestRedraw();
}

function hexToRgba(hex, alpha) {
  let r = 0;
  let g = 0;
  let b = 0;
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

function runLayoutToCompletion() {
  for (let i = 0; i < MAX_LAYOUT_ITERATIONS; i++) {
    updatePhysics();
    let energy = 0;
    for (let j = 0; j < state.nodes.length; j++) {
      const n = state.nodes[j];
      energy += n.vx * n.vx + n.vy * n.vy;
    }
    if (energy < 0.05) break;
  }
  state.nodes.forEach((n) => {
    n.vx = 0;
    n.vy = 0;
  });
}

function getActiveHighlightId() {
  return state.hoveredNode ? state.hoveredNode.id : state.currentSelectedId;
}

function getActiveConnections() {
  const id = getActiveHighlightId();
  if (!id) return null;
  const term = state.glossaryById.get(id);
  return term ? term._connectionSet : null;
}

function updatePhysics() {
  const dpr = Math.min(window.devicePixelRatio || 1, LAYOUT_DPR_CAP);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < state.links.length; i++) {
    const link = state.links[i];
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

  const nLen = state.nodes.length;
  for (let i = 0; i < nLen; i++) {
    const n1 = state.nodes[i];
    for (let j = i + 1; j < nLen; j++) {
      const n2 = state.nodes[j];

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

  for (let i = 0; i < nLen; i++) {
    const node = state.nodes[i];
    if (node === state.draggedNode) continue;

    node.vx += (centerX - node.x) * kGravity;
    node.vy += (centerY - node.y) * kGravity;

    node.x += node.vx;
    node.y += node.vy;
    node.vx *= damping;
    node.vy *= damping;

    const pad = node.radius + 15;
    if (node.x < pad) {
      node.x = pad;
      node.vx = 0;
    } else if (node.x > width - pad) {
      node.x = width - pad;
      node.vx = 0;
    }

    if (node.y < pad) {
      node.y = pad;
      node.vy = 0;
    } else if (node.y > height - pad) {
      node.y = height - pad;
      node.vy = 0;
    }
  }
}

function drawGraph() {
  const dpr = Math.min(window.devicePixelRatio || 1, LAYOUT_DPR_CAP);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;

  ctx.clearRect(0, 0, width, height);

  const activeNodeId = getActiveHighlightId();
  const activeNodeConnections = getActiveConnections();

  for (let i = 0; i < state.links.length; i++) {
    const link = state.links[i];
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

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(t.x, t.y);
    if (isLinkActive) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
      ctx.lineWidth = 1.8;
    } else {
      ctx.strokeStyle = isLinkDimmed ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 0.9;
    }
    ctx.stroke();
  }

  for (let i = 0; i < state.nodes.length; i++) {
    const node = state.nodes[i];
    let isNodeDimmed = false;

    if (activeNodeId) {
      if (node.id !== activeNodeId && (!activeNodeConnections || !activeNodeConnections.has(node.id))) {
        isNodeDimmed = true;
      }
    }

    const opacity = isNodeDimmed ? 0.2 : 1.0;
    const isSelected = node.isSelected;
    const isHovered = node === state.hoveredNode;

    if (isSelected || isHovered) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = node.colorGlow;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.strokeStyle = isSelected ? node.color : isNodeDimmed ? node.colorBorderDim : node.colorBorderLight;
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius - 1.5, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? node.color : isNodeDimmed ? node.colorFillDim : "rgba(15, 23, 42, 0.9)";
    ctx.fill();

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

function getCanvasPos(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function onPointerDown(x, y) {
  const hit = findNodeAt(x, y);
  if (hit) {
    state.isDragging = true;
    state.draggedNode = hit;
    state.selectTerm(hit.id);
  }
}

function onPointerMove(x, y) {
  if (state.isDragging && state.draggedNode) {
    state.draggedNode.x = x;
    state.draggedNode.y = y;
    requestRedraw();
    return;
  }

  const hit = findNodeAt(x, y);
  if (hit !== state.hoveredNode) {
    state.hoveredNode = hit;
    canvas.style.cursor = hit ? "pointer" : "grab";
    requestRedraw();
  }
}

function onPointerUp() {
  state.isDragging = false;
  state.draggedNode = null;
}

function onMouseDown(e) {
  const m = getCanvasPos(e.clientX, e.clientY);
  onPointerDown(m.x, m.y);
}

function onMouseMove(e) {
  const m = getCanvasPos(e.clientX, e.clientY);
  onPointerMove(m.x, m.y);
}

function onMouseUp() {
  onPointerUp();
}

function onTouchStart(e) {
  if (e.touches.length !== 1) return;
  e.preventDefault();
  const m = getCanvasPos(e.touches[0].clientX, e.touches[0].clientY);
  onPointerDown(m.x, m.y);
}

function onTouchMove(e) {
  if (e.touches.length !== 1) return;
  e.preventDefault();
  const m = getCanvasPos(e.touches[0].clientX, e.touches[0].clientY);
  onPointerMove(m.x, m.y);
}

function onTouchEnd() {
  onPointerUp();
}

function findNodeAt(x, y) {
  for (let i = 0; i < state.nodes.length; i++) {
    const node = state.nodes[i];
    const dx = node.x - x;
    const dy = node.y - y;
    const distSq = dx * dx + dy * dy;
    const radiusThreshold = node.radius + 12;
    if (distSq < radiusThreshold * radiusThreshold) {
      return node;
    }
  }
  return null;
}
