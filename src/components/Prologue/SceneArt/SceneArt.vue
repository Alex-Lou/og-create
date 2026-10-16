<template>
  <!-- Une scène du tutoriel dessinée par la bibliothèque (game/sceneArt.js) : le carré entier, aussi grand que l'écran le
       permet au-dessus de la bulle (sur un téléphone en hauteur, le recadrer couperait l'avatar ou celui qui parle).
       Au-dessus et au-dessous, la couleur de ses bords, nette (le ciel en haut, le sol en bas ; choix de l'auteur,
       16 oct. : des images claires, rien de flouté). Le fond, ce qui bouge dessus (s'il est à part), l'avatar, puis le
       devant ; leurs images en boucle.
       Le carré est peint dans deux images (canvas), une fois par image de la scène : dessous le fond, dessus l'avatar et
       le devant ; leurs dessins sont lus une fois à sa taille (raster.js), puis seulement recopiés (le navigateur
       repeignait leurs vecteurs et leurs centaines d'animations à chaque image de l'écran : la scène du conseil ramait ;
       choix de l'auteur, 16 oct. : l'image figée, nette). Entre les deux, le calque « anime » d'une scène qui en a un
       (léger, livré à part par la bibliothèque) se joue tel quel. Par-dessus, le temps qu'il fait (meteo) : le ciel qui
       s'assombrit, la pluie. Une scène en papier découpé (camera) : la caméra s'y avance lentement et dérive, recadrée
       dans le carré (comme la cinématique de la porte du phare ; choix de l'auteur, 16 oct.).
       Une seule racine : la scène l'anime en fondu -->
  <div class="sa" :style="fillStyle" aria-hidden="true">
    <template v-if="data">
      <div class="sa__stage">
        <div ref="square" :class="['sa__square', { 'sa__square--camera': data.camera }]">
          <div :class="['sa__art', { 'sa__art--breathing': data.still, 'sa__art--camera': data.camera }]">
            <canvas ref="under" class="sa__paint" />
            <img v-for="(href, k) in data.live" :key="`l${k}`" class="sa__paint" :src="href" alt="" :style="{ visibility: k === frame % data.live.length ? 'visible' : 'hidden' }" />
            <canvas ref="over" class="sa__paint" />
            <svg v-if="name" class="sa__paint" viewBox="0 0 400 400">
              <text class="sa__name" :x="NAME_LINE.x" :y="NAME_LINE.y" :textLength="name.length > 12 ? NAME_LINE.w : null" lengthAdjust="spacingAndGlyphs">{{ name }}</text>
            </svg>
          </div>
        </div>
      </div>
      <template v-if="meteo">
        <div class="sa__nuages" :style="{ opacity: meteo.nuages || 0 }" />
        <canvas ref="pluie" class="sa__pluie" />
      </template>
    </template>
  </div>
</template>

<script>
import { sceneOf, avatarFrames, avatarBox, NAME_LINE } from '@/game/sceneArt';
import { reducedMotion } from '@/utils/fx';
import { rasterOf, edgeColors } from './raster';

// Le carré de la scène (unités de ses SVG) ; la finesse de son image au plus (pixels par pixel d'écran)
const ART = 400;
const MAX_DPR = 3;
// La pluie (meteo.pluie, de 0 à 1) : ses gouttes au plus, leur pente, la vitesse à laquelle elle forcit ou faiblit (par
// seconde) ; la finesse de son image au plus
const DROPS = 150;
const SLANT = 0.16;
const RAIN_EASE = 0.5;
const RAIN_DPR = 2;
// Un nombre entre 0 et 1, toujours le même pour (n, k) : la place et l'allure de chaque goutte
const hash = (n, k) => {
  const x = Math.sin(n * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export default {
  name: 'SceneArt',
  props: {
    // La scène de la bibliothèque (scenes.json : 01_greve, 02_rocher…)
    scene: { type: String, required: true },
    // L'avatar du joueur : l'un des exemples (game/sceneArt.js, LOOKS), ou ses choix (game/avatarKit.js)
    look: { type: [String, Object], default: '' },
    // Le joueur n'est pas encore à l'écran : on voit par ses yeux
    alone: { type: Boolean, default: false },
    // Une autre vue ou pose que celle de la scène ({ vue, pose } : grelotter de face, quand il a peur)
    pose: { type: Object, default: null },
    // La scène reste sur sa première image (le feu pas encore pris)
    still: { type: Boolean, default: false },
    // Le nom écrit sur la ligne « Nom » de la carte d'embarquement
    name: { type: String, default: '' },
    // Le temps qu'il fait sur la scène ({ nuages, pluie }, de 0 à 1 : le conseil, texts/tutorial/scenes.js), ou null
    meteo: { type: Object, default: null }
  },
  data() {
    return { NAME_LINE, frame: 0, px: 0, fill: null };
  },
  computed: {
    data() {
      return sceneOf(this.scene);
    },
    body() {
      if (!this.data || !this.data.avatar || this.alone) return null;
      const spot = { ...this.data.avatar, ...this.pose };
      return { ...avatarBox(spot), frames: avatarFrames(this.look, spot), axis: spot.miroir ? spot.x : null };
    },
    fillStyle() {
      return this.fill ? { '--sa-fill-top': this.fill.top, '--sa-fill-bottom': this.fill.bottom } : null;
    }
  },
  watch: {
    frame() {
      this.paint();
    },
    body() {
      this.paint();
    },
    // (la pluie se relance quand elle se met à tomber : sa boucle s'arrête tant qu'il ne pleut pas)
    meteo(now) {
      if (!now) {
        cancelAnimationFrame(this.rainRaf);
        this.rainRaf = 0;
      } else if (!this.rainRaf) this.$nextTick(() => this.startRain());
    }
  },
  mounted() {
    // Les images tournent en boucle ; avec le mouvement réduit, la première reste
    if (this.data && this.data.frames > 1 && !this.still && !reducedMotion()) this.timer = setInterval(() => this.frame++, this.data.ms);
    if (this.$refs.square && window.ResizeObserver) {
      this.observer = new ResizeObserver(() => this.measure());
      this.observer.observe(this.$refs.square);
    }
    this.measure();
    if (this.meteo) this.startRain();
  },
  beforeUnmount() {
    clearInterval(this.timer);
    if (this.observer) this.observer.disconnect();
    cancelAnimationFrame(this.rainRaf);
    this.token = (this.token || 0) + 1;
  },
  methods: {
    // La taille du carré à l'écran : son image s'y accorde (et se repeint) quand elle change
    measure() {
      const { square, under, over } = this.$refs;
      if (!square || !under || !over) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const px = Math.round(square.getBoundingClientRect().width * dpr);
      if (!px || px === this.px) return;
      this.px = px;
      under.width = under.height = over.width = over.height = px;
      // (toutes les images de la scène se lisent tout de suite : la boucle ne les attend pas)
      for (let f = 0; f < Math.max(1, this.data.frames); f++) {
        const { under: below, over: above } = this.layersOf(f);
        [...below, ...above].forEach(layer => this.rasterOf(layer));
      }
      this.paint();
    },
    // Les calques peints d'une image de la scène, en unités du carré : dessous le fond ; dessus l'avatar (sa place, son
    // miroir, sa photo), puis le devant
    layersOf(f) {
      const pick = list => (list.length ? [{ href: list[f % list.length], x: 0, y: 0, w: ART, h: ART }] : []);
      const body = this.body;
      const avatar = body && body.frames.length ? [{ href: body.frames[f % body.frames.length], x: body.x, y: body.y, w: body.w, h: body.h, axis: body.axis, clip: body.clip }] : [];
      return { under: pick(this.data.back), over: [...avatar, ...pick(this.data.front)] };
    },
    rasterOf(layer) {
      const k = this.px / ART;
      return rasterOf(layer.href, Math.max(1, Math.round(layer.w * k)), Math.max(1, Math.round(layer.h * k)));
    },
    // L'image du moment, peinte quand ses calques sont lus (une image plus récente demandée entre-temps passe devant) ;
    // la première fois, la couleur des bords de son fond
    async paint() {
      if (!this.data || !this.px) return;
      const token = (this.token = (this.token || 0) + 1);
      const { under, over } = this.layersOf(this.frame);
      const [below, above] = await Promise.all([under, over].map(list => Promise.all(list.map(layer => this.rasterOf(layer)))));
      if (token !== this.token || !this.$refs.under || !this.$refs.over) return;
      this.paintInto(this.$refs.under, under, below);
      this.paintInto(this.$refs.over, over, above);
      if (!this.fill && below[0]) this.fill = edgeColors(below[0]);
    },
    paintInto(canvas, layers, images) {
      const k = this.px / ART;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      layers.forEach((layer, i) => {
        if (!images[i]) return;
        ctx.save();
        if (layer.clip) {
          const { x, y, width, height } = layer.clip;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x * k, y * k, width * k, height * k, 4 * k);
          else ctx.rect(x * k, y * k, width * k, height * k);
          ctx.clip();
        }
        if (layer.axis !== null && layer.axis !== undefined) {
          ctx.translate(layer.axis * 2 * k, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(images[i], layer.x * k, layer.y * k, layer.w * k, layer.h * k);
        ctx.restore();
      });
    },
    // La pluie sur la scène : des traits qui tombent en biais, plus ou moins nombreux selon meteo.pluie (elle forcit et
    // faiblit doucement) ; avec le mouvement réduit, une image fixe
    startRain() {
      cancelAnimationFrame(this.rainRaf);
      const canvas = this.$refs.pluie;
      if (!canvas) return;
      const still = reducedMotion();
      let last = performance.now();
      this.rainK = this.rainK || (still ? (this.meteo && this.meteo.pluie) || 0 : 0);
      const step = now => {
        const target = (this.meteo && this.meteo.pluie) || 0;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        this.rainK = still ? target : this.rainK < target ? Math.min(target, this.rainK + dt * RAIN_EASE) : Math.max(target, this.rainK - dt * RAIN_EASE);
        this.drawRain(canvas, still ? 0 : now / 1000);
        this.rainRaf = !still && (this.rainK > 0 || target > 0) ? requestAnimationFrame(step) : 0;
      };
      this.rainRaf = requestAnimationFrame(step);
    },
    drawRain(canvas, t) {
      const dpr = Math.min(window.devicePixelRatio || 1, RAIN_DPR);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);
      const n = Math.round(DROPS * this.rainK);
      if (!n) return;
      const span = w + h * SLANT;
      ctx.strokeStyle = 'rgba(205, 218, 240, 0.42)';
      ctx.lineWidth = 1.1 * dpr;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const len = (14 + hash(i, 3) * 16) * dpr;
        const speed = (900 + hash(i, 5) * 600) * dpr;
        const y = ((hash(i, 7) * (h + len) + t * speed) % (h + len)) - len;
        // (en tombant, elle glisse vers la gauche ; sortie d'un côté, elle revient de l'autre)
        const x = (((hash(i, 1) * span - y * SLANT) % span) + span) % span;
        ctx.moveTo(x, y);
        ctx.lineTo(x - len * SLANT, y + len);
      }
      ctx.stroke();
    }
  }
};
</script>

<style scoped src="./SceneArt.css"></style>
