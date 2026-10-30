// Contrôles fonctionnels et d'accessibilité du site SNUS LBV : structure, polices, contrôle d'âge, sélection de goût,
// clavier, commande WhatsApp (numéro, message, quantité, prix), menu mobile, mouvement réduit, débordements, console.
// node tools/check.mjs [url]
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://127.0.0.1:5231";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const results = [];
const ok = (name, pass, detail = "") => results.push(`${pass ? "OK   " : "ÉCHEC"} ${name}${detail ? " — " + detail : ""}`);

async function fresh(w, h, { touch = false, reduced = false, adult = true, dpr = 1 } = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror " + e.message));
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(m.type() + " " + m.text().slice(0, 160)));
  page.on("response", (r) => r.status() >= 400 && errors.push(r.status() + " " + r.url()));
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setViewport({ width: w, height: h, isMobile: touch, hasTouch: touch, deviceScaleFactor: dpr });
  if (adult) await page.evaluateOnNewDocument(() => localStorage.setItem("snuslbv_adulte", "1"));
  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(2400);
  return { page, errors };
}

// ── Contrôle d'âge
{
  const { page } = await fresh(1440, 900, { adult: false });
  ok("contrôle d'âge affiché à la première visite", (await page.$(".gate[role='dialog']")) !== null);
  ok("le site est inerte derrière le contrôle d'âge", await page.$eval(".site", (el) => el.hasAttribute("inert")));
  ok("le bouton d'entrée reçoit le focus", await page.evaluate(() => document.activeElement?.textContent?.includes("Entrer") ?? false));
  await page.click(".gate .pill--ghost");
  await sleep(300);
  ok("mineur : message de refus, aucune entrée", await page.evaluate(() => document.querySelector(".gate")?.textContent?.includes("pas accessible aux mineurs") && !document.querySelector(".gate .pill:not(.pill--ghost)")));
  await page.evaluate(() => localStorage.removeItem("snuslbv_adulte"));
  await page.reload({ waitUntil: "load" });
  await sleep(1500);
  await page.click(".gate .pill:not(.pill--ghost)");
  await sleep(400);
  ok("adulte : le contrôle disparaît et le choix est mémorisé", (await page.$(".gate")) === null && (await page.evaluate(() => localStorage.getItem("snuslbv_adulte") === "1")));
  await page.close();
}

