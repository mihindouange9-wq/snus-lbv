import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "../lib/motion";
import { PRODUCTS, fcfa, nowrapHyphens, type Product } from "../data/products";
import { SITE } from "../data/site";
import { buildMessage, canOrder, whatsappLink } from "../lib/whatsapp";
import { Arrow } from "./Icons";

interface Props {
  /** Goût choisi par le visiteur, ou null tant qu'il n'a rien choisi. */
  product: Product | null;
  qty: number;
  onOrder: () => void;
}

/** Barre de commande collée en bas : présente entre la roue et la section Commande, absente quand elles sont à l'écran. */
export default function Dock({ product, qty, onOrder }: Props) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: ".marquee",
      start: "top 70%",
      endTrigger: "#commander",
      end: "top 55%",
      onToggle: (self) => {
        el.classList.toggle("is-on", self.isActive);
        el.inert = !self.isActive;
      },
    });
    return () => st.kill();
  }, []);
  const ready = product != null && canOrder(product);
  return (
    <div ref={root} className="dock on-clair" inert>
      {ready ? (
        <>
          <p className="dock__what">
            <span className="dock__name">{nowrapHyphens(product.name)}</span>
            <span className="label">
              {qty} × {product.price != null ? `${fcfa(product.price)} ${SITE.currency}` : product.brand}
            </span>
          </p>
          <a className="btn dock__go" href={whatsappLink(buildMessage(product, qty))} target="_blank" rel="noopener noreferrer">
            WhatsApp
            <Arrow />
          </a>
        </>
      ) : (
        <>
          <p className="dock__what">
            <span className="dock__name">{PRODUCTS.length} goûts</span>
            <span className="label">Livré à {SITE.city}</span>
          </p>
          <button type="button" className="btn dock__go" onClick={onOrder}>
            Commander
            <Arrow />
          </button>
        </>
      )}
    </div>
  );
}
