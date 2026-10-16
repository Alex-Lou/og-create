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
import { vibrate, reducedMotion } from '@/utils/fx';
import { gamePiece, gameFrame } from '@/game/minigameArt';
import { createStage } from '@/game/stage/stage';
import { createSpriteCache } from '@/game/stage/sprites';
import { horlogeDePartie } from '@/game/stage/horloge';
import { FISH_FX, fishWord, nextStreak, tierOfStreak } from '@/game/fishingFx';

const TAU = Math.PI * 2;
const LANES = [0, 1, 2];
const LANE_NAMES = ['au large', 'au milieu', 'près du ponton'];
// Couloirs (fractions de la hauteur) : au large en haut, plus petit ; près du ponton en bas
const BANDS = [[0.2, 0.42], [0.42, 0.66], [0.66, 1]];
const LANE_Y = [0.31, 0.54, 0.83];
const LANE_SCALE = [0.72, 0.86, 1];
const DECK = 0.2;
const JUMP_MS = 650;
const BUMP_MS = 320; // le seau qui bondit quand une prise y tombe
// Ombres des poissons sous l'eau, et leur couleur une fois sortis (le dessin par code, en attendant la bibliothèque)
const SHADOW = { gardon: 'rgba(24,48,66,.5)', truite: 'rgba(36,60,38,.52)', dore: 'rgba(246,196,70,.82)', botte: 'rgba(58,40,28,.55)' };
const SKIN = { gardon: ['#8FA9B8', '#3E5A6A'], truite: ['#A7B87A', '#4E5E33'], dore: ['#F2C04B', '#9A6A14'], botte: ['#6A4A34', '#3A2618'] };
// La pression d'une prise dans la main, selon son palier
const HAPTICS = [12, 12, [14, 30, 14], [14, 30, 14, 30, 22], [16, 30, 16, 30, 16, 30, 28], [20, 30, 20, 30, 20, 30, 40]];
const piece = name => gamePiece('peche', name);
const frame = (suite, ms) => gameFrame('peche', suite, ms);

