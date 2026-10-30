import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Product } from "../../data/products";
import { canOrder } from "../../lib/whatsapp";
import "./dock.css";

interface Props {
  product: Product;
  qty: number;
}

/**
 * Raccourci de commande sur smartphone : la sélection en cours et un bouton à portée de pouce.
 * Masqué sur le hero, dans la scène de commande et sur le pied de page pour ne rien recouvrir d'important.
 */
export default function Dock({ product, qty }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // masqué sur le hero, sur la bande des boîtes (ses pilules « Choisir ce goût » sont l'action principale), la commande et le pied
    const zones = [document.getElementById("haut"), document.getElementById("commander"), document.querySelector("footer")].filter((el): el is HTMLElement => !!el);
    const lineup = document.querySelector<HTMLElement>(".lineup");
    const inside = new Set<Element>([document.getElementById("haut")!]);
    const update = () => setShow(inside.size === 0);
    const onEntries: IntersectionObserverCallback = (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inside.add(e.target);
        else inside.delete(e.target);
      }
      update();
    };
    const io = new IntersectionObserver(onEntries, { threshold: 0 });
    zones.forEach((el) => io.observe(el));
    // la bande compte seulement sous la barre de navigation (ses pilules sont l'action principale)
    const ioLineup = new IntersectionObserver(onEntries, { threshold: 0, rootMargin: "-80px 0px 0px 0px" });
    if (lineup) ioLineup.observe(lineup);
    return () => {
      io.disconnect();
      ioLineup.disconnect();
    };
  }, []);

  const ok = canOrder(product);
  return (
    <div className="dock" data-show={show || undefined} aria-hidden={!show}>
      <p className="dock__sel">
        <strong>{product.name}</strong>
        <span>
          {product.brand} · {qty} {qty > 1 ? "boîtes" : "boîte"}
          {!ok && " · indisponible"}
        </span>
      </p>
      <a href="#commander" className="pill pill--small dock__cta" tabIndex={show ? 0 : -1}>
        {ok ? "Commander" : "Changer"}
        <ArrowRight aria-hidden="true" />
      </a>
    </div>
  );
}
