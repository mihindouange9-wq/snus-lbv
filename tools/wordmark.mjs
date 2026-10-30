// Génère le mot-symbole SNUS LBV en tracés SVG depuis Black Han Sans (SIL OFL 1.1) : lettres condensées à angles vifs,
// chaque lettre inclinée et décalée, ombre portée douce, à la manière de la référence « WAUW! ».
// Produit src/assets/wordmark.ts, les logos SVG de public/logo/ (à plat et avec ombre) et le favicon.
// node tools/wordmark.mjs
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const root = path.resolve(import.meta.dirname, "..");
const ttf = path.join(root, "references/polices/ttf/BlackHanSans-Regular.ttf");
const buf = fs.readFileSync(ttf);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const SIZE = 200;
// inclinaison (degrés) et décalage vertical (fraction de la taille) par lettre, dans l'esprit de « WAUW! »
const LETTERS = [
  { ch: "S", rot: -8, dy: 0.02 },
  { ch: "N", rot: 5, dy: -0.03 },
  { ch: "U", rot: -4, dy: 0.03 },
  { ch: "S", rot: 7, dy: -0.02 },
  { ch: " " },
  { ch: "L", rot: -6, dy: 0.02 },
  { ch: "B", rot: 4, dy: -0.03 },
  { ch: "V", rot: -8, dy: 0.02 },
];
const scale = SIZE / font.unitsPerEm;
const TRACK = -0.035 * SIZE; // resserrage
const glyphs = [];
const words = [];
let x = 0, prev = null, word = null;
const box = () => ({ minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, glyphs: [] });
const grow = (b, px, py) => { b.minX = Math.min(b.minX, px); b.maxX = Math.max(b.maxX, px); b.minY = Math.min(b.minY, py); b.maxY = Math.max(b.maxY, py); };
const all = box();
for (const L of LETTERS) {
  const g = font.charToGlyph(L.ch);
  if (prev) x += font.getKerningValue(prev, g) * scale;
  const adv = g.advanceWidth * scale;
  if (L.ch !== " ") {
    if (!word) { word = box(); words.push(word); }
    const p = g.getPath(0, 0, SIZE);
    const bb = p.getBoundingBox();
    const cx = (bb.x1 + bb.x2) / 2, cy = (bb.y1 + bb.y2) / 2;
    const rad = (L.rot * Math.PI) / 180, c = Math.cos(rad), s = Math.sin(rad);
    const tx = x + cx, ty = L.dy * SIZE + cy;
    const transform = `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${L.rot}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})`;
    glyphs.push({ ch: L.ch, d: p.toPathData(2), transform });
    word.glyphs.push(glyphs.length - 1);
    for (const [px, py] of [[bb.x1, bb.y1], [bb.x2, bb.y1], [bb.x1, bb.y2], [bb.x2, bb.y2]]) {
      const rx = (px - cx) * c - (py - cy) * s + tx, ry = (px - cx) * s + (py - cy) * c + ty;
      grow(all, rx, ry); grow(word, rx, ry);
    }
    x += adv + TRACK;
  } else {
    x += adv * 0.45;
    word = null;
  }
  prev = g;
}
// marge pour l'ombre portée (décalée vers le bas à droite, floutée)
const SHADOW = { dx: SIZE * 0.03, dy: SIZE * 0.05, blur: SIZE * 0.035 };
const pad = Math.ceil(SHADOW.blur * 3 + SHADOW.dy);
const vbOf = (b) => {
  const w = b.maxX - b.minX + 2 * pad, h = b.maxY - b.minY + 2 * pad;
  return { viewBox: `${(b.minX - pad).toFixed(1)} ${(b.minY - pad).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`, w, h };
};
const vb = vbOf(all);

const ts = `// Généré par tools/wordmark.mjs depuis Black Han Sans (SIL OFL 1.1). Ne pas modifier à la main.
export interface Glyph { ch: string; transform: string; d: string }
export const WORDMARK = {
  viewBox: "${vb.viewBox}",
  width: ${vb.w.toFixed(1)},
  height: ${vb.h.toFixed(1)},
  /** Ombre portée douce : décalage et flou en unités du viewBox. */
  shadow: { dx: ${SHADOW.dx.toFixed(1)}, dy: ${SHADOW.dy.toFixed(1)}, blur: ${SHADOW.blur.toFixed(1)} },
  /** Les deux mots, pour la version empilée (mobile). */
  words: [
${words.map((w) => { const v = vbOf(w); return `    { viewBox: "${v.viewBox}", width: ${v.w.toFixed(1)}, height: ${v.h.toFixed(1)}, glyphs: [${w.glyphs.join(", ")}] },`; }).join("\n")}
  ],
  glyphs: [
${glyphs.map((g) => `    { ch: "${g.ch}", transform: "${g.transform}", d: "${g.d}" },`).join("\n")}
  ] as Glyph[],
};
`;
fs.mkdirSync(path.join(root, "src/assets"), { recursive: true });
fs.writeFileSync(path.join(root, "src/assets/wordmark.ts"), ts);

function svg(fill, bg, shadow) {
  const paths = glyphs.map((g) => `<path transform="${g.transform}" d="${g.d}"/>`).join("");
  const [vx, vy, vw, vh] = vb.viewBox.split(" ");
  const rect = bg ? `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${bg}"/>` : "";
  const sh = shadow
    ? `<defs><filter id="o" x="-10%" y="-25%" width="125%" height="160%"><feGaussianBlur stdDeviation="${SHADOW.blur.toFixed(1)}"/></filter></defs><g fill="#000" opacity=".5" filter="url(#o)" transform="translate(${SHADOW.dx.toFixed(1)} ${SHADOW.dy.toFixed(1)})">${paths}</g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.viewBox}" role="img" aria-label="SNUS LBV">${rect}${sh}<g fill="${fill}">${paths}</g></svg>\n`;
}
const out = path.join(root, "public/logo");
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) fs.unlinkSync(path.join(out, f));
const C = { nuit: "#0B0A10", creme: "#F4EFE6", orange: "#FF5A1F", jaune: "#F8FF32", violet: "#7928FF" };
for (const [n, c] of Object.entries(C)) {
  fs.writeFileSync(path.join(out, `snus-lbv-${n}.svg`), svg(c, null, false));
  fs.writeFileSync(path.join(out, `snus-lbv-${n}-ombre.svg`), svg(c, null, true));
}
fs.writeFileSync(path.join(out, "snus-lbv-creme-sur-nuit.svg"), svg(C.creme, C.nuit, true));

// favicon : S incliné, jaune sur disque nuit
const S = glyphs[0];
const pS = font.charToGlyph("S").getPath(0, 0, SIZE).getBoundingBox();
const sw = pS.x2 - pS.x1, sh = pS.y2 - pS.y1;
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${C.nuit}"/><g transform="translate(32 32) rotate(-8) scale(${(44 / Math.max(sw, sh)).toFixed(4)}) translate(${(-(pS.x1 + pS.x2) / 2).toFixed(2)} ${(-(pS.y1 + pS.y2) / 2).toFixed(2)})"><path fill="${C.jaune}" d="${S.d}"/></g></svg>\n`;
fs.writeFileSync(path.join(root, "public/favicon.svg"), fav);
console.log("mot-symbole :", vb.viewBox, "·", glyphs.length, "lettres ·", words.length, "mots ·", Object.keys(C).length * 2 + 1, "SVG + favicon");
