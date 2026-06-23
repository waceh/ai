#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const defaultIndexPath = path.join(root, "data", "glossary-index.json");
const termsDir = path.join(root, "content", "terms");
const examplesDir = path.join(root, "content", "examples");

function stripFrontmatter(raw) {
  let body = raw.trim();
  if (body.startsWith("---")) {
    const end = body.indexOf("---", 3);
    if (end !== -1) body = body.slice(end + 3).trim();
  }
  return body;
}

function getTermLabels(term) {
  const labels = [term.name];
  if (term.englishName && term.englishName !== term.name) {
    term.englishName.split("/").forEach((part) => {
      const trimmed = part.trim();
      if (trimmed) labels.push(trimmed);
    });
  }
  if (term.aliases) {
    term.aliases.forEach((alias) => {
      if (alias) labels.push(alias);
    });
  }
  return [...new Set(labels)];
}

function collectSearchText(term) {
  const parts = [term.oneLine || ""];

  const termMd = path.join(termsDir, `${term.id}.md`);
  if (fs.existsSync(termMd)) {
    parts.push(stripFrontmatter(fs.readFileSync(termMd, "utf8")));
  }

  const exampleMd = path.join(examplesDir, `${term.id}.md`);
  if (fs.existsSync(exampleMd)) {
    parts.push(stripFrontmatter(fs.readFileSync(exampleMd, "utf8")));
  }

  return parts.join("\n\n");
}

function findMentionedIds(text, allTerms, selfId) {
  const mentioned = new Set();
  const needles = [];

  allTerms.forEach((term) => {
    if (term.id === selfId) return;
    getTermLabels(term).forEach((label) => {
      needles.push({ id: term.id, label });
    });
  });

  needles.sort((a, b) => b.label.length - a.label.length);

  needles.forEach(({ id, label }) => {
    if (text.includes(label)) mentioned.add(id);
  });

  return [...mentioned].sort();
}

function rebuildConnections(indexPath = defaultIndexPath, { write = true } = {}) {
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

  index.forEach((term) => {
    const text = collectSearchText(term);
    term.connections = findMentionedIds(text, index, term.id);
  });

  if (write) {
    fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
  }

  return index;
}

module.exports = { rebuildConnections };

if (require.main === module) {
  const index = rebuildConnections();
  console.log("Rebuilt connections from oneLine + term md + example md:");
  index.forEach((term) => {
    console.log(`  ${term.id}: ${term.connections.length} → [${term.connections.join(", ")}]`);
  });
}
