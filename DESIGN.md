---
name: SNUS LBV
description: Scène de nuit éclairée par trois projecteurs ; la lumière qui se mélange raconte le goût.
colors:
  nuit: "#0b0a10"
  nuit-2: "#14121c"
  creme: "#f4efe6"
  creme-2: "#e8e1d2"
  orange: "#ff5a1f"
  jaune: "#f8ff32"
  violet: "#7928ff"
  encre-doux: "rgba(11, 10, 16, 0.7)"
  papier-doux: "rgba(244, 239, 230, 0.72)"
  filet-sombre: "rgba(244, 239, 230, 0.18)"
  filet-clair: "rgba(11, 10, 16, 0.16)"
typography:
  display:
    fontFamily: "Metal Mania, Titre Repli Impact, Titre Repli Arial Black, Titre Repli Roboto, sans-serif"
    fontSize: "clamp(2.5rem, 1.4rem + 5.2vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Metal Mania, Titre Repli Impact, Titre Repli Arial Black, Titre Repli Roboto, sans-serif"
    fontSize: "clamp(1.5rem, 1.15rem + 1.6vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
  title:
    fontFamily: "Shrikhand, Nom Repli Impact, Nom Repli Arial Black, Nom Repli Roboto, sans-serif"
    fontSize: "clamp(1.35rem, 1.1rem + 0.9vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.05
  numeral:
    fontFamily: "Black Han Sans, Logo Repli Arial Black, Logo Repli Roboto, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2.4vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.01em"
    fontVariation: "font-variant-numeric: tabular-nums"
  lead:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Repli Arial, Bricolage Repli Roboto, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.6vw, 1.4rem)"
    fontWeight: 450
    lineHeight: 1.4
  body:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Repli Arial, Bricolage Repli Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 450
    lineHeight: 1.5
  label:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Repli Arial, Bricolage Repli Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
    fontVariation: "font-stretch: 75%; text-transform: uppercase"
  aside:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Repli Arial, Bricolage Repli Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 450
    letterSpacing: "0.02em"
rounded:
  focus: "4px"
  tag: "6px"
  row: "8px"
  select: "14px"
  tab: "14px"
  bubble: "18px"
  field-mobile: "20px"
  field: "28px"
  pill: "999px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  gutter: "clamp(16px, 4vw, 56px)"
  scene-top: "clamp(72px, 12vh, 140px)"
  scene-head: "clamp(28px, 5vh, 56px)"
  field-pad: "clamp(24px, 3.5vw, 48px)"
  nav-h: "72px"
  wrap: "1440px"
components:
  pill:
    backgroundColor: "{colors.jaune}"
    textColor: "{colors.nuit}"
    rounded: "{rounded.pill}"
    padding: "0 1.45rem"
    height: "52px"
  pill-ghost:
    backgroundColor: "transparent"
    textColor: "currentColor"
    rounded: "{rounded.pill}"
    padding: "0 1.45rem"
    height: "52px"
  pill-ghost-hover:
    backgroundColor: "rgba(244, 239, 230, 0.08)"
  pill-nuit:
    backgroundColor: "{colors.nuit}"
    textColor: "{colors.creme}"
    rounded: "{rounded.pill}"
    padding: "0 1.45rem"
    height: "52px"
  pill-small:
    rounded: "{rounded.pill}"
    padding: "0 1.1rem"
    height: "46px"
  select:
    backgroundColor: "{colors.nuit-2}"
    textColor: "{colors.creme}"
    rounded: "{rounded.select}"
    padding: "0 44px 0 16px"
    height: "52px"
  stepper:
    backgroundColor: "transparent"
    textColor: "{colors.creme}"
    rounded: "{rounded.pill}"
    height: "60px"
    width: "min(100%, 300px)"
  flavor-tab:
    backgroundColor: "transparent"
    textColor: "{colors.creme}"
    rounded: "{rounded.tab}"
    padding: "8px 12px 8px 14px"
  flavor-tab-checked:
    backgroundColor: "{colors.jaune}"
    textColor: "{colors.nuit}"
    rounded: "{rounded.tab}"
  field-orange:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.nuit}"
    rounded: "{rounded.field}"
    padding: "{spacing.field-pad}"
  field-violet:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.creme}"
    rounded: "{rounded.field}"
    padding: "{spacing.field-pad}"
  preview-bubble:
    backgroundColor: "{colors.nuit-2}"
    textColor: "{colors.papier-doux}"
    rounded: "18px 18px 18px 4px"
    padding: "16px 18px"
  dock:
    backgroundColor: "rgba(11, 10, 16, 0.92)"
    textColor: "{colors.creme}"
    rounded: "{rounded.pill}"
    padding: "8px 8px 8px 16px"
  arrow-round:
    backgroundColor: "transparent"
    textColor: "{colors.creme}"
    rounded: "{rounded.round}"
    size: "48px"
  arrow-round-hover:
    backgroundColor: "{colors.jaune}"
    textColor: "{colors.nuit}"
  annotation-tag:
    backgroundColor: "rgba(11, 10, 16, 0.55)"
    textColor: "{colors.creme}"
    rounded: "{rounded.tag}"
    padding: "4px 8px"
