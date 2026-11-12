import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { PRODUCTS, fcfa, level, nowrapHyphens, type Family } from "../data/products";
import { SITE } from "../data/site";
import { gsap, reducedMotion } from "../lib/motion";
import Wordmark from "./Wordmark";
import { Arrow, Chevron } from "./Icons";

const N = PRODUCTS.length;
/** Images de fond de la scène (public/images/fond), déjà passées aux deux tons de la charte : [fichier, hauteur pour 480 de large]. */
const FOND: [string, number][] = [
  ["01", 678],
  ["02", 640],
  ["03", 637],
  ["04", 600],
];
const COLONNES = [
  [0, 1, 2, 3],
  [2, 3, 0, 1],
  [1, 0, 3, 2],
  [3, 2, 1, 0],
];
/** Couleur du plateau sous la boîte active : chaud pour le fruit, neutre pour le neutre, frais pour les menthes. */
const TONE: Record<Family, string> = { fruit: "tangelo", neutre: "linen", menthe: "botticelli", glace: "botticelli" };

interface Props {
  /** Le visiteur commande le goût affiché : c'est le seul moment où la roue choisit à sa place. */
  onOrder: (id: string) => void;
}

/**
 * Scène d'accueil : mot-symbole pleine largeur, bandeau, puis la roue des neuf boîtes.
 * La section est haute ; son contenu reste collé à l'écran (position: sticky, défilement natif) et le défilement
 * fait tourner la roue, du goût le plus léger au plus fort.
 */
