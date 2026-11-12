import { useEffect, useRef } from "react";
import { PRODUCTS, byId, fcfa, level, nowrapHyphens } from "../data/products";
import { SITE } from "../data/site";
import { buildMessage, canOrder, telLink, whatsappLink } from "../lib/whatsapp";
import { gsap, reducedMotion } from "../lib/motion";
import { Arrow, Sign } from "./Icons";

const MAX = 20;

interface Props {
  selectedId: string;
  qty: number;
  onSelect: (id: string) => void;
  onQty: (n: number) => void;
}

/** Commande : un goût, une quantité, puis WhatsApp avec le message prérempli. Rien n'est envoyé par le site. */
export default function Order({ selectedId, qty, onSelect, onQty }: Props) {
  const p = byId(selectedId);
  const can = useRef<HTMLImageElement>(null);
  const total = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: p.price != null ? p.price * qty : 0 });
  const first = useRef(true);
  const message = buildMessage(p, qty);

  // la boîte fait un tour à chaque changement, le total roule jusqu'à sa nouvelle valeur
  useEffect(() => {
    const value = p.price != null ? p.price * qty : 0;
    const out = total.current;
    if (first.current || reducedMotion()) {
      first.current = false;
      shown.current.v = value;
      if (out) out.textContent = fcfa(value);
      return;
    }
    if (can.current) gsap.fromTo(can.current, { rotate: -200, scale: 0.86 }, { rotate: 0, scale: 1, duration: 0.9, ease: "expo.out", overwrite: true });
    const tween = gsap.to(shown.current, {
      v: value,
      duration: 0.7,
      ease: "power3.out",
      onUpdate: () => {
        if (out) out.textContent = fcfa(Math.round(shown.current.v / 500) * 500);
      },
      onComplete: () => {
        if (out) out.textContent = fcfa(value);
      },
    });
    return () => {
      tween.kill();
    };
  }, [p.id, p.price, qty]);

  const set = (n: number) => onQty(Math.max(1, Math.min(MAX, n)));

  return (
    <section className="order" id="commander" aria-labelledby="order-title">
      <h2 id="order-title" className="display order__title" tabIndex={-1} data-focus>
        Ta commande
      </h2>

      <div className="order__picker" role="radiogroup" aria-label="Goût">
        {PRODUCTS.map((q) => (
          <button key={q.id} type="button" role="radio" aria-checked={q.id === p.id} className="chip" onClick={() => onSelect(q.id)}>
            <img src={q.image} alt="" width={300} height={300} loading="lazy" decoding="async" />
            <span className="chip__name">{nowrapHyphens(q.name)}</span>
            <span className="label chip__dose">
              {q.brand} · {q.dose} mg/g
            </span>
          </button>
        ))}
      </div>

      <div className="order__card on-clair">
        <div className="order__product">
          <img ref={can} className="order__can" src={p.image} alt={`Boîte ${p.brand} ${p.name}`} width={300} height={300} loading="lazy" decoding="async" />
          <div>
            <p className="label">
              {p.brand} · {level(p.dose)}
            </p>
            <p className="display order__name">{nowrapHyphens(p.name)}</p>
            <p className="order__unit">{p.price != null ? `${fcfa(p.price)} ${SITE.currency} la boîte` : "Prix confirmé par le vendeur"}</p>
          </div>
        </div>

        <div className="order__row">
          <span className="label" id="qty-label">
            Quantité
          </span>
          <div className="stepper" role="group" aria-labelledby="qty-label">
            <button type="button" onClick={() => set(qty - 1)} disabled={qty <= 1} aria-label="Retirer une boîte">
              <Sign />
            </button>
            <output className="num" aria-live="polite">
              {qty}
            </output>
            <button type="button" onClick={() => set(qty + 1)} disabled={qty >= MAX} aria-label="Ajouter une boîte">
              <Sign plus />
            </button>
          </div>
        </div>

        {p.price != null && (
          <div className="order__row order__row--total">
            <span className="label">Total indicatif</span>
            <p className="order__total">
              <span ref={total} className="num" suppressHydrationWarning>
                {fcfa(p.price * qty)}
              </span>{" "}
              {SITE.currency}
            </p>
          </div>
        )}

        <figure className="order__msg">
          <figcaption className="label">Ton message, modifiable dans WhatsApp</figcaption>
          <p>{message}</p>
        </figure>

        <a className="btn order__send" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" aria-disabled={canOrder(p) ? undefined : "true"}>
          {canOrder(p) ? "Commander sur WhatsApp" : "Indisponible"}
          <Arrow />
        </a>
        <p className="order__note">
          {SITE.delivery.note} Ou appelle le <a href={telLink}>{SITE.phoneDisplay}</a>.
        </p>
      </div>
    </section>
  );
}