---

# Design System: SNUS LBV

## Overview

**Creative North Star: « La scène à trois projecteurs »**

SNUS LBV est une scène de nuit. Le fond est un noir bleuté profond, et trois projecteurs de couleur (orange, jaune, violet) le traversent en mode `screen` : leurs mélanges (ambre, cerise, givre) sont les seules couleurs intermédiaires du site. Rien n'est décoré : la lumière se déplace de scène en scène selon une conduite, s'éteint pour la « salle » crème de la marque, et chaque goût possède son propre couple de gels. Les boîtes sont des galets dessinés en canvas sous le projecteur, en rotation lente, avec une ombre portée douce ; elles sont le seul « visuel ».

La typographie porte deux références distinctes : le mot-symbole en tracés Black Han Sans (lettres condensées inclinées une à une, ombre douce, remplissage de lumière vivante dans le hero) et les titres Shrikhand en capitales, pleins nets, accompagnés d'une étincelle SVG à quatre branches. Bricolage Grotesque assure le texte courant et, resserrée (`font-stretch: 75 %`), les étiquettes de données (marque, dose, prix). Les chiffres importants (prix, mg/g, numéros d'étape, 18+) reprennent Black Han Sans.

La densité est généreuse : scènes hautes (72 à 140 px de respiration), grands titres, notes latérales entre parenthèses, et un seul bouton primaire jaune par scène. La page est mobile d'abord ; l'ordinateur en est l'extension.

**Key Characteristics:**
- Trois couleurs vives exactement, mélangées par chemins de teinte oklch ; nuit et crème comme seuls neutres.
- Lumière mobile (gels en fondu 1,8 s par scène, dérive sinusoïdale permanente, sillage du pointeur).
- Transitions d'iris circulaire pilotées par le défilement entre nuit et salle.
- Boîtes 3D en canvas : rotation 30 à 38 s par tour, inertie au glissement, ralentissement à l'examen.
- Pilules partout pour l'action ; champs très arrondis (28 px) pour les blocs de matière colorée.
- Titres révélés par masque typographique (`clip-path`), le reste monte en fondu `expo.out`.

## Colors

Trois gels saturés sur une nuit bleutée, une crème de salle, et des voiles translucides dérivés de ces deux neutres pour le texte secondaire et les filets.

### Primary
- **Jaune gel** (`{colors.jaune}`) : couleur de l'action. Pilule primaire, onglet de goût sélectionné, prix, soulignement de la navigation, sélection de texte, caret, points de dose actifs, premier iris. Texte nuit par-dessus, jamais crème.
- **Orange gel** (`{colors.orange}`) : lumière dominante du hero, anneau de focus clavier (3 px, décalé de 3 px), champ « Du plus léger au plus fort », marqueurs de liste légale, étincelle de l'avertissement.
- **Violet gel** (`{colors.violet}`) : profondeur de la scène, pouce de barre de défilement, champ « Libreville livré », second iris, fondu d'entrée de la scène Commander. Texte crème par-dessus.

