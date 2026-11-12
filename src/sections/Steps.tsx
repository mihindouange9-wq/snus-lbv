import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "../lib/motion";
import { PRODUCTS } from "../data/products";
import { SITE } from "../data/site";

const doses = PRODUCTS.map((p) => p.dose);
const STEPS = [
  { word: "Voir", tone: "botticelli", text: `Neuf boîtes rangées du plus léger (${Math.min(...doses)} mg/g) au plus fort (${Math.max(...doses)} mg/g).`, can: 1 },
  { word: "Choisir", tone: "linen", text: "Un goût à la fois : fruit, neutre, menthe ou glace.", can: 4 },
  { word: "Régler", tone: "tangelo", text: "La quantité, de 1 à 20 boîtes. Le total indicatif s'affiche.", can: 7 },
  { word: "Envoyer", tone: "chocolat", text: `WhatsApp s'ouvre avec ton message prêt. Tu l'envoies toi-même, le vendeur confirme la livraison à ${SITE.city}.`, can: 8 },
] as const;

/** Quatre gestes : quatre panneaux pleine hauteur qui s'empilent ; celui du dessous recule quand le suivant le recouvre. */
export default function Steps() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const panels = gsap.utils.toArray<HTMLElement>(".step", root.current);
      panels.forEach((panel, i) => {
        const inner = panel.querySelector<HTMLElement>(".step__in");
        const can = panel.querySelector<HTMLElement>(".step__can");
        if (can) gsap.fromTo(can, { rotate: -70, yPercent: 30 }, { rotate: 50, yPercent: -12, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 0.5 } });
        const next = panels[i + 1];
        if (inner && next) gsap.to(inner, { scale: 0.88, yPercent: -4, ease: "none", transformOrigin: "50% 0%", scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="steps" aria-labelledby="steps-title">
      <h2 id="steps-title" className="sr">
        Commander en quatre gestes
      </h2>
      <ol className="steps__list">
        {STEPS.map((s, i) => (
          <li key={s.word} className={`step step--${s.tone}${s.tone === "chocolat" ? "" : " on-clair"}`}>
            <div className="step__in">
              <p className="label step__count">
                Geste {i + 1} sur {STEPS.length}
              </p>
              <h3 className="display step__word">{s.word}</h3>
              <p className="step__text">{s.text}</p>
              <img className="step__can" src={PRODUCTS[s.can].image} alt="" width={300} height={300} loading="lazy" decoding="async" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
