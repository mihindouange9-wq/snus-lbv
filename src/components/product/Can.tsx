import { useEffect, useRef, type CSSProperties } from "react";
import type { Product } from "../../data/products";
import type { Can3DHandle } from "./can3d";
import { whenEngaged } from "./engage";
import "./can.css";

interface Props {
  product: Product;
  /** Diamètre en pixels CSS. */
  size: number;
  /** Inclinaison de la vue, en degrés (90 = vue de dessus). */
  tilt?: number;
  /** Durée d'un tour, en secondes. */
  duration?: number;
  /** Décalage de phase, en secondes, pour désynchroniser plusieurs boîtes. */
  phase?: number;
  spin?: boolean;
  /** Le pointeur ou le doigt fait tourner la boîte avec inertie ; le survol la ralentit. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}

const GELS = { orange: "255, 90, 31", jaune: "248, 255, 50", violet: "121, 40, 255" };
const H_RATIO = 0.34; // hauteur de la boîte par rapport au diamètre
const SLICES = 28; // tranches du flanc dessinées par image (rendu 2D)

/**
 * Boîte de snus. Rendu 3D WebGL (can3d.ts : géométrie réelle, matériaux physiques, studio) chargé à la demande ;
 * en attendant, ou sans WebGL, rendu 2D canvas (couvercle réel incliné, flanc à bandeau, reflets des gels).
 * Rotation lente continue avec inertie et ralentissement à l'examen, légère variation d'angle selon le défilement,
 * pause hors écran, image fixe en mouvement réduit. L'<img> sert à la toute première peinture.
 */
export default function Can({ product, size, tilt = 62, duration = 32, phase = 0, spin = true, interactive = false, className = "", style, priority = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = ref.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const S = size;
    canvas.width = Math.round(S * dpr);
    canvas.height = Math.round(S * dpr);

    const img = new Image();
    img.decoding = "async";
    img.src = product.image;

    // géométrie du rendu 2D
    const rad0 = (tilt * Math.PI) / 180;
    const r = S * 0.47;
    const circ = 2 * Math.PI * r;

    // bandeau du flanc (partagé par les deux rendus) : texte de marque répété un nombre entier de fois
    const bandH = Math.max(8, S * H_RATIO);
    const band = document.createElement("canvas");
    band.width = Math.round(Math.max(circ * dpr, 1024));
    band.height = Math.round(Math.max(bandH * dpr, 128));
    const bctx = band.getContext("2d")!;
    const paintBand = () => {
      const W = band.width;
      const H = band.height;
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.fillStyle = product.side.body;
      bctx.fillRect(0, 0, W, H);
      const rim = Math.max(2, H * 0.09);
      bctx.fillStyle = product.side.rim;
      bctx.fillRect(0, 0, W, rim);
      bctx.fillRect(0, H - rim, W, rim);
      // Black Han Sans n'a ni accents ni point médian : texte sans diacritiques, séparé par des tirets
      const plain = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").replace(/·/g, "-");
      const text = plain(`${product.brand}  -  ${product.name.toUpperCase()}  -  ${product.dose} MG/G  -  `);
      const fs = Math.max(7, H * 0.42);
      bctx.font = `400 ${fs}px "Black Han Sans", "Arial Black", sans-serif`;
      bctx.textBaseline = "middle";
      bctx.fillStyle = product.side.text;
      const w = bctx.measureText(text).width;
      const repeats = Math.max(1, Math.floor(W / w));
      const unit = W / repeats;
      for (let i = 0; i < repeats; i++) bctx.fillText(text, i * unit, H / 2 + 1, unit * 0.96);
    };

    // reflets fixes des gels (rendu 2D)
    const gloss = document.createElement("canvas");
    gloss.width = Math.round(S * dpr);
    gloss.height = Math.round(S * dpr);
    const radial = (c: CanvasRenderingContext2D, gx: number, gy: number, gr: number, rgb: string, a: number) => {
      const g = c.createRadialGradient(gx, gy, 0, gx, gy, gr);
      g.addColorStop(0, `rgba(${rgb}, ${a})`);
      g.addColorStop(1, `rgba(${rgb}, 0)`);
      c.fillStyle = g;
      c.fillRect(0, 0, S, S);
    };
    let prepared = false;
    let handle3d: Can3DHandle | null = null;
    let disposed = false;
    const prepare = () => {
      if (prepared) return;
      prepared = true;
      paintBand();
      const gctx = gloss.getContext("2d")!;
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radial(gctx, S * 0.5 + r * 0.65, S * 0.5 - r * 0.3, r * 0.7, GELS.orange, 0.3);
      radial(gctx, S * 0.5 - r * 0.7, S * 0.5 + r * 0.3, r * 0.7, GELS.violet, 0.32);
      radial(gctx, S * 0.5 + r * 0.4, S * 0.5 + r * 0.36, r * 0.6, GELS.jaune, 0.18);
      document.fonts?.ready.then(() => {
        paintBand();
        if (reduced || !spin) draw(restAngle);
      });
      // rendu 3D après le premier geste du visiteur ; le 2D reste affiché jusqu'à ce qu'il soit prêt
      whenEngaged()
        .then(() => (disposed ? null : import("./can3d")))
        .then(async (m) => {
          if (!m || disposed || !m.supports3D()) return;
          const h = await m.createCan({ product, band, target: canvas, px: canvas.width });
          if (disposed) h.dispose();
          else handle3d = h;
          if (reduced || !spin) {
            const wait = () => (h.ready() ? draw(restAngle) : setTimeout(wait, 60));
            wait();
          }
        })
        .catch(() => {});
    };

    const restAngle = 0; // à l'arrêt (mouvement réduit), la marque du couvercle est à l'endroit
    let raf = 0;
    let visible = false;
    let last = 0;
    const frameGap = coarse || S < 260 ? 32 : 0; // 30 images par seconde sur mobile et pour les petites boîtes
    const started = performance.now() - phase * 1000;
    const base = (Math.PI * 2) / (duration * 1000); // vitesse de croisière, rad/ms

    // inertie : angle supplémentaire et vitesse angulaire pilotés par le pointeur ; ralentissement à l'examen
    const motion = { extra: 0, vel: 0, dragging: false, hover: false, lastX: 0, lastT: 0 };
    let scrollTilt = 0;

    const draw2d = (theta: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, S, S);
      const rad = rad0 + (scrollTilt * Math.PI) / 180;
      const k = Math.cos(rad);
      const ry = r * k;
      const h = S * H_RATIO * Math.sin(rad);
      const cx = S / 2;
      const cyLid = S / 2 - h / 2;
      const cyBase = cyLid + h;
      const side = new Path2D();
      side.ellipse(cx, cyBase, r, ry, 0, 0, Math.PI);
      side.ellipse(cx, cyLid, r, ry, 0, Math.PI, 0, true);
      side.closePath();
      ctx.save();
      ctx.clip(side);
      const sliceW = band.width / SLICES;
      const stepA = (Math.PI * 2) / SLICES;
      for (let i = 0; i < SLICES; i++) {
        const a = theta + (i + 0.5) * stepA;
        const s = Math.sin(a);
        if (s <= 0) continue;
        const x = cx + r * Math.cos(a);
        const w = r * stepA * s + 0.8;
        ctx.drawImage(band, (SLICES - 1 - i) * sliceW, 0, sliceW, band.height, x - w / 2, cyLid, w, h);
      }
      const shade = ctx.createLinearGradient(cx - r, 0, cx + r, 0);
      shade.addColorStop(0, "rgba(0,0,0,0.62)");
      shade.addColorStop(0.3, "rgba(0,0,0,0.1)");
      shade.addColorStop(0.5, "rgba(255,255,255,0.08)");
      shade.addColorStop(0.7, "rgba(0,0,0,0.1)");
      shade.addColorStop(1, "rgba(0,0,0,0.62)");
      ctx.fillStyle = shade;
      ctx.fill(side);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cyLid, r, ry, 0, 0, Math.PI * 2);
      ctx.clip();
      if (img.complete && img.naturalWidth) {
        ctx.translate(cx, cyLid);
        ctx.scale(1, k);
        ctx.rotate(theta);
        ctx.drawImage(img, -r, -r, r * 2, r * 2);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      } else {
        ctx.fillStyle = product.side.body;
        ctx.fillRect(cx - r, cyLid - ry, r * 2, ry * 2);
      }
      ctx.globalCompositeOperation = "screen";
      ctx.translate(cx - S / 2, cyLid - S / 2);
      ctx.scale(1, k);
      ctx.drawImage(gloss, 0, (S / 2) * (1 - 1 / k), S, S / k);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const root = document.documentElement.style;
      const px = Number(root.getPropertyValue("--px")) || 0.5;
      const py = Number(root.getPropertyValue("--py")) || 0.5;
      radial(ctx, cx - r * 0.45 + px * r * 0.7, cyLid - ry * 0.5 + py * ry * 0.6, r * 0.75, "255, 255, 255", 0.3);
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
      ctx.beginPath();
      ctx.ellipse(cx, cyLid, r, ry, 0, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.stroke();
    };

    const draw = (theta: number) => {
      if (handle3d && handle3d.ready()) handle3d.frame(theta, tilt + scrollTilt);
      else draw2d(theta);
      host.setAttribute("data-drawn", "");
    };

    const updateScrollTilt = () => {
      const b = host.getBoundingClientRect();
      const rel = (b.top + b.height / 2) / window.innerHeight - 0.5; // -0.5 en haut, +0.5 en bas
      scrollTilt = Math.max(-5, Math.min(5, -rel * 10));
    };

    let prevNow = 0;
    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      if (frameGap && now - last < frameGap) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = prevNow ? Math.min(64, now - prevNow) : 16;
      prevNow = now;
      last = now;
      updateScrollTilt();
      // vitesse de croisière, réduite pendant l'examen (survol) et suspendue pendant le glissement
      const cruise = motion.dragging ? 0 : motion.hover ? base * 0.25 : base;
      if (!motion.dragging) {
        motion.extra += motion.vel * dt;
        motion.vel *= Math.pow(0.9, dt / 16); // inertie : décélération douce
      }
      const theta = spin ? (now - started) * cruise + motion.extra : motion.extra;
      draw(theta);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      prepare();
      if (reduced || !spin) {
        draw(restAngle);
        return;
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        host.toggleAttribute("data-visible", visible);
        if (visible) start();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(host);
    img
      .decode()
      .then(() => {
        if (!visible) return;
        prepare();
        if (reduced || !spin) draw(restAngle);
      })
      .catch(() => {});

    // interactions : glissement avec inertie (souris et doigt), ralentissement au survol
    const onDown = (e: PointerEvent) => {
      if (!interactive) return;
      motion.dragging = true;
      motion.vel = 0;
      motion.lastX = e.clientX;
      motion.lastT = e.timeStamp;
      host.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!interactive) return;
      if (!motion.dragging) return;
      const dx = e.clientX - motion.lastX;
      const dt = Math.max(1, e.timeStamp - motion.lastT);
      const dTheta = (dx / S) * Math.PI; // un diamètre de glissement = un demi-tour
      motion.extra += dTheta;
      motion.vel = dTheta / dt;
      motion.lastX = e.clientX;
      motion.lastT = e.timeStamp;
      if (reduced || !spin) draw(restAngle + motion.extra);
    };
    const onUp = (e: PointerEvent) => {
      if (!motion.dragging) return;
      motion.dragging = false;
      motion.vel = Math.max(-0.02, Math.min(0.02, motion.vel));
      host.releasePointerCapture?.(e.pointerId);
    };
    const onEnter = () => {
      if (interactive && !coarse) motion.hover = true;
    };
    const onLeave = () => {
      motion.hover = false;
    };
    if (interactive) {
      host.addEventListener("pointerdown", onDown);
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerup", onUp);
      host.addEventListener("pointercancel", onUp);
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
    }

    return () => {
      disposed = true;
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      handle3d?.dispose();
      if (interactive) {
        host.removeEventListener("pointerdown", onDown);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerup", onUp);
        host.removeEventListener("pointercancel", onUp);
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [product, size, tilt, duration, phase, spin, interactive]);

  const vars: CSSProperties = { "--size": `${size}px`, "--k": Math.cos((tilt * Math.PI) / 180).toFixed(3), "--h": `${size * H_RATIO * Math.sin((tilt * Math.PI) / 180)}px`, ...style };
  return (
    <div ref={ref} className={`can ${interactive ? "can--interactive" : ""} ${className}`} style={vars}>
      <div className="can__shadow" aria-hidden="true" />
      <img
        className="can__static"
        src={product.image}
        width={300}
        height={300}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
      />
      <canvas ref={canvasRef} className="can__canvas" role="img" aria-label={`Boîte ${product.brand} ${product.name}, vue inclinée`} />
    </div>
  );
}