### Neutral
- **Nuit** (`{colors.nuit}`) : fond du site, des gels, du menu mobile, du contrôle d'âge ; encre sur la salle crème et sur le jaune/orange.
- **Nuit 2** (`{colors.nuit-2}`) : surface relevée (sélecteur de goût, bulle d'aperçu du message).
- **Crème** (`{colors.creme}`) : papier sur la nuit ; fond de la scène « salle » (marque) et base du second iris.
- **Crème 2** (`{colors.creme-2}`) : déclarée, réservée aux surfaces secondaires sur crème.
- **Papier doux** (`{colors.papier-doux}`) : texte secondaire sur nuit (notes, marques, mentions). **Encre douce** (`{colors.encre-doux}`) : son équivalent sur crème.
- **Filet sombre** (`{colors.filet-sombre}`) : bordures et séparateurs sur nuit (barre de nav compacte, flèches, étapes, stepper, pied de page). **Filet clair** (`{colors.filet-clair}`) : séparateurs sur crème.

### Named Rules
**The Three Gels Rule.** Toute couleur intermédiaire est un mélange de deux ou trois gels par `linear-gradient(... in oklch shorter|longer hue, ...)`. Les quatre mélanges nommés sont `--mix-ambre` (orange → jaune, 160°, shorter), `--mix-cerise` (orange → violet, 160°, shorter), `--mix-givre` (violet → jaune, 170°, longer), `--mix-trio` (orange → jaune → violet, 150°, longer). Chaque goût du catalogue porte son propre couple (`light.a`, `light.b`, chemin, angle) et éclaire sa flaque (`.lineup__pool`) et sa scène. Aucune teinte hors de ces chemins.

**The Screen Light Rule.** Les gels sont des disques radiaux en `mix-blend-mode: screen` sur la nuit, jamais des aplats ; une couleur n'est posée en aplat que dans un champ (orange, violet), un iris ou une pilule.

**The Lighted Choice Rule.** Le goût sélectionné prend la lumière (flaque à 0,62 d'opacité, voisins réduits à 1 − 0,25 × distance et mis à l'échelle 1 − 0,06 × distance) ; la sélection se dit par la lumière avant de se dire par un cadre.

## Typography

**Display Font:** Metal Mania pour les titres de scène (sous-ensemble woff2 76 Ko ; replis locaux Impact, Arial Black, Roboto Bold avec `size-adjust` 105 % / 68 % / 75 %) et Shrikhand pour les noms de goût (sous-ensemble 17 Ko ; replis avec `size-adjust` 144 % / 93 % / 103 %).
**Body Font:** Bricolage Grotesque Variable (axe `wdth` ; replis Arial et Roboto à 105 %).
**Label/Mono Font:** Black Han Sans pour le mot-symbole (tracés SVG) et les chiffres (replis Arial Black 89 %, Roboto Black 96 %).

**Character:** un lettrage d'affiche à lames (Metal Mania, capitales, pointes tranchées) pour les titres de scène et un lettrage rebondi (Shrikhand) pour les noms de goût tenu par une grotesque variable souple ; les chiffres en Black Han Sans donnent la stabilité télétexte des prix et doses.

### Hierarchy
- **Display** (`.title`, Metal Mania 400, `clamp(2.5rem, 1.4rem + 5.2vw, 6rem)`, 0.98, capitales, `text-wrap: balance`) : titre de chaque scène. Variantes : marque `clamp(3rem, 2rem + 6vw, 7rem)`, contrôle d'âge `clamp(2.4rem, 2rem + 4vw, 5rem)`, menu mobile `clamp(2.4rem, 11vw, 3.6rem)`.
- **Headline** (`.title--h3`, Metal Mania 400, `clamp(1.5rem, 1.15rem + 1.6vw, 2.5rem)`, 1) : titres des champs colorés ; champ violet `clamp(2.2rem, 1.6rem + 2.6vw, 4rem)`.
- **Title** (Shrikhand 400, `clamp(1.35rem, 1.1rem + 0.9vw, 1.75rem)`, 1.05, capitales) : nom des boîtes dans la collection ; onglets de goût `clamp(1.2rem, 1rem + 0.8vw, 1.55rem)` ; titres d'étape `clamp(1.4rem, 1.1rem + 1vw, 1.9rem)` ; liens du pied de page `clamp(1.4rem, 1.2rem + 0.8vw, 1.9rem)`.
- **Numeral** (`.label--big`, Black Han Sans 400, `clamp(1.75rem, 1.2rem + 2.4vw, 3.25rem)`, 0.95, `tabular-nums`) : prix (en jaune), doses de l'échelle (`clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)`), compteur de quantité, numéros d'étape, pastille 18+.
- **Lead** (`.lead`, Bricolage 450, `clamp(1.125rem, 1rem + 0.6vw, 1.4rem)`, 1.4, `text-wrap: pretty`) : phrase d'accroche, introduction de la marque, texte du contrôle d'âge (max 44ch).
- **Body** (Bricolage 450, 1.0625rem, 1.5) : texte courant ; descriptions limitées à 30 à 38 ch.
- **Label** (`.label`, Bricolage 700, 0.875rem, `font-stretch: 75 %`, 0.08em, capitales) : marque, famille de goût, dose, références, compteur « 2 / 9 ». Les annotations sur la scène des goûts resserrent à 80 % et 0.8rem ; le numéro de téléphone du pied de page à 80 %, 800, `clamp(1.4rem, 1.2rem + 1vw, 2rem)`.
- **Aside** (`.aside`, 0.875rem, 0.02em, opacité 0.78) : note latérale entre parenthèses à côté d'un titre, mention 18+.

### Named Rules
**The Label Is Data Rule.** Une étiquette condensée en capitales ne porte que des données du catalogue (marque, dose, prix, référence, compteur) ; elle n'introduit jamais un titre.

**The Weight 400 Rule.** Metal Mania, Shrikhand et Black Han Sans n'existent qu'en 400 ; la hiérarchie se fait par la taille et la couleur, jamais par la graisse.

## Layout

Site une page, conteneur `.wrap` de 1440 px max avec gouttières `clamp(16px, 4vw, 56px)`. Chaque scène (`.scene`) est une section pleine largeur portant un `data-cue` qui déplace les projecteurs ; respiration verticale `clamp(72px, 12vh, 140px)` en haut, en-tête de scène (titre + note latérale + commandes) alignée en bas avec `clamp(28px, 5vh, 56px)` de marge. Barre de navigation fixe de 72 px (`scroll-padding-top` identique), `env(safe-area-inset-bottom)` ajouté aux marges basses.

Grilles : hero 5/7 (texte / scène de boîtes) ; goûts 3/6/3 (onglets / scène / fiche) ; marque 7/5 (champ orange / champ violet décalé de `clamp(32px, 8vw, 120px)`) ; commande 4/3/5 (goût / quantité / WhatsApp) ; pied de page 3/4/5. Points de rupture : 1100 px (grilles à deux colonnes, scène des goûts au-dessus), 900 px (pied de page deux colonnes), 760 px (une colonne, menu mobile, dock, boîte du hero centrée sous le mot-symbole empilé, onglets de goût en pilules), 560 et 480 px (une colonne stricte, pilules pleine largeur). Le hero fait `100svh` ; la collection est une bande à défilement natif (`scroll-snap-type: x mandatory`, accroche au centre, cartes `clamp(250px, 24vw, 320px)` ou `min(78vw, 320px)`), dont la gouttière se prolonge jusqu'au bord du viewport.

Rythme d'espacement observé : 4, 6, 8, 10, 12, 16, 18, 22, 24, 28, 32, 40 px, puis des `clamp()` pour les écarts de scène.

## Elevation & Depth

Système hybride. La profondeur vient d'abord de la lumière (gels `screen`, flaques radiales masquées, fondus de couleur d'entrée de scène) et des couches de nuit (`nuit-2` pour les surfaces relevées, voiles `rgba` pour la barre compacte à 0.86 et le dock à 0.92). Les ombres sont réservées aux objets physiques : boîtes et dock. Aucune ombre dure, aucune bordure de carte.

