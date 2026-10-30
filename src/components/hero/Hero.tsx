import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";
import Wordmark from "../brand/Wordmark";
import Can from "../product/Can";
import { byId } from "../../data/products";
import { gsap, ScrollTrigger, reducedMotion } from "../../lib/motion";
import { SITE } from "../../data/site";
import "./hero.css";

const MAIN = byId("velo-fp");
const LEFT = byId("zyn-bc");
const BACK = byId("ns-fm");

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const root = ref.current!;
      const glyphs = root.querySelectorAll(".hero__mark .wm__g");
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      // le texte est déjà peint (pré-rendu) : seuls le mot-symbole et les boîtes entrent
      tl.fromTo(glyphs, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, stagger: 0.055 }, 0.1)
        .fromTo(".hero__can--main", { y: 70, scale: 1.06 }, { y: 0, scale: 1, duration: 1.6, ease: "expo.out" }, 0.2)
        .fromTo([".hero__can--left", ".hero__can--back"], { y: 50, scale: 1.04 }, { y: 0, scale: 1, duration: 1.4, stagger: 0.12 }, 0.4);

      // matière vivante : la nappe glisse en diagonale, le point chaud parcourt les lettres (lentement, sans à-coups)
      root.querySelectorAll<SVGLinearGradientElement>(".wm__base").forEach((grad, i) => {
        const x1 = Number(grad.getAttribute("x1"));
        const x2 = Number(grad.getAttribute("x2"));
        const span = x2 - x1;
        gsap.to(grad, { attr: { x1: x1 - span * 1.2, x2: x2 - span * 1.2 }, duration: 16 + i * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
      root.querySelectorAll<SVGRadialGradientElement>(".wm__hot").forEach((grad, i) => {
        const cx = Number(grad.getAttribute("cx"));
        const cy = Number(grad.getAttribute("cy"));
        const r = Number(grad.getAttribute("r"));
        gsap.to(grad, { attr: { cx: cx + r * 2.1 }, duration: 11 + i * 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(grad, { attr: { cy: cy - r * 0.7 }, duration: 7 + i, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(grad, { attr: { r: r * 1.35 }, duration: 9 + i * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });

      // le hero s'efface sans disparaître, la boîte principale monte vers l'étagère de la collection
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.8 } })
        .to(".hero__mark", { yPercent: -18, scale: 0.96, opacity: 0.35, transformOrigin: "50% 0%", ease: "none" }, 0)
        .to(".hero__can--main", { y: -160, scale: 0.8, ease: "none" }, 0)
        .to(".hero__can--left", { y: -60, ease: "none" }, 0)
        .to(".hero__can--back", { y: -220, ease: "none" }, 0)
        .to(".hero__text", { y: -40, opacity: 0.2, ease: "none" }, 0);

      return () => ScrollTrigger.getAll().forEach((t) => t.trigger === root && t.kill());
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="hero scene" id="haut" data-cue="hero" aria-labelledby="hero-title">
      <div className="wrap hero__wrap">
        <p className="hero__ageTop aside" aria-hidden="true">
          18+ · Réservé aux adultes
        </p>
        <h1 className="hero__title" id="hero-title">
          <span className="sr-only">SNUS LBV, pouches de nicotine à {SITE.city}</span>
          <Wordmark className="hero__mark hero__mark--line" shadow live />
          <Wordmark className="hero__mark hero__mark--stack" stacked shadow live />
        </h1>

        <div className="hero__body">
          <div className="hero__text">
            <p className="lead hero__lead">
              Pouches de nicotine, sans tabac. Neuf goûts, du plus léger au plus fort, livrés à {SITE.city}.
            </p>
            <div className="hero__actions">
              <a href="#gouts" className="pill">
                Découvrir les goûts
                <ArrowDown aria-hidden="true" />
              </a>
              <a href="#commander" className="pill pill--ghost">
                Commander sur WhatsApp
              </a>
            </div>
            <p className="hero__age aside">18+ · Réservé aux adultes · La nicotine crée une forte dépendance.</p>
          </div>

          <div className="hero__stage" aria-hidden="true">
            <div className="hero__can hero__can--back">
              <Can product={BACK} size={200} phase={11} duration={38} />
            </div>
            <div className="hero__can hero__can--left">
              <Can product={LEFT} size={170} phase={5} duration={36} />
            </div>
            <div className="hero__can hero__can--main">
              <Can product={MAIN} size={320} priority duration={34} interactive />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
