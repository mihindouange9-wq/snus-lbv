# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated : Vite 6 + React 19 + TypeScript + GSAP/ScrollTrigger, CSS natif (variables, modules par composant), aucune dépendance native bloquée par Smart App Control sur ce poste. Next.js était la référence du brief (« à adapter à l'environnement ») ; le site est statique, sans route serveur, donc Vite suffit et se déploie tel quel sur Render/Netlify. Three.js écarté : les visuels disponibles sont des vues de dessus 300 × 300, la rotation 3D est construite en CSS 3D (couvercle + flanc cylindrique).

## Users

Adultes (18 ans et plus) de Libreville qui consomment ou veulent essayer des pouches de nicotine (snus sans tabac) et commandent au téléphone, sur mobile, pour être livrés en ville. [inféré du brief et du site actuel, non confirmé par le client]

## Product Purpose

Faire choisir un goût et une quantité, puis ouvrir WhatsApp avec un message de commande prérempli vers le 076451360. Succès : le visiteur comprend en quelques secondes ce qu'est SNUS LBV, voit les boîtes, choisit, envoie son message lui-même.

## Positioning

Revendeur libreville-ois de pouches de nicotine de marques internationales (ZYN, VELO, White Fox, Nordic Spirit, GOAT), livraison locale, commande directe par WhatsApp sans compte ni panier. [inféré du catalogue du site actuel]

## Operating Context

- Site actuel de référence : https://snushellbev-fc3d0b.netlify.app/ (« Snus.hellbev », thème terminal vert/noir, panier + formulaire + envoi FormSubmit, repli WhatsApp). Copie HTML et images extraites dans `references/site-actuel/`.
- Commande : WhatsApp wa.me/24176451360 (076451360 au format gabonais). Paiement évoqué sur l'ancien site : cash à la livraison, Airtel Money, Moov Money (non confirmé pour le nouveau site).
- Livraison : Libreville (quartiers listés sur l'ancien site). Frais et délais inconnus.

## Capabilities and Constraints

- Catalogue centralisé (`src/data/products.ts`) : 9 références, 5 marques, dose mg/g, prix FCFA (repris de l'ancien site, à confirmer), visuel WebP 300 × 300 transparent, disponibilité.
- Visuels : 8 images seulement (ZYN Black Cherry et Black Cherry Strong partagent le même visuel), résolution 300 px, vue de dessus. Pas de photo HD, pas de vue de côté, pas de modèle 3D.
- Pas de paiement en ligne, pas de compte, pas de panier multi-produits obligatoire : une commande = un goût × une quantité (le message WhatsApp reste modifiable par le client).
- Contrôle d'âge 18+ à l'entrée (déclaratif, pas une garantie juridique).
- Mentions obligatoires : interdit aux mineurs, la nicotine crée une forte dépendance, tenir hors de portée des enfants.
- Cadre légal gabonais : loi n° 006/2013 et décrets du 17 mai 2016 (publicité, promotion et parrainage du tabac et produits dérivés interdits ; sachets de nicotine cités dans les définitions). Un site promotionnel peut tomber sous ces restrictions : à faire vérifier par le client avant mise en ligne. Aucune promesse de santé ou de sécurité.
- Performances mobile d'abord : largeurs 320 à 1440, prefers-reduced-motion respecté, aucun débordement horizontal.

## Brand Commitments

- Nom : SNUS LBV (LBV = Libreville).
- Références visuelles contraignantes : `references/logo snus lbv.jpg` (mot « WAUW! » : lettres grasses condensées, chaque lettre inclinée, crème sur noir) pour le logo ; `references/typographie site.jpg` (« SPICY DOLLZ » : lettrage pointu à lames, étoiles à quatre branches, noir sur rose) pour le caractère des titres.
- Palette imposée : exactement trois couleurs vives (départ orange #FF5A1F, jaune #F8FF32, violet #7928FF, ajustables) + noir profond et blanc cassé comme neutres de structure uniquement.
- Référence d'exécution : https://www.noth.in/ (niveau d'interaction, compositions typographiques, alternance de blocs, étiquettes entre parenthèses), à ne pas copier.
- Ton : fun, sobre, urbain contemporain ; pas de codes enfantins, pas de slogans vides, pas de fausses preuves sociales.
- Second prompt client (31 oct. 2026, « perfectionnement ») : le mot-symbole du hero doit porter une « matière lumineuse en mouvement », des mélanges de violet, d'orange et de jaune qui circulent à l'intérieur des lettres (texte en dégradé animé explicitement demandé, lisibilité et contours nets exigés, repli statique en mouvement réduit) ; boîtes en 3D réaliste avec éclairage de studio ; message WhatsApp commençant exactement par « Bonjour SNUS LBV, je veux [QUANTITÉ] boîte(s) de snus [NOM DU GOÛT] à livrer. ».

## Evidence on Hand

- `references/site-actuel/produits/*.webp` : 8 visuels de boîtes (droits : images du site actuel du client).
- `references/site-actuel/_html/index.html` : catalogue, textes, numéro, quartiers.
- `references/nothin/*.png` : captures de la référence d'exécution (ordinateur et mobile).
- `references/polices/` : planche de polices candidates.
- Absences à ne pas inventer : photos HD, logo vectoriel officiel, tarifs de livraison, délais, horaires, adresse, mentions légales de la société (forme juridique, RCCM, NIF), réseaux sociaux, avis clients.

## Product Principles

1. Le goût choisi pilote tout : visuel dominant, couleur de section, message WhatsApp.
2. Une commande en quatre gestes : voir, choisir, quantité, WhatsApp. Jamais de fausse confirmation.
3. Aucune donnée inventée : ce qui manque est affiché comme « à confirmer » ou absent.
4. Le mobile est la version principale ; l'ordinateur en est l'extension.
5. La couleur raconte, elle ne décore pas : trois couleurs, leurs mélanges, et des respirations neutres.

## Accessibility & Inclusion

Contrastes AA sur fonds colorés (texte noir sur jaune/orange, blanc cassé sur violet/noir), navigation clavier complète avec focus visible, textes alternatifs réels sur les boîtes, mouvement réduit honoré (rotation et transitions de fond coupées), zones tactiles 44 px minimum.
