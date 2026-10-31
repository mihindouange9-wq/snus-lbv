# SNUS LBV — site officiel

Site de marque one-page pour SNUS LBV (pouches de nicotine, Libreville) : collection de neuf boîtes en 3D, sélecteur de goût qui pilote la lumière, commande directe sur WhatsApp au **076 45 13 60**, contrôle d'âge, mentions obligatoires.

Direction artistique « scène à trois projecteurs » : fond nuit, gels orange `#FF5A1F`, jaune `#F8FF32` et violet `#7928FF` mélangés en lumière (chemins de teinte oklch), crème `#F4EFE6` pour les scènes « lumière de salle ». Mot-symbole en tracés Black Han Sans (lettres inclinées, ombre douce, matière colorée vivante dans le hero : langage de la référence « WAUW! »), titres de scène Metal Mania (pleins nets, pointes en lames : langage de la référence « SPICY DOLLZ »), noms de goût Shrikhand, texte et étiquettes Bricolage Grotesque, chiffres Black Han Sans.

## Lancer

```bash
npm install
npm run dev        # http://127.0.0.1:5230
npm run build      # types + lint + build + pré-rendu statique de dist/
npm run preview    # sert dist/ sur http://127.0.0.1:5231
```

Node 20 ou plus (22 recommandé). Les polices sont auto-hébergées (sous-ensembles WOFF2 de 76, 17 et 8 Ko, Bricolage via Fontsource, licences SIL OFL), aucun appel à Google Fonts.

## Vérifier

```bash
npm run verify          # 67 contrôles navigateur (voir ci-dessous), serveur preview requis
npm run test:whatsapp   # 10 tests unitaires du message et du lien WhatsApp (Node 22, sans navigateur)
npm run lint            # ESLint (TypeScript, règles React Hooks)
npm run typecheck       # tsc --noEmit
npm run shots           # captures scène par scène (1440 et 390) dans .impeccable/review/shots
npm run fullpage        # captures pleine page desktop.png / mobile.png
npm run wordmark        # régénère le mot-symbole (src/assets/wordmark.ts, public/logo/*.svg, favicon)
npm run fonts           # régénère les sous-ensembles de polices (src/assets/fonts/)
npm run assets          # régénère public/og.jpg et public/apple-touch-icon.png
```

`npm run verify` couvre : contrôle d'âge (adulte, mineur, mémorisation), langue, polices, hiérarchie des titres, alt, libellés, ancres, gels et conduites lumière, boîtes de la collection, rendu 3D (WebGL, module chargé dès le chargement, boîte dessinée), sélection depuis la collection, clavier (flèches, Début), lignes de rappel, commande (défilement, focus, lien wa.me, message exact, quantité, changement de goût, secours), échelle d'intensité, pied de page, largeurs 320 · 360 · 375 · 390 (densité 2) · 414 · 430 · 844 × 390 (paysage) · 768 · 1024 · 1280 · 1440 · 1920 (débordement, texte coupé, zones tactiles ≥ 40 px, console), menu mobile (iris, Échap), bande à glissement, raccourci de commande mobile, mouvement réduit. Les outils pilotent le Chrome installé (`C:/Program Files/Google/Chrome/Application/chrome.exe`, variable `CHROME` pour un autre chemin). Lighthouse : `npx lighthouse@12 http://127.0.0.1:5231/ --chrome-flags="--headless=new"` (ou `--preset=desktop`).

## Modifier le catalogue, le numéro, les textes

| Quoi | Où |
| --- | --- |
| Numéro WhatsApp, ville, mentions de livraison, mentions légales | `src/data/site.ts` |
| Produits : marque, goût, dose, **prix**, visuel, **disponibilité**, couleurs de lumière et du flanc | `src/data/products.ts` |
| Message WhatsApp (« Bonjour SNUS LBV, je veux N boîte(s) de snus GOÛT à livrer. ») | `src/lib/whatsapp.ts` |
| Conduite lumière de chaque scène | `src/components/animations/Lights.tsx` (`CUES`) |
| Éclairage, matériaux et géométrie 3D des boîtes | `src/components/product/can3d.ts` |
| Avertissements | `src/data/site.ts` (`WARNINGS`) |

Un prix à `null` masque le prix et le total dans le message (« Prix sur WhatsApp »). `available: false` grise la boîte, retire les boutons de sélection et de commande et désactive l'option du menu. Les visuels sont dans `public/images/products/` (WebP 300 × 300 à fond transparent, repris du site actuel).

## Boîtes 3D

