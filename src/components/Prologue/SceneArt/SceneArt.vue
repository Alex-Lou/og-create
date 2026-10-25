<template>
  <!-- Une scène du tutoriel dessinée par la bibliothèque (game/sceneArt.js) : le carré entier, aussi grand que l'écran le
       permet au-dessus de la bulle (sur un téléphone en hauteur, le recadrer couperait l'avatar ou celui qui parle).
       Au-dessus et au-dessous, la couleur de ses bords, nette (le ciel en haut, le sol en bas ; choix de l'auteur,
       16 oct. : des images claires, rien de flouté). Le fond, ce qui bouge dessus (s'il est à part), l'avatar, puis le
       devant ; leurs images en boucle.
       Le carré est peint dans deux images (canvas), une fois par image de la scène : dessous le fond, dessus l'avatar et
       le devant ; leurs dessins sont lus une fois (raster.js : par bandes, sans geler l'écran), puis seulement
       recopiés (le navigateur repeignait leurs vecteurs et leurs centaines d'animations à chaque image de l'écran : la
       scène du conseil ramait ; choix de l'auteur, 16 oct. : l'image figée, nette). Entre les deux, le calque « anime » d'une scène qui en a un
       (léger, livré à part par la bibliothèque) se joue tel quel. Par-dessus, le temps qu'il fait (meteo) : le ciel qui
       s'assombrit, la pluie.
       Une seule racine : la scène l'anime en fondu -->
  <div :class="['sa', { 'sa--plans': data && data.plans }]" :style="fillStyle" aria-hidden="true">
    <template v-if="data">
      <div class="sa__stage">
        <div ref="square" :class="['sa__square', { 'sa__square--tall': squareStyle, 'sa__square--plans': data.plans }]" :style="squareStyle">
          <ScenePlans v-if="data.plans" :plans="data.plans" :partition="data.partition" :beat="beat" :width="cssWidth" @edges="onEdges" @temps="onTemps">
            <template #avatar>
              <canvas ref="over" class="sa__paint" />
            </template>
            <template #anime>
              <img v-for="(href, k) in data.live" :key="`l${k}`" class="sa__paint" :src="href" alt="" />
            </template>
            <!-- la photo et le nom du joueur sur la carte que le vent emporte (game/sceneArt.js : CARTES) -->
            <template v-if="data.carte" #photo>
              <canvas ref="photo" class="sa__paint" />
              <svg v-if="name" class="sa__paint" viewBox="0 0 400 400">
                <text
                  class="sa__carte-nom" :transform="cardPlace" :x="data.carte.nom[0]" :y="data.carte.nom[1]"
                  :textLength="name.length > 14 ? 124 : null" lengthAdjust="spacingAndGlyphs"
                >{{ name }}</text>
              </svg>
            </template>
          </ScenePlans>
          <div v-else :class="['sa__art', { 'sa__art--breathing': data.still }]">
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
import { sceneOf, avatarFrames, avatarBox, photoBox, NAME_LINE } from '@/game/sceneArt';
import { acteurImages, mouvementsKit } from '@/game/avatarKit';
import { clipA, imageA, prochain } from '@/game/acteur';
import { reducedMotion } from '@/utils/fx';
import { layerRaster, rasterOf, acteurPx, prepareActeur, edgeColors, MAX_DPR, ART } from './raster';
import ScenePlans from './ScenePlans';
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
  components: { ScenePlans },
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
    meteo: { type: Object, default: null },
    // Le rang de la bulle dans la scène (0 à son ouverture) : une scène en plans y joue le temps de sa partition
    beat: { type: Number, default: 0 }
  },
  data() {
    return { NAME_LINE, frame: 0, px: 0, cssWidth: 0, fill: null, acteurT: 0 };
  },
  computed: {
    data() {
      return sceneOf(this.scene);
    },
    // Le jeu de l'avatar dans une scène en plans (game/acteur.js) : la piste « acteur » du temps de la bulle (une bulle
    // au-delà de la partition garde le dernier), ou null
    jeu() {
      const temps = this.data && this.data.plans && this.data.avatar && !this.alone && this.data.partition ? this.data.partition.temps : null;
      const dernier = temps && temps[Math.min(this.beat, temps.length - 1)];
      return dernier && dernier.acteur ? dernier.acteur : null;
    },
    // L'image que l'avatar joue en ce moment (null tant que le kit se charge : il garde alors son image de la scène)
    joue() {
      const anims = this.jeu && mouvementsKit();
      if (!anims) return null;
      const { debut, clip } = clipA(this.jeu, this.acteurT);
      const images = this.imagesDe(clip);
      return images.length ? images[imageA(clip.anim, this.acteurT - debut, anims)] : null;
    },
    body() {
      if (!this.data || !this.data.avatar || this.alone) return null;
      // (il joue la scène : ses images viennent de sa piste, à la place de la scène ; sa direction fait son miroir)
      if (this.joue) return { ...avatarBox(this.data.avatar), frames: [this.joue], axis: null, acteur: true };
      const spot = { ...this.data.avatar, ...this.pose };
      return { ...avatarBox(spot), frames: avatarFrames(this.look, spot), axis: spot.miroir ? spot.x : null };
    },
    // La photo du joueur sur la carte : prise à bord, en tenue de croisière, de face (la première image : une photo ne
    // bouge pas, comme sur sa carte : BoardingCard), ou null
    photo() {
      const carte = this.data && this.data.carte;
      const href = carte && avatarFrames(this.look, { vue: 'face', pose: 'repos', naufrage: false })[0];
      return href ? { href, ...photoBox(carte.photo) } : null;
    },
    // (la place de la carte dans le carré, pour son nom)
    cardPlace() {
      const c = this.data && this.data.carte;
      return c ? `translate(${c.x} ${c.y}) rotate(${c.angle}) translate(${-c.coin[0]} ${-c.coin[1]})` : null;
    },
    // (une scène plus haute que large : la veillée du conseil, qui remplit un téléphone)
    squareStyle() {
      return this.data && this.data.h !== ART ? { '--sa-ratio': ART / this.data.h } : null;
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
    // (la photo de la carte paraît quand l'avatar du joueur est dessiné)
    photo() {
      this.paintPhoto();
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
    clearTimeout(this.acteurTimer);
    if (this.observer) this.observer.disconnect();
    cancelAnimationFrame(this.rainRaf);
    this.token = (this.token || 0) + 1;
  },
  methods: {
    // La taille du carré à l'écran : son image s'y accorde (et se repeint) quand elle change
    // (une scène en plans n'a au plus que le canvas de l'avatar : ScenePlans peint ses plans)
    measure() {
      const { square, under, over, photo } = this.$refs;
      if (!square || (!this.data.plans && (!under || !over))) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const css = square.getBoundingClientRect().width;
      const px = Math.round(css * dpr);
      if (!px || px === this.px) return;
      this.px = px;
      this.cssWidth = css;
      for (const canvas of [under, over, photo].filter(Boolean)) {
        canvas.width = px;
        canvas.height = Math.round((px * this.data.h) / ART);
      }
      // (toutes les images de la scène se lisent tout de suite : la boucle ne les attend pas)
      for (let f = 0; f < Math.max(1, this.data.frames); f++) {
        const { under: below, over: above } = this.layersOf(f);
        [...below, ...above].forEach(layer => this.rasterOf(layer));
      }
      this.paint();
      this.paintPhoto();
    },
    // La photo sur la carte (data.carte) : lue à la taille de l'écran, posée dans son tirage, penchée avec la carte
    async paintPhoto() {
      const canvas = this.$refs.photo, carte = this.data && this.data.carte, photo = this.photo;
      if (!canvas || !carte || !photo || !this.px) return;
      const k = this.px / ART;
      const image = await rasterOf(photo.href, Math.max(1, Math.round(photo.w * k)), Math.max(1, Math.round(photo.h * k)));
      if (!image || canvas !== this.$refs.photo || photo !== this.photo) return;
      const ctx = canvas.getContext('2d');
      const [x, y, w, h] = carte.photo;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingQuality = 'high';
      ctx.save();
      ctx.scale(k, k);
      ctx.translate(carte.x, carte.y);
      ctx.rotate((carte.angle * Math.PI) / 180);
      ctx.translate(-carte.coin[0], -carte.coin[1]);
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.drawImage(image, photo.x, photo.y, photo.w, photo.h);
      ctx.restore();
    },
    // Les calques peints d'une image de la scène, en unités du carré : dessous le fond ; dessus l'avatar (sa place, son
    // miroir, sa photo), puis le devant
    layersOf(f) {
      const pick = list => (list.length ? [{ href: list[f % list.length], x: 0, y: 0, w: ART, h: this.data.h }] : []);
      const body = this.body;
      const avatar = body && body.frames.length ? [{ href: body.frames[f % body.frames.length], x: body.x, y: body.y, w: body.w, h: body.h, axis: body.axis, clip: body.clip, acteur: body.acteur }] : [];
      return { under: pick(this.data.back), over: [...avatar, ...pick(this.data.front)] };
    },
    rasterOf(layer) {
      // (ce que joue l'avatar se lit à la taille de l'écran : lu d'avance, il est là dès que la scène s'ouvre)
      return layer.acteur ? rasterOf(layer.href, ...acteurPx(layer)) : layerRaster(layer, this.px, this.data.h);
    },
    // L'image du moment, peinte quand ses calques sont lus (une image plus récente demandée entre-temps passe devant) ;
    // la première fois, la couleur des bords de son fond
    async paint() {
      if (!this.data || !this.px) return;
      const token = (this.token = (this.token || 0) + 1);
      const { under, over } = this.layersOf(this.frame);
      const [below, above] = await Promise.all([under, over].map(list => Promise.all(list.map(layer => this.rasterOf(layer)))));
      if (token !== this.token || (!this.data.plans && (!this.$refs.under || !this.$refs.over))) return;
      if (this.$refs.under) this.paintInto(this.$refs.under, under, below);
      if (this.$refs.over) this.paintInto(this.$refs.over, over, above);
      if (!this.fill && below[0]) this.fill = edgeColors(below[0]);
    },
    // Les images d'un clip de la piste « acteur », gravées à la lumière de la scène
    imagesDe(clip) {
      return acteurImages(this.look, clip, { naufrage: this.data.avatar.naufrage !== false, lumiere: this.data.partition.lumiere || {} });
    },
    // Un temps de la partition commence (ScenePlans) : l'avatar joue sa piste depuis son début, au rythme de ses images
    // (toutes lues d'avance) ; avec le mouvement réduit, il reste sur le début de son dernier clip
    onTemps() {
      clearTimeout(this.acteurTimer);
      const acteur = this.jeu;
      if (!acteur) return;
      // (toutes ses images de la scène, celles de ce temps d'abord)
      const box = avatarBox(this.data.avatar);
      for (const [, clip] of acteur) this.imagesDe(clip).forEach(href => this.rasterOf({ href, ...box, acteur: true }));
      if (!this.alone) prepareActeur(this.data, this.look);
      if (reducedMotion()) {
        this.acteurT = acteur[acteur.length - 1][0];
        return;
      }
      const t0 = performance.now();
      const tick = () => {
        this.acteurT = performance.now() - t0;
        const anims = mouvementsKit();
        this.acteurTimer = setTimeout(tick, anims ? prochain(acteur, this.acteurT, anims) : 100);
      };
      this.acteurT = 0;
      tick();
    },
    // La couleur des bords d'une scène en plans : celle de son premier plan (son ciel)
    onEdges(colors) {
      if (!this.fill && colors) this.fill = colors;
    },
    paintInto(canvas, layers, images) {
      const k = this.px / ART;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // (le fond et le devant, lus à la taille commune, se réduisent nets à celle du carré)
      ctx.imageSmoothingQuality = 'high';
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
