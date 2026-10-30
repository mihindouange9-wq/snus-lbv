import { ArrowUpRight } from "lucide-react";
import Sparkle from "./Sparkle";
import { DOSE_MAX, PRODUCTS } from "../../data/products";
import { SITE, WARNINGS } from "../../data/site";
import "./brand.css";

interface Props {
  onSelect: (id: string) => void;
}

const byDose = [...PRODUCTS].sort((a, b) => a.dose - b.dose || a.brand.localeCompare(b.brand));

/** La marque, lumière de salle : trois faits, une échelle d'intensité vivante, l'avertissement. */
export default function Brand({ onSelect }: Props) {
  return (
    <section className="brand scene" id="marque" data-cue="salle" aria-labelledby="marque-title">
      <div className="wrap">
        <div className="brand__open">
          <h2 className="title brand__title" id="marque-title" data-reveal>
            Sans tabac
            <br />
            sans fumée
          </h2>
          <p className="lead brand__lead" data-reveal="0.1">
            SNUS LBV distribue à {SITE.city} des pouches de nicotine de marques internationales : des sachets à glisser sous la lèvre, sans tabac, sans fumée. Cinq marques, neuf goûts, et un seul numéro pour commander.
          </p>
        </div>

        <div className="brand__fields">
          <div className="brand__field brand__field--orange" data-reveal>
            <h3 className="title title--h3">Du plus léger au plus fort</h3>
            <p className="brand__fieldNote">De {byDose[0].dose} à {byDose[byDose.length - 1].dose} mg/g. Touche une ligne pour ouvrir le goût.</p>
            <ol className="ladder">
              {byDose.map((p) => (
                <li key={p.id}>
                  <button type="button" className="ladder__row" onClick={() => onSelect(p.id)}>
                    <span className="label label--big ladder__dose">{p.dose}</span>
                    <span className="ladder__bar" aria-hidden="true">
                      <i style={{ "--w": `${(p.dose / DOSE_MAX) * 100}%` }} />
                    </span>
                    <span className="ladder__name">
                      <span className="label">{p.brand}</span> {p.name}
                    </span>
                    <ArrowUpRight className="ladder__arrow" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="brand__field brand__field--violet" data-reveal="0.1">
            <h3 className="title title--h3">
              {SITE.city}
              <br />
              livré
            </h3>
            <p>Tu commandes sur WhatsApp. Le vendeur confirme la disponibilité, la livraison et le paiement avec toi, avant tout envoi.</p>
            <p className="brand__small">{SITE.delivery.note}</p>
          </div>
        </div>

        <p className="brand__warning" data-reveal>
          <Sparkle className="brand__spark" />
          {WARNINGS[0]} {WARNINGS[1]}
        </p>
      </div>
    </section>
  );
}
