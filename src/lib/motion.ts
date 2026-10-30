import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const reducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const coarsePointer = (): boolean => window.matchMedia("(pointer: coarse)").matches;

/** Défilement vers une scène, en respectant la préférence de mouvement. */
export function scrollToId(id: string, focus = false): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  if (focus) {
    const target = el.querySelector<HTMLElement>("[data-focus]");
    if (!target) return;
    // un élément encore masqué par sa révélation ne peut pas recevoir le focus : on termine sa révélation
    // (la tween est amenée à sa fin, elle ne redémarrera pas quand l'observateur la verra entrer)
    let holder: HTMLElement | null = target.closest<HTMLElement>("[data-reveal]");
    while (holder) {
      const tween = (holder as RevealHost).__reveal;
      if (tween) tween.progress(1);
      else gsap.set(holder, { autoAlpha: 1, y: 0, clipPath: "none" });
      holder = holder.parentElement?.closest<HTMLElement>("[data-reveal]") ?? null;
    }
    target.focus({ preventScroll: true });
  }
}

type RevealHost = HTMLElement & { __reveal?: gsap.core.Tween };

/**
 * Révélations au défilement : tout élément portant data-reveal (valeur = délai en secondes) monte
 * et apparaît une seule fois. Sans JS ou en mouvement réduit, tout reste visible.
 */
export function initReveals(root: ParentNode): () => void {
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (!items.length || reducedMotion()) return () => {};
  const triggers: ScrollTrigger[] = [];
  const tweens = new Map<Element, gsap.core.Tween>();
  // second déclencheur, indépendant des positions calculées par ScrollTrigger (les scènes en content-visibility
  // changent de hauteur en s'approchant) : dès qu'un élément entre réellement dans la fenêtre, il se révèle
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        tweens.get(e.target)?.play();
        io.unobserve(e.target);
      }
    },
    { threshold: 0.02 },
  );
  for (const el of items) {
    const delay = Number(el.dataset.reveal || 0);
    // les titres de scène sortent d'un masque typographique ; le reste monte en fondu
    const tween = el.classList.contains("title")
      ? gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)", y: 40 }, { clipPath: "inset(0 0 -10% 0)", y: 0, duration: 1.3, ease: "expo.out", delay, paused: true })
      : gsap.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.15, ease: "expo.out", delay, paused: true });
    tweens.set(el, tween);
    (el as RevealHost).__reveal = tween;
    io.observe(el);
    triggers.push(ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => tween.play() }));
  }
  // filet de sécurité : rien ne doit rester masqué
  const safety = window.setTimeout(() => {
    for (const el of items) {
      const cs = getComputedStyle(el);
      if (cs.opacity === "0" || cs.clipPath.includes("100%")) gsap.set(el, { autoAlpha: 1, y: 0, clipPath: "none" });
    }
  }, 6000);
  return () => {
    triggers.forEach((t) => t.kill());
    io.disconnect();
    window.clearTimeout(safety);
  };
}
