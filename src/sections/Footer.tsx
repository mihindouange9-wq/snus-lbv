import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "../lib/motion";
import { SITE, WARNINGS } from "../data/site";
import { telLink } from "../lib/whatsapp";
import Wordmark from "./Wordmark";

const YEAR = 2026;

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".footer__mark", { yPercent: 100, ease: "none", scrollTrigger: { trigger: ".footer__clip", start: "top bottom", end: "bottom bottom", scrub: 0.4 } });
    },
    { scope: root },
  );
  return (
    <footer ref={root} className="footer">
      <ul className="footer__warn on-clair">
        {WARNINGS.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <div className="footer__grid">
        <p>
          <span className="label">Livraison</span>
          {SITE.delivery.zone}, {SITE.country}
        </p>
        <p>
          <span className="label">Téléphone et WhatsApp</span>
          <a href={telLink}>{SITE.phoneDisplay}</a>
        </p>
        <p>
          <span className="label">Site</span>
          <span>
            <a href="#gouts">Goûts</a>, <a href="#commander">Commander</a>
          </span>
        </p>
      </div>
      <div className="footer__clip" aria-hidden="true">
        <Wordmark className="footer__mark" />
      </div>
      <div className="footer__collab">
        <p className="label">Collaboration</p>
        <div className="footer__lockup">
          <Wordmark className="footer__collabLogo" />
          <svg className="footer__x" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
          <a href="https://methode-aura.onrender.com" target="_blank" rel="noopener noreferrer" aria-label="MÉTHODE AURA, studio de marque (nouvel onglet)">
            <img src="/partenaires/methode-aura.png" alt="MÉTHODE AURA" width={800} height={246} loading="lazy" decoding="async" />
          </a>
        </div>
        <p className="footer__collabNote">MÉTHODE AURA, studio de marque à Libreville · Du concept à l'impact.</p>
      </div>
      <p className="footer__legal">
        © {YEAR} {SITE.name}. Réservé aux adultes de {SITE.legalAge} ans et plus.
      </p>
    </footer>
  );
}
