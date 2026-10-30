/** Configuration centrale du site : un seul endroit pour le numéro WhatsApp et les informations de contact. */
export const SITE = {
  name: "SNUS LBV",
  city: "Libreville",
  country: "Gabon",
  /** Numéro affiché (format local). */
  phoneDisplay: "076 45 13 60",
  /** Numéro au format international pour wa.me et tel:, sans « + » ni zéro initial (indicatif Gabon 241). */
  whatsapp: "24176451360",
  /** Adresse publique du site, remplie au build par VITE_SITE_URL. */
  url: ((import.meta as { env?: Record<string, string | undefined> }).env?.VITE_SITE_URL ?? "").replace(/\/$/, ""),
  /** Âge légal retenu pour le contrôle d'entrée (déclaratif). */
  legalAge: 18,
  currency: "FCFA",
  /** Informations commerciales non confirmées par le client. */
  delivery: {
    zone: "Libreville",
    note: "Frais et délais de livraison confirmés par le vendeur sur WhatsApp.",
  },
  /** Mentions légales de l'entreprise : à compléter (raison sociale, RCCM, NIF). */
  legal: {
    company: null as string | null,
    rccm: null as string | null,
    nif: null as string | null,
  },
} as const;

export const WARNINGS = [
  "Ce produit contient de la nicotine. La nicotine crée une forte dépendance.",
  "Vente interdite aux mineurs. Réservé aux adultes de 18 ans et plus.",
  "Tenir hors de portée des enfants.",
] as const;
