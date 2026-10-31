/**
 * Rendu 3D des boîtes (Three.js) : un seul moteur WebGL partagé, une géométrie de boîte réelle (flanc cylindrique,
 * arête arrondie, couvercle recessé) habillée des textures disponibles (visuel du couvercle, bandeau du flanc),
 * matériaux physiques (vernis sur le couvercle, plastique mat sur le flanc), éclairage de studio à trois sources
 * et réflexions d'environnement. Chaque boîte reçoit son image par copie dans son propre canvas 2D.
 * Chargé à la demande (import dynamique) ; en l'absence de WebGL ou sur un appareil modeste, Can.tsx garde son rendu 2D.
 */
import * as THREE from "three";
import type { Product } from "../../data/products";

/** Environnement de studio dessiné en quelques traits (équirectangulaire 256 × 128) : plafond lumineux,
 *  deux boîtes à lumière teintées par la palette, sol sombre. Bien moins coûteux qu'une scène PMREM complète. */
function studioEnvironment(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const x = c.getContext("2d")!;
  const sky = x.createLinearGradient(0, 0, 0, 128);
  sky.addColorStop(0, "#fff6e8");
  sky.addColorStop(0.42, "#5a5270");
  sky.addColorStop(0.62, "#1a1722");
  sky.addColorStop(1, "#070609");
  x.fillStyle = sky;
  x.fillRect(0, 0, 256, 128);
  const box = (cx: number, cy: number, w: number, h: number, color: string) => {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(cx - w, cy - h, w * 2, h * 2);
  };
  box(64, 30, 60, 26, "rgba(255,244,225,0.95)"); // boîte à lumière principale
  box(200, 44, 44, 22, "rgba(140,96,255,0.7)"); // remplissage violet
  box(130, 56, 30, 14, "rgba(255,120,60,0.6)"); // contour orange
  return c;
}

export interface Can3DHandle {
  /** Dessine la boîte dans le canvas cible. theta en radians, tilt (angle de vue) en degrés. */
  frame(theta: number, tilt: number): void;
  ready(): boolean;
  dispose(): void;
}

interface Shared {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  lid: THREE.MeshPhysicalMaterial;
  body: THREE.MeshStandardMaterial;
  rim: THREE.MeshStandardMaterial;
  pmrem: THREE.PMREMGenerator;
  size: number;
  users: number;
}

let shared: Shared | null = null;
const lidTextures = new Map<string, Promise<THREE.Texture>>();
const bandTextures = new Map<string, THREE.CanvasTexture>();

const RADIUS = 1;
const HEIGHT = 0.68;

function build(sizePx: number): Shared {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance", premultipliedAlpha: true });
  renderer.setPixelRatio(1);
  renderer.setSize(sizePx, sizePx, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = new THREE.CanvasTexture(studioEnvironment());
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.colorSpace = THREE.SRGBColorSpace;
  scene.environment = pmrem.fromEquirectangular(envTex).texture;
  envTex.dispose();

  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 50);

  // éclairage de studio : clé chaude, remplissage violet, contour orange, ambiance scène
  const key = new THREE.DirectionalLight(0xfff1dc, 2.4);
  key.position.set(-3.2, 5.5, 4.2);
  const fill = new THREE.DirectionalLight(0x9a6bff, 0.75);
  fill.position.set(4.5, 2.2, 3.5);
  const rimLight = new THREE.DirectionalLight(0xff8a4a, 1.7);
  rimLight.position.set(2.5, 4.5, -4.5);
  const hemi = new THREE.HemisphereLight(0xf4efe6, 0x0b0a10, 0.35);
  scene.add(key, fill, rimLight, hemi);

  const group = new THREE.Group();
  scene.add(group);

  const lid = new THREE.MeshPhysicalMaterial({ roughness: 0.34, metalness: 0, clearcoat: 0.75, clearcoatRoughness: 0.28, envMapIntensity: 0.85 });
  const body = new THREE.MeshStandardMaterial({ roughness: 0.52, metalness: 0.06, envMapIntensity: 0.55 });
  const rim = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.08, envMapIntensity: 0.7 });
  const bottom = new THREE.MeshStandardMaterial({ color: 0x15131c, roughness: 0.85, metalness: 0 });

  const half = HEIGHT / 2;
  const bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT - 0.08, 96, 1, true), body);
  const topRim = new THREE.Mesh(new THREE.TorusGeometry(RADIUS - 0.045, 0.045, 14, 96), rim);
  topRim.rotation.x = Math.PI / 2;
  topRim.position.y = half - 0.045;
  const bottomRim = topRim.clone();
  bottomRim.position.y = -half + 0.045;
  const lidMesh = new THREE.Mesh(new THREE.CircleGeometry(RADIUS - 0.06, 96), lid);
  lidMesh.rotation.x = -Math.PI / 2;
  lidMesh.position.y = half - 0.012;
  const bottomMesh = new THREE.Mesh(new THREE.CircleGeometry(RADIUS - 0.045, 96), bottom);
  bottomMesh.rotation.x = Math.PI / 2;
  bottomMesh.position.y = -half + 0.01;
  group.add(bodyMesh, topRim, bottomRim, lidMesh, bottomMesh);

  return { renderer, scene, camera, group, lid, body, rim, pmrem, size: sizePx, users: 0 };
}

