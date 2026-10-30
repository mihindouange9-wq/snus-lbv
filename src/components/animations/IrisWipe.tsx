import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reducedMotion } from "../../lib/motion";
import "./iris.css";

interface Props {
  /** Couleur du cercle qui s'ouvre. */
  color: "jaune" | "orange" | "violet";
  /** Fond derrière le cercle : la scène nuit (transparent) ou la salle crème. */
  base?: "nuit" | "creme";
  /** Point d'origine du cercle, en pourcentage. */
  origin?: { x: number; y: number };
}

/**
 * Transition d'iris : en défilant, un disque de couleur s'ouvre et couvre l'écran, comme si l'on
 * traversait une surface colorée avant la scène suivante. Pas de pin GSAP : un simple sticky.
 */
export default function IrisWipe({ color, base = "nuit", origin = { x: 50, y: 50 } }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = ref.current!;
      const disc = wrap.querySelector<HTMLElement>(".iris__disc")!;
      if (reducedMotion()) {
        gsap.set(disc, { "--r": "120%" });
        return;
      }
      let st: ScrollTrigger | undefined;
      const r1 = requestAnimationFrame(() => {
        const tween = gsap.fromTo(disc, { "--r": "0%" }, { "--r": "120%", ease: "none" });
        st = ScrollTrigger.create({ trigger: wrap, start: "top 85%", end: "bottom bottom", scrub: 0.6, animation: tween });
      });
      return () => {
        cancelAnimationFrame(r1);
        st?.kill();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`iris iris--${base}`} aria-hidden="true">
      <div className="iris__sticky">
        <div className={`iris__disc iris__disc--${color}`} style={{ "--ox": `${origin.x}%`, "--oy": `${origin.y}%` }} />
      </div>
    </div>
  );
}
