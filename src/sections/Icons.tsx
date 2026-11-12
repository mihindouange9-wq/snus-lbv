/** Icônes dessinées pour le site : un seul trait, mêmes proportions (24 × 24). */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12C6.600 11.1 11.1 6.600 12 0Z" />
    </svg>
  );
}
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M6 18 18 6M8 6h10v10" />
    </svg>
  );
}
export function Chevron({ className = "", up = false }: { className?: string; up?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={up ? "m5 15 7-7 7 7" : "m5 9 7 7 7-7"} />
    </svg>
  );
}
export function Sign({ className = "", plus = false }: { className?: string; plus?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d={plus ? "M12 5v14M5 12h14" : "M5 12h14"} />
    </svg>
  );
}