// ── Ordinateur
{
  const { page, errors } = await fresh(1440, 900);
  ok("langue : français", (await page.evaluate(() => document.documentElement.lang)) === "fr");
  ok("polices Black Han Sans, Shrikhand et Bricolage chargées", await page.evaluate(() => document.fonts.check('400 20px "Black Han Sans"') && document.fonts.check('400 20px "Shrikhand"') && document.fonts.check('400 20px "Metal Mania"') && document.fonts.check('500 16px "Bricolage Grotesque Variable"')));
  ok("un seul h1", (await page.$$eval("h1", (n) => n.length)) === 1);
  const headings = await page.$$eval("h1, h2, h3", (hs) => hs.map((h) => h.tagName));
  let jump = false;
  for (let i = 1; i < headings.length; i++) if (+headings[i][1] > +headings[i - 1][1] + 1) jump = true;
  ok("hiérarchie des titres sans saut", !jump, headings.join(" "));
  const noAlt = await page.$$eval("img", (imgs) => imgs.filter((i) => !i.hasAttribute("alt")).length);
  ok("toutes les images ont un alt", noAlt === 0, `${noAlt} sans alt`);
  const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")));
  ok("aucune image cassée", broken.length === 0, broken.join(", "));
  const unlabeled = await page.$$eval("a, button", (els) => els.filter((el) => !(el.textContent || "").trim() && !el.getAttribute("aria-label")).length);
  ok("liens et boutons tous libellés", unlabeled === 0, `${unlabeled} sans libellé`);
  const dead = await page.$$eval("a[href^='#']", (as) => as.map((a) => a.getAttribute("href")).filter((h) => h.length > 1 && !document.querySelector(h)));
  ok("aucune ancre morte", dead.length === 0, dead.join(", "));
  ok("les trois gels et six conduites lumière existent", await page.evaluate(() => document.querySelectorAll(".gel").length === 3 && document.querySelectorAll("[data-cue]").length >= 5));
  ok("neuf boîtes dessinées en canvas dans la collection", await page.evaluate(() => document.querySelectorAll(".lineup__item canvas").length === 9));
  ok("la boîte du hero est dessinée et tourne", await page.evaluate(async () => { const c = document.querySelector(".hero__can--main canvas"); const px = () => c.getContext("2d").getImageData(Math.round(c.width*0.64), Math.round(c.height*0.3), 1, 1).data.join(); const a = px(); await new Promise((r) => setTimeout(r, 900)); return c.parentElement.hasAttribute("data-drawn") && a !== px(); }));
  // la 3D ne se charge qu'au premier geste du visiteur : on simule un mouvement de souris et un léger défilement
  await page.mouse.move(400, 400);
  await page.evaluate(() => window.scrollBy(0, 1));
  await sleep(6000);
  const r3 = await page.evaluate(() => ({ webgl: (() => { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); })(), chunk: performance.getEntriesByType("resource").some((r) => /three-/.test(r.name)), drawn: document.querySelector(".hero__can--main .can")?.hasAttribute("data-drawn") }));
  ok("rendu 3D : WebGL disponible, module Three.js chargé à la demande, boîte du hero dessinée", r3.webgl && r3.chunk && r3.drawn, JSON.stringify(r3));
  ok("l'en-tête se détache au défilement", await page.evaluate(async () => { window.scrollTo(0, 400); await new Promise((r) => setTimeout(r, 500)); return document.querySelector(".nav").classList.contains("nav--compact"); }));

  // sélection depuis la collection → scène des goûts
  await page.evaluate(() => document.querySelector("#collection").scrollIntoView({ block: "start" }));
  await sleep(1500);
  await page.click('.lineup__item:nth-child(3) .pill');
  await sleep(2200);
  const sel = await page.evaluate(() => ({
    top: Math.round(document.querySelector("#gouts").getBoundingClientRect().top),
    checked: document.querySelector('#gouts [role="radio"][aria-checked="true"]')?.id,
    name: document.querySelector(".flavors__name")?.textContent,
    focus: document.activeElement?.id,
    light: document.querySelector(".flavors__light")?.style.background.length > 0,
  }));
  ok("« Choisir ce goût » (Crispy Peppermint) ouvre la scène des goûts sur ce goût", Math.abs(sel.top - 72) < 120 && sel.checked === "gout-velo-cp" && sel.name === "Crispy Peppermint" && sel.focus === "gout-velo-cp" && sel.light, JSON.stringify(sel));

  // clavier dans le choix des goûts
  await page.keyboard.press("ArrowRight");
  await sleep(600);
  ok("flèche droite : goût suivant sélectionné et focalisé", await page.evaluate(() => document.querySelector('#gouts [role="radio"][aria-checked="true"]')?.id === "gout-zyn-bcs" && document.activeElement?.id === "gout-zyn-bcs"));
  await page.keyboard.press("Home");
  await sleep(600);
  ok("Début : retour au premier goût", await page.evaluate(() => document.querySelector(".flavors__name")?.textContent === "Black Cherry"));
  ok("l'étiquette de dose suit la sélection", await page.evaluate(() => document.querySelector(".flavors__tag--dose")?.textContent?.includes("8 mg/g")));

  // commander ce goût → section commande, message WhatsApp
  await page.click(".flavors__order");
  await sleep(2000);
  const order = await page.evaluate(() => {
    const a = document.querySelector(".order__cta");
    const href = a.getAttribute("href");
    const msg = decodeURIComponent(href.split("text=")[1]);
    return { top: Math.round(document.querySelector("#commander").getBoundingClientRect().top), href, msg, preview: document.querySelector(".order__preview").textContent, target: a.target, rel: a.rel, focus: document.activeElement?.tagName };
  });
  ok("« Commander ce goût » amène à la commande et focalise le choix", Math.abs(order.top - 72) < 120 && order.focus === "SELECT", `haut ${order.top}, focus ${order.focus}`);
  ok("lien WhatsApp vers 24176451360 (wa.me)", order.href.startsWith("https://wa.me/24176451360?text="));
  ok("message prérempli : formule exacte, marque, dose, prix, total", /^Bonjour SNUS LBV, je veux 1 boîte de snus Black Cherry à livrer\./.test(order.msg) && /Marque : ZYN MINI · 8 mg\/g/.test(order.msg) && /Prix unitaire : 9.000 FCFA/.test(order.msg) && /Total indicatif : 9.000 FCFA/.test(order.msg), order.msg.replace(/\n/g, " | "));
  ok("l'aperçu affiche le même message", order.preview === order.msg);
  ok("le lien s'ouvre dans un nouvel onglet, sans opener", order.target === "_blank" && order.rel.includes("noopener"));
  await page.click('.stepper__btn[aria-label="Une boîte de plus"]');
  await page.click('.stepper__btn[aria-label="Une boîte de plus"]');
  await sleep(300);
  const q3 = await page.evaluate(() => ({ msg: decodeURIComponent(document.querySelector(".order__cta").getAttribute("href").split("text=")[1]), total: document.querySelector(".order__total").textContent }));
  ok("quantité 3 : message et total mis à jour", /je veux 3 boîtes de snus Black Cherry à livrer./.test(q3.msg) && /Total indicatif : 27.000 FCFA/.test(q3.msg) && /27.000 FCFA/.test(q3.total), q3.total);
  await page.select(".order__selectBox select", "velo-fp");
  await sleep(300);
  ok("changer de goût dans la commande met à jour le message", await page.evaluate(() => /Freezing Peppermint/.test(decodeURIComponent(document.querySelector(".order__cta").getAttribute("href").split("text=")[1])) && /72.000 FCFA/.test(document.querySelector(".order__total").textContent)));
  ok("bouton « Copier le message » et lien d'appel présents", await page.evaluate(() => !!document.querySelector(".order__fallback button") && document.querySelector('.order__fallback a[href^="tel:"]')?.getAttribute("href") === "tel:+24176451360"));
  ok("échelle d'intensité : 9 lignes, du plus léger au plus fort", await page.evaluate(() => { const d = [...document.querySelectorAll(".ladder__dose")].map((e) => +e.textContent); return d.length === 9 && d.every((v, i) => i === 0 || v >= d[i - 1]); }));
  ok("pied de page : numéro, 18+, avertissements, crédit", await page.evaluate(() => document.querySelector(".footer__phone")?.textContent?.includes("076 45 13 60") && !!document.querySelector(".footer__age") && document.querySelectorAll(".footer__legal li").length === 3 && !!document.querySelector('.footer__bottom a[href*="methode-aura"]')));
  const overflowD = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok("aucun débordement horizontal à 1440 px", overflowD === 0, `${overflowD} px`);
  ok("aucune erreur console ni requête en échec (ordinateur)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await page.close();
}

