// L'île vue d'en haut : géométrie isométrique (monde ↔ écran), caméra, zoom, cadrage. Méthodes de WorldView.vue (this :
// le composant), extraites telles quelles (lot santé).
import { HS } from '@/world/terrain';
import { TW, TH, FRAME_DOIGT_MS } from './constants';
import { memory } from './memory';
import { noter, vitesseOf, freiner, arretee, avancer, revenir, bornerDebord } from './elan';

const DEPTH = 30;
const MAX_SCALE = 1.8;
// La caméra qui glisse vers une cible (le coach, le tracé des chemins)
const GLIDE_MS = 650;

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
    // … et les notifications (fixées à la page) descendent sous son bord (styles/base/responsive.css ; retiré en quittant l'île)
    document.documentElement.style.setProperty('--oc-toast-top', `${this.immersive || !this.$refs.top ? 0 : Math.round(this.$refs.top.getBoundingClientRect().bottom)}px`);
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
  // à défaut, la case à plat (la mer). keep(x, y) : seulement parmi ces cases (une pose, son niveau : poseLevel.js),
  // et rien à défaut
  tileAt(px, py, keep = null) {
    const w = this.toWorld(px, py);
    const a = w.x / (TW / 2);
    const b = w.y / (TH / 2);
    const x0 = Math.round((a + b) / 2);
    const y0 = Math.round((b - a) / 2);
    const n = this.state.size;
    let best = null;
    for (let y = y0 - 1; y <= y0 + 5; y++) {
      for (let x = x0 - 1; x <= x0 + 5; x++) {
        if (!this.landAt(x, y) || (keep && !keep(x, y))) continue;
        const c = this.ground(x, y);
        if (Math.abs(w.x - c.x) / (TW / 2) + Math.abs(w.y - c.y) / (TH / 2) > 1) continue;
        if (!best || x + y > best.x + best.y) best = { x, y };
      }
    }
    if (best || keep) return best;
    return x0 >= 0 && y0 >= 0 && x0 < n && y0 < n ? { x: x0, y: y0 } : null;
  },
  clampCam() {
    const cam = this.cam;
    cam.s = Math.max(this.geo.minScale, Math.min(MAX_SCALE, cam.s));
    const b = this.camBounds();
    cam.x = Math.max(b.x0, Math.min(b.x1, cam.x));
    cam.y = Math.max(b.y0, Math.min(b.y1, cam.y));
  },
  // Où peut aller le centre de la caméra (unités du monde)
  camBounds() {
    const n = this.state.size;
    return { x0: -(n * TW) / 2, x1: (n * TW) / 2, y0: 0, y1: n * TH };
  },
  // Le doigt glisse de (dx, dy) pixels d'écran : la caméra suit ; au-delà du bord de l'île, elle résiste un peu (view/
  // elan.js : le dépassement se garde dans debordRaw, il revient au lâcher). En mouvement réduit, le bord bloque net
  panBy(dx, dy) {
    const s = this.cam.s;
    if (this.reduced()) {
      this.cam.x -= dx / s;
      this.cam.y -= dy / s;
      this.clampCam();
      return;
    }
    this.stepCam(-dx / s, -dy / s);
  },
  // Un pas de la caméra (unités du monde), bords souples compris
  stepCam(mx, my) {
    const b = this.camBounds();
    const raw = this.debordRaw;
    const x = avancer(this.cam.x, raw.x, mx, b.x0, b.x1);
    const y = avancer(this.cam.y, raw.y, my, b.y0, b.y1);
    this.cam.x = x.pos;
    this.cam.y = y.pos;
    this.debordRaw = { x: bornerDebord(x.raw, this.cam.s), y: bornerDebord(y.raw, this.cam.s) };
  },
  // La trace du doigt qui glisse (pour son élan au lâcher)
  noteDoigt(gesture, p) {
    gesture.trace = noter(gesture.trace, p, performance.now());
  },
  // Au lâcher : la caméra file sur son élan (trace : celle du doigt, ou null pour seulement revenir du bord), ralentit,
  // rebondit à peine contre un bord et y revient. Un doigt posé l'arrête (stopGlide) ; rien en mouvement réduit
  lancerElan(trace) {
    this.stopElan();
    if (!this.cam || this.reduced()) {
      this.debordRaw = { x: 0, y: 0 };
      return;
    }
    let { vx, vy } = trace ? vitesseOf(trace, performance.now()) : { vx: 0, vy: 0 };
    if (arretee(vx, vy) && !this.debordRaw.x && !this.debordRaw.y) return;
    let last = performance.now();
    const step = now => {
      if (this.gone || !this.cam) return;
      const dt = Math.min(50, Math.max(0, now - last));
      last = now;
      const s = this.cam.s;
      const raw = this.debordRaw;
      // (contre un bord, l'élan tombe vite ; plus d'élan : le dépassement revient)
      vx = freiner(vx, dt, Boolean(raw.x));
      vy = freiner(vy, dt, Boolean(raw.y));
      if (arretee(vx, vy)) { vx = 0; vy = 0; }
      this.stepCam(-vx * dt / s, -vy * dt / s);
      const next = this.debordRaw;
      this.debordRaw = { x: vx && Math.sign(vx) === -Math.sign(next.x) ? next.x : revenir(next.x, dt, s), y: vy && Math.sign(vy) === -Math.sign(next.y) ? next.y : revenir(next.y, dt, s) };
      // (la boucle de l'île saute cette image : un seul dessin par image, mesuré, au plus au rythme du doigt :
      // draw/loop.js, FRAME_DOIGT_MS ; le dernier toujours, pour finir où l'élan s'arrête)
      const done = !vx && !vy && !this.debordRaw.x && !this.debordRaw.y;
      if (done || now - this.lastFrame >= FRAME_DOIGT_MS) this.drawTimed(now);
      this.elanRaf = done ? 0 : requestAnimationFrame(step);
    };
    this.elanRaf = requestAnimationFrame(step);
  },
  stopElan() {
    cancelAnimationFrame(this.elanRaf);
    this.elanRaf = 0;
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
    this.drawSoon();
  },
  zoomBy(factor) {
    if (this.geo) this.zoomAt(this.geo.width / 2, this.geo.height / 2, factor);
  },
  // La caméra glisse en douceur vers { x, y, s } (ms : la durée ; en mouvement réduit, d'un coup). Un doigt posé
  // l'arrête (gestures.js, onDown) ; le démontage aussi (WorldView)
  glideTo(to, ms = GLIDE_MS) {
    cancelAnimationFrame(this.glideRaf);
    this.glideRaf = 0;
    // (une glissade prend la main sur l'élan et efface un dépassement du bord)
    this.stopElan();
    this.debordRaw = { x: 0, y: 0 };
    if (!this.geo || !this.cam) return;
    const from = { ...this.cam };
    const end = { x: to.x, y: to.y, s: to.s || from.s };
    if (this.reduced() || ms <= 0) {
      Object.assign(this.cam, end);
      this.clampCam();
      this.drawSoon();
      return;
    }
    const start = performance.now();
    const step = now => {
      const k = Math.min(1, (now - start) / ms);
      // (doux au départ, doux à l'arrivée)
      const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
      this.cam.x = from.x + (end.x - from.x) * e;
      this.cam.y = from.y + (end.y - from.y) * e;
      this.cam.s = from.s + (end.s - from.s) * e;
      this.clampCam();
      // (la boucle de l'île saute cette image : un seul dessin par image, drawSoon)
      this.lastFrame = now;
      this.draw(now);
      this.glideRaf = k < 1 ? requestAnimationFrame(step) : 0;
    };
    this.glideRaf = requestAnimationFrame(step);
  },
  stopGlide() {
    cancelAnimationFrame(this.glideRaf);
    this.glideRaf = 0;
    this.stopElan();
  }
};
