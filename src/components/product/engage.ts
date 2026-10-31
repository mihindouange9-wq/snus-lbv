/**
 * Le rendu 3D (Three.js, ~130 Ko compressés, compilation de shaders) démarre dès que la page est chargée et que le
 * navigateur a un instant de libre, ou plus tôt encore au premier geste du visiteur. Le module est préchargé par
 * index.html (modulepreload) pour arriver avec le reste. Le rendu 2D est affiché pendant ce temps : rien n'est vide.
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
    const after = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle(go, { timeout: 400 });
      else setTimeout(go, 120);
    };
    if (document.readyState === "complete") after();
    else window.addEventListener("load", after, { once: true });
  });
  return engaged;
}
