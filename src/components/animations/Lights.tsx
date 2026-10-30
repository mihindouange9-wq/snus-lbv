import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reducedMotion, coarsePointer } from "../../lib/motion";
import "./lights.css";

interface GelPos {
  x: number;
  y: number;
  s: number;
  o: number;
}
type Cue = [GelPos, GelPos, GelPos]; // orange, jaune, violet

/** Conduite lumière : une position par scène (data-cue), en pourcentage de la fenêtre. */
const CUES: Record<string, Cue> = {
  hero: [
    { x: 22, y: 30, s: 1.35, o: 0.95 },
    { x: 84, y: 22, s: 0.75, o: 0.7 },
    { x: 72, y: 96, s: 1.15, o: 0.85 },
  ],
  collection: [
    { x: 88, y: 18, s: 0.9, o: 0.7 },
    { x: 48, y: 110, s: 0.9, o: 0.6 },
    { x: 8, y: 40, s: 1.3, o: 0.9 },
  ],
  gouts: [
    { x: 10, y: 90, s: 0.8, o: 0.45 },
    { x: 92, y: 80, s: 0.6, o: 0.4 },
    { x: 60, y: 10, s: 0.9, o: 0.5 },
  ],
  salle: [
    { x: 50, y: 50, s: 0.6, o: 0 },
    { x: 50, y: 50, s: 0.6, o: 0 },
    { x: 50, y: 50, s: 0.6, o: 0 },
  ],
  commander: [
    { x: 14, y: 96, s: 1.1, o: 0.7 },
    { x: 86, y: 14, s: 1.05, o: 0.85 },
    { x: 30, y: 20, s: 1.2, o: 0.8 },
  ],
  footer: [
    { x: 80, y: 100, s: 0.9, o: 0.5 },
    { x: 20, y: 110, s: 0.6, o: 0.35 },
    { x: 50, y: 95, s: 1.1, o: 0.6 },
  ],
};

/**
 * Trois projecteurs de couleur sur fond nuit. Chaque scène portant data-cue déplace les gels en fondu ;
 * le pointeur (ordinateur) les fait dériver légèrement et alimente --px/--py pour les reflets des boîtes.
 */
export default function Lights() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const gels = Array.from(root.querySelectorAll<HTMLElement>(".gel"));
      const reduced = reducedMotion();
      const apply = (name: string) => {
        const cue = CUES[name];
        if (!cue) return;
        cue.forEach((g, i) => {
          const el = gels[i];
          if (reduced) gsap.set(el, { left: `${g.x}%`, top: `${g.y}%`, scale: g.s, opacity: g.o });
          else gsap.to(el, { left: `${g.x}%`, top: `${g.y}%`, scale: g.s, opacity: g.o, duration: 1.8, ease: "power2.inOut", overwrite: "auto" });
        });
      };
      // la conduite « hero » est la position de départ en CSS ; le reste attend que la première image soit peinte
      let cleanup: (() => void) | undefined;
      let r1 = 0;
      let r2 = 0;
      r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => {
          cleanup = setup();
        });
      });
      const setup = () => {
      const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-cue]"));
      const triggers = scenes.map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) apply(el.dataset.cue!);
          },
        }),
      );

      if (reduced) return () => triggers.forEach((t) => t.kill());

      // dérive lente, toujours en vie
      gels.forEach((el, i) => {
        gsap.to(el, { xPercent: i % 2 ? 5 : -5, yPercent: i === 1 ? -4 : 4, duration: 9 + i * 2.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      // sillage du pointeur
      if (!coarsePointer()) {
        const inner = root.querySelector<HTMLElement>(".lights__inner")!;
        const xTo = gsap.quickTo(inner, "x", { duration: 1.2, ease: "power3.out" });
        const yTo = gsap.quickTo(inner, "y", { duration: 1.2, ease: "power3.out" });
        let raf = 0;
        const onMove = (e: PointerEvent) => {
          const px = e.clientX / window.innerWidth;
          const py = e.clientY / window.innerHeight;
          xTo((px - 0.5) * 70);
          yTo((py - 0.5) * 50);
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            document.documentElement.style.setProperty("--px", px.toFixed(3));
            document.documentElement.style.setProperty("--py", py.toFixed(3));
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          window.removeEventListener("pointermove", onMove);
          cancelAnimationFrame(raf);
          triggers.forEach((t) => t.kill());
        };
      }
      return () => triggers.forEach((t) => t.kill());
      };
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
        cleanup?.();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="lights" aria-hidden="true">
      <div className="lights__inner">
        <i className="gel gel--orange" />
        <i className="gel gel--jaune" />
        <i className="gel gel--violet" />
      </div>
    </div>
  );
}
