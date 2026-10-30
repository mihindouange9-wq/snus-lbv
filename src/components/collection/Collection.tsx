import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Can from "../product/Can";
import Sparkle from "../brand/Sparkle";
import { PRODUCTS, fcfa, gradient, level, nowrapHyphens } from "../../data/products";
import { SITE } from "../../data/site";
import "./collection.css";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

/** L'étagère : neuf boîtes en rotation lente sur une bande à défilement horizontal natif (glissement au doigt). */
export default function Collection({ selectedId, onSelect }: Props) {
  const list = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);

  // échelle selon la position dans la fenêtre : la boîte au centre est la plus grande ; on retient laquelle
  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = ul.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      let best = 0;
      let bestD = Infinity;
      (Array.from(ul.children) as HTMLElement[]).forEach((li, i) => {
        const b = li.getBoundingClientRect();
        const dist = Math.abs(b.left + b.width / 2 - mid);
        const d = Math.min(1, dist / (r.width / 2));
        li.style.setProperty("--d", d.toFixed(3));
        if (dist < bestD) {
          bestD = dist;
          best = i;
        }
      });
      setCurrent(best);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    ul.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      ul.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const ul = list.current;
    if (!ul) return;
    const item = ul.firstElementChild as HTMLElement | null;
    ul.scrollBy({ left: dir * (item?.offsetWidth ?? 300), behavior: "smooth" });
  };

  return (
    <section className="collection scene" id="collection" data-cue="collection" aria-labelledby="collection-title">
      <div className="wrap collection__head">
        <h2 className="title" id="collection-title" data-reveal>
          La collection
        </h2>
        <p className="collection__note aside" data-reveal="0.1">
          ( neuf boîtes, cinq marques, toutes livrées à {SITE.city} )
        </p>
        <div className="collection__arrows" data-reveal="0.15">
          <p className="collection__count label" aria-live="polite">
            <span className="sr-only">Boîte </span>
            {current + 1} / {PRODUCTS.length}
          </p>
          <button type="button" className="collection__arrow" onClick={() => step(-1)} aria-label="Boîte précédente">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" className="collection__arrow" onClick={() => step(1)} aria-label="Boîte suivante">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul ref={list} className="lineup" aria-label="Les neuf boîtes">
        {PRODUCTS.map((p, i) => {
          const selected = p.id === selectedId;
          return (
            <li key={p.id} className="lineup__item" data-selected={selected || undefined} data-unavailable={!p.available || undefined} style={{ "--d": 0 }}>
              <div className="lineup__pool" style={{ "--pool": gradient(p, 140) }} aria-hidden="true" />
              <div className="lineup__can">
                <Can product={p} size={220} phase={i * 4.3} duration={30 + (i % 3) * 3} />
              </div>
              <div className="lineup__text">
                <p className="label lineup__brand">{p.brand}</p>
                <h3 className="lineup__name">{nowrapHyphens(p.name)}</h3>
                <p className="lineup__meta">
                  <span>{p.flavor}</span>
                  <Sparkle />
                  <span>
                    {p.dose} mg/g · {level(p.dose)}
                  </span>
                </p>
                <p className="label label--big lineup__price">{p.price != null ? `${fcfa(p.price)} ${SITE.currency}` : "Prix sur WhatsApp"}</p>
                {p.available ? (
                  <button type="button" className={`pill pill--small ${selected ? "" : "pill--ghost"}`} aria-pressed={selected} onClick={() => onSelect(p.id)}>
                    {selected ? (
                      <>
                        <Check aria-hidden="true" /> Goût choisi
                      </>
                    ) : (
                      "Choisir ce goût"
                    )}
                  </button>
                ) : (
                  <p className="lineup__off label">Indisponible pour le moment</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