// Pêche : les poissons de la partie viennent de la graine du serveur ; les lancers [t, couloir] lui sont renvoyés à la
// fin (end) et il les rejoue. La scène (game/stage) dessine le ponton, l'eau, les ombres qui passent, la ligne et les
// prises, avec les dessins de la bibliothèque précuits à leur taille ; chaque prise dit son mot (game/fishingFx.js),
// les prises d'affilée montent les paliers féeriques.
export default {
  name: 'FishingBoard',
  props: {
    seed: { type: Number, required: true },
    playing: { type: Boolean, default: false },
    // la durée (ms) de la partie (les premières sont courtes : game/minigames.js, SHORT), sinon celle d'une partie normale
    limit: { type: Number, default: null }
  },
  emits: ['tally', 'end'],
  data() {
    return { LANES, LANE_NAMES, BANDS };
  },
  computed: {
    // La durée (ou les coups) de cette partie
    span() {
      return this.limit || FISHING.duration;
    }
  },
  watch: {
    playing(on) {
      if (on && !this.horloge.started) {
        this.horloge.start();
        this.stage.wake();
      }
    }
  },
  created() {
    // Non réactifs : la partie, ce qui a été pris, les lancers, les effets en cours (rangés au temps de la partie)
    this.fish = fishingOf(this.seed, this.span);
    this.caught = new Set();
    this.taps = [];
    this.catches = [];
    this.free = 0;
    this.casts = [];
    this.jumps = [];
    this.soon = [];
    this.streak = 0;
    this.said = { miss: 0 };
    this.bumpAt = -Infinity;
    // (le temps de jeu : en pause quand la page est cachée)
    this.horloge = horlogeDePartie();
    this.ended = false;
    this.reduced = reducedMotion();
  },
  mounted() {
    this.stage = createStage(this.$refs.canvas, (ctx, stage) => this.frameOf(ctx, stage), { reduced: this.reduced });
    this.sprites = createSpriteCache(this.stage.dpr, () => this.stage.wake());
  },
  beforeUnmount() {
    this.horloge.stop();
    if (this.stage) this.stage.destroy();
  },
  methods: {
    elapsed() {
      return Math.min(this.span, Math.round(this.horloge.elapsed()));
    },
    // Un dessin de la bibliothèque précuit à la taille w (sa hauteur suit sa proportion) : { img, w, h }, ou null
    art(url, w) {
      const ratio = this.sprites.ratio(url);
      if (!ratio) return null;
      const h = w * ratio;
      return { img: this.sprites.get(url, w, h), w, h };
    },
    // Ce qui arrive plus tard dans la partie (une éclaboussure, un mot) : à l'instant at (ms de partie)
    later(at, fn) {
      this.soon.push({ at, fn });
    },
    // Une image de la scène : la partie avance au temps réel ; rend vrai tant qu'elle se joue
    frameOf(ctx, stage) {
      const t = this.elapsed();
      if (this.soon.length) {
        const due = this.soon.filter(s => s.at <= t);
        this.soon = this.soon.filter(s => s.at > t);
        due.forEach(s => s.fn());
      }
      this.draw(ctx, t, stage.w, stage.h);
      if (this.horloge.started && !this.ended && t >= this.span) this.finish();
      return this.horloge.started && (!this.ended || this.soon.length > 0 || t < this.bumpAt + BUMP_MS);
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
      const { w: W, h: H } = this.stage;
      const hook = [W * FISHING.hook, LANE_Y[lane] * H];
      // le bouchon se pose : des gouttes
      this.later(t + FISHING.busy * 0.25, () => this.stage.particles.burst(hook[0], hook[1], { n: 6, shape: 'drop', colors: ['#E4F6FF', '#A9DBF1'], speed: [W * 0.1, W * 0.22], angle: -Math.PI / 2, spread: 1.6, size: [2, 3.5], gravity: W * 1.2, life: [300, 500] }));
      if (f) this.landed(f, lane, t, hook);
      else {
        this.streak = nextStreak(this.streak, null);
        this.later(t + 300, () => this.stage.texts.add({ text: fishWord(null, this.said.miss++), x: hook[0] + W * 0.12, y: hook[1] - H * 0.03, size: Math.round(W * 0.045), fill: ['#FFFFFF', '#9FB8C8'], life: 800, rise: H * 0.03 }));
        vibrate(4);
      }
      this.stage.wake();
    },
    // Une prise : elle bondit jusqu'au seau ; son mot, ses éclats, et le palier si la série en atteint un
    landed(f, lane, t, hook) {
      const { w: W, h: H } = this.stage;
      const fx = FISH_FX[f.kind];
      const before = tierOfStreak(this.streak);
      this.streak = nextStreak(this.streak, f.kind);
      const tier = tierOfStreak(this.streak);
      this.caught.add(f.id);
      this.catches.push(f.kind);
      this.jumps.push({ kind: f.kind, lane, at: t + 180 });
      this.said[f.kind] = (this.said[f.kind] || 0) + 1;
      const word = fishWord(f.kind, this.said[f.kind] - 1);
      const gold = f.kind === 'dore';
      this.later(t + 180, () => {
        this.stage.particles.burst(hook[0], hook[1], { n: gold ? 14 : 9, shape: 'drop', colors: ['#E4F6FF', '#A9DBF1', '#FFFFFF'], speed: [W * 0.15, W * 0.4], angle: -Math.PI / 2, spread: 1.4, size: [2.5, 4.5], gravity: W * 1.4, life: [380, 650] });
        this.stage.particles.burst(hook[0], hook[1], { n: gold ? 10 : 5, shape: gold ? 'star' : 'circle', colors: fx.colors, speed: [W * 0.1, W * 0.3], size: [2, gold ? 6 : 3.5], gravity: W * 0.4, life: [500, 900] });
        this.stage.texts.add({ text: word, x: hook[0] + W * 0.14, y: hook[1] - H * 0.06, size: Math.round(W * (gold ? 0.075 : 0.06)), fill: fx.fill, look: f.kind === 'botte' ? 'gain' : 'word', tilt: (Math.random() - 0.5) * 0.25, life: 950, rise: H * 0.04 });
        if (gold) {
          this.stage.flash('rgba(255, 236, 170, 1)', 260);
          this.stage.shake(6);
        }
      });
      // au seau : le gain, le seau qui bondit ; puis le palier atteint
      this.later(t + 180 + JUMP_MS, () => {
        this.bumpAt = this.elapsed();
        const bucket = [W * 0.86, DECK * H * 0.42];
        if (FISH[f.kind].value) this.stage.texts.add({ text: `+${FISH[f.kind].value}`, x: bucket[0], y: bucket[1] + DECK * H * 0.9, size: Math.round(W * 0.05), fill: ['#FFF6D6', '#F2B33D'], life: 900, rise: H * 0.05 });
        this.stage.particles.burst(bucket[0], bucket[1], { n: 5, shape: 'star', colors: ['#FFF6D6', '#F2B33D'], speed: [W * 0.08, W * 0.2], size: [2, 4], gravity: W * 0.3, life: [400, 700] });
        if (tier.label && tier.rank > before.rank) {
          this.stage.texts.add({ text: tier.label, x: W / 2, y: H * 0.3, size: Math.round(W * (0.08 + tier.rank * 0.008)), fill: tier.fill, font: 'display', look: 'label', rays: tier.rank >= 3, life: 1400, rise: H * 0.03 });
          this.stage.particles.burst(W / 2, H * 0.3, { n: 6 + tier.rank * 3, shape: 'star', colors: ['#FFF6D6', tier.fill[1], '#F2B33D'], speed: [W * 0.2, W * 0.45], size: [2.5, 5.5], gravity: W * 0.3, life: [600, 1000] });
          this.stage.shake(tier.shake);
          if (tier.flash) this.stage.flash(tier.flash, 280);
          if (tier.freeze) this.stage.freeze(tier.freeze);
        }
      });
      this.$emit('tally', { raw: this.catches.reduce((sum, k) => sum + FISH[k].value, 0), detail: this.catches.slice() });
      vibrate(gold ? HAPTICS[3] : HAPTICS[tier.rank]);
    },
    finish() {
      if (this.ended) return;
      this.ended = true;
      this.$emit('end', this.taps.slice());
    },
    // Arrêt avant la fin (bouton « Arrêter »)
    stop() {
      this.finish();
    },

    /* ---------- Dessin ---------- */
    draw(ctx, t, W, H) {
      if (!W || !H) return;
      this.water(ctx, t, W, H);
      this.shadows(ctx, t, W, H);
      this.targets(ctx, t, W, H);
      this.deck(ctx, t, W, H);
      this.line(ctx, t, W, H);
      this.leaps(ctx, t, W, H);
    },
    water(ctx, t, W, H) {
      // Le couloir d'eau de la bibliothèque, répété en largeur dans chaque bande ; sinon le dégradé
      const url = frame('couloir', t);
      const ratio = this.sprites.ratio(url);
      if (ratio) {
        for (const [top, bottom] of BANDS) {
          const h = (bottom - top) * H;
          const w = h / ratio;
          const img = this.sprites.get(url, w, h);
          for (let x = 0; x < W; x += w) ctx.drawImage(img, x, top * H, w, h);
        }
        return;
      }
      const g = ctx.createLinearGradient(0, DECK * H, 0, H);
      g.addColorStop(0, '#8ACDE6');
      g.addColorStop(0.45, '#5FAED6');
      g.addColorStop(1, '#3A86B8');
      ctx.fillStyle = g;
      ctx.fillRect(0, DECK * H, W, H - DECK * H);
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
      ctx.moveTo(0.15, -0.36);
      ctx.quadraticCurveTo(-0.15, -0.72, -0.42, -0.34);
      ctx.closePath();
    },
    // Un halo doré sous le poisson doré (au lieu d'un flou d'ombre, qui coûte cher à chaque image)
    halo(ctx, x, y, r, t) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255, 220, 120, ${0.55 + Math.sin(t / 180) * 0.15})`);
      g.addColorStop(1, 'rgba(255, 220, 120, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    },
    shadows(ctx, t, W, H) {
      for (const f of this.fish) {
        if (this.caught.has(f.id) || t < f.t0) continue;
        const x = fishX(f, t);
        if (x < -0.2 || x > 1.2) continue;
        const s = W * 0.066 * LANE_SCALE[f.lane] * (f.kind === 'truite' ? 1.15 : f.kind === 'botte' ? 0.8 : 1);
        const y = LANE_Y[f.lane] * H + Math.sin(t / 300 + f.id) * 2;
        if (f.kind === 'dore') this.halo(ctx, x * W, y, s * 1.6, t);
        const swim = this.art(frame(`nage-${f.kind}`, t + f.id * 70), s * 2.6);
        if (swim) {
          // (le poisson dessiné regarde vers la droite)
          ctx.save();
          ctx.translate(x * W, y);
          ctx.scale(f.dir, 1);
          ctx.globalAlpha = 0.9;
          ctx.drawImage(swim.img, -swim.w / 2, -swim.h / 2, swim.w, swim.h);
          ctx.restore();
          const bubbles = f.kind !== 'botte' && this.art(frame('bulles', t + f.id * 130), s * 0.5);
          if (bubbles) {
            ctx.globalAlpha = 0.8;
            ctx.drawImage(bubbles.img, x * W + f.dir * s * 1.1 - bubbles.w / 2, y - swim.h / 2 - bubbles.w * 1.6, bubbles.w, bubbles.h);
            ctx.globalAlpha = 1;
          }
          continue;
        }
        ctx.save();
        ctx.translate(x * W, y);
        ctx.scale(f.dir * s, s);
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
    // Le ponton : planches, seau des prises (qui bondit quand une prise y tombe), temps restant
    deck(ctx, t, W, H) {
      const h = DECK * H;
      ctx.fillStyle = '#B98552';
      ctx.fillRect(0, 0, W, h);
      const boardsUrl = piece('ponton');
      const ratio = this.sprites.ratio(boardsUrl);
      if (ratio) {
        const w = h / ratio;
        const img = this.sprites.get(boardsUrl, w, h);
        for (let x = 0; x < W; x += w) ctx.drawImage(img, x, 0, w, h);
      }
      ctx.fillStyle = 'rgba(30,60,90,.25)';
      ctx.fillRect(0, h, W, 6);
      const bx = W * 0.86;
      const by = h * 0.58;
      const shown = this.catches.filter(k => k !== 'botte').length;
      const k = (t - this.bumpAt) / BUMP_MS;
      const bump = k >= 0 && k < 1 && !this.reduced ? 1 + Math.sin(k * Math.PI) * 0.18 : 1;
      const size = h * 0.92;
      const pail = this.art(piece(shown ? 'seau_plein' : 'seau_vide'), size);
      ctx.save();
      ctx.translate(bx, by + size * 0.38);
      ctx.scale(bump, 2 - bump);
      if (pail) ctx.drawImage(pail.img, -size / 2, -size, size, size);
      ctx.restore();
      ctx.font = `900 ${Math.round(h * 0.2)}px ${this.stage.fonts.ui}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(58,36,20,.85)';
      ctx.strokeText(String(this.catches.length), bx, by + size * 0.12);
      ctx.fillStyle = '#FFF6E6';
      ctx.fillText(String(this.catches.length), bx, by + size * 0.12);
      // Temps restant
      const left = Math.ceil((this.span - t) / 1000);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#3A2414';
      ctx.font = `900 ${Math.round(h * 0.26)}px ${this.stage.fonts.ui}`;
      ctx.fillText(`${left} s`, 14, h * 0.5);
      ctx.fillStyle = 'rgba(58,36,20,.25)';
      ctx.fillRect(0, 0, W, 5);
      ctx.fillStyle = left <= 5 ? '#E2574A' : '#F2C04B';
      ctx.fillRect(0, 0, W * (1 - t / this.span), 5);
    },
    // La ligne : elle part du bout de la canne, le bouchon se pose, plonge, puis revient
    line(ctx, t, W, H) {
      const tip = [W * 0.5, DECK * H * 0.62];
      const cast = this.casts[this.casts.length - 1];
      ctx.strokeStyle = '#5A3A1E';
      ctx.lineWidth = 3.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(W * 0.18, -4);
      ctx.quadraticCurveTo(W * 0.34, tip[1] * 0.2, tip[0], tip[1]);
      ctx.stroke();
      if (!cast || t >= cast.at + FISHING.busy) return;
      const p = (t - cast.at) / FISHING.busy;
      const target = [W * FISHING.hook, LANE_Y[cast.lane] * H];
      let float;
      if (p < 0.25) {
        const k = p / 0.25;
        float = [tip[0] + (target[0] - tip[0]) * k, tip[1] + (target[1] - tip[1]) * k - Math.sin(k * Math.PI) * 30];
      } else if (p < 0.7) {
        const plunge = cast.fish ? Math.min(1, (p - 0.25) / 0.1) * 6 : Math.sin((p - 0.25) * 30) * 1.5;
        float = [target[0], target[1] + plunge];
        // Ronds dans l'eau là où le bouchon s'est posé
        const k = (p - 0.25) / 0.45;
        const rings = this.art(frame('ronds', t - cast.at - FISHING.busy * 0.25), W * 0.16 * LANE_SCALE[cast.lane]);
        if (rings) {
          ctx.globalAlpha = 1 - k * 0.6;
          ctx.drawImage(rings.img, target[0] - rings.w / 2, target[1] + 4 - rings.h / 2, rings.w, rings.h);
          ctx.globalAlpha = 1;
        }
      } else {
        const k = (p - 0.7) / 0.3;
        float = [target[0] + (tip[0] - target[0]) * k, target[1] + (tip[1] - target[1]) * k];
      }
      ctx.strokeStyle = 'rgba(255,255,255,.85)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tip[0], tip[1]);
      ctx.quadraticCurveTo((tip[0] + float[0]) / 2, Math.max(tip[1], float[1]) + 10, float[0], float[1]);
      ctx.stroke();
      // Le bouchon de la bibliothèque : il flotte, plonge quand ça mord ; la ligne qui revient vide montre l'hameçon
      const bite = cast.fish && p >= 0.25 && p < 0.7;
      const bob = this.art(bite ? frame('bouchon-touche', t - cast.at - FISHING.busy * 0.25) : frame('bouchon-flotte', t), W * 0.05);
      if (bob) {
        ctx.drawImage(bob.img, float[0] - bob.w / 2, float[1] - bob.h * 0.72, bob.w, bob.h);
        const hook = p >= 0.7 && !cast.fish && this.art(piece('hamecon'), bob.w * 0.5);
        if (hook) ctx.drawImage(hook.img, float[0] - bob.w * 0.25, float[1] + bob.h * 0.08, hook.w, hook.h);
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
        const splash = t - j.at < 360 && this.art(frame('eclaboussure', t - j.at), W * 0.14 * LANE_SCALE[j.lane]);
        if (splash) ctx.drawImage(splash.img, from[0] - splash.w / 2, from[1] - splash.h * 0.8, splash.w, splash.h);
        if (j.kind === 'dore') this.halo(ctx, x, y, s * 2.4, t);
        // La prise ferrée de la bibliothèque, au bout de la ligne, qui se balance jusqu'au seau
        const url = frame(`ferre-${j.kind}`, t - j.at);
        const ratio = this.sprites.ratio(url);
        if (ratio) {
          const fh = s * 3.4;
          const fw = fh / ratio;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.sin(k * Math.PI * 2) * 0.25);
          ctx.drawImage(this.sprites.get(url, fw, fh), -fw / 2, -fh * 0.3, fw, fh);
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
      }
    }
  }
};
</script>

<style scoped src="./FishingBoard.css"></style>
