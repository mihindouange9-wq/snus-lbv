import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "../lib/motion";
import { PRODUCTS } from "../data/products";

const doses = PRODUCTS.map((p) => p.dose);
const TEXT = `Neuf boîtes, de ${Math.min(...doses)} à ${Math.max(...doses)} mg/g. Tu choisis ton goût, tu règles la quantité, WhatsApp fait le reste.`;

/** Manifeste : la phrase se remplit mot à mot à mesure qu'on la fait défiler. */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const words = gsap.utils.toArray<HTMLElement>(".manifesto__w", root.current);
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        { opacity: 1, ease: "none", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 78%", end: "bottom 62%", scrub: 0.4 } },
      );
    },
    { scope: root },
  );
  return (
    <section ref={root} className="manifesto on-clair" aria-label="En une phrase">
      <p className="display manifesto__text">
        {TEXT.split(" ").map((w, i) => (
          <span key={i} className="manifesto__w">
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
