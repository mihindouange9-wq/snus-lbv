import { useEffect, useRef, useState } from "react";
import Wordmark from "../brand/Wordmark";
import Sparkle from "../brand/Sparkle";
import { SITE, WARNINGS } from "../../data/site";
import "./gate.css";

const KEY = "snuslbv_adulte";

export function readGate(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

interface Props {
  onEnter: () => void;
}

/** Contrôle d'âge déclaratif à l'entrée. Ne constitue pas une garantie de conformité. */
export default function AgeGate({ onEnter }: Props) {
  const [minor, setMinor] = useState(false);
  const primary = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.add("is-locked");
    primary.current?.focus();
    return () => document.body.classList.remove("is-locked");
  }, []);

  const enter = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* stockage indisponible : on entre pour la session */
    }
    onEnter();
  };

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate__panel">
        <Wordmark className="gate__mark" />
        {minor ? (
          <>
            <h2 id="gate-title" className="title title--h3 gate__title">
              Ce site n'est pas accessible aux mineurs.
            </h2>
            <p className="gate__text">Les produits présentés contiennent de la nicotine et sont réservés aux adultes de {SITE.legalAge} ans et plus.</p>
          </>
        ) : (
          <>
            <h2 id="gate-title" className="title gate__title">
              Réservé
              <Sparkle className="gate__spark" />
              aux adultes
            </h2>
            <p className="gate__text">
              Ce site présente des produits contenant de la nicotine. Il est réservé aux personnes de {SITE.legalAge} ans et plus.
            </p>
            <div className="gate__actions">
              <button ref={primary} type="button" className="pill" onClick={enter}>
                J'ai {SITE.legalAge} ans ou plus · Entrer
              </button>
              <button type="button" className="pill pill--ghost" onClick={() => setMinor(true)}>
                Je n'ai pas {SITE.legalAge} ans
              </button>
            </div>
          </>
        )}
        <ul className="gate__warn">
          {WARNINGS.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
