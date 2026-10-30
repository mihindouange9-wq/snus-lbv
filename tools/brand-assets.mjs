// Image de partage (og.jpg, 1200 × 630) et icône Apple (180 × 180) rendues dans Chrome headless
// à partir du mot-symbole, des trois gels et des visuels réels des boîtes.
// node tools/brand-assets.mjs
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const root = path.resolve(import.meta.dirname, "..");
const b64 = (p, mime) => `data:${mime};base64,${fs.readFileSync(path.join(root, p)).toString("base64")}`;
const mark = fs.readFileSync(path.join(root, "public/logo/snus-lbv-creme.svg"), "utf8");
const fav = fs.readFileSync(path.join(root, "public/favicon.svg"), "utf8");
const can = (id, size, x, y, rot) =>
  `<img src="${b64(`public/images/products/${id}.webp`, "image/webp")}" style="position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;transform:rotate(${rot}deg) scaleY(.62);box-shadow:0 30px 40px -20px rgba(0,0,0,.8)">`;

const og = `<!doctype html><html><body style="margin:0;width:1200px;height:630px;overflow:hidden;background:#0B0A10;font-family:Arial;position:relative">
<div style="position:absolute;inset:0;background:
 radial-gradient(circle at 14% 18%, rgba(255,90,31,.85), transparent 42%),
 radial-gradient(circle at 86% 10%, rgba(248,255,50,.5), transparent 36%),
 radial-gradient(circle at 70% 100%, rgba(121,40,255,.9), transparent 50%)"></div>
<div style="position:absolute;left:64px;top:70px;width:760px;color:#F4EFE6">${mark}</div>
${can("ns-fm", 200, 760, 300, -10)}
${can("velo-fp", 300, 860, 250, 6)}
${can("zyn-bc", 170, 650, 420, 12)}
<p style="position:absolute;left:64px;top:300px;margin:0;color:#F4EFE6;font-size:34px;line-height:1.3;width:560px;font-weight:600">Pouches de nicotine, sans tabac.<br>Neuf goûts, livrés à Libreville.</p>
<p style="position:absolute;left:64px;bottom:56px;margin:0;color:#F8FF32;font-size:22px;font-weight:700;letter-spacing:.08em">COMMANDE SUR WHATSAPP · 076 45 13 60</p>
<p style="position:absolute;right:64px;bottom:56px;margin:0;color:#F4EFE6;font-size:18px;opacity:.8">18+ · La nicotine crée une forte dépendance</p>
</body></html>`;

const icon = `<!doctype html><html><body style="margin:0;width:180px;height:180px;overflow:hidden;background:#0B0A10"><div style="width:180px;height:180px">${fav.replace('<circle cx="32" cy="32" r="32" fill="#0B0A10"/>', "")}</div></body></html>`;

let browser;
for (let i = 0; i < 3 && !browser; i++) {
  try {
    browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
  } catch { /* Chrome met parfois du temps à démarrer : nouvel essai */ }
}
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(og, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: path.join(root, "public/og.jpg"), type: "jpeg", quality: 86 });
await page.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
await page.setContent(icon, { waitUntil: "load" });
await page.screenshot({ path: path.join(root, "public/apple-touch-icon.png"), type: "png" });
await browser.close();
console.log("og.jpg et apple-touch-icon.png écrits");
