<template>
  <div ref="wrap" class="fishing">
    <canvas ref="canvas" class="fishing__canvas" aria-hidden="true"></canvas>
    <!-- Les trois couloirs d'eau : un toucher lance la ligne sous l'hameçon -->
    <button
      v-for="lane in LANES"
      :key="lane"
      type="button"
      class="fishing__lane"
      :style="{ top: `${BANDS[lane][0] * 100}%`, height: `${(BANDS[lane][1] - BANDS[lane][0]) * 100}%` }"
      :aria-label="`Lancer la ligne : ${LANE_NAMES[lane]}`"
      :disabled="!playing"
      @pointerdown.prevent="cast(lane)"
      @keydown.enter.prevent="cast(lane)"
      @keydown.space.prevent="cast(lane)"
    ></button>
  </div>
</template>

<script>
import { FISHING, FISH, fishingOf, fishX, catchAt } from '@/game/minigames';
import { vibrate } from '@/utils/fx';
import { gamePiece, gameFrame, gameUrls } from '@/game/minigameArt';

const TAU = Math.PI * 2;
const LANES = [0, 1, 2];
const LANE_NAMES = ['au large', 'au milieu', 'près du ponton'];
// Couloirs (fractions de la hauteur) : au large en haut, plus petit ; près du ponton en bas
const BANDS = [[0.2, 0.42], [0.42, 0.66], [0.66, 1]];
const LANE_Y = [0.31, 0.54, 0.83];
const LANE_SCALE = [0.72, 0.86, 1];
const DECK = 0.2;
const JUMP_MS = 650;
// Ombres des poissons sous l'eau, et leur couleur une fois sortis
const SHADOW = { gardon: 'rgba(24,48,66,.5)', truite: 'rgba(36,60,38,.52)', dore: 'rgba(246,196,70,.82)', botte: 'rgba(58,40,28,.55)' };
const SKIN = { gardon: ['#8FA9B8', '#3E5A6A'], truite: ['#A7B87A', '#4E5E33'], dore: ['#F2C04B', '#9A6A14'], botte: ['#6A4A34', '#3A2618'] };
// Les pièces de la bibliothèque (design/bibliotheque/svg/minijeux/peche) : une image chargée, ou null (le dessin par
// code la remplace en attendant)
const IMAGES = new Map();
function art(url) {
  if (!url) return null;
  let img = IMAGES.get(url);
  if (!img) {
    img = new Image();
    img.src = url;
    IMAGES.set(url, img);
  }
  return img.complete && img.naturalWidth ? img : null;
}
const piece = (name) => art(gamePiece('peche', name));
const frame = (suite, ms) => art(gameFrame('peche', suite, ms));

