// Captures pleine page (ordinateur 1440, mobile 390) pour la revue de finition : .impeccable/review/desktop.png et mobile.png
// node tools/fullpage.mjs [url]
import fs from "node:fs";
import puppeteer from "puppeteer-core";
const url = process.argv[2] ?? "http://127.0.0.1:5231";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(".impeccable/review", { recursive: true });
let browser;
for (let i = 0; i < 3 && !browser; i++) { try { browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--hide-scrollbars"] }); } catch { /* Chrome met parfois du temps à démarrer : nouvel essai */ } }
for (const [w, h, name] of [[1440, 900, "desktop"], [390, 844, "mobile"]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, isMobile: w < 800, hasTouch: w < 800, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => localStorage.setItem("snuslbv_adulte", "1"));
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]); // états finaux, pas d'entrée en cours
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(1500);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += h * 0.7) { await page.evaluate((y) => window.scrollTo(0, y), y); await sleep(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
  console.log(name, w, "×", total);
  await page.close();
}
await browser.close();
