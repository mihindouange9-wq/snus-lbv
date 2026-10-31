import Wordmark from "../brand/Wordmark";
import { SITE, WARNINGS } from "../../data/site";
import { telLink, whatsappLink } from "../../lib/whatsapp";
import "./footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" data-cue="footer">
      <div className="wrap">
        <div className="footer__top">
          <a href="#haut" className="footer__brand" aria-label="SNUS LBV, haut de page">
            <Wordmark className="footer__mark" />
          </a>
          <span className="footer__age" aria-label="Réservé aux adultes de 18 ans et plus">
            18+
          </span>
        </div>

        <div className="footer__grid">
          <nav className="footer__nav" aria-label="Navigation du pied de page">
            <a href="#collection">Collection</a>
            <a href="#gouts">Les goûts</a>
            <a href="#marque">La marque</a>
            <a href="#commander">Commander</a>
          </nav>

          <div className="footer__contact">
            <p className="label">Commandes et questions</p>
            <a className="footer__phone" href={whatsappLink(`Bonjour ${SITE.name}, j'ai une question.`)} target="_blank" rel="noopener noreferrer">
              WhatsApp {SITE.phoneDisplay}
            </a>
            <a className="footer__tel" href={telLink}>
              Appeler le {SITE.phoneDisplay}
            </a>
            <p className="footer__city">
              {SITE.city}, {SITE.country}
            </p>
          </div>

          <div className="footer__legal">
            <p className="label">Vente et livraison</p>
            <p>
              Livraison à {SITE.city}. {SITE.delivery.note} Le prix affiché est indicatif ; la commande est confirmée par le vendeur sur WhatsApp.
            </p>
            <p className="label">Avertissements</p>
            <ul>
              {WARNINGS.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__partner">
          <p className="label footer__partnerLabel">Site conçu et réalisé en collaboration avec</p>
          <div className="footer__lockup">
            <Wordmark className="footer__lockupMark" title="SNUS LBV" />
            <svg className="footer__x" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
            <a href="https://methode-aura.onrender.com" target="_blank" rel="noopener noreferrer" className="footer__partnerLink" aria-label="MÉTHODE AURA, studio de marque (nouvel onglet)">
              <img src="/partenaires/methode-aura.png" alt="MÉTHODE AURA" width={800} height={246} loading="lazy" decoding="async" />
            </a>
          </div>
          <p className="footer__partnerNote">MÉTHODE AURA, studio de marque à Libreville · Du concept à l'impact.</p>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {SITE.name}
            {SITE.legal.company ? ` · ${SITE.legal.company}` : ""}
            {SITE.legal.rccm ? ` · RCCM ${SITE.legal.rccm}` : ""}
            {SITE.legal.nif ? ` · NIF ${SITE.legal.nif}` : ""}
          </p>
          <p>
            <a href="https://methode-aura.onrender.com" target="_blank" rel="noopener noreferrer">
              MÉTHODE AURA
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
