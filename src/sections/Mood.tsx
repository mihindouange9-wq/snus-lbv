import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "../lib/motion";

/** Images d'ambiance fournies par le client (public/images/humeur), avec leurs dimensions réelles. */
const SHOTS: [file: string, w: number, h: number][] = [
  ["01", 736, 909],
  ["02", 382, 750],
  ["03", 735, 883],
  ["04", 736, 981],
  ["05", 736, 736],
  ["06", 736, 1089],
  ["07", 640, 640],
  ["08", 736, 920],
  ["09", 735, 925],
  ["10", 736, 939],
  ["11", 235, 322],
];
const TILT = [-6, 4, -3, 7, -5, 3, -7, 5, -2, 6, -4];

/**
 * Humeur : les images tombent une à une sur la pile au rythme du défilement ; celle du dessous recule, les plus
 * anciennes s'effacent. Sans JavaScript ou en mouvement réduit, la même suite se feuillette à l'horizontale.
 */
export default function Mood() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      if (!el || reducedMotion()) return;
      el.classList.add("is-live");
      const cards = gsap.utils.toArray<HTMLElement>(".mood__card", el);
      const count = el.querySelector<HTMLElement>(".mood__count b");
      gsap.set(cards[0], { rotate: TILT[0] });
      const tl = gsap.timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (count) count.textContent = String(Math.min(cards.length, 1 + Math.round(self.progress * (cards.length - 1))));
          },
        },
      });
      for (let i = 1; i < cards.length; i++) {
        tl.fromTo(cards[i], { y: () => window.innerHeight * 1.3, rotate: TILT[i] * 3.5, scale: 1.14 }, { y: 0, rotate: TILT[i], scale: 1, ease: "power2.out" }, i - 1);
        tl.to(cards[i - 1], { scale: 0.92, ease: "none" }, i - 1);
        if (i >= 3) tl.to(cards[i - 3], { autoAlpha: 0, duration: 0.5, ease: "none" }, i - 0.5);
      }
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        el.classList.remove("is-live");
      };
    },
    { scope: root },
  );
  return (
    <section ref={root} className="mood" aria-labelledby="mood-title">
      <div className="mood__pin">
        <h2 id="mood-title" className="display mood__word">
          Humeur
        </h2>
        <ul className="mood__pile">
          {SHOTS.map(([file, w, h]) => (
            <li key={file} className="mood__card">
              <img src={`/images/humeur/${file}.jpg`} alt="" width={w} height={h} loading="lazy" decoding="async" draggable={false} />
            </li>
          ))}
        </ul>
        <p className="label mood__count" aria-hidden="true">
          <b className="num">1</b> / {SHOTS.length}
        </p>
      </div>
    </section>
  );
}
