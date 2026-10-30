import { renderToString } from "react-dom/server";
import App from "./App";

/** Pré-rendu statique au build (tools/prerender.mjs) : le HTML complet arrive avant le JavaScript. */
export function render(): string {
  return renderToString(<App />);
}