// Pêche : les poissons de la partie viennent de la graine du serveur ; les lancers [t, couloir] lui sont renvoyés à la
// fin (end) et il les rejoue. Le canvas dessine le ponton, l'eau, les ombres qui passent, la ligne et les prises.
export default {
  name: 'FishingBoard',
  props: {
    seed: { type: Number, required: true },
    playing: { type: Boolean, default: false }
  },
  emits: ['tally', 'end'],
  data() {
    return { LANES, LANE_NAMES, BANDS };
  },
  watch: {
    playing(on) {
      if (on && !this.started) {
        this.started = performance.now();
        this.loop();
      }
    }
  },
  created() {
    // Non réactifs : la partie, ce qui a été pris, les lancers, les effets en cours
    this.fish = fishingOf(this.seed);
    this.caught = new Set();
    this.taps = [];
    this.catches = [];
    this.free = 0;
    this.casts = [];
    this.jumps = [];
    this.texts = [];
    this.started = 0;
    this.ended = false;
    this.raf = 0;
    for (const url of gameUrls('peche')) art(url);
  },
  mounted() {
    this.resize();
    this.observer = new ResizeObserver(() => {
      this.resize();
      this.draw(this.elapsed());
    });
    this.observer.observe(this.$refs.wrap);
    this.draw(0);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.raf);
    if (this.observer) this.observer.disconnect();
  },
  methods: {
    elapsed() {
      return this.started ? Math.min(FISHING.duration, Math.round(performance.now() - this.started)) : 0;
    },
    resize() {
      const { width, height } = this.$refs.wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.W = width;
      this.H = height;
      this.$refs.canvas.width = Math.round(width * dpr);
      this.$refs.canvas.height = Math.round(height * dpr);
      this.dpr = dpr;
    },
    loop() {
      const t = this.elapsed();
      this.draw(t);
      if (t >= FISHING.duration) {
        this.finish();
        return;
      }
      this.raf = requestAnimationFrame(() => this.loop());
    },
    // Lancer : compte seulement si la ligne est sortie de l'eau ; le serveur applique la même règle
    cast(lane) {
      if (!this.playing || this.ended) return;
      const t = this.elapsed();
      if (t < this.free || this.taps.length >= FISHING.maxTaps) return;
      this.free = t + FISHING.busy;
      this.taps.push([t, lane]);
      const f = catchAt(this.fish, this.caught, t, lane);
      this.casts.push({ lane, at: t, fish: f });
      if (f) {
        this.caught.add(f.id);
        this.catches.push(f.kind);
        this.jumps.push({ kind: f.kind, lane, at: t + 180 });
        this.texts.push({ text: f.kind === 'botte' ? 'Une botte…' : `+${FISH[f.kind].value}`, lane, at: t + 500, good: f.kind !== 'botte' });
        this.$emit('tally', { raw: this.catches.reduce((s, k) => s + FISH[k].value, 0), detail: this.catches.slice() });
        vibrate(f.kind === 'dore' ? [14, 40, 20] : 12);
      } else {
        this.texts.push({ text: 'Raté', lane, at: t + 250, good: false });
        vibrate(4);
      }
    },
    finish() {
      if (this.ended) return;
      this.ended = true;
      cancelAnimationFrame(this.raf);
      this.$emit('end', this.taps.slice());
    },
    // Arrêt avant la fin (bouton « Arrêter »)
    stop() {
      this.finish();
    },

    /* ---------- Dessin ---------- */
    draw(t) {
      const ctx = this.$refs.canvas.getContext('2d');
      const { W, H } = this;
      if (!W || !H) return;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      this.water(ctx, t, W, H);
      this.shadows(ctx, t, W, H);
      this.targets(ctx, t, W, H);
      this.deck(ctx, t, W, H);
      this.line(ctx, t, W, H);
      this.leaps(ctx, t, W, H);
      this.labels(ctx, t, W, H);
    },
    water(ctx, t, W, H) {
      // Le couloir d'eau de la bibliothèque, répété en largeur dans chaque bande ; sinon le dégradé
      const lane = frame('couloir', t);
      if (lane) {
        for (const [top, bottom] of BANDS) {
          const h = (bottom - top) * H;
          const w = (h * lane.naturalWidth) / lane.naturalHeight;
          for (let x = 0; x < W; x += w) ctx.drawImage(lane, x, top * H, w, h);
        }
        return;
      }
      const g = ctx.createLinearGradient(0, DECK * H, 0, H);
      g.addColorStop(0, '#8ACDE6');
      g.addColorStop(0.45, '#5FAED6');
      g.addColorStop(1, '#3A86B8');
      ctx.fillStyle = g;
      ctx.fillRect(0, DECK * H, W, H - DECK * H);
      // Frontières des couloirs, ondulées
      ctx.strokeStyle = 'rgba(255,255,255,.22)';
      ctx.lineWidth = 1.5;
      for (const y of [BANDS[1][0], BANDS[2][0]]) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8) {
          const yy = y * H + Math.sin(x / 26 + t / 700) * 2.2;
          if (x) ctx.lineTo(x, yy);
          else ctx.moveTo(x, yy);
        }
        ctx.stroke();
      }
      // Reflets qui dérivent
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.lineWidth = 1.4;
      for (let k = 0; k < 14; k++) {
        const lane = k % 3;
        const x = ((k * 97 + t * (0.012 + lane * 0.004)) % (W + 60)) - 30;
        const y = (BANDS[lane][0] + (BANDS[lane][1] - BANDS[lane][0]) * ((k * 37) % 10) / 10) * H;
        const w = 8 + LANE_SCALE[lane] * 10;
        ctx.beginPath();
        ctx.moveTo(x - w, y);
        ctx.quadraticCurveTo(x, y - 3, x + w, y);
        ctx.stroke();
      }
    },
    // Silhouette (unité : demi-longueur du corps, tête vers +x) : poisson fuselé à nageoires, ou vieille botte
    fishPath(ctx, kind, wiggle) {
      ctx.beginPath();
      if (kind === 'botte') {
        ctx.moveTo(-0.55, -1);
        ctx.lineTo(0.05, -1);
        ctx.lineTo(0.12, 0.05);
        ctx.quadraticCurveTo(0.75, 0.05, 0.95, 0.3);
        ctx.quadraticCurveTo(1.05, 0.55, 0.85, 0.62);
        ctx.lineTo(-0.6, 0.62);
        ctx.quadraticCurveTo(-0.7, 0, -0.55, -1);
        ctx.closePath();
        return;
      }
      ctx.moveTo(1, 0);
      ctx.bezierCurveTo(0.7, -0.5, -0.4, -0.48, -0.8, -0.08);
      ctx.lineTo(-1.35, -0.46 + wiggle);
      ctx.quadraticCurveTo(-1.2, 0 + wiggle, -1.35, 0.46 + wiggle);
      ctx.lineTo(-0.8, 0.08);
      ctx.bezierCurveTo(-0.4, 0.48, 0.7, 0.5, 1, 0);
      ctx.closePath();
      // Nageoire du dos
      ctx.moveTo(0.15, -0.36);
      ctx.quadraticCurveTo(-0.15, -0.72, -0.42, -0.34);
      ctx.closePath();
    },
    shadows(ctx, t, W, H) {
      for (const f of this.fish) {
        if (this.caught.has(f.id) || t < f.t0) continue;
        const x = fishX(f, t);
        if (x < -0.2 || x > 1.2) continue;
        const s = W * 0.066 * LANE_SCALE[f.lane] * (f.kind === 'truite' ? 1.15 : f.kind === 'botte' ? 0.8 : 1);
        const y = LANE_Y[f.lane] * H + Math.sin(t / 300 + f.id) * 2;
        const swim = frame(`nage-${f.kind}`, t + f.id * 70);
        if (swim) {
          // (le poisson dessiné regarde vers la droite ; le doré luit)
          const w = s * 2.6;
          const h = (w * swim.naturalHeight) / swim.naturalWidth;
          ctx.save();
          ctx.translate(x * W, y);
          ctx.scale(f.dir, 1);
          if (f.kind === 'dore') {
            ctx.shadowColor = 'rgba(255,220,120,.95)';
            ctx.shadowBlur = 14;
          }
          ctx.globalAlpha = 0.9;
          ctx.drawImage(swim, -w / 2, -h / 2, w, h);
          ctx.restore();
          const bubbles = f.kind !== 'botte' && frame('bulles', t + f.id * 130);
          if (bubbles) {
            const bw = s * 0.5;
            ctx.globalAlpha = 0.8;
            ctx.drawImage(bubbles, x * W + f.dir * s * 1.1 - bw / 2, y - h / 2 - bw * 1.6, bw, bw * 1.67);
            ctx.globalAlpha = 1;
          }
          continue;
        }
        ctx.save();
        ctx.translate(x * W, y);
        ctx.scale(f.dir * s, s);
        // Contours flous, comme vus à travers l'eau ; le poisson doré luit
        ctx.shadowColor = f.kind === 'dore' ? 'rgba(255,220,120,.95)' : SHADOW[f.kind];
        ctx.shadowBlur = f.kind === 'dore' ? 14 : 6;
        ctx.fillStyle = SHADOW[f.kind];
        this.fishPath(ctx, f.kind, f.kind === 'botte' ? 0 : Math.sin(t / 120 + f.id) * 0.18);
        ctx.fill();
        ctx.restore();
      }
    },
    // Repère de l'hameçon dans chaque couloir : un cercle qui pulse, plus clair quand la ligne est libre
    targets(ctx, t, W, H) {
      const x = FISHING.hook * W;
      const g = ctx.createLinearGradient(x - 26, 0, x + 26, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.5, 'rgba(255,255,255,.12)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 26, DECK * H, 52, H - DECK * H);
      const ready = this.playing && t >= this.free;
      for (const lane of LANES) {
        const r = W * FISHING.reach * LANE_SCALE[lane];
        const pulse = ready ? 1 + Math.sin(t / 260) * 0.06 : 1;
        ctx.strokeStyle = ready ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.3)';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(x, LANE_Y[lane] * H, r * pulse, r * 0.42 * pulse, 0, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    },
    // Le ponton : planches, seau des prises, temps restant
    deck(ctx, t, W, H) {
      const h = DECK * H;
      const boards = piece('ponton');
      if (boards) {
        // Les planches de la bibliothèque, répétées en largeur
        ctx.fillStyle = '#B98552';
        ctx.fillRect(0, 0, W, h);
        const w = (h * boards.naturalWidth) / boards.naturalHeight;
        for (let x = 0; x < W; x += w) ctx.drawImage(boards, x, 0, w, h);
      } else {
        ctx.fillStyle = '#B98552';
        ctx.fillRect(0, 0, W, h);
        ctx.strokeStyle = 'rgba(90,58,30,.55)';
        ctx.lineWidth = 1.2;
        for (let k = 1; k < 4; k++) {
          ctx.beginPath();
          ctx.moveTo(0, (h * k) / 4);
          ctx.lineTo(W, (h * k) / 4);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,.12)';
        for (let k = 0; k < 4; k++) ctx.fillRect(0, (h * k) / 4 + 1, W, 2);
        ctx.fillStyle = '#7A5230';
        ctx.fillRect(0, h - 5, W, 5);
      }
      ctx.fillStyle = 'rgba(30,60,90,.25)';
      ctx.fillRect(0, h, W, 6);
      // Seau : vide, puis plein dès la première prise ; le compte des prises par-dessus
      const bx = W * 0.86;
      const by = h * 0.58;
      const shown = this.catches.filter(k => k !== 'botte').length;
      const pail = piece(shown ? 'seau_plein' : 'seau_vide');
      if (pail) {
        const size = h * 0.92;
        ctx.drawImage(pail, bx - size / 2, by - size * 0.62, size, size);
        ctx.font = `900 ${Math.round(h * 0.2)}px Nunito, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(58,36,20,.85)';
        ctx.strokeText(String(this.catches.length), bx, by + size * 0.12);
        ctx.fillStyle = '#FFF6E6';
        ctx.fillText(String(this.catches.length), bx, by + size * 0.12);
      } else {
        ctx.fillStyle = '#7C8C99';
        ctx.strokeStyle = '#3E4A54';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx - 16, by - 12);
        ctx.lineTo(bx + 16, by - 12);
        ctx.lineTo(bx + 12, by + 14);
        ctx.lineTo(bx - 12, by + 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(bx, by - 12, 16, 4.5, 0, 0, TAU);
        ctx.fillStyle = '#4E5C68';
        ctx.fill();
        ctx.stroke();
        for (let k = 0; k < Math.min(shown, 4); k++) {
          ctx.fillStyle = SKIN[this.catches.filter(c => c !== 'botte')[k]][0];
          ctx.beginPath();
          ctx.moveTo(bx - 8 + k * 5, by - 13);
          ctx.lineTo(bx - 11 + k * 5, by - 22);
          ctx.lineTo(bx - 5 + k * 5, by - 22);
          ctx.closePath();
          ctx.fill();
        }
        ctx.fillStyle = '#FFF6E6';
        ctx.font = `900 ${Math.round(h * 0.2)}px Nunito, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(this.catches.length), bx, by + 2);
      }
      // Temps restant
      const left = Math.ceil((FISHING.duration - t) / 1000);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#3A2414';
      ctx.font = `900 ${Math.round(h * 0.26)}px Nunito, system-ui, sans-serif`;
      ctx.fillText(`${left} s`, 14, h * 0.5);
      ctx.fillStyle = 'rgba(58,36,20,.25)';
      ctx.fillRect(0, 0, W, 5);
      ctx.fillStyle = left <= 5 ? '#E2574A' : '#F2C04B';
      ctx.fillRect(0, 0, W * (1 - t / FISHING.duration), 5);
    },
    // La ligne : elle part du bout de la canne, le bouchon se pose, plonge, puis revient
    line(ctx, t, W, H) {
      const tip = [W * 0.5, DECK * H * 0.62];
      const cast = this.casts[this.casts.length - 1];
      const rod = () => {
        ctx.strokeStyle = '#5A3A1E';
        ctx.lineWidth = 3.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(W * 0.18, -4);
        ctx.quadraticCurveTo(W * 0.34, tip[1] * 0.2, tip[0], tip[1]);
        ctx.stroke();
      };
      rod();
      let float = null;
      if (cast && t < cast.at + FISHING.busy) {
        const p = (t - cast.at) / FISHING.busy;
        const target = [W * FISHING.hook, LANE_Y[cast.lane] * H];
        if (p < 0.25) {
          const k = p / 0.25;
          float = [tip[0] + (target[0] - tip[0]) * k, tip[1] + (target[1] - tip[1]) * k - Math.sin(k * Math.PI) * 30];
        } else if (p < 0.7) {
          const plunge = cast.fish ? Math.min(1, (p - 0.25) / 0.1) * 6 : Math.sin((p - 0.25) * 30) * 1.5;
          float = [target[0], target[1] + plunge];
          // Ronds dans l'eau là où le bouchon s'est posé
          const k = (p - 0.25) / 0.45;
          const rings = frame('ronds', t - cast.at - FISHING.busy * 0.25);
          if (rings) {
            const rw = W * 0.16 * LANE_SCALE[cast.lane];
            ctx.globalAlpha = 1 - k * 0.6;
            ctx.drawImage(rings, target[0] - rw / 2, target[1] + 4 - (rw * 0.375) / 2, rw, rw * 0.375);
            ctx.globalAlpha = 1;
          } else {
            ctx.strokeStyle = `rgba(255,255,255,${0.6 * (1 - k)})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.ellipse(target[0], target[1] + 4, 8 + k * 26, (8 + k * 26) * 0.35, 0, 0, TAU);
            ctx.stroke();
          }
        } else {
          const k = (p - 0.7) / 0.3;
          float = [target[0] + (tip[0] - target[0]) * k, target[1] + (tip[1] - target[1]) * k];
        }
      }
      if (float) {
        ctx.strokeStyle = 'rgba(255,255,255,.85)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tip[0], tip[1]);
        ctx.quadraticCurveTo((tip[0] + float[0]) / 2, Math.max(tip[1], float[1]) + 10, float[0], float[1]);
        ctx.stroke();
        // Le bouchon de la bibliothèque : il flotte, plonge quand ça mord ; la ligne qui revient vide montre l'hameçon
        const p = (t - cast.at) / FISHING.busy;
        const bite = cast.fish && p >= 0.25 && p < 0.7;
        const bob = bite ? frame('bouchon-touche', t - cast.at - FISHING.busy * 0.25) : frame('bouchon-flotte', t);
        if (bob) {
          const bw = W * 0.05;
          const bh = bw * 1.5;
          ctx.drawImage(bob, float[0] - bw / 2, float[1] - bh * 0.72, bw, bh);
          const hook = p >= 0.7 && !cast.fish && piece('hamecon');
          if (hook) ctx.drawImage(hook, float[0] - bw * 0.25, float[1] + bh * 0.08, bw * 0.5, bw * 0.75);
          return;
        }
        ctx.fillStyle = '#E2453A';
        ctx.beginPath();
        ctx.arc(float[0], float[1] - 3, 4.2, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(float[0], float[1] - 3, 4.2, 0, Math.PI);
        ctx.fill();
      }
    },
    // Les prises bondissent hors de l'eau jusqu'au seau
    leaps(ctx, t, W, H) {
      const bucket = [W * 0.86, DECK * H * 0.42];
      for (const j of this.jumps) {
        const k = (t - j.at) / JUMP_MS;
        if (k < 0 || k > 1) continue;
        const from = [W * FISHING.hook, LANE_Y[j.lane] * H];
        const x = from[0] + (bucket[0] - from[0]) * k;
        const y = from[1] + (bucket[1] - from[1]) * k - Math.sin(k * Math.PI) * H * 0.18;
        const s = W * 0.05 * (1 - 0.35 * k);
        // L'éclaboussure là où la prise sort de l'eau
        const splash = frame('eclaboussure', t - j.at);
        if (splash && t - j.at < 360) {
          const sw = W * 0.14 * LANE_SCALE[j.lane];
          ctx.drawImage(splash, from[0] - sw / 2, from[1] - sw * 0.6, sw, sw * 0.75);
        }
        // La prise ferrée de la bibliothèque, au bout de la ligne, qui se balance jusqu'au seau
        const hooked = frame(`ferre-${j.kind}`, t - j.at);
        if (hooked) {
          const fh = s * 3.4;
          const fw = (fh * hooked.naturalWidth) / hooked.naturalHeight;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.sin(k * Math.PI * 2) * 0.25);
          ctx.drawImage(hooked, -fw / 2, -fh * 0.3, fw, fh);
          ctx.restore();
          continue;
        }
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.9 + k * 1.8);
        ctx.scale(s, s);
        ctx.fillStyle = SKIN[j.kind][0];
        ctx.strokeStyle = SKIN[j.kind][1];
        ctx.lineWidth = 1.6 / s;
        this.fishPath(ctx, j.kind, Math.sin(t / 60) * 0.25);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        if (k < 0.3 && !splash) {
          ctx.fillStyle = `rgba(255,255,255,${0.8 * (1 - k / 0.3)})`;
          for (let d = 0; d < 6; d++) {
            const a = (d / 6) * Math.PI + Math.PI;
            ctx.beginPath();
            ctx.arc(from[0] + Math.cos(a) * 16 * (k / 0.3 + 0.3), from[1] + Math.sin(a) * 10 * (k / 0.3 + 0.3), 2.2, 0, TAU);
            ctx.fill();
          }
        }
      }
    },
    labels(ctx, t, W, H) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const l of this.texts) {
        const k = (t - l.at) / 900;
        if (k < 0 || k > 1) continue;
        ctx.globalAlpha = 1 - k;
        ctx.font = `900 ${Math.round(W * 0.05)}px Nunito, system-ui, sans-serif`;
        ctx.fillStyle = l.good ? '#FFF2B8' : '#FFFFFF';
        ctx.strokeStyle = 'rgba(30,50,70,.6)';
        ctx.lineWidth = 3;
        const y = LANE_Y[l.lane] * H - 20 - k * 22;
        ctx.strokeText(l.text, W * FISHING.hook + 34, y);
        ctx.fillText(l.text, W * FISHING.hook + 34, y);
        ctx.globalAlpha = 1;
      }
    }
  }
};
</script>

<style scoped src="./FishingBoard.css"></style>
