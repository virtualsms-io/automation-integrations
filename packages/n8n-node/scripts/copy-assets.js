// Copies node icons (.svg) into dist so n8n loads them from the published package.
const fs = require("fs");
const path = require("path");

const srcRoot = path.join(__dirname, "..", "src");
const distRoot = path.join(__dirname, "..", "dist");

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith(".svg") || entry.name.endsWith(".png")) {
      const rel = path.relative(srcRoot, full);
      const dest = path.join(distRoot, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(full, dest);
      console.log(`copied ${rel}`);
    }
  }
}

if (fs.existsSync(srcRoot)) walk(srcRoot);