### Shadow Vocabulary
- **Ombre de boîte** (`filter: drop-shadow(0 30px 30px rgba(0,0,0,0.45))` dans le hero ; `0 34px 34px rgba(0,0,0,0.5)` sur la scène des goûts ; `0 16px 16px rgba(0,0,0,0.45)` dans la commande ; `--shadow-can: 0 28px 48px -18px rgba(0,0,0,0.7), 0 10px 18px -8px rgba(0,0,0,0.5)`) : sous les galets ; une ellipse radiale `.can__shadow` ancre la boîte au sol.
- **Ombre du mot-symbole** (SVG : décalage 6/10 unités, flou gaussien 7, noir à 0.5) : sous chaque lettre inclinée, grands formats seulement.
- **Lueur de pilule** (`0 10px 24px -12px rgba(248,255,50,0.6)` ; variante nuit `rgba(11,10,16,0.7)`) : au survol seulement, avec `translateY(-1px)`.
- **Ombre du dock** (`0 18px 40px -16px rgba(0,0,0,0.8)`) : raccourci de commande mobile flottant.
- **Filet de barre** (`0 1px 0 var(--filet-sombre)`) : barre de navigation compacte.

### Named Rules
**The Light Before Shadow Rule.** Une surface s'élève par la lumière (flaque, gel, voile de nuit) ; l'ombre n'apparaît que sous un objet physique ou en réponse au survol.

## Shapes