function getShared(sizePx: number): Shared {
  if (!shared) shared = build(sizePx);
  else if (sizePx > shared.size) {
    shared.renderer.setSize(sizePx, sizePx, false);
    shared.size = sizePx;
  }
  return shared;
}

function lidTexture(url: string, anisotropy: number): Promise<THREE.Texture> {
  const cached = lidTextures.get(url);
  if (cached) return cached;
  const p = new THREE.TextureLoader().loadAsync(url).then((t: THREE.Texture) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = anisotropy;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.needsUpdate = true;
    return t;
  });
  lidTextures.set(url, p);
  return p;
}

function bandTexture(id: string, band: HTMLCanvasElement, anisotropy: number): THREE.CanvasTexture {
  let t = bandTextures.get(id);
  if (!t) {
    t = new THREE.CanvasTexture(band);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = anisotropy;
    bandTextures.set(id, t);
  }
  return t;
}

/** Le navigateur peut-il rendre les boîtes en WebGL ? Faux sur les appareils modestes : le rendu 2D prend le relais. */
export function supports3D(): boolean {
  try {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return false;
    if ((nav.deviceMemory ?? 4) <= 2 || (nav.hardwareConcurrency ?? 4) <= 2) return false;
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Crée le rendu 3D d'une boîte vers un canvas 2D cible. `band` est le bandeau du flanc déjà dessiné. */
export async function createCan(opts: { product: Product; band: HTMLCanvasElement; target: HTMLCanvasElement; px: number }): Promise<Can3DHandle> {
  const s = getShared(opts.px);
  s.users += 1;
  const ctx = opts.target.getContext("2d")!;
  const maxAniso = s.renderer.capabilities.getMaxAnisotropy();
  const bandTex = bandTexture(opts.product.id, opts.band, maxAniso);
  let lidTex: THREE.Texture | null = null;
  let disposed = false;
  lidTexture(opts.product.image, maxAniso).then((t) => {
    if (!disposed) lidTex = t;
  });
  const rimColor = new THREE.Color(opts.product.side.rim);
  const bodyColor = new THREE.Color("#ffffff");
  const px = opts.px;

  // compilation des shaders hors du fil principal quand le GPU le permet (KHR_parallel_shader_compile) :
  // la première image 3D n'arrive qu'une fois les programmes prêts, sans à-coup
  let compiled = false;
  s.lid.map = s.lid.map ?? null;
  s.renderer
    .compileAsync(s.scene, s.camera)
    .then(() => {
      compiled = true;
    })
    .catch(() => {
      compiled = true;
    });

  return {
    ready: () => lidTex !== null && compiled,
    frame(theta, tilt) {
      if (disposed || !lidTex) return;
      const { renderer, scene, camera, group } = s;
      // habillage de cette boîte
      if (s.lid.map !== lidTex) {
        s.lid.map = lidTex;
        s.lid.needsUpdate = true;
      }
      if (s.body.map !== bandTex) {
        s.body.map = bandTex;
        s.body.color.copy(bodyColor);
        s.body.needsUpdate = true;
      }
      s.rim.color.copy(rimColor);
      // orientation : rotation propre, angle de vue
      group.rotation.set(0, -theta, 0);
      const rad = (tilt * Math.PI) / 180;
      const d = 5.6;
      camera.position.set(0, Math.sin(rad) * d, Math.cos(rad) * d);
      camera.lookAt(0, -0.04, 0);
      camera.updateProjectionMatrix();
      // rendu dans le coin bas-gauche du moteur, puis copie dans le canvas de la boîte
      renderer.setViewport(0, 0, px, px);
      renderer.setScissor(0, 0, px, px);
      renderer.setScissorTest(true);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, opts.target.width, opts.target.height);
      ctx.drawImage(renderer.domElement, 0, s.size - px, px, px, 0, 0, opts.target.width, opts.target.height);
    },
    dispose() {
      disposed = true;
      s.users -= 1;
    },
  };
}
