import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Adresse publique du site (variable VITE_SITE_URL au déploiement, sans barre oblique finale). */
const SITE_URL = (process.env.VITE_SITE_URL || "https://snus-lbv.example").replace(/\/$/, "");

/** Remplit les adresses absolues de index.html et produit robots.txt et sitemap.xml. */
function seo(): Plugin {
  return {
    name: "snus-lbv-seo",
    transformIndexHtml(html) {
      return html.split("__SITE_URL__").join(SITE_URL);
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
    },
  };
}

export default defineConfig({
  plugins: [react(), seo()],
  build: {
    target: "es2022",
    cssMinify: "esbuild",
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
          if (/[\\/]node_modules[\\/](gsap|@gsap)[\\/]/.test(id)) return "gsap";
          if (/[\\/]node_modules[\\/]three[\\/]/.test(id)) return "three";
        },
      },
    },
  },
});