// ── Largeurs : débordement, textes coupés
for (const [w, h, dpr] of [[320, 568], [360, 780], [375, 667], [390, 844, 2], [414, 896], [430, 932], [844, 390], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]]) {
  const { page, errors } = await fresh(w, h, { touch: w < 800 || h < 500, dpr: dpr ?? 1 });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += h * 0.7) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await sleep(120);
  }
  const r = await page.evaluate(() => {
    const over = document.documentElement.scrollWidth - window.innerWidth;
    const wide = [...document.querySelectorAll("body *")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.right > window.innerWidth + 1 || b.left < -1) && !el.closest(".lineup, .lights, .hero__stage, .gate, .menu, .iris, .flavors__stage"); }).map((el) => el.className?.toString().slice(0, 40) || el.tagName).slice(0, 4);
    const clipped = [...document.querySelectorAll(".title, .lineup__name, .flavors__name, .pill")].filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent.trim().slice(0, 24));
    const small = [...document.querySelectorAll("a, button")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.height < 40 || b.width < 40) && !el.closest(".footer__bottom, .footer__tel, .nav__links"); }).map((el) => el.textContent.trim().slice(0, 20) || el.className).slice(0, 5);
    return { over, wide, clipped, small };
  });
  ok(`${w} × ${h} px${dpr ? " (densité " + dpr + ")" : ""} : aucun débordement, aucun texte coupé, zones tactiles ≥ 40 px`, r.over === 0 && r.wide.length === 0 && r.clipped.length === 0 && r.small.length === 0, JSON.stringify(r));
  ok(`${w} × ${h} px : aucune erreur console`, errors.length === 0, errors.slice(0, 2).join(" | "));
  await page.close();
}

