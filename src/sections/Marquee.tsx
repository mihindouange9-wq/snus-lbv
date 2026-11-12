import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reducedMotion } from "../lib/motion";
import { SITE } from "../data/site";
import { PRODUCTS } from "../data/products";
import { Star } from "./Icons";

const WORDS = [`Livré à ${SITE.city}`, "Commande sur WhatsApp", `${PRODUCTS.length} goûts`, "Nique ta mère si t'es pas majeur"];

/** Bandeau défilant : avance tout seul, s'incline et accélère avec la vitesse du défilement. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reducedMotion() || !root.current) return;
      const track = root.current.querySelector<HTMLElement>(".marquee__track");
      if (!track) return;
      const loop = gsap.to(track, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
      const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
      // retour au calme un quart de seconde après le dernier mouvement (aucune horloge permanente)
      const calm = gsap.delayedCall(0.25, () => {
        skew(0);
        gsap.to(loop, { timeScale: 1, duration: 0.8, overwrite: true });
      });
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-1800, 1800, self.getVelocity());
          skew(v / -110);
          gsap.to(loop, { timeScale: 1 + Math.abs(v) / 500, duration: 0.3, overwrite: true });
          calm.restart(true);
        },
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });
      return () => {
        calm.kill();
        st.kill();
        loop.kill();
      };
    },
    { scope: root },
  );
  const row = (hidden: boolean) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {WORDS.map((w) => (
        <li key={w} className="display">
          {w}
          <Star />
        </li>
      ))}
    </ul>
  );
  return (
    <div ref={root} className="marquee on-clair">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
