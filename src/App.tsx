import { useEffect, useState } from "react";
import Gate, { readGate } from "./sections/Gate";
import Stage from "./sections/Stage";
import Marquee from "./sections/Marquee";
import Manifesto from "./sections/Manifesto";
import Mood from "./sections/Mood";
import Steps from "./sections/Steps";
import Order from "./sections/Order";
import Footer from "./sections/Footer";
import Dock from "./sections/Dock";
import { PRODUCTS, byId } from "./data/products";
import { ScrollTrigger, scrollToId } from "./lib/motion";
import "./site.css";

export default function App() {
  // même état au pré-rendu et à l'hydratation ; la mémoire du contrôle d'âge est lue ensuite
  const [adult, setAdult] = useState(false);
  useEffect(() => {
    // lecture du stockage volontairement après l'hydratation (le HTML pré-rendu montre toujours le contrôle d'âge)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readGate()) setAdult(true);
  }, []);
  const [selectedId, setSelectedId] = useState(PRODUCTS[0].id);
  const [qty, setQty] = useState(1);
  // tant qu'aucun goût n'a été choisi par le visiteur, la barre du bas mène à la commande, pas à WhatsApp
  const [chosen, setChosen] = useState(false);
  const choose = (id: string) => {
    setSelectedId(id);
    setChosen(true);
  };

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);
  useEffect(() => {
    if (adult) ScrollTrigger.refresh();
  }, [adult]);

  // les animations en boucle (logo, fond de scène) s'arrêtent dès que leur zone sort de l'écran
  useEffect(() => {
    const zones = document.querySelectorAll(".stage__pin, .footer");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle("is-offscreen", !e.isIntersecting);
    });
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {!adult && <Gate onEnter={() => setAdult(true)} />}
      <div className="site" inert={!adult}>
        <a className="skip" href="#commander">
          Aller à la commande
        </a>
        <main>
          <Stage
            onOrder={(id) => {
              choose(id);
              scrollToId("commander", true);
            }}
          />
          <Marquee />
          <Manifesto />
          <Mood />
          <Steps />
          <Order selectedId={selectedId} qty={qty} onSelect={choose} onQty={setQty} />
        </main>
        <Footer />
        <Dock product={chosen ? byId(selectedId) : null} qty={qty} onOrder={() => scrollToId("commander", true)} />
      </div>
    </>
  );
}
