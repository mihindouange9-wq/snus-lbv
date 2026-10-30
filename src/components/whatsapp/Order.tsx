import { useMemo, useState } from "react";
import { ChevronDown, Copy, Minus, Phone, Plus, MessageCircle } from "lucide-react";
import Can from "../product/Can";
import { PRODUCTS, byId, fcfa } from "../../data/products";
import { SITE } from "../../data/site";
import { buildMessage, canOrder, telLink, whatsappLink } from "../../lib/whatsapp";
import "./order.css";

interface Props {
  selectedId: string;
  qty: number;
  onSelect: (id: string) => void;
  onQty: (q: number) => void;
}

const MIN = 1;
const MAX = 50;
const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand)));

/** Commande en trois gestes : le goût, la quantité, WhatsApp. Rien n'est envoyé sans le client. */
export default function Order({ selectedId, qty, onSelect, onQty }: Props) {
  const product = byId(selectedId);
  const message = useMemo(() => buildMessage(product, qty), [product, qty]);
  const link = useMemo(() => whatsappLink(message), [message]);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 2400);
  };

  const total = product.price != null ? product.price * qty : null;

  return (
    <section className="order scene" id="commander" data-cue="commander" aria-labelledby="commander-title">
      <div className="wrap">
        <div className="order__head">
          <h2 className="title" id="commander-title" data-reveal>
            Commander
          </h2>
          <p className="aside order__note" data-reveal="0.1">
            ( trois gestes, zéro compte )
          </p>
        </div>

        <div className="order__grid">
          <div className="order__step order__step--gout" data-reveal>
            <p className="order__stepTitle">
              <span className="order__num">1</span> Le goût
            </p>
            <div className="order__pick">
              <div className="order__canWrap" aria-hidden="true">
                <Can product={product} size={150} duration={30} />
              </div>
              <label className="order__select">
                <span className="label">Changer de goût</span>
                <span className="order__selectBox">
                  <select value={selectedId} onChange={(e) => onSelect(e.target.value)} data-focus="">
                    {BRANDS.map((brand) => (
                      <optgroup key={brand} label={brand}>
                        {PRODUCTS.filter((p) => p.brand === brand).map((p) => (
                          <option key={p.id} value={p.id} disabled={!p.available}>
                            {p.name}
                            {!p.available ? " (indisponible)" : ""}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown aria-hidden="true" />
                </span>
              </label>
            </div>
            <p className="order__chosen">
              <strong>
                {product.brand} {product.name}
              </strong>
              <br />
              {product.flavor} · {product.dose} mg/g
              {product.price != null && (
                <>
                  <br />
                  {fcfa(product.price)} {SITE.currency} la boîte
                </>
              )}
            </p>
          </div>

          <div className="order__step order__step--qty" data-reveal="0.08">
            <p className="order__stepTitle">
              <span className="order__num">2</span> La quantité
            </p>
            <div className="stepper" role="group" aria-label="Quantité de boîtes">
              <button type="button" className="stepper__btn" onClick={() => onQty(Math.max(MIN, qty - 1))} disabled={qty <= MIN} aria-label="Une boîte de moins">
                <Minus aria-hidden="true" />
              </button>
              <input
                className="stepper__input label label--big"
                type="number"
                inputMode="numeric"
                min={MIN}
                max={MAX}
                value={qty}
                aria-label="Nombre de boîtes"
                onChange={(e) => {
                  const v = Number.parseInt(e.target.value, 10);
                  onQty(Number.isFinite(v) ? Math.min(MAX, Math.max(MIN, v)) : MIN);
                }}
              />
              <button type="button" className="stepper__btn" onClick={() => onQty(Math.min(MAX, qty + 1))} disabled={qty >= MAX} aria-label="Une boîte de plus">
                <Plus aria-hidden="true" />
              </button>
            </div>
            <p className="order__total">
              {qty} {qty > 1 ? "boîtes" : "boîte"}
              {total != null ? (
                <>
                  {" "}
                  · total indicatif <strong>{fcfa(total)} {SITE.currency}</strong>
                </>
              ) : (
                " · prix communiqué sur WhatsApp"
              )}
            </p>
          </div>

          <div className="order__step order__step--send" data-reveal="0.16">
            <p className="order__stepTitle">
              <span className="order__num">3</span> WhatsApp
            </p>
            <pre className="order__preview" aria-label="Aperçu du message">
              {message}
            </pre>
            {canOrder(product) ? (
              <a className="pill order__cta" href={link} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" />
                Commander sur WhatsApp
              </a>
            ) : (
              <button type="button" className="pill order__cta" disabled>
                <MessageCircle aria-hidden="true" />
                Goût indisponible
              </button>
            )}
            <p className="order__hint">
              {canOrder(product)
                ? `WhatsApp s'ouvre avec le ${SITE.phoneDisplay} et ce message. Tu vérifies, tu envoies : rien ne part sans toi.`
                : "Ce goût est indisponible pour le moment : choisis-en un autre ci-dessus, ou écris-nous pour connaître sa date de retour."}
            </p>
            <div className="order__fallback">
              <span className="aside">WhatsApp ne s'ouvre pas ?</span>
              <button type="button" className="pill pill--ghost pill--small" onClick={copy}>
                <Copy aria-hidden="true" />
                {copied === "ok" ? "Message copié" : copied === "fail" ? "Copie impossible" : "Copier le message"}
              </button>
              <a className="pill pill--ghost pill--small" href={telLink}>
                <Phone aria-hidden="true" />
                Appeler le {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
