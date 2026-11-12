// Pré-rendu statique : injecte le HTML de l'application dans dist/index.html à partir du bundle SSR (dist-ssr),
// puis supprime dist-ssr. Lancé par `npm run build` après les deux builds Vite.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const ssrDir = path.join(root, "dist-ssr");
const entry = fs.readdirSync(ssrDir).find((f) => f.startsWith("entry-server") && f.endsWith(".js"));
if (!entry) throw new Error("bundle SSR introuvable dans dist-ssr/");
const { render } = await import(pathToFileURL(path.join(ssrDir, entry)).href);
const html = render();
const file = path.join(root, "dist/index.html");
const page = fs.readFileSync(file, "utf8");
if (!page.includes('<div id="root"></div>')) throw new Error("racine #root introuvable dans dist/index.html");
// préchargement des trois polices latines : elles arrivent ensemble, une seule remise en page
const assets = fs.readdirSync(path.join(root, "dist/assets"));
const fonts = ["bricolage-grotesque-latin-wdth-normal", "black-han-sans-subset"]
  .map((n) => assets.find((f) => f.startsWith(n) && f.endsWith(".woff2")))
  .filter(Boolean)
  .map((f) => `    <link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`);
// le moteur 3D arrive avec le reste : les boîtes passent en WebGL dès le chargement
const modules = assets
  .filter((f) => /^(three|can3d)-.*\.js$/.test(f))
  .map((f) => `    <link rel="modulepreload" href="/assets/${f}" />`);
fs.writeFileSync(file, page.replace('<div id="root"></div>', `<div id="root">${html}</div>`).replace("</head>", `${fonts.join("\n")}\n${modules.join("\n")}\n  </head>`));
console.log(`préchargement : ${fonts.length} polices, ${modules.length} modules 3D`);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`pré-rendu : ${Math.round(html.length / 1024)} Ko de HTML injectés dans dist/index.html`);
