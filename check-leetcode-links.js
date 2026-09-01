const fs = require("fs");
const path = require("path");

const root = __dirname;
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const hot100Js = fs.readFileSync(path.join(root, "hot100-cards.js"), "utf8");

const hot100Numbers = Array.from(hot100Js.matchAll(/^\s+\[(\d+),/gm), (match) => match[1]);
const slugEntries = Array.from(appJs.matchAll(/^\s+(\d+):\s+"([^"]+)"/gm), (match) => ({
  number: match[1],
  slug: match[2]
}));

const slugMap = new Map(slugEntries.map((entry) => [entry.number, entry.slug]));
const missing = hot100Numbers.filter((number) => !slugMap.has(number));
const unsafe = slugEntries.filter((entry) => !/^[a-z0-9-]+$/.test(entry.slug));
const urls = hot100Numbers.map((number) => `https://leetcode.cn/problems/${slugMap.get(number) || ""}/`);
const duplicateUrls = urls.filter((url, index) => urls.indexOf(url) !== index);

if (hot100Numbers.length !== 100) {
  console.error(`Expected 100 Hot100 cards, found ${hot100Numbers.length}.`);
  process.exitCode = 1;
}

if (missing.length) {
  console.error(`Missing LeetCode slugs: ${missing.join(", ")}`);
  process.exitCode = 1;
}

if (unsafe.length) {
  console.error("Unsafe slug values:");
  unsafe.forEach((entry) => console.error(`  LC ${entry.number}: ${entry.slug}`));
  process.exitCode = 1;
}

if (duplicateUrls.length) {
  console.error(`Duplicate LeetCode URLs: ${Array.from(new Set(duplicateUrls)).join(", ")}`);
  process.exitCode = 1;
}

if (!process.exitCode) {
  console.log(`Checked ${hot100Numbers.length} Hot100 LeetCode links.`);
  console.log(`Sample: ${urls.slice(0, 3).join(" | ")}`);
}
