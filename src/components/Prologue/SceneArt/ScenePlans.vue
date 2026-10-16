<template>
  <!-- La cinématique en plans d'une scène (game/scenePlans.js) : chaque plan de papier, peint une fois à la taille du
       carré (sa marge comprise, pour que la caméra ne découvre jamais ses bords ; plus petit s'il est flou : agrandi,
       il se fond), dans deux cadres : la caméra (selon sa profondeur), puis son mouvement propre. L'avatar et le calque
       « anime » de SceneArt prennent leur place dans la pile (fentes avatar, anime) -->
  <div class="sp">
    <div v-for="(plan, i) in plans" :key="plan.id" ref="camera" class="sp__camera">
      <div ref="piste" class="sp__piste" :style="pivotStyle(plan)">
        <slot v-if="plan.id === 'avatar'" name="avatar" />
        <slot v-else-if="plan.id === 'anime'" name="anime" />
        <canvas v-else :ref="el => setCanvas(i, el)" class="sp__plan" :style="planStyle(plan)" />
      </div>
    </div>
  </div>
</template>

<script>
import { reducedMotion } from '@/utils/fx';
import { SCENE_W, imagesCles, styleCamera, stylePiste, tempsDe, derniere, premiere, cleRepos, cameraTransform, pisteTransform } from '@/game/scenePlans';
import { rasterOf, edgeColors } from './raster';

// La finesse des plans au plus (pixels par pixel d'écran) : une pile de plans pèse plus qu'une image
const PLAN_DPR = 2;

export default {
  name: 'ScenePlans',
  props: {
    // Les plans, du fond vers nous (game/sceneArt.js : sceneOf) : { id, href, profondeur, marge, flou, pivot }
    plans: { type: Array, required: true },
    // La partition (game/scenePlans.js)
    partition: { type: Object, default: null },
    // Le temps de la scène : le rang de la bulle dans la scène (0 à son ouverture)
    beat: { type: Number, default: 0 },
    // La largeur du carré à l'écran (pixels CSS)
    width: { type: Number, default: 0 }
  },
  emits: ['edges'],
  created() {
    // (les canvas des plans, par rang, et s'ils sont peints : hors de l'état réactif, ils ne relancent pas le rendu)
    this.canvases = [];
    this.peint = false;
  },
  watch: {
    beat(n) {
      if (this.peint) this.play(n);
    },
    width() {
      this.paint();
    }
  },
  mounted() {
    // (l'état d'où part le premier temps, avant même que les plans soient peints : rien ne saute ; la partition part
    // quand ils le sont, pour ne pas jouer son début sur du vide)
    this.pose(tempsDe(this.partition, this.beat), 'debut');
    this.paint();
  },
  beforeUnmount() {
    this.stop();
    this.token = (this.token || 0) + 1;
  },
  methods: {
    setCanvas(i, el) {
      this.canvases[i] = el;
    },
    pivotStyle(plan) {
      const [x, y] = plan.pivot || [SCENE_W / 2, SCENE_W / 2];
      return { transformOrigin: `${(x * 100) / SCENE_W}% ${(y * 100) / SCENE_W}%` };
    },
    // (un plan déborde du carré de sa marge, de chaque côté)
    planStyle(plan) {
      const m = ((plan.marge || 0) * 100) / SCENE_W;
      return { left: `${-m}%`, top: `${-m}%`, width: `${100 + 2 * m}%`, height: `${100 + 2 * m}%` };
    },
    // Chaque plan lu une fois à sa taille, puis recopié dans son canvas ; le premier donne la couleur des bords
    async paint() {
      if (!this.width) return;
      const token = (this.token = (this.token || 0) + 1);
      const dpr = Math.min(window.devicePixelRatio || 1, PLAN_DPR);
      await Promise.all(this.plans.map(async (plan, i) => {
        if (!plan.href) return;
        const side = Math.max(1, Math.round(this.width * dpr * (1 + (2 * (plan.marge || 0)) / SCENE_W) * (plan.flou || 1)));
        const image = await rasterOf(plan.href, side, side);
        const canvas = this.canvases[i];
        if (token !== this.token || !image || !canvas) return;
        canvas.width = side;
        canvas.height = side;
        canvas.getContext('2d').drawImage(image, 0, 0);
        if (i === 0) this.$emit('edges', edgeColors(image));
      }));
      if (token !== this.token || this.peint) return;
      this.peint = true;
      this.play(this.beat);
    },
    stop() {
      (this.running || []).forEach(a => a.cancel());
      this.running = [];
      clearTimeout(this.drift);
    },
    // Pose tout de suite l'état du début ou de la fin d'un temps (sans animation)
    pose(temps, ou) {
      if (!temps) return;
      const pick = ou === 'debut' ? premiere : derniere;
      this.plans.forEach((plan, i) => {
        const cam = this.$refs.camera && this.$refs.camera[i], piste = this.$refs.piste && this.$refs.piste[i];
        if (cam) cam.style.transform = cameraTransform(pick(temps.camera), plan.profondeur || 0);
        const cles = temps.pistes && temps.pistes[plan.id];
        if (piste && cles) {
          piste.style.transform = pisteTransform(pick(cles));
          piste.style.opacity = String(pick(cles).o ?? 1);
        }
      });
    },
    // Joue le temps n : la caméra et les pistes, puis la dérive au repos ; avec le mouvement réduit, sa fin tout de suite
    play(n) {
      const temps = tempsDe(this.partition, n);
      if (!temps) return;
      this.stop();
      if (reducedMotion()) {
        this.pose(temps, 'fin');
        return;
      }
      const options = { duration: temps.duree, fill: 'forwards' };
      this.plans.forEach((plan, i) => {
        const d = plan.profondeur || 0;
        const cam = this.$refs.camera[i], piste = this.$refs.piste[i];
        if (temps.camera && temps.camera.length && d) this.running.push(cam.animate(imagesCles(temps.camera, temps.duree, styleCamera(d)), options));
        const cles = temps.pistes && temps.pistes[plan.id];
        if (cles) this.running.push(piste.animate(imagesCles(cles, temps.duree, stylePiste), options));
      });
      const repos = this.partition && this.partition.repos;
      if (repos) this.drift = setTimeout(() => this.rest(temps, repos), temps.duree);
    },
    // La dérive au repos : la caméra va et vient doucement autour de là où le temps l'a laissée
    rest(temps, repos) {
      const de = derniere(temps.camera, {}), a = cleRepos(de, repos);
      this.plans.forEach((plan, i) => {
        const d = plan.profondeur || 0;
        if (!d) return;
        this.running.push(this.$refs.camera[i].animate([styleCamera(d)(de), styleCamera(d)(a)], { duration: repos.duree, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }));
      });
    }
  }
};
</script>

<style scoped>
/* Les plans, l'un sur l'autre, dans le carré (SceneArt le coupe à ses bords) */
.sp { position: absolute; inset: 0; }
.sp__camera, .sp__piste { position: absolute; inset: 0; transform-origin: 50% 50%; will-change: transform; }
.sp__plan { position: absolute; display: block; }
</style>
