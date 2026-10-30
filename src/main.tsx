import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "./styles/tokens.css";
import "./styles/base.css";
import App from "./App";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// index.html est pré-rendu au build ; en développement, la racine est vide
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
