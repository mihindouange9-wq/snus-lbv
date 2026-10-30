// Sous-ensembles des polices de titre et de mot-symbole (SIL OFL 1.1), limités aux caractères du site et compressés
// en WOFF2 (wawoff2, WASM) : Shrikhand (titres, 220 Ko à l'origine) et Black Han Sans (mot-symbole, chiffres, 998 Ko).
// node tools/subset-font.mjs
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";
import wawoff2 from "wawoff2";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "src/assets/fonts");

const LATIN = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const ACCENTS = "ÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸàâäçéèêëîïôöùûüÿŒœÆæ«»‘’“”–—·•…€°";

const JOBS = [
  { src: "references/polices/ttf/MetalMania-Regular.ttf", out: "metal-mania-subset.woff2", family: "Metal Mania", chars: LATIN + ACCENTS },
  { src: "references/polices/ttf/Shrikhand-Regular.ttf", out: "shrikhand-subset.woff2", family: "Shrikhand", chars: LATIN + ACCENTS },
  { src: "references/polices/ttf/BlackHanSans-Regular.ttf", out: "black-han-sans-subset.woff2", family: "Black Han Sans", chars: LATIN + "’–—•€" },
];

fs.mkdirSync(outDir, { recursive: true });
for (const job of JOBS) {
  const buf = fs.readFileSync(path.join(root, job.src));
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const seen = new Set([0]);
  const glyphs = [font.glyphs.get(0)];
  let missing = "";
  for (const ch of job.chars) {
    const g = font.charToGlyph(ch);
    if (!g || g.index === 0) {
      if (ch !== " ") missing += ch;
      continue;
    }
    if (seen.has(g.index)) continue;
    seen.add(g.index);
    glyphs.push(g);
  }
  const subset = new opentype.Font({ familyName: job.family, styleName: "Regular", unitsPerEm: font.unitsPerEm, ascender: font.ascender, descender: font.descender, glyphs });
  const ttf = Buffer.from(subset.toArrayBuffer());
  const woff2 = Buffer.from(await wawoff2.compress(ttf));
  fs.writeFileSync(path.join(outDir, job.out), woff2);
  console.log(`${job.family} : ${glyphs.length} glyphes → ${Math.round(woff2.length / 1024)} Ko WOFF2 (${Math.round(buf.length / 1024)} Ko à l'origine)${missing ? ` · absents : ${missing}` : ""}`);
}
