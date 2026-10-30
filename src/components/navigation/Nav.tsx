import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Wordmark from "../brand/Wordmark";
import { SITE } from "../../data/site";
import "./nav.css";

const LINKS = [
  { href: "#collection", label: "Collection" },
  { href: "#gouts", label: "Les goûts" },
  { href: "#marque", label: "La marque" },
];

export default function Nav() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burger.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${compact ? "nav--compact" : ""} ${open ? "nav--open" : ""}`}>
      <div className="nav__bar wrap">
        <a href="#haut" className="nav__brand" aria-label="SNUS LBV, haut de page" onClick={close}>
          <Wordmark className="nav__mark" />
        </a>
        <nav className="nav__links" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#commander" className="pill pill--small nav__cta" onClick={close}>
          Commander
        </a>
        <button ref={burger} type="button" className="nav__burger" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((o) => !o)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
        </button>
      </div>

      <div id="menu-mobile" className="menu" inert={!open}>
        <nav className="menu__links" aria-label="Navigation mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
          <a href="#commander" onClick={close}>
            Commander
          </a>
        </nav>
        <p className="menu__foot">
          WhatsApp {SITE.phoneDisplay} · {SITE.city}
          <br />
          <span>Réservé aux adultes · 18+</span>
        </p>
      </div>
    </header>
  );
}
