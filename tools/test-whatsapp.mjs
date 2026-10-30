// Tests unitaires du message et du lien WhatsApp, sans navigateur (Node 22, types TypeScript retirés à la volée).
// node --experimental-strip-types tools/test-whatsapp.mjs
import assert from "node:assert/strict";
import { PRODUCTS, byId } from "../src/data/products.ts";
import { SITE } from "../src/data/site.ts";
import { buildMessage, whatsappLink, canOrder } from "../src/lib/whatsapp.ts";

const results = [];
const ok = (name, fn) => {
  try {
    fn();
    results.push(`OK    ${name}`);
  } catch (e) {
    results.push(`ÉCHEC ${name} — ${e.message.split("\n")[0]}`);
  }
};
const decode = (link) => decodeURIComponent(new URL(link).searchParams.get("text"));

ok("numéro centralisé au format international, sans + ni zéro", () => assert.equal(SITE.whatsapp, "24176451360"));
ok("une boîte : première ligne exacte", () => assert.match(buildMessage(byId("velo-fp"), 1), /^Bonjour SNUS LBV, je veux 1 boîte de snus Freezing Peppermint à livrer\.\n/));
ok("plusieurs boîtes du même goût : accord du pluriel", () => assert.match(buildMessage(byId("zyn-bc"), 3), /^Bonjour SNUS LBV, je veux 3 boîtes de snus Black Cherry à livrer\.\n/));
ok("prix et total indicatif quand le prix est défini", () => {
  const m = buildMessage(byId("zyn-bc"), 3);
  assert.match(m, /Prix unitaire : 9.000 FCFA/);
  assert.match(m, /Total indicatif : 27.000 FCFA/);
});
ok("sans prix : ni prix ni total dans le message", () => {
  const m = buildMessage({ ...byId("zyn-bc"), price: null }, 2);
  assert.doesNotMatch(m, /Prix|Total/);
  assert.match(m, /^Bonjour SNUS LBV, je veux 2 boîtes de snus Black Cherry à livrer\./);
});
ok("nom avec espaces, point médian et accents : encodé puis décodé à l'identique", () => {
  const p = byId("ns-fms");
  const m = buildMessage(p, 1);
  const link = whatsappLink(m);
  assert.ok(link.startsWith("https://wa.me/24176451360?text="));
  assert.equal(decode(link), m);
  assert.match(decode(link), /Frosty Mint X-Strong · Édition spéciale à livrer\./);
  assert.ok(!/[ ·é]/.test(link.split("text=")[1]), "caractères spéciaux encodés");
});
ok("tous les produits produisent une première ligne conforme", () => {
  for (const p of PRODUCTS) assert.match(buildMessage(p, 1), new RegExp(`^Bonjour SNUS LBV, je veux 1 boîte de snus ${p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} à livrer\\.`));
});
ok("quantité modifiée : le message suit", () => {
  const p = byId("goat-cm");
  assert.match(buildMessage(p, 5), /je veux 5 boîtes de snus Cool Mint/);
  assert.match(buildMessage(p, 1), /je veux 1 boîte de snus Cool Mint/);
});
ok("quantité invalide ramenée à 1", () => assert.match(buildMessage(byId("goat-cm"), 0), /je veux 1 boîte/));
ok("produit indisponible : commande refusée par canOrder", () => {
  assert.equal(canOrder(byId("goat-cm")), true);
  assert.equal(canOrder({ ...byId("goat-cm"), available: false }), false);
});

console.log(results.join("\n"));
const failed = results.filter((r) => r.startsWith("ÉCHEC")).length;
console.log(`\n${results.length - failed}/${results.length} tests WhatsApp réussis`);
process.exit(failed ? 1 : 0);