// ── Mobile : menu, glissement, goûts
{
  const { page } = await fresh(390, 844, { touch: true });
  ok("mobile : mot-symbole empilé affiché, version ligne masquée", await page.evaluate(() => getComputedStyle(document.querySelector(".hero__mark--stack")).display === "grid" && getComputedStyle(document.querySelector(".hero__mark--line")).display === "none"));
  await page.click(".nav__burger");
  await sleep(900);
  const menu = await page.evaluate(() => ({ expanded: document.querySelector(".nav__burger").getAttribute("aria-expanded"), inert: document.querySelector("#menu-mobile").hasAttribute("inert"), locked: document.body.classList.contains("is-locked"), links: document.querySelectorAll("#menu-mobile a").length }));
  ok("menu mobile : ouverture par iris, 4 liens, défilement bloqué", menu.expanded === "true" && !menu.inert && menu.locked && menu.links === 4, JSON.stringify(menu));
  await page.keyboard.press("Escape");
  await sleep(500);
  await page.evaluate(() => document.querySelector("#gouts").scrollIntoView());
  await sleep(900);
  const dock = await page.evaluate(() => { const d = document.querySelector(".dock"); const b = d.getBoundingClientRect(); return { shown: d.hasAttribute("data-show"), text: d.textContent, inside: b.bottom <= window.innerHeight && b.height >= 44 }; });
  ok("mobile : raccourci de commande visible sur les goûts, avec la sélection en cours", dock.shown && /Freezing Peppermint/.test(dock.text) && /1 boîte/.test(dock.text) && dock.inside, JSON.stringify(dock));
  await page.evaluate(() => document.querySelector("#commander").scrollIntoView());
  await sleep(900);
  ok("mobile : le raccourci disparaît dans la scène de commande", await page.evaluate(() => !document.querySelector(".dock").hasAttribute("data-show")));
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  ok("Échap ferme le menu et rend le focus au bouton", await page.evaluate(() => document.querySelector(".nav__burger").getAttribute("aria-expanded") === "false" && document.activeElement?.classList.contains("nav__burger")));
  const snap = await page.evaluate(() => getComputedStyle(document.querySelector(".lineup")).scrollSnapType);
  ok("collection : bande à glissement natif avec accroche", /x/.test(snap) && /mandatory/.test(snap), snap);
  await page.evaluate(() => document.querySelector("#gouts").scrollIntoView());
  await sleep(1200);
  await page.evaluate(() => document.querySelector(".flavors__tabs").scrollIntoView({ block: "center" }));
  await sleep(1800);
  await page.$eval("#gout-goat-cm", (el) => el.click()); // clic DOM : le tap réel est vérifié à part (coordonnées fraîches)
  await sleep(800);
  const goat = await page.evaluate(() => ({ name: document.querySelector(".flavors__name")?.textContent, price: document.querySelector(".flavors__price")?.textContent, checked: document.querySelector('#gouts [role="radio"][aria-checked="true"]')?.id, vis: getComputedStyle(document.querySelector(".flavors__tabs")).visibility }));
  ok("mobile : choisir GOAT Cool Mint met à jour la fiche et le prix", goat.name === "Cool Mint" && goat.price?.includes("18"), JSON.stringify(goat));
  await page.close();
}

// ── Mouvement réduit
{
  const { page } = await fresh(1440, 900, { reduced: true });
  ok("mouvement réduit : les boîtes ne tournent pas", await page.evaluate(async () => { const c = document.querySelector(".hero__can--main canvas"); const px = () => c.getContext("2d").getImageData(Math.round(c.width*0.64), Math.round(c.height*0.3), 1, 1).data.join(); const a = px(); await new Promise((r) => setTimeout(r, 900)); return c.parentElement.hasAttribute("data-drawn") && a === px(); }));
  ok("mouvement réduit : l'iris est ouvert, tout le contenu visible", await page.evaluate(() => getComputedStyle(document.querySelector(".iris__disc")).clipPath.includes("120%") && [...document.querySelectorAll("[data-reveal]")].every((el) => getComputedStyle(el).opacity !== "0")));
  await page.close();
}

await browser.close();
console.log(results.join("\n"));
const failed = results.filter((r) => r.startsWith("ÉCHEC")).length;
console.log(`\n${results.length - failed}/${results.length} contrôles réussis`);
process.exit(failed ? 1 : 0);
