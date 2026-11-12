import { useId } from "react";
import { LOGO } from "../assets/logo";

interface Props {
  className?: string;
  /** Texte lu à la place du dessin ; sans lui, le logo est décoratif. */
  title?: string;
}

/** Nappes de couleur qui se promènent dans les lettres de SNUS : centre, rayon, teinte et trajet. */
const NAPPES = [
  { cx: 60, cy: -120, r: 190, tone: "botticelli", k: 1 },
  { cx: 500, cy: -20, r: 170, tone: "tangelo", k: 2 },
  { cx: 280, cy: 10, r: 160, tone: "botticelli", k: 3 },
  { cx: 180, cy: -160, r: 150, tone: "tangelo", k: 4 },
] as const;

/**
 * Logo SNUS LBV. Deux idées, un seul motif, le sachet : un sachet Tangelo glissé dans le U (là où il se place, sous
 * la lèvre) et « LBV » posé dans une capsule en forme de sachet. Les lettres de SNUS portent une matière vivante,
 * des nuances de la palette qui s'y déplacent lentement ; leur contour reste net.
 */
export default function Wordmark({ className = "", title }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { glyphs, snus, pouch, capsule, lbv, lbvScale, lbvY } = LOGO;
  return (
    <svg className={`logo ${className}`} viewBox={LOGO.viewBox} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      <defs>
        <clipPath id={`lg-c-${uid}`}>
          {snus.map((l, i) => (
            <path key={i} transform={`translate(${l.x} 0)`} d={glyphs[l.ch as keyof typeof glyphs]} />
          ))}
        </clipPath>
        {(["botticelli", "tangelo"] as const).map((tone) => (
          <radialGradient key={tone} id={`lg-${tone}-${uid}`}>
            <stop offset="0" stopColor={`var(--${tone})`} />
            <stop offset="0.5" stopColor={`var(--${tone})`} stopOpacity="0.8" />
            <stop offset="1" stopColor={`var(--${tone})`} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      <g clipPath={`url(#lg-c-${uid})`}>
        <rect className="logo__base" x="-3" y="-173" width={LOGO.snusWidth + 6} height="176" />
        {NAPPES.map((n) => (
          <circle key={n.k} className={`logo__nappe logo__nappe--${n.k}`} cx={n.cx} cy={n.cy} r={n.r} fill={`url(#lg-${n.tone}-${uid})`} />
        ))}
      </g>
      <rect className="logo__pouch" x={pouch.x} y={pouch.y} width={pouch.w} height={pouch.h} rx={pouch.r} />
      <rect className="logo__capsule" x={capsule.x} y={capsule.y} width={capsule.w} height={capsule.h} rx={capsule.r} />
      <g className="logo__lbv">
        {lbv.map((l) => (
          <path key={l.ch} transform={`translate(${l.x} ${lbvY}) scale(${lbvScale})`} d={glyphs[l.ch as keyof typeof glyphs]} />
        ))}
      </g>
    </svg>
  );
}
