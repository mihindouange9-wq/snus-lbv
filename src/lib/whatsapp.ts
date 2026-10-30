import { SITE } from "../data/site.ts";
import { fcfa, type Product } from "../data/products.ts";

/**
 * Message de commande prérempli. La première ligne suit la formulation imposée :
 * « Bonjour SNUS LBV, je veux [QUANTITÉ] boîte(s) de snus [NOM DU GOÛT] à livrer. »
 * Prix et total n'apparaissent que si le prix est défini.
 */
export function buildMessage(p: Product, qty: number): string {
  const n = Math.max(1, Math.floor(qty));
  const boites = n > 1 ? "boîtes" : "boîte";
  const lines = [`Bonjour ${SITE.name}, je veux ${n} ${boites} de snus ${p.name} à livrer.`, "", `Marque : ${p.brand} · ${p.dose} mg/g`];
  if (p.price != null) {
    lines.push(`Prix unitaire : ${fcfa(p.price)} ${SITE.currency}`);
    lines.push(`Total indicatif : ${fcfa(p.price * n)} ${SITE.currency}`);
  }
  lines.push("", "Merci de me confirmer la disponibilité et la livraison.");
  return lines.join("\n");
}

/** Lien wa.me vers le numéro SNUS LBV avec le message encodé (WhatsApp Web sur ordinateur, application sur mobile). */
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Un produit indisponible ne peut pas être commandé. */
export const canOrder = (p: Product): boolean => p.available;

export const telLink = `tel:+${SITE.whatsapp}`;
