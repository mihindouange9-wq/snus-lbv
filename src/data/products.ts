/**
 * Catalogue SNUS LBV. Source : catalogue du site actuel (snushellbev-fc3d0b.netlify.app), repris sans invention.
 * Les prix et disponibilités se modifient ici uniquement ; `price: null` masque le prix et le total dans le message.
 * Les couleurs `light` ne désignent que les trois gels de la charte (orange, jaune, violet) et leur sens de mélange.
 */
export type Gel = "orange" | "jaune" | "violet";
export type Family = "fruit" | "neutre" | "menthe" | "glace";

export interface Product {
  id: string;
  brand: string;
  name: string;
  /** Libellé de goût tel qu'affiché. */
  flavor: string;
  family: Family;
  /** Dose de nicotine en mg/g (valeur du catalogue). */
  dose: number;
  /** Prix unitaire en FCFA, ou null si non défini. */
  price: number | null;
  /** Visuel de la boîte (vue de dessus, fond transparent, 300 × 300). */
  image: string;
  available: boolean;
  /** Description factuelle, sans promesse. */
  description: string;
  /** Éclairage du goût : deux gels et le chemin de teinte entre eux (oklch). */
  light: { a: Gel; b: Gel; hue: "shorter" | "longer"; angle: number };
  /** Couleurs du flanc de la boîte, approchées depuis le visuel réel. */
  side: { rim: string; body: string; text: string };
}

export const GELS: Record<Gel, string> = { orange: "#FF5A1F", jaune: "#F8FF32", violet: "#7928FF" };

export const FAMILIES: Record<Family, string> = { fruit: "Fruit", neutre: "Neutre", menthe: "Menthe", glace: "Glace" };

export const PRODUCTS: Product[] = [
  {
    id: "zyn-bc", brand: "ZYN MINI", name: "Black Cherry", flavor: "Fruitée", family: "fruit", dose: 8, price: 9000,
    image: "/images/products/zyn-bc.webp", available: true,
    description: "Cerise noire, format slim. Le plus léger du catalogue.",
    light: { a: "orange", b: "violet", hue: "shorter", angle: 160 },
    side: { rim: "#F3F0F4", body: "#EDE6F1", text: "#2B1A3D" },
  },
  {
    id: "wf-bal", brand: "WHITE FOX", name: "Balanced", flavor: "Neutre", family: "neutre", dose: 8, price: 9000,
    image: "/images/products/wf-bal.webp", available: true,
    description: "Goût neutre, sans arôme dominant. Fabriqué en Suède.",
    light: { a: "orange", b: "jaune", hue: "shorter", angle: 150 },
    side: { rim: "#F4F4F4", body: "#2A66A8", text: "#F4F4F4" },
  },
  {
    id: "velo-cp", brand: "VELO", name: "Crispy Peppermint", flavor: "Menthe fraîche", family: "menthe", dose: 14, price: 12000,
    image: "/images/products/velo-cp.webp", available: true,
    description: "Menthe poivrée nette, intensité moyenne.",
    light: { a: "jaune", b: "violet", hue: "longer", angle: 165 },
    side: { rim: "#F4F4F4", body: "#1B3FB5", text: "#F4F4F4" },
  },
  {
    id: "zyn-bcs", brand: "ZYN MINI", name: "Black Cherry Strong", flavor: "Fruitée", family: "fruit", dose: 15, price: 12000,
    image: "/images/products/zyn-bc.webp", available: true,
    description: "Cerise noire, version forte du même format slim.",
    light: { a: "violet", b: "orange", hue: "shorter", angle: 160 },
    side: { rim: "#F3F0F4", body: "#EDE6F1", text: "#2B1A3D" },
  },
  {
    id: "ns-sm", brand: "NORDIC SPIRIT", name: "Sweet Mint X-Strong", flavor: "Menthe douce", family: "menthe", dose: 16, price: 15000,
    image: "/images/products/ns-sm.webp", available: true,
    description: "Menthe douce, intensité forte.",
    light: { a: "jaune", b: "violet", hue: "longer", angle: 150 },
    side: { rim: "#2BAA4A", body: "#F4F4F4", text: "#1E8A3C" },
  },
  {
    id: "ns-fm", brand: "NORDIC SPIRIT", name: "Frosty Mint X-Strong", flavor: "Menthe glacée", family: "glace", dose: 16, price: 15000,
    image: "/images/products/ns-fm.webp", available: true,
    description: "Menthe glacée, intensité forte.",
    light: { a: "violet", b: "jaune", hue: "longer", angle: 170 },
    side: { rim: "#2A8FB5", body: "#F4F4F4", text: "#2A8FB5" },
  },
  {
    id: "ns-fms", brand: "NORDIC SPIRIT", name: "Frosty Mint X-Strong · Édition spéciale", flavor: "Menthe glacée", family: "glace", dose: 16, price: 18000,
    image: "/images/products/ns-fms.webp", available: true,
    description: "Menthe glacée, boîte édition spéciale.",
    light: { a: "violet", b: "jaune", hue: "longer", angle: 200 },
    side: { rim: "#0F3F55", body: "#1E6E8C", text: "#F4F4F4" },
  },
  {
    id: "goat-cm", brand: "GOAT", name: "Cool Mint", flavor: "Menthe forte", family: "menthe", dose: 16, price: 18000,
    image: "/images/products/goat-cm.webp", available: true,
    description: "Menthe fraîche, boîte noire, intensité forte.",
    light: { a: "violet", b: "jaune", hue: "longer", angle: 140 },
    side: { rim: "#1A1A1A", body: "#121212", text: "#7FE05A" },
  },
  {
    id: "velo-fp", brand: "VELO", name: "Freezing Peppermint", flavor: "Menthe intense", family: "glace", dose: 20, price: 24000,
    image: "/images/products/velo-fp.webp", available: true,
    description: "Menthe poivrée glaciale. Le plus fort du catalogue.",
    light: { a: "violet", b: "jaune", hue: "longer", angle: 185 },
    side: { rim: "#121212", body: "#2E4A7A", text: "#F4F4F4" },
  },
];

export const byId = (id: string): Product => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

/** Niveau lisible selon la dose, même échelle que le catalogue d'origine. */
export function level(dose: number): string {
  if (dose <= 8) return "Léger";
  if (dose <= 15) return "Moyen";
  if (dose <= 16) return "Fort";
  return "Très fort";
}

export const DOSE_MAX = 20;

/** Format FCFA : milliers séparés par une espace fine insécable (U+202F). */
export const fcfa = (n: number): string => n.toLocaleString("fr-FR").replace(/[\u202f\u00a0\s]/g, "\u202f");

/** Dégradé CSS du goût : deux gels, chemin de teinte en oklch pour des intermédiaires naturels. */
export function gradient(p: Product, angle = p.light.angle): string {
  return `linear-gradient(${angle}deg in oklch ${p.light.hue} hue, ${GELS[p.light.a]}, ${GELS[p.light.b]})`;
}

/** Pour l'affichage : trait d'union insécable (U+2011) afin que « X-Strong » ne se coupe pas en fin de ligne. */
export const nowrapHyphens = (s: string): string => s.replace(/-/g, "‑");
