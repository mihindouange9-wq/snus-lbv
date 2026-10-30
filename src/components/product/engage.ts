/**
 * Le rendu 3D (Three.js, ~130 Ko compressés, compilation de shaders) ne se charge qu'une fois le visiteur engagé :
 * premier geste (défilement, toucher, pointeur, clavier) ou, à défaut, quelques secondes après le chargement.
 * Le rendu 2D est affiché pendant ce temps : rien n'est vide, et la première interaction n'est jamais bloquée.
 */
let engaged: Promise<void> | null = null;

export function whenEngaged(): Promise<void> {
  if (engaged) return engaged;
  engaged = new Promise<void>((resolve) => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      for (const t of EVENTS) window.removeEventListener(t, go);
      // on laisse encore une image au navigateur avant d'importer le module
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle(() => resolve(), { timeout: 1500 });
      else setTimeout(resolve, 200);
    };
    const EVENTS = ["pointerdown", "pointermove", "touchstart", "wheel", "scroll", "keydown"] as const;
    for (const t of EVENTS) window.addEventListener(t, go, { passive: true, once: true });
    const after = () => setTimeout(go, 14000);
    if (document.readyState === "complete") after();
    else window.addEventListener("load", after, { once: true });
  });
  return engaged;
}