Pilules (999 px) pour toute action, le stepper, le dock, les onglets de goût sur mobile et les mentions « indisponible » (tirets). Disques (50 %) pour les flèches de collection (48 px), le burger (44 px), les numéros d'étape, la pastille 18+ (56 px), les points de dose (10 px), les flaques et les iris. Champs de matière colorée très arrondis (28 px, 20 px sur mobile). Rayons intermédiaires : 14 px (sélecteur, onglet de goût), 18 px (bulle d'aperçu avec coin inférieur gauche à 4 px, façon message), 16 px (encart indisponible), 8 px (ligne d'échelle), 6 px (annotation), 4 px (anneau de focus). Bordures toujours 1.5 px en filet translucide (2 px pour la pastille 18+), dessins en tirets uniquement pour l'indisponibilité. Le mot-symbole est un bloc de lettres inclinées ; les titres finissent en pointes ; l'étincelle à quatre branches (`.sparkle`, 1em, `currentColor`) signe une donnée ou un avertissement.

## Components

### Pill (bouton)
- **Shape :** pilule (999 px), hauteur mini 52 px, padding `0 1.45rem`, bordure 1.5 px transparente, icône SVG 1.1em avec écart 0.55em.
- **Primary :** fond jaune, texte nuit, Bricolage 650, 1rem.
- **Hover / Focus :** `translateY(-1px)` + lueur jaune ; actif `scale(0.985)` ; focus clavier par l'anneau orange global. Transition 0.25 s `--ease-out`.
- **Ghost :** transparent, bordure `currentColor`, survol voile crème 0.08. **Nuit :** fond nuit, texte crème. **Small :** 46 px, `0 1.1rem`, 0.9375rem. `aria-pressed="true"` repasse en jaune. Désactivé : opacité 0.5.
- **CTA de commande :** pilule pleine largeur, 60 px, 1.1rem.

### Label / Numeral
- `.label` : donnée condensée en capitales (voir Typography). `.label--big` : chiffres Black Han Sans, prix en jaune, tabulaires.

### Title / Aside
- `.title` : titre de scène Metal Mania, révélé par masque `inset(0 0 100% 0) → inset(0 0 -10% 0)` + 40 px, 1.3 s `expo.out`. `.aside` : note entre parenthèses posée à côté du titre, papier doux.

### Scene / Lights
- Chaque `.scene[data-cue]` déclenche une conduite (hero, collection, gouts, salle, commander, footer) : position, échelle et opacité de chaque gel, en fondu 1.8 s `power2.inOut` quand la scène occupe 55 à 45 % de la fenêtre. Gels : disques 92 vmax (130 vmax sur mobile), dérive permanente ±5 % en 9 / 11,5 / 14 s `sine.inOut`, sillage du pointeur ±35/25 px en 1,2 s `power3.out`, `--px/--py` alimentent les reflets des boîtes. Conduite « salle » : gels éteints.

### Iris
- Bloc de 150 svh avec disque collant ; `clip-path: circle(--r at --ox --oy)` de 0 à 120 % en scrub 0.6 entre `top 85%` et `bottom bottom`. Jaune sur nuit (origine 50/48) avant la salle, violet sur crème (origine 20/70) avant la commande ; un fondu d'entrée de 28 vh (jaune → crème) ou 40 vh (violet → transparent à 0.55) prolonge la couleur dans la scène suivante. Masqué en mouvement réduit.

### Can (boîte)
- Canvas 2D (couvercle réel incliné, `tilt` 62°, flanc à bandeau) ou WebGL partagé (studio, `roughness` 0.38) quand l'appareil le permet ; couvercle statique peint avant le dessin. Rotation 30 à 38 s par tour (hero 34/36/38, collection 30/33/36, goûts 36, commande 30), déphasées ; 30 ips sur mobile et petites tailles ; glissement avec inertie (décélération 0.9 par 16 ms) et ralentissement au survol pour les boîtes interactives ; `touch-action: pan-y`. Tailles : 320 (hero, `min(58vw, 290px)` mobile), 220 (collection), 150 (commande).

### Lineup (collection)
- Carte sans cadre : flaque radiale du goût (300 px, masque radial 20 → 68 %, opacité 0.22 → 0.62 à la sélection ou au survol), boîte qui monte de 6 px au survol, marque en label, nom en Shrikhand, famille · dose avec étincelle jaune, prix numeral jaune, pilule small. Les voisins s'éteignent selon `--d`.

### Flavors stage
- Scène carrée (560 px max) avec spot masqué, boîte interactive, lignes de rappel SVG (crème 1.2 px, opacité 0.85) vers des annotations (`.flavors__tag`, 0.8rem, resserrées 80 %, voile nuit 0.55, 6 px). Onglets radio : 14 px, survol voile crème 0.07, coché jaune/nuit décalé de 4 px ; en pilules bordées sur mobile. Entrée de boîte `flavors-in` 0.9 s (26 px, échelle 0.86).

### Fields (champs de matière)
- Orange (texte nuit) et violet (texte crème), 28 px, padding `clamp(24px, 3.5vw, 48px)`. Échelle d'intensité : lignes séparées par un filet nuit 0.22, barre 10 px nuit sur nuit 0.18, survol voile 0.08 + `translateX(6px)` et flèche révélée.

### Order steps
- Trois étapes séparées par un filet supérieur, numéro en disque jaune (2em, chiffre Black Han Sans 0.62em). Sélecteur natif 52 px / 14 px / `nuit-2`, bordure filet → jaune au survol. Stepper pilule 56 / 1fr / 56, 60 px, chiffre jaune, boutons jaunes au survol. Bulle d'aperçu du message (`nuit-2`, 18/18/18/4, 0.9rem 500, `pre-wrap`).

### Dock (mobile)
- Pilule fixe à 12 px des bords, voile nuit 0.92, filet, ombre portée ; entre par `translateY` 0.5 s `--ease-out`, sélection en 0.8rem + nom en 0.95rem 700 tronqué, pilule small à droite.

### Navigation
- Barre fixe 72 px transparente ; compacte au défilement (voile nuit 0.86, filet). Mot-symbole 24 px (20 px mobile) crème → jaune au survol. Liens 600 / 0.95rem soulignés par une règle jaune 2 px qui s'étend depuis la gauche (0.35 s). Menu mobile : iris `clip-path: circle()` depuis le burger en 0.75 s `--ease-io`, trois halos radiaux, liens Shrikhand, dernier lien en jaune.

### Age gate
- Voile nuit plein écran avec trois halos radiaux, panneau 640 px, mot-symbole 220 px, titre avec étincelle jaune, texte lead, pilules (pleine largeur sous 480 px), avertissements en petit papier doux.

### Browser surfaces
- Sélection jaune / nuit, caret jaune, barre de défilement violet sur nuit (10 px, pouce 999 px avec liseré nuit 2 px), focus visible orange 3 px décalé de 3 px (rayon 4 px ; décalé de −3 px dans le stepper).

## Do's and Don'ts

### Do:
- **Do** composer toute couleur intermédiaire par un dégradé oklch entre deux gels (`shorter` ou `longer hue`) et nommer le couple dans les données du goût.
- **Do** réserver le jaune à l'action et au prix, et poser du texte nuit dessus ; crème sur violet et sur nuit uniquement.
- **Do** placer un seul bouton primaire jaune par scène, les autres en ghost.
- **Do** révéler les titres par masque `clip-path` (1.3 s `expo.out`) et le reste par montée en fondu (30 px, 1.15 s), une seule fois, avec `IntersectionObserver` en second déclencheur et filet de sécurité à 6 s.
- **Do** garder les zones tactiles à 44 px minimum (liens de nav, burger, onglets mobiles, liens de pied de page) et 52 à 60 px pour les commandes.
- **Do** honorer `prefers-reduced-motion` : gels posés sans fondu, iris masqués, révélations désactivées, pilules sans transformation, défilement natif.
- **Do** sous-ensembler les polices et conserver les replis locaux à métriques ajustées pour que la mise en page ne bouge pas à l'arrivée des vraies polices.
- **Do** afficher ce qui manque comme « à confirmer » ou « Prix sur WhatsApp », jamais une valeur inventée.

### Don't:
- **Don't** introduire une quatrième couleur vive, un gris ou un blanc pur : seuls nuit, crème et leurs voiles `rgba` sont neutres.
- **Don't** poser un gel en aplat sur la nuit : les gels sont des halos `screen`.
- **Don't** utiliser Shrikhand ou Black Han Sans pour le texte courant, ni Bricolage pour un titre de scène.
- **Don't** encadrer les boîtes dans des cartes bordées ou ombrées : la carte est la flaque de lumière.
- **Don't** ajouter d'ombre dure, de bordure opaque ou de rayon inférieur à 4 px ; les filets restent translucides et 1.5 px.
- **Don't** faire tourner une boîte en moins de 30 s par tour ni lui retirer l'inertie au glissement.
- **Don't** faire d'une étiquette condensée un sur-titre : elle ne porte que des données.