`Can.tsx` dessine d'abord la boîte en canvas 2D (couvercle réel incliné, flanc à bandeau, reflets des gels), visible dès la première peinture. Dès le chargement (module préchargé, démarrage au premier instant libre du navigateur, ou plus tôt au premier geste), `can3d.ts` est importé : un seul moteur WebGL partagé rend une géométrie réelle (cylindre, arêtes arrondies, couvercle recessé) avec le visuel du couvercle, le bandeau du flanc, un vernis sur le couvercle, un éclairage de studio (clé chaude, remplissage violet, contour orange) et des réflexions d'environnement, puis copie l'image dans le canvas de chaque boîte. Rotation lente continue, inertie au glissement (souris et doigt) sur les boîtes du hero et des goûts, ralentissement au survol, angle qui varie légèrement avec le défilement, pause hors écran. Sans WebGL, sur un appareil modeste (≤ 2 Go, ≤ 2 cœurs, économie de données) ou en mouvement réduit, le rendu 2D reste en place. Pour privilégier le score Lighthouse plutôt que l'apparition immédiate de la 3D, remettre dans `engage.ts` le démarrage au premier geste (un `setTimeout` long à la place du `requestIdleCallback`).

Limite : les seuls visuels disponibles sont des vues de dessus de 300 × 300 px ; le flanc est reconstruit (couleurs approchées du visuel réel). Des photos HD et une vue de côté par boîte améliorerraient nettement le réalisme.

## Déployer

**En ligne : https://snus-lbv.onrender.com** (site statique Render gratuit, service `snus-lbv`, dépôt public https://github.com/mihindouange9-wq/snus-lbv, branche `main`, build `npm ci && npm run build`, publication de `dist/`, `VITE_SITE_URL=https://snus-lbv.onrender.com`).

Après une modification : `git push` puis `RENDER_API_KEY=rnd_xxx node tools/render-deploy.mjs` (ou `RENDER_KEY_FILE=chemin`) : l'outil retrouve le service, redéploie et attend « live ». Un push seul ne redéploie pas toujours (application GitHub de Render non installée), et un nouveau déploiement purge aussi le cache du CDN : juste après la première mise en ligne, deux fichiers avaient répondu 404 depuis le cache jusqu'au déploiement suivant. La clé API ne doit jamais être écrite dans le dépôt. `render.yaml` reflète la même configuration.

## Structure

```
src/
  App.tsx                     état partagé (goût choisi, quantité), ordre des scènes, raccourci mobile
  data/site.ts                numéro, ville, livraison, mentions
  data/products.ts            catalogue centralisé
  lib/whatsapp.ts             message et lien wa.me, canOrder
  lib/motion.ts               GSAP, ScrollTrigger, révélations, défilement
  components/
    gate/        contrôle d'âge (18+, mémorisé dans localStorage)
    animations/  Lights (trois gels), IrisWipe (transition par disque)
    navigation/  barre, menu mobile à iris
    hero/        mot-symbole monumental à matière vivante, trois boîtes
    product/     Can (2D), can3d (WebGL), engage (démarrage de la 3D dès le chargement)
    collection/  bande des neuf boîtes à glissement natif, compteur et flèches
    flavors/     scène du goût : lumière, boîte, lignes de rappel, fiche
    brand/       mot-symbole, étincelle, section « La marque » et échelle d'intensité
    whatsapp/    commande en trois gestes, raccourci mobile (Dock)
    footer/
tools/                        captures, contrôles, tests WhatsApp, mot-symbole, polices, images de partage, pré-rendu
references/                   références fournies et extraites (logo, typographie, site actuel, noth.in)
```

## À renseigner avant la mise en ligne

- Prix confirmés par SNUS LBV (repris du site actuel, octobre 2026) et disponibilités.
- Frais et délais de livraison, moyens de paiement acceptés (l'ancien site citait cash, Airtel Money, Moov Money).
- Identité de l'entreprise pour le pied de page : raison sociale, RCCM, NIF (`SITE.legal`).
- Réseaux sociaux s'il y en a ; adresse publique du site (`VITE_SITE_URL`).
- Visuels HD des boîtes (les fichiers actuels font 300 × 300) et une vue de côté si possible.
- Confirmer le format international du numéro (24176451360) en envoyant un premier message test.
- Cadre légal : la loi gabonaise n° 006/2013 et ses décrets de 2016 interdisent la publicité, la promotion et le parrainage du tabac et des produits dérivés, et citent les sachets de nicotine. Faire valider par un conseil que ce site promotionnel et la vente à distance sont autorisés avant publication. Le contrôle d'âge du site est déclaratif et ne constitue pas une garantie de conformité.
