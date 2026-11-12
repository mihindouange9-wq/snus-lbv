import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import { SITE, WARNINGS } from "../data/site";
import { reducedMotion } from "../lib/motion";

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
export default function Gate({ onEnter }: Props) {
  const [minor, setMinor] = useState(false);
  const [leaving, setLeaving] = useState(false);
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
    if (reducedMotion()) return onEnter();
    // le rideau se referme en cercle sur le bouton, puis le site prend la main
    setLeaving(true);
    window.setTimeout(onEnter, 760);
  };

  return (
    <div className={`gate${leaving ? " is-leaving" : ""}`} role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <Wordmark className="gate__mark" />
      <div className="gate__panel">
        {minor ? (
          <>
            <h2 id="gate-title" className="display gate__title">
              Ce site n'est pas accessible aux mineurs.
            </h2>
            <p className="gate__text">Les produits présentés contiennent de la nicotine et sont réservés aux adultes de {SITE.legalAge} ans et plus.</p>
          </>
        ) : (
          <>
            <p className="num gate__age" aria-hidden="true">
              {SITE.legalAge}+
            </p>
            <h2 id="gate-title" className="display gate__title">
              Réservé aux adultes
            </h2>
            <p className="gate__text">
              Ce site présente des produits contenant de la nicotine. Il est réservé aux personnes de {SITE.legalAge} ans et plus.
            </p>
            <div className="gate__actions">
              <button ref={primary} type="button" className="btn gate__enter" onClick={enter}>
                J'ai {SITE.legalAge} ans ou plus · Entrer
              </button>
              <button type="button" className="btn btn--ghost gate__refuse" onClick={() => setMinor(true)}>
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
