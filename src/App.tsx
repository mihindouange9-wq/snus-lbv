import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import AgeGate, { readGate } from "./components/gate/AgeGate";
import Lights from "./components/animations/Lights";
import Nav from "./components/navigation/Nav";
import Hero from "./components/hero/Hero";
import Collection from "./components/collection/Collection";
import Flavors from "./components/flavors/Flavors";
import IrisWipe from "./components/animations/IrisWipe";
import Brand from "./components/brand/Brand";
import Order from "./components/whatsapp/Order";
import Dock from "./components/whatsapp/Dock";
import Footer from "./components/footer/Footer";
import { byId } from "./data/products";
import { ScrollTrigger, initReveals, scrollToId } from "./lib/motion";
import "./app.css";

export default function App() {
  // même état au pré-rendu et à l'hydratation ; la mémoire du contrôle d'âge est lue ensuite
  const [adult, setAdult] = useState(false);
  useEffect(() => {
    // lecture du stockage volontairement après l'hydratation (le HTML pré-rendu montre toujours le contrôle d'âge)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readGate()) setAdult(true);
  }, []);
  const [selectedId, setSelectedId] = useState("velo-fp");
  const [qty, setQty] = useState(1);

  const pending = useRef<"gouts" | "commander" | null>(null);
  const current = useRef(selectedId);
  useEffect(() => {
    current.current = selectedId;
  }, [selectedId]);

  const select = useCallback((id: string, go?: "gouts" | "commander") => {
    if (go && id === current.current) {
      // sélection inchangée : la scène visée est déjà rendue, on y va tout de suite
      scrollToId(go, true);
      return;
    }
    pending.current = go ?? null;
    setSelectedId(id);
  }, []);

  // le défilement et le focus attendent que la scène visée ait rendu la nouvelle sélection
  useEffect(() => {
    if (!pending.current) return;
    scrollToId(pending.current, true);
    pending.current = null;
  }, [selectedId]);

  // les révélations attendent deux images : la première peinture n'est pas retardée par leur mise en place
  useGSAP(() => {
    let cleanup: (() => void) | undefined;
    const r1 = requestAnimationFrame(() => {
      cleanup = initReveals(document);
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(r1);
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    if (adult) ScrollTrigger.refresh();
  }, [adult]);

  return (
    <>
      {!adult && <AgeGate onEnter={() => setAdult(true)} />}
      <Lights />
      <div className="site" inert={!adult}>
        <Nav />
        <main className="main">
          <Hero />
          <Collection selectedId={selectedId} onSelect={(id) => select(id, "gouts")} />
          <Flavors selectedId={selectedId} onSelect={(id) => select(id)} onOrder={() => scrollToId("commander", true)} />
          <IrisWipe color="jaune" base="nuit" origin={{ x: 50, y: 48 }} />
          <Brand onSelect={(id) => select(id, "gouts")} />
          <IrisWipe color="violet" base="creme" origin={{ x: 20, y: 70 }} />
          <Order selectedId={selectedId} qty={qty} onSelect={(id) => select(id)} onQty={setQty} />
        </main>
        <Footer />
        <Dock product={byId(selectedId)} qty={qty} />
      </div>
    </>
  );
}
