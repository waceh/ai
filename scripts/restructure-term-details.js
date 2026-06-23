#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const enrichedPath = path.join(__dirname, "term-details-enriched.js");
const terms = require("./term-details-enriched.js");

function parseSubsections(body) {
  const subsections = {};
  const normalized = body.trim().replace(/^### /, "\n### ").trim();
  const chunks = normalized.split(/\n### /);
  for (const chunk of chunks) {
    const nl = chunk.indexOf("\n");
    if (nl === -1) continue;
    const title = chunk.slice(0, nl).trim();
    subsections[title] = chunk.slice(nl + 1).trim();
  }
  return subsections;
}

function restructure(body) {
  const refMatch = body.match(/\n## 참고\n([\s\S]*)$/);
  const refBlock = refMatch ? `## 참고\n\n${refMatch[1].trim()}` : "";
  let main = refMatch ? body.slice(0, refMatch.index) : body;

  main = main.replace(/^## 세부 내용\n\n/, "");

  let topOverview = "";
  const topOverviewMatch = main.match(/^## 개요\n\n([\s\S]*?)\n\n(?:## 세부 내용\n\n)?/);
  if (topOverviewMatch) {
    topOverview = topOverviewMatch[1].trim();
    main = main.slice(topOverviewMatch[0].length);
  }

  main = main.replace(/^## 세부 내용\n\n/, "");
  const sub = parseSubsections(main);

  const overviewParts = [
    topOverview,
    sub["개요"],
    sub["한 줄로 이해하기"],
    sub["주니어가 헷갈리기 쉬운 점"],
    sub["유의사항"],
  ].filter(Boolean);

  const structureParts = [
    sub["동작/구조"],
    sub["어떻게 동작하나요?"],
    sub["다른 개념과의 관계"],
  ].filter(Boolean);

  const overview = [...new Set(overviewParts.join("\n\n").split("\n\n").filter(Boolean))].join("\n\n");
  const purpose = sub["사용목적"] || sub["왜 쓰나요?"] || "";
  const structure = structureParts.join("\n\n");

  return `### 개요

${overview}

### 사용목적

${purpose}

### 동작/구조

${structure}

${refBlock}`.trim();
}

const restructured = {};
for (const [id, body] of Object.entries(terms)) {
  restructured[id] = restructure(body);
}

const lines = ["module.exports = {"];
for (const [id, body] of Object.entries(restructured)) {
  const key = id.includes("-") ? `"${id}"` : id;
  lines.push(`  ${key}: \`${body.replace(/\\/g, "\\\\").replace(/`/g, "\\`")}\`,`);
  lines.push("");
}
lines.push("};");
lines.push("");

fs.writeFileSync(enrichedPath, lines.join("\n"));
console.log("restructured", Object.keys(restructured).length, "terms");
