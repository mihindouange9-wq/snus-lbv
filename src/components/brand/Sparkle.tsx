interface Props {
  className?: string;
}

/** Étincelle à quatre branches, motif emprunté à la référence typographique. */
export default function Sparkle({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={`sparkle ${className}`} aria-hidden="true" focusable="false">
      <path d="M12 0c.7 6.8 4.5 10.6 12 12-7.5 1.4-11.3 5.2-12 12-.7-6.8-4.5-10.6-12-12 7.5-1.4 11.3-5.2 12-12z" />
    </svg>
  );
}
