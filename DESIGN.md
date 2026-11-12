---
name: SNUS LBV
description: Affiche typographique chocolat et lin ; une roue de neuf boîtes, l'orange pour agir, le bleu pour la fraîcheur.
colors:
  linen: "#FFEDE3"
  tangelo: "#FB4E01"
  chocolat: "#49261D"
  botticelli: "#CBE7F7"
  linen-doux: "rgba(255, 237, 227, 0.74)"
  chocolat-doux: "rgba(73, 38, 29, 0.76)"
  filet-sombre: "rgba(255, 237, 227, 0.22)"
  filet-clair: "rgba(73, 38, 29, 0.2)"
typography:
  logo:
    fontFamily: "Black Han Sans"
    fontWeight: 400
  display:
    fontFamily: "Bricolage Grotesque Variable"
    fontWeight: 800
    fontVariation: "font-stretch: 75%; text-transform: uppercase"
    letterSpacing: "-0.03em"
    lineHeight: 0.88
  body:
    fontFamily: "Bricolage Grotesque Variable"
    fontSize: "1.0625rem"
    fontWeight: 450
    lineHeight: 1.5
  label:
    fontFamily: "Bricolage Grotesque Variable"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.08em"
    fontVariation: "font-stretch: 75%; text-transform: uppercase"
rounded:
  panel: "clamp(22px, 5vw, 40px)"
  pill: "999px"
---

# Charte graphique SNUS LBV

Version 2, novembre 2026. Elle remplace la charte « scène de nuit à trois projecteurs » (orange, jaune, violet).
Planche visuelle : `docs/charte-graphique.html`. Jetons : `src/styles/tokens.css`.

## 1. Idée

Une affiche, pas une boutique. Le logo tient en haut à gauche, les neuf boîtes tournent sur une roue du plus léger
au plus fort, et une seule couleur sert à agir. Référence d'exécution : osply.co (mot-symbole pleine largeur, bandeau
fin, roue verticale, ligne de repères), adaptée sans rien en copier.

Public : adultes de 18 à 35 ans à Libreville, sur téléphone. Le site ne s'adresse jamais aux mineurs : contrôle d'âge
à l'entrée, mentions obligatoires, aucun code enfantin.

## 2. Couleurs

Quatre couleurs, aucune autre teinte. Les seules dérivations admises sont ces quatre couleurs en transparence.

| Nom | Hex | Rôle | Part de surface |
|---|---|---|---|
| Chocolate Brown | `#49261D` | Fond principal, texte sur fond clair | environ 60 % |
| Linen | `#FFEDE3` | Texte sur Chocolat, fonds clairs, bandeau | environ 25 % |
| Tangelo | `#FB4E01` | Action et signal : boutons, niveau d'intensité, bandeau défilant, mot-symbole de pied | environ 10 % |
| Botticelli | `#CBE7F7` | Fraîcheur : plateau des menthes, carte de commande, premier panneau | environ 5 % |

### Associations autorisées

| Texte | Fond | Contraste | Usage |
|---|---|---|---|
| Linen | Chocolat | 11,7:1 | tout texte |
| Chocolat | Linen | 11,7:1 | tout texte |
| Chocolat | Botticelli | 10,3:1 | tout texte |
| Chocolat | Tangelo | 3,9:1 | texte large seulement : 19 px gras ou 24 px et plus |
| Tangelo | Chocolat | 3,9:1 | texte large et pictogrammes seulement |

### Interdits

- Petit texte sur Tangelo ou en Tangelo (sous 19 px gras).
- Linen sur Tangelo (3,0:1) et Tangelo sur Linen ou Botticelli (2,6:1) pour du texte.
- Dégradés, texte en dégradé (seule exception : la matière vivante du logo), ombres colorées, toute cinquième couleur (gris, noir pur, blanc pur compris).
- Tangelo en fond de page entière : il reste un signal. Une seule exception par page (le panneau « Régler »).

## 3. Typographie

| Voix | Police | Réglage | Usage |
|---|---|---|---|
| Logo et chiffres | Black Han Sans | contours dessinés, à plat | le logo, et les chiffres clés |
| Affichage | Bricolage Grotesque | largeur 75 %, graisse 800, capitales, interlettrage −0,03 em, interligne 0,88 | noms de goûts, titres, bandeau |
| Texte | Bricolage Grotesque | graisse 450, 17 px, interligne 1,5 | descriptions, messages |
| Étiquette | Bricolage Grotesque | largeur 75 %, graisse 700, capitales, 13 px, interlettrage 0,08 em | marque, unités, légendes |

