#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const termsDir = path.join(root, "content", "terms");
const terms = require("./term-details-enriched.js");

for (const [id, body] of Object.entries(terms)) {
  const file = path.join(termsDir, `${id}.md`);
  const content = `---\nid: ${id}\n---\n\n${body.trim()}\n`;
  fs.writeFileSync(file, content);
  console.log("wrote", id);
}

console.log("done", Object.keys(terms).length);
