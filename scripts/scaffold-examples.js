#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const index = JSON.parse(
  fs.readFileSync(path.join(root, "data", "glossary-index.json"), "utf8")
);
const examplesDir = path.join(root, "content", "examples");
const templatePath = path.join(examplesDir, "_TEMPLATE.md");

if (!fs.existsSync(examplesDir)) fs.mkdirSync(examplesDir, { recursive: true });

const template = fs.readFileSync(templatePath, "utf8");

for (const term of index) {
  const file = path.join(examplesDir, `${term.id}.md`);
  if (fs.existsSync(file)) {
    console.log("skip", term.id);
    continue;
  }
  const content = template.replace("TERM_ID", term.id);
  fs.writeFileSync(file, content);
  console.log("created", term.id);
}

console.log("done", index.length);
