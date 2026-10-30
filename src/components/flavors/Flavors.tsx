import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import Can from "../product/Can";
import Sparkle from "../brand/Sparkle";
import { FAMILIES, PRODUCTS, byId, fcfa, gradient, level, nowrapHyphens, type Family } from "../../data/products";
import { SITE } from "../../data/site";
import { gsap, reducedMotion } from "../../lib/motion";
import "./flavors.css";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  onOrder: () => void;
}

const ORDER: Family[] = ["fruit", "neutre", "menthe", "glace"];

function useStageSize(): number {
  // valeur fixe au pré-rendu et à l'hydratation, puis mesure réelle
  const [w, setW] = useState(1200);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  // plafonné à 320 px CSS : le visuel source fait 300 px, le halo et les lignes de rappel portent l'échelle
  if (w < 760) return Math.round(Math.min(w * 0.6, 300));
  return 320;
}

/** La scène des goûts : le choix prend la lumière, la boîte change, le bouton de commande suit. */
export default function Flavors({ selectedId, onSelect, onOrder }: Props) {
  const product = byId(selectedId);
  const ref = useRef<HTMLElement>(null);
  const size = useStageSize();
  const [layer, setLayer] = useState(0);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const first = useRef(true);

  // fondu enchaîné de la lumière du goût
  useEffect(() => {
    const next = 1 - layer;
    const a = layers.current[layer];
    const b = layers.current[next];
    if (!a || !b) return;
    if (first.current) {
      first.current = false;
      a.style.background = gradient(product);
      gsap.set(a, { opacity: 1 });
      gsap.set(b, { opacity: 0 });
      return;
    }
    b.style.background = gradient(product);
    if (reducedMotion()) {
      gsap.set(b, { opacity: 1 });
      gsap.set(a, { opacity: 0 });
    } else {
      gsap.to(b, { opacity: 1, duration: 1.1, ease: "power2.inOut" });
      gsap.to(a, { opacity: 0, duration: 1.1, ease: "power2.inOut" });
    }
    setLayer(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // lignes de rappel tracées à chaque changement
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const lines = ref.current!.querySelectorAll<SVGPathElement>(".leaders path");
      const labels = ref.current!.querySelectorAll(".flavors__tag");
      gsap.fromTo(lines, { strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.25 });
      gsap.fromTo(labels, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.08, delay: 0.6 });
    },
    { scope: ref, dependencies: [selectedId] },
  );

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = PRODUCTS.findIndex((p) => p.id === selectedId);
    let n = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % PRODUCTS.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + PRODUCTS.length) % PRODUCTS.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = PRODUCTS.length - 1;
    onSelect(PRODUCTS[n].id);
    ref.current?.querySelector<HTMLButtonElement>(`#gout-${PRODUCTS[n].id}`)?.focus();
  };

  const dots = Math.max(1, Math.min(5, Math.round(product.dose / 4)));

  return (
    <section ref={ref} className="flavors scene" id="gouts" data-cue="gouts" aria-labelledby="gouts-title">
      <div className="wrap">
        <div className="flavors__head">
          <h2 className="title" id="gouts-title" data-reveal>
            Les goûts
          </h2>
          <p className="aside flavors__note" data-reveal="0.1">
            ( choisis, la lumière suit )
          </p>
        </div>

        <div className="flavors__grid">
          <div className="flavors__tabs" role="radiogroup" aria-label="Choisir un goût" data-reveal="0.1">
            {ORDER.map((fam) => (
              <div key={fam} className="flavors__group">
                <p className="label flavors__family">{FAMILIES[fam]}</p>
                {PRODUCTS.filter((p) => p.family === fam).map((p) => {
                  const on = p.id === selectedId;
                  return (
                    <button
                      key={p.id}
                      id={`gout-${p.id}`}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      tabIndex={on ? 0 : -1}
                      className="flavors__tab"
                      data-focus={on ? "" : undefined}
                      onClick={() => onSelect(p.id)}
                      onKeyDown={onKey}
                    >
                      <span className="flavors__tabName">{nowrapHyphens(p.name)}</span>
                      <span className="flavors__tabMeta">
                        {p.brand} · {p.dose} mg/g
                        {!p.available && " · indisponible"}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flavors__stage" aria-hidden="true">
            <div className="flavors__spot">
              <div
                ref={(el) => {
                  layers.current[0] = el;
                }}
                className="flavors__light"
              />
              <div
                ref={(el) => {
                  layers.current[1] = el;
                }}
                className="flavors__light"
              />
            </div>
            <div className="flavors__can" key={product.id}>
              <Can product={product} size={size} duration={36} interactive />
            </div>
            <svg className="leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path className="leaders__brand" d="M27 40 L16 26" />
              <path d="M82 49 L91 39" />
              <path d="M31 66 L23 81" />
            </svg>
            <span className="flavors__tag flavors__tag--brand">{product.brand}</span>
            <span className="flavors__tag flavors__tag--dose">
              {product.dose} mg/g · {level(product.dose)}
            </span>
            <span className="flavors__tag flavors__tag--price">{product.price != null ? `${fcfa(product.price)} ${SITE.currency}` : "Prix sur WhatsApp"}</span>
          </div>

          <div className="flavors__info" aria-live="polite">
            <p className="label flavors__brand">{product.brand}</p>
            <h3 className="flavors__name">{nowrapHyphens(product.name)}</h3>
            <p className="flavors__flavor">
              <Sparkle />
              {product.flavor}
            </p>
            <div className="flavors__dose">
              <span className="label label--big">{product.dose}</span>
              <span className="flavors__unit">
                mg/g
                <br />
                {level(product.dose)}
              </span>
              <span className="flavors__dots" role="img" aria-label={`Intensité ${dots} sur 5`}>
                <span className="flavors__dotsLabel" aria-hidden="true">
                  intensité
                </span>
                {[0, 1, 2, 3, 4].map((i) => (
                  <i key={i} data-on={i < dots || undefined} />
                ))}
              </span>
            </div>
            <p className="flavors__desc">{product.description}</p>
            <p className="label label--big flavors__price">{product.price != null ? `${fcfa(product.price)} ${SITE.currency}` : "Prix sur WhatsApp"}</p>
            {product.available ? (
              <button type="button" className="pill flavors__order" onClick={onOrder}>
                Commander ce goût
                <ArrowRight aria-hidden="true" />
              </button>
            ) : (
              <p className="flavors__off">Indisponible pour le moment. Choisis un autre goût ou demande sa date de retour sur WhatsApp.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
