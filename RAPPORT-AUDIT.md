# SNUS LBV — rapport d'audit et de perfectionnement (31 octobre 2026)

Site en ligne : https://snus-lbv.onrender.com · dépôt public : https://github.com/mihindouange9-wq/snus-lbv

Travail réalisé sur le projet existant `geek/snus-lbv`, sans reconstruction : audit, corrections dans le code, tests, mesures. Tout ce qui est coché a été exécuté sur ce poste (Windows 11, Node 22.23, Chrome installé piloté en headless) ; ce qui n'a pas pu l'être est listé en fin de rapport.

## 1. Problèmes détectés et corrections

| # | Gravité | Problème | Cause | Correction (fichiers) |
| --- | --- | --- | --- | --- |
| 1 | Critique (commande) | Message WhatsApp sans la formulation imposée | Ancien gabarit « Goût choisi / Produit / Quantité » | `src/lib/whatsapp.ts` : première ligne « Bonjour SNUS LBV, je veux N boîte(s) de snus GOÛT à livrer. », accord du pluriel, prix et total seulement si prix défini ; 10 tests unitaires `tools/test-whatsapp.mjs` |
| 2 | Critique (commande) | Produit indisponible commandable | Aucun état d'indisponibilité | `products.ts` (`available`), `Collection.tsx`, `Flavors.tsx`, `Order.tsx`, `Dock.tsx` : boîte grisée, boutons retirés, option désactivée, bouton de commande désactivé avec explication |
| 3 | Critique (fidélité) | Texte du flanc des boîtes lu à l'envers (2D puis 3D) | Tranches projetées dans l'ordre inverse / texture inversée | `Can.tsx` (ordre des tranches), `can3d.ts` (texture non inversée) ; vérifié sur captures (« ZYN », « VELO », « WHITE FOX » lisibles) |
| 4 | Majeure (identité) | Titres en brosse déchiquetée (Protest Revolution) et mot-symbole large et arrondi (Rowdies) contredisant les références « SPICY DOLLZ » et « WAUW! » | Choix initial de faces | Shrikhand d'abord, puis, la revue jugeant ses terminaisons encore trop rondes, Metal Mania (pointes tranchées) pour les six titres de scène, Shrikhand restant sur les noms de goût ; Black Han Sans (condensé, angles vifs) pour le mot-symbole et les chiffres, lettres inclinées une à une avec ombre portée douce (`tools/wordmark.mjs`, `Wordmark.tsx`, `tokens.css`, `base.css`) ; sous-ensembles WOFF2 17 + 8 Ko (`tools/subset-font.mjs`), repli local avec `size-adjust` (CLS 0) |
| 5 | Majeure (hero) | Mot-symbole plat, sans « matière vivante » | — | `Wordmark.tsx` (`live`) : nappe linéaire diagonale des trois gels prolongée en miroir + point chaud radial en mode screen, par lettre ; `Hero.tsx` : GSAP fait glisser la nappe (16–18 s) et parcourir le point chaud (7–11 s) ; statique en mouvement réduit ; contours nets (tracés SVG), aucun déplacement de layout ; léger recul (échelle 0,96, opacité 0,35 minimum) au défilement |
| 6 | Majeure (3D) | Boîtes dessinées en 2D : pas de vraie géométrie, reflets fixes | Visuels sources 2D uniquement (300 × 300, vue de dessus) | `can3d.ts` : moteur WebGL partagé (Three 0.187), cylindre + arêtes toriques + couvercle recessé, vernis physique sur le couvercle, flanc mat, lumière clé chaude / remplissage violet / contour orange, environnement de studio dessiné (équirectangulaire 256 × 128, PMREM), copie par `drawImage` dans le canvas de chaque boîte ; chargé au premier geste (`engage.ts`) ; repli 2D conservé (sans WebGL, ≤ 2 Go, ≤ 2 cœurs, économie de données). Le flanc reste reconstruit : aucune vue de côté n'existe |
| 7 | Majeure (3D) | Rotation sans inertie ni interaction | — | `Can.tsx` : glissement souris/doigt avec inertie (`touch-action: pan-y`, le défilement vertical reste libre), ralentissement au survol (× 0,25), angle de vue lié au défilement (± 5°), pause hors écran, 30 ips sur mobile |
| 8 | Majeure (mobile) | Pas d'accès rapide à la commande depuis les scènes centrales | — | `Dock.tsx` : raccourci fixe (sélection en cours, quantité, bouton) visible hors hero, commande et pied de page |
| 9 | Majeure (mobile) | Boîte du hero décentrée à 390 (translateX écrasé par GSAP), mention 18+ hors premier écran | Conflit transform CSS / GSAP | `hero.css` : centrage par marge, scène réduite, mention dans le premier écran (vérifié 320 → 430) |
| 10 | Majeure (lisibilité) | `<select>` « Changer de goût » tronqué à 1440 et 390 | Libellés trop longs | `Order.tsx` : groupes par marque, option = nom du goût ; largeur minimale |
| 11 | Majeure (collection mobile) | Une boîte par écran sans repère | — | `Collection.tsx` : compteur « n / 9 » (aria-live) et flèches sur mobile |
| 12 | Mineure | Dalles vides en mouvement réduit (iris) | Hauteur fixe conservée | `iris.css` : iris retiré en mouvement réduit, la couleur passe par le bord dégradé de la scène suivante |
| 13 | Mineure | Points d'intensité lisibles comme des étoiles d'avis | — | `Flavors.tsx` : étiquette « intensité » + `role="img"` |
| 14 | Mineure | Couvercle agrandi au-delà de sa résolution | Visuels 300 px | Boîtes plafonnées à 320 px CSS ; halo et lignes de rappel portent l'échelle |
| 15 | Performance | Trois polices complètes (jusqu'à 185 Ko), remise en page à chaque arrivée | — | Sous-ensembles, préchargement injecté au build (`tools/prerender.mjs`), repli métrique |
| 16 | Performance | Three.js chargé au démarrage : TBT simulé 6,6 s mobile | Compilation de shaders + PMREM pendant l'hydratation | `engage.ts` : import au premier geste ou 14 s après `load` ; environnement PMREM léger au lieu de RoomEnvironment |
| 17 | Accessibilité | Focus perdu après « Commander ce goût » | La révélation redémarrait sur l'élément focalisé | `motion.ts` : la révélation de l'ancêtre est terminée (`progress(1)`) avant le focus |
| 18 | Qualité | Pas de lint | — | ESLint (TypeScript, règles React Hooks) dans `npm run build` ; 6 problèmes corrigés (setState dans effet, ref en rendu, espace irrégulière, blocs vides) |

## 2. Fichiers modifiés ou créés

Sources : `src/App.tsx`, `src/lib/whatsapp.ts`, `src/lib/motion.ts`, `src/data/site.ts`, `src/data/products.ts`, `src/styles/tokens.css`, `src/styles/base.css`, `src/components/brand/Wordmark.tsx`, `src/components/hero/Hero.tsx`, `hero.css`, `src/components/product/Can.tsx`, `can3d.ts` (nouveau), `engage.ts` (nouveau), `can.css`, `src/components/collection/Collection.tsx`, `collection.css`, `src/components/flavors/Flavors.tsx`, `flavors.css`, `src/components/whatsapp/Order.tsx`, `order.css`, `Dock.tsx` (nouveau), `dock.css` (nouveau), `src/components/animations/iris.css`, `src/assets/wordmark.ts` (régénéré), `src/assets/fonts/*.woff2` (régénérés).
Outils : `tools/wordmark.mjs`, `tools/subset-font.mjs`, `tools/prerender.mjs`, `tools/check.mjs`, `tools/test-whatsapp.mjs` (nouveau), `eslint.config.js` (nouveau), `package.json`, `tsconfig.json`, `vite.config.ts`, `README.md`, `public/logo/*.svg`, `public/favicon.svg`.

## 3. Tests exécutés et résultats

| Vérification | Outil | Résultat |
| --- | --- | --- |
| Compilation de production (types + lint + Vite + SSR + pré-rendu) | `npm run build` | OK, 71 Ko de HTML pré-rendu, Three.js en chunk séparé chargé à la demande (134 Ko gzip) |
| TypeScript strict | `tsc --noEmit` | OK, 0 erreur |
| ESLint (TS + React Hooks) | `npm run lint` | OK, 0 problème |
| Tests unitaires WhatsApp (1 boîte, plusieurs boîtes, prix absent, nom avec espaces/point médian/accents encodé puis décodé, tous les produits, quantité modifiée, quantité invalide, produit indisponible) | `npm run test:whatsapp` | 10/10 |
| Contrôles navigateur (contrôle d'âge, structure, polices, alt, libellés, ancres, lumières, boîtes, 3D WebGL + module chargé au geste + boîte dessinée, sélection depuis la collection, clavier, lignes de rappel, commande : défilement, focus, lien wa.me/24176451360, message exact, quantité 3, changement de goût, secours ; échelle ; pied de page ; largeurs 320 · 360 · 375 · 390 (densité 2) · 414 · 430 · 844 × 390 paysage · 768 · 1024 · 1280 · 1440 · 1920 : débordement 0, aucun texte coupé, zones tactiles ≥ 40 px, console vide ; menu mobile, glissement, dock, GOAT au toucher ; mouvement réduit) | `npm run verify` (Chrome headless) | 67/67 |
| Tap réel sur un goût en émulation mobile (coordonnées fraîches) | script dédié | OK (le clic Puppeteer par coordonnées est fragile pendant un défilement doux ; les tests passent par `element.click()`, le tap réel a été vérifié à part) |
| Captures scène par scène | `npm run shots`, `tools/shoot.mjs` à 1920/1280/1024/768/430/375/320, pleine page 1440 et 390, contrôle d'âge, menu, rendu 3D (SwiftShader) | Inspectées : aucun chevauchement, aucune boîte tronquée, prix et goûts lisibles |
| Détecteur d'anti-patterns impeccable | `impeccable detect` | 0 constat |
| Revue de finition indépendante (sous-agent) | impeccable-finish-reviewer | Premier verdict « fix » (8 correctifs) ; première passe : 6 résolus, 2 partiels, 3 régressions ; second lot (Metal Mania, mention 18+ en tête du hero mobile, dock masqué sur la bande, trait d'union insécable et hauteur de nom fixe, angle de repos 0) ; seconde passe : tout résolu, disposition **ship** (sur les éléments notés) |
| Lighthouse 12 mobile (Moto G Power simulé, 4G lente) | `npx lighthouse@12` | Performance 71 à 82 selon la passe (FCP 2,2–2,3 s, LCP 3,1–3,6 s simulé, TBT 280–550 ms, CLS 0) ; Accessibilité 100, Bonnes pratiques 100, SEO 100 |
| Lighthouse 12 ordinateur | idem `--preset=desktop` | Performance 99, Accessibilité 100, Bonnes pratiques 100, SEO 100 (LCP 0,8 s, TBT 40 ms, CLS 0) |
| Trace Chrome throttlée (CPU × 4, 4G lente) | script CDP | FCP ≈ 2,0 s, LCP ≈ 2,3 s en conditions réelles simulées ; la mise en page initiale et l'arrivée des polices restent les coûts principaux |

Les scores Lighthouse sont mesurés sans WebGL matériel (headless) : la 3D ne se charge qu'au premier geste, donc après la fenêtre mesurée ; sur un téléphone réel, l'initialisation 3D (compilation de shaders) coûte une centaine de millisecondes au premier défilement.

## 4. Tests non exécutés et raisons

- Ouverture réelle de WhatsApp (application mobile et WhatsApp Web) : impossible en headless ; vérifiés le lien `https://wa.me/24176451360?text=…`, `target="_blank"`, `rel="noopener"`, le message décodé et le numéro. Un premier message test depuis un téléphone confirmera le format international.
- Appareils physiques (iPhone/Android, forte densité) : non disponibles ; émulation Chrome uniquement (toucher, densité 2, paysage).
- Safari / Firefox : non installés sur ce poste. Les techniques utilisées (canvas 2D, WebGL 1/2, `mask`, `clip-path`, `oklch` dans les dégradés, `text-wrap`) ont des replis : dégradé sRGB si `oklch` non supporté, 2D si WebGL absent.
- INP réel : non mesurable sans interaction utilisateur ; TBT et « max potential FID » Lighthouse servent d'approximation.
- Commande multi-goûts : le site vend un goût par commande (le message reste modifiable par le client) ; aucun panier n'a été ajouté.

## 5. Points restant à résoudre (hors de portée ici)

- Visuels HD des boîtes et vues de côté : les seules sources sont des vues de dessus de 300 × 300 px ; le flanc est reconstruit avec des couleurs approchées, le couvercle reste limité à 320 px CSS.
- Prix, disponibilités, frais et délais de livraison, moyens de paiement : à confirmer par SNUS LBV (`src/data/products.ts`, `src/data/site.ts`).
- Mentions légales de l'entreprise (raison sociale, RCCM, NIF) et réseaux sociaux.
- Cadre légal gabonais (loi 006/2013 et décrets 2016 sur la publicité du tabac et des produits dérivés, sachets de nicotine cités) : validation juridique avant publication.
- Performance mobile : 76–82 ; les leviers restants sont des visuels plus légers, moins de texte dans le premier rendu, ou Preact à la place de React (non fait pour rester sur la pile demandée).

## 6. Checklist finale

- [x] Compilation de production (`npm run build`, 31 octobre 2026)
- [x] Vérification TypeScript et lint (`tsc --noEmit`, `eslint .`)
- [x] Tests des interactions (67 contrôles navigateur)
- [x] Tests de commande WhatsApp (10 unitaires + 8 contrôles navigateur ; ouverture réelle non testée)
- [x] Contrôle des produits et des goûts (9 références, noms, doses, prix, indisponibilité ; tous produisent un message conforme)
- [x] Contrôle responsive (12 configurations, 320 → 1920, paysage, densité 2 ; captures inspectées)
- [x] Contrôle des animations (révélations, iris, rotation, inertie, mouvement réduit ; nettoyage des observateurs et des animations au démontage)
- [x] Contrôle des performances (Lighthouse mobile et ordinateur, trace throttlée)
- [x] Contrôle de l'accessibilité (Lighthouse 100, hiérarchie, alt, libellés, focus, clavier, contrastes, zones tactiles)
- [x] Vérification des ressources manquantes (aucune requête en échec, aucune image cassée, polices chargées)