Règles : deux familles, jamais une troisième. Pas de surtitre au-dessus d'un titre. Corps de texte jamais sous 13 px.
Les nombres (prix, dose, quantité) sont en Black Han Sans à chasse fixe. Espace insécable avant « : » et dans les prix.

## 4. Logo

Version 2 du logo, 12 nov. 2026. Fichiers : `public/logo/snus-lbv-logo-linen.svg` (sur fond sombre),
`snus-lbv-logo-chocolat.svg` (sur fond clair), `snus-lbv-logo-sur-chocolat.svg` (avec son fond), `public/favicon.svg`.
Données de construction : `src/assets/logo.ts`.

- Un seul motif, le sachet. Un sachet Tangelo est glissé dans le U de SNUS, là où il se place sous la lèvre ; « LBV »
  est posé dans une capsule Tangelo de la forme d'un sachet, à la hauteur exacte des capitales.
- Lettres : contours Black Han Sans, à plat, espacées à la main (9 unités entre deux lettres pour 150 de hauteur).
- Couleurs : lettres Linen sur fond sombre, Chocolat sur fond clair. Le sachet et la capsule sont toujours Tangelo,
  « LBV » toujours Chocolat. Aucune autre combinaison.
- Matière vivante (site uniquement) : des nuances Botticelli et Tangelo se déplacent lentement dans les lettres de SNUS,
  sans jamais se synchroniser, et le sachet s'enfonce doucement dans le U. Contours nets. Fixe en mouvement réduit et
  sur tout support imprimé.
- Taille : le logo est compact, en haut à gauche (56 % de la largeur sur téléphone, 290 px au plus). Largeur minimale
  96 px ; en dessous, utiliser le sachet seul avec le S (favicon).
- Zone de protection : la hauteur du sachet du U tout autour. Jamais sur une photo, jamais étiré, incliné ou recoloré.

## 5. Formes et espace

- Marge de page : 12 px sur téléphone, jusqu'à 40 px sur ordinateur (`--gutter`).
- Deux rayons seulement : pilule (boutons, barre de commande) et panneau (22 à 40 px).
- Les boîtes sont rondes : c'est la seule forme ronde, avec son plateau et les boutons ronds.
- Filets d'un pixel, en Linen ou Chocolat à 20 %. Pas de carte dans une carte.
- Zones tactiles : 44 px au minimum, boutons d'action 56 px.

## 6. Mouvement

Le mouvement raconte une seule chose : la roue. Tout le reste l'accompagne.

| Effet | Où | Règle |
|---|---|---|
| Roue des boîtes | scène d'accueil | pilotée par le défilement, aimantée sur chaque goût ; les boîtes roulent (150° par cran) |
| Plateau | sous la boîte active | change de couleur selon la famille : Tangelo (fruit), Linen (neutre), Botticelli (menthes) |
| Rideau circulaire | sortie du contrôle d'âge | 750 ms |
| Bandeau défilant | après la scène | s'incline et accélère avec la vitesse du défilement |
| Remplissage mot à mot | manifeste | lié au défilement |
| Pile d'images | humeur | les images tombent une à une sur la pile, liées au défilement ; trois couches visibles au plus |
| Panneaux empilés | quatre gestes | chaque panneau recouvre le précédent, qui recule à 88 % |
| Tour de boîte et total qui roule | commande | à chaque changement de goût ou de quantité |
| Logo qui monte | pied de page | lié au défilement |

Règles : seuls `transform`, `opacity` et `clip-path` sont animés. Courbe de sortie exponentielle
(`cubic-bezier(0.16, 1, 0.3, 1)`). Durées : 180 ms (toucher), 420 ms (état), 900 ms (entrée). Deux écrans épinglés au plus
(la roue et la pile d'images, en `position: sticky`). Mouvement réduit : la roue se tourne avec ses deux boutons, les panneaux se suivent
sans s'empiler, rien n'est masqué.

## 7. Empilement

Un seul ordre, défini dans les jetons : scène (1), panneaux (2), barre de commande (40), lien d'évitement (60),
contrôle d'âge (100). Aucun `z-index` libre dans les composants.

## 8. Ton

Tutoiement, phrases courtes, faits vérifiables (dose, prix, ville). Pas de promesse de santé, pas de fausse preuve
sociale, pas de slogan. Les boutons nomment leur action : « Commander ce goût », « Commander sur WhatsApp ».
