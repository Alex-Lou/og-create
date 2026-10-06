// L'île vue d'en haut : géométrie isométrique (monde ↔ écran), caméra, zoom, cadrage. Méthodes de WorldView.vue (this :
// le composant), extraites telles quelles (lot santé).
import { HS } from '@/world/terrain';
import { TW, TH } from './constants';
import { memory } from './memory';

const DEPTH = 30;
const MAX_SCALE = 1.8;

export default {
  /* ---------- Géométrie et caméra ---------- */
  setup() {
    const stage = this.$refs.stage;
    const canvas = this.$refs.canvas;
    if (!stage || !canvas || !this.state) return;
    if (!this.observer) {
      this.observer = new ResizeObserver(() => {
        this.setup();
        this.draw(performance.now());
      });
      this.observer.observe(stage);
      if (this.$refs.top) this.observer.observe(this.$refs.top);
    }
    // Hauteur de la barre qui flotte en haut : les boutons du dessin se rangent dessous
    stage.style.setProperty('--world-top', `${this.immersive || !this.$refs.top ? 0 : this.$refs.top.offsetHeight}px`);
    const width = stage.clientWidth;
    // Hauteur : toute la scène (l'île couvre l'écran, de bord à bord, jusqu'à la barre d'onglets)
    const height = Math.max(240, Math.round(stage.clientHeight));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.height = `${height}px`;
    const n = this.state.size;
    const fit = Math.min(width / (n * TW + TW), height / (n * TH + DEPTH + 3 * HS + TW * 1.6));
    this.geo = { width, height, dpr, n, minScale: Math.min(fit, 1) };
    // Première vue : celle qu'on avait en quittant l'île, sinon le Foyer au centre, à taille confortable pour le pouce
    if (!this.cam && memory.view) this.cam = { ...memory.view.cam };
    if (!this.cam) {
      const foyer = this.state.sites.find(s => s.id === 'foyer');
      const c = foyer ? this.centerOf(foyer) : this.world(n / 2, n / 2);
      this.cam = { s: Math.max(this.geo.minScale, Math.min(1, width / (TW * 6.5))), x: c.x, y: c.y };
    }
    this.clampCam();
  },
  // Centre d'une case (ou d'un point fractionnaire) dans le monde
  world(x, y) {
    return { x: ((x - y) * TW) / 2, y: ((x + y) * TH) / 2 };
  },
  toScreen(wx, wy) {
    const { s, x, y } = this.cam;
    return { x: (wx - x) * s + this.geo.width / 2, y: (wy - y) * s + this.geo.height / 2 };
  },
  toWorld(px, py) {
    const { s, x, y } = this.cam;
    return { x: (px - this.geo.width / 2) / s + x, y: (py - this.geo.height / 2) / s + y };
  },
  // Case sous un point de l'écran : la plus en avant dont le dessus (relevé par le relief) contient le point ;
  // à défaut, la case à plat (la mer)
  tileAt(px, py) {
    const w = this.toWorld(px, py);
    const a = w.x / (TW / 2);
    const b = w.y / (TH / 2);
    const x0 = Math.round((a + b) / 2);
    const y0 = Math.round((b - a) / 2);
    const n = this.state.size;
    let best = null;
    for (let y = y0 - 1; y <= y0 + 5; y++) {
      for (let x = x0 - 1; x <= x0 + 5; x++) {
        if (!this.landAt(x, y)) continue;
        const c = this.ground(x, y);
        if (Math.abs(w.x - c.x) / (TW / 2) + Math.abs(w.y - c.y) / (TH / 2) > 1) continue;
        if (!best || x + y > best.x + best.y) best = { x, y };
      }
    }
    if (best) return best;
    return x0 >= 0 && y0 >= 0 && x0 < n && y0 < n ? { x: x0, y: y0 } : null;
  },
  clampCam() {
    const n = this.state.size;
    const cam = this.cam;
    cam.s = Math.max(this.geo.minScale, Math.min(MAX_SCALE, cam.s));
    cam.x = Math.max(-(n * TW) / 2, Math.min((n * TW) / 2, cam.x));
    cam.y = Math.max(0, Math.min(n * TH, cam.y));
  },
  // Zoom autour d'un point de l'écran (le point du monde sous le doigt ne bouge pas)
  zoomAt(px, py, factor) {
    this.dropPick();
    const before = this.toWorld(px, py);
    this.cam.s *= factor;
    this.clampCam();
    const after = this.toWorld(px, py);
    this.cam.x += before.x - after.x;
    this.cam.y += before.y - after.y;
    this.clampCam();
    this.draw(performance.now());
  },
  zoomBy(factor) {
    if (this.geo) this.zoomAt(this.geo.width / 2, this.geo.height / 2, factor);
  }
};