export default function Stage({ onOrder }: Props) {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const live = useRef({ p: 0, idx: 0, gap: 220 });
  const paint = useRef<(p: number) => void>(() => {});

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const cans = gsap.utils.toArray<HTMLElement>(".wheel__can", el);
      const state = live.current;
      const render = (p: number) => {
        state.p = p;
        for (let i = 0; i < cans.length; i++) {
          const d = i - p;
          const a = Math.abs(d);
          const can = cans[i];
          if (a > 2.3) {
            can.style.visibility = "hidden";
            continue;
          }
          const k = Math.min(a, 1);
          can.style.visibility = "visible";
          can.style.opacity = String(1 - k * 0.66);
          can.style.transform = `translate3d(0,${(d * state.gap).toFixed(1)}px,0) scale(${(1 - k * 0.52).toFixed(3)}) rotate(${(d * -150).toFixed(1)}deg)`;
        }
        const near = Math.max(0, Math.min(N - 1, Math.round(p)));
        if (near !== state.idx) {
          state.idx = near;
          setIdx(near);
        }
      };
      paint.current = render;
      const measure = () => {
        const can = cans[0]?.offsetWidth ?? 230;
        const wheel = el.querySelector<HTMLElement>(".wheel");
        // les voisines restent visibles aux quatre cinquièmes, même sur un écran court
        state.gap = Math.min(can * 1.05, (wheel?.offsetHeight ?? can * 2.4) / 2 - can * 0.144);
        render(state.p);
      };
      measure();
      window.addEventListener("resize", measure);
      if (reducedMotion()) return () => window.removeEventListener("resize", measure);

      // entrée : le mot-symbole monte dans son masque, le bandeau s'étire, la roue arrive par le bas
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .from(".stage__mark", { yPercent: 105, duration: 1.2 })
        .from(".stage__bar", { scaleX: 0, duration: 0.9 }, 0.25)
        .from(".stage__bar > *", { autoAlpha: 0, duration: 0.5 }, 0.75)
        .from(".wheel", { yPercent: 28, autoAlpha: 0, duration: 1.2 }, 0.35)
        .from(".stage__info", { y: 30, autoAlpha: 0, duration: 0.9 }, 0.6);

      const proxy = { p: 0 };
      const tween = gsap.to(proxy, {
        p: N - 1,
        ease: "none",
        onUpdate: () => render(proxy.p),
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          snap: { snapTo: 1 / (N - 1), duration: { min: 0.18, max: 0.5 }, delay: 0.08, ease: "power2.out", inertia: false, directional: false },
        },
      });
      return () => {
        window.removeEventListener("resize", measure);
        tween.scrollTrigger?.kill();
        tween.kill();
        intro.kill();
      };
    },
    { scope: root },
  );

  const goTo = (i: number) => {
    const el = root.current;
    const target = Math.max(0, Math.min(N - 1, i));
    if (!el) return;
    if (reducedMotion()) {
      paint.current(target);
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (target / (N - 1)) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  /** Toucher la boîte active la fait tourner sur elle-même. */
  const spin = (button: HTMLElement) => {
    const img = button.querySelector("img");
    if (!img || reducedMotion()) return;
    gsap.fromTo(img, { rotate: 0, scale: 0.9 }, { rotate: 360, scale: 1, duration: 1.1, ease: "expo.out", overwrite: true });
  };

  const p = PRODUCTS[idx];

  return (
    <section ref={root} className="stage" id="gouts" aria-label="Les neuf goûts">
      <div className="stage__pin" data-tone={TONE[p.family]}>
        <div className="stage__bg" aria-hidden="true">
          {COLONNES.map((col, c) => (
            <div key={c} className="stage__col">
              {[...col, ...col].map((k, i) => (
                <img key={i} src={`/images/fond/${FOND[k][0]}.webp`} alt="" width={480} height={FOND[k][1]} loading={c < 2 ? "eager" : "lazy"} decoding="async" draggable={false} />
              ))}
            </div>
          ))}
        </div>
        <header className="stage__head">
          <div className="stage__top">
            <h1 className="stage__h1">
              <span className="stage__clip">
                <Wordmark className="stage__mark" title={`${SITE.name}, pouches de nicotine à ${SITE.city}`} />
              </span>
            </h1>
            <p className="label stage__where">
              Pouches de nicotine
              <br />
              {SITE.city}
            </p>
          </div>
          <nav className="stage__bar on-clair" aria-label="Navigation">
            <span className="stage__links">
              <a href="#gouts">Goûts</a>, <a href="#commander">Commander</a>
            </span>
            <a className="stage__tel" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </nav>
        </header>

        <div className="wheel">
          <span className="wheel__plate" key={p.family} aria-hidden="true" />
          <span className="wheel__line" aria-hidden="true" />
          <p className="wheel__meta wheel__meta--l">
            <span className="num">{p.dose}</span> mg/g
          </p>
          <p className="wheel__meta wheel__meta--r">{p.price != null ? `${fcfa(p.price)} ${SITE.currency}` : "Prix sur demande"}</p>
          <ul className="wheel__cans">
            {PRODUCTS.map((q, i) => (
              <li
                key={q.id}
                className="wheel__can"
                style={{
                  transform: i === 0 ? undefined : `translate3d(0,calc(var(--can) * ${0.96 * i}),0) scale(0.48)`,
                  opacity: i === 0 ? 1 : 0.34,
                  visibility: i > 2 ? "hidden" : undefined,
                }}
              >
                <button type="button" aria-label={i === idx ? `${q.brand} ${q.name}, faire tourner la boîte` : `Voir ${q.brand} ${q.name}`} aria-current={i === idx ? "true" : undefined} onClick={(e) => (i === idx ? spin(e.currentTarget) : goTo(i))}>
                  <img src={q.image} alt={`Boîte ${q.brand} ${q.name}`} width={300} height={300} loading={i < 3 ? "eager" : "lazy"} decoding="async" draggable={false} />
                </button>
              </li>
            ))}
          </ul>
          <div className="wheel__nav">
            <button type="button" onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Goût précédent">
              <Chevron up />
            </button>
            <button type="button" onClick={() => goTo(idx + 1)} disabled={idx === N - 1} aria-label="Goût suivant">
              <Chevron />
            </button>
          </div>
        </div>

        <div className="stage__info">
          <div className="stage__text" key={p.id} aria-live="polite">
            <p className="label stage__brand">
              {p.brand} · {p.flavor}
            </p>
            <h2 className="display stage__name">{nowrapHyphens(p.name)}</h2>
            <p className="stage__desc">{p.description}</p>
          </div>
          <div className="stage__scale" role="img" aria-label={`Intensité : ${level(p.dose)}, goût ${idx + 1} sur ${N} du plus léger au plus fort`}>
            {PRODUCTS.map((q, i) => (
              <i key={q.id} className={i <= idx ? "is-on" : undefined} />
            ))}
            <span className="label">{level(p.dose)}</span>
          </div>
          <button type="button" className="btn stage__cta" onClick={() => onOrder(p.id)}>
            Commander ce goût
            <Arrow />
          </button>
        </div>

        <ol className="stage__list" aria-label="Tous les goûts">
          {PRODUCTS.map((q, i) => (
            <li key={q.id}>
              <button type="button" className={i === idx ? "is-on" : undefined} onClick={() => goTo(i)}>
                {q.brand} {nowrapHyphens(q.name)}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

