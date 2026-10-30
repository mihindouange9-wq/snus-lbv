import { useId } from "react";
import { WORDMARK } from "../../assets/wordmark";

interface Props {
  className?: string;
  /** Deux lignes (SNUS / LBV) pour les écrans étroits. */
  stacked?: boolean;
  /** Ombre portée douce sous chaque lettre (grands formats). */
  shadow?: boolean;
  /** Matière colorée vivante dans les lettres : dégradés des trois gels, animés par le hero. */
  live?: boolean;
  /** Identifiant de titre accessible ; sinon l'image est décorative. */
  title?: string;
}

const GEL = { orange: "#FF5A1F", jaune: "#F8FF32", violet: "#7928FF" };

/** Mot-symbole SNUS LBV en tracés (Black Han Sans, lettres inclinées, ombre douce). Hérite de `color` ; `live` remplit de lumière. */
export default function Wordmark({ className = "", stacked = false, shadow = false, live = false, title }: Props) {
  const uid = useId().replace(/:/g, "");
  const { dx, dy, blur } = WORDMARK.shadow;

  const defs = (k: number, viewBox: string) => {
    const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
    const f = `wm-ombre-${uid}-${k}`;
    const base = `wm-base-${uid}-${k}`;
    const hot = `wm-hot-${uid}-${k}`;
    return (
      <defs>
        {shadow && (
          <filter id={f} x="-15%" y="-30%" width="135%" height="170%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        )}
        {live && (
          <>
            {/* nappe de base : les trois gels se succèdent en diagonale, prolongée en miroir pour glisser sans fin */}
            <linearGradient id={base} className="wm__base" gradientUnits="userSpaceOnUse" spreadMethod="reflect" x1={vx} y1={vy} x2={vx + vw * 0.9} y2={vy + vh}>
              {/* le violet reste un accent court : les lettres gardent toujours une large part chaude et lumineuse */}
              <stop offset="0" stopColor="#9B4DFF" />
              <stop offset="0.12" stopColor={GEL.orange} />
              <stop offset="0.34" stopColor={GEL.jaune} />
              <stop offset="0.52" stopColor={GEL.orange} />
              <stop offset="0.7" stopColor={GEL.violet} />
              <stop offset="0.84" stopColor={GEL.orange} />
              <stop offset="1" stopColor={GEL.jaune} />
            </linearGradient>
            {/* point chaud : une zone plus lumineuse qui parcourt les lettres */}
            <radialGradient id={hot} className="wm__hot" gradientUnits="userSpaceOnUse" cx={vx + vw * 0.3} cy={vy + vh * 0.5} r={vw * 0.32}>
              <stop offset="0" stopColor={GEL.jaune} stopOpacity="0.95" />
              <stop offset="0.45" stopColor={GEL.orange} stopOpacity="0.55" />
              <stop offset="1" stopColor={GEL.violet} stopOpacity="0" />
            </radialGradient>
          </>
        )}
      </defs>
    );
  };

  const glyphs = (idx: readonly number[], k: number) =>
    idx.map((i) => {
      const g = WORDMARK.glyphs[i];
      return (
        <g key={i} className="wm__g">
          {shadow && <path className="wm__ombre" transform={`translate(${dx} ${dy}) ${g.transform}`} d={g.d} fill="#000" opacity="0.5" filter={`url(#wm-ombre-${uid}-${k})`} />}
          <path transform={g.transform} d={g.d} fill={live ? `url(#wm-base-${uid}-${k})` : "currentColor"} />
          {live && <path className="wm__glow" transform={g.transform} d={g.d} fill={`url(#wm-hot-${uid}-${k})`} style={{ mixBlendMode: "screen" }} />}
        </g>
      );
    });

  if (stacked) {
    return (
      <span className={`wm wm--stack ${live ? "wm--live" : ""} ${className}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
        {WORDMARK.words.map((w, k) => (
          <svg key={k} viewBox={w.viewBox} className={`wm__svg wm__svg--${k}`} focusable="false" aria-hidden="true">
            {defs(k, w.viewBox)}
            {glyphs(w.glyphs, k)}
          </svg>
        ))}
      </span>
    );
  }
  return (
    <svg viewBox={WORDMARK.viewBox} className={`wm ${live ? "wm--live" : ""} ${className}`} focusable="false" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {defs(0, WORDMARK.viewBox)}
      {glyphs(
        WORDMARK.glyphs.map((_, i) => i),
        0,
      )}
    </svg>
  );
}
