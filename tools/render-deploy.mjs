// Crée (ou retrouve) le site statique SNUS LBV sur Render par l'API publique, puis suit le déploiement jusqu'à « live ».
// Reflète render.yaml : si l'un change, mettre l'autre à jour.
//
// Usage : RENDER_API_KEY=rnd_xxx node tools/render-deploy.mjs
//    ou : RENDER_KEY_FILE=chemin/vers/fichier-contenant-la-clé node tools/render-deploy.mjs
// La clé se crée dans Render → Account Settings → API Keys. Elle n'est jamais écrite dans le dépôt.
// Un push sur main ne redéploie pas toujours (application GitHub de Render non installée) : relancer cet outil.
import fs from "node:fs";

const API = "https://api.render.com/v1";
const KEY = process.env.RENDER_API_KEY || (process.env.RENDER_KEY_FILE ? fs.readFileSync(process.env.RENDER_KEY_FILE, "utf8").trim() : "");
if (!KEY) {
  console.error("RENDER_API_KEY (ou RENDER_KEY_FILE) manquante.");
  process.exit(1);
}

const REPO = "https://github.com/mihindouange9-wq/snus-lbv";
const NAME = "snus-lbv";
const URL_FINALE = "https://snus-lbv.onrender.com";

const header = (path, name, value) => ({ path, name, value });
const SERVICE = {
  type: "static_site",
  name: NAME,
  repo: REPO,
  branch: "main",
  autoDeploy: "yes",
  envVars: [
    { key: "NODE_VERSION", value: "22.12.0" },
    { key: "VITE_SITE_URL", value: URL_FINALE },
  ],
  serviceDetails: {
    buildCommand: "npm ci && npm run build",
    publishPath: "dist",
    pullRequestPreviewsEnabled: "no",
    headers: [header("/*", "X-Content-Type-Options", "nosniff"), header("/assets/*", "Cache-Control", "public, max-age=31536000, immutable")],
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(method, path, body, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(API + path, {
        method,
        headers: { Authorization: `Bearer ${KEY}`, Accept: "application/json", "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(30000),
      });
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${typeof data === "string" ? data : JSON.stringify(data)}`);
      return data;
    } catch (e) {
      if (i === tries - 1) throw e;
      console.log("  nouvel essai :", e.message.slice(0, 120));
      await sleep(3000 * (i + 1));
    }
  }
}

const owners = await api("GET", "/owners?limit=20");
const owner = owners.map((o) => o.owner).find((o) => o.type === "user") ?? owners[0]?.owner;
if (!owner) throw new Error("aucun espace Render trouvé pour cette clé");
console.log("espace :", owner.name, owner.id);

const existing = (await api("GET", `/services?name=${NAME}&limit=10`)).map((s) => s.service).find((s) => s.name === NAME);
let service;
if (existing) {
  service = existing;
  console.log("service existant :", service.id, service.serviceDetails?.url);
  await api("PATCH", `/services/${service.id}`, { repo: REPO, branch: "main", autoDeploy: "yes", serviceDetails: { buildCommand: SERVICE.serviceDetails.buildCommand, publishPath: "dist" } });
  await api("PUT", `/services/${service.id}/env-vars`, SERVICE.envVars);
} else {
  const created = await api("POST", "/services", { ...SERVICE, ownerId: owner.id });
  service = created.service;
  console.log("service créé :", service.id, service.serviceDetails?.url);
}

const deploy = existing ? await api("POST", `/services/${service.id}/deploys`, { clearCache: "do_not_clear" }) : (await api("GET", `/services/${service.id}/deploys?limit=1`))[0]?.deploy;
const deployId = deploy?.id;
console.log("déploiement :", deployId);
for (let i = 0; i < 80 && deployId; i++) {
  await sleep(15000);
  const d = await api("GET", `/services/${service.id}/deploys/${deployId}`);
  console.log(`  ${new Date().toLocaleTimeString("fr-FR")} ${d.status}`);
  if (d.status === "live") break;
  if (/failed|canceled|deactivated/.test(d.status)) {
    console.error("échec du déploiement :", d.status);
    process.exit(1);
  }
}
console.log("adresse :", service.serviceDetails?.url ?? URL_FINALE);
