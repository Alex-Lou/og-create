// La cinématique en plans d'une scène (game/scenePlans.js) : un théâtre de papier. Chaque pièce (un plan du décor, une
// vague, un bras de marionnette…) est peinte une fois, à sa taille (son cadre ; ou le carré entier et sa marge, pour que
// la caméra ne découvre jamais ses bords ; plus petite si elle est floue : agrandie, elle se fond), dans deux cadres : la
// caméra (selon sa profondeur), puis son mouvement propre. Une pièce attachée à une autre (dans : un bras au corps, une
// mâchoire à la tête) se pose dans son cadre, devant elle ou derrière (derriere), et suit tous ses mouvements. L'avatar
// et le calque « anime » de SceneArt prennent leur place dans la pile (fentes avatar, anime). Quand la scène s'en va,
// ses pièces jouent leur sortie (partition.sortie : le démontage), par-dessus là où elles en sont
import { h } from 'vue';
import { reducedMotion } from '@/utils/fx';
import { SCENE_W, imagesCles, styleCamera, stylePiste, tempsDe, derniere, premiere, cleRepos, cameraTransform, pisteTransform } from '@/game/scenePlans';
import { rasterOf, edgeColors, planPx, planSize } from './raster';

const pc = v => `${(v * 100) / SCENE_W}%`;
// (la couleur des bords de l'écran, au-dessus et au-dessous du carré : celle de la première pièce, assombrie comme la
// vignette qui ferme les gravures ; elle reste juste quand la scène s'assombrit, l'orage venu)
const VIGNETTE = 0.72;
const assombrir = rgb => rgb && rgb.replace(/\d+/g, v => String(Math.round(Number(v) * (1 - VIGNETTE))));
// (les pièces, l'une sur l'autre, dans le carré : SceneArt le coupe à ses bords ; leurs styles en ligne, la fonction de
// rendu n'a pas de gabarit)
const CADRE = { position: 'absolute', inset: '0', transformOrigin: '50% 50%', willChange: 'transform' };

export default {
  name: 'ScenePlans',
  props: {
    // Les pièces, du fond vers nous (game/sceneArt.js : sceneOf) : { id, href, profondeur, marge, flou, pivot, cadre,
    // dans, derriere }
    plans: { type: Array, required: true },
    // La partition (game/scenePlans.js)
    partition: { type: Object, default: null },
    // Le temps de la scène : le rang de la bulle dans la scène (0 à son ouverture)
    beat: { type: Number, default: 0 },
    // La largeur du carré à l'écran (pixels CSS)
    width: { type: Number, default: 0 }
  },
  emits: ['edges', 'temps'],
  data() {
    // (la scène paraît quand toutes ses pièces sont peintes)
    return { visible: false };
  },
  computed: {
    // (l'arbre des pièces : celles qui suivent la caméra, et celles attachées à chacune)
    racines() {
      return this.plans.filter(p => !p.dans);
    },
    attachees() {
      const par = {};
      for (const p of this.plans) if (p.dans) (par[p.dans] = par[p.dans] || []).push(p);
      return par;
    }
  },
  created() {
    // (les cadres et les canvas des pièces, par identifiant, et si elles sont peintes : hors de l'état réactif, ils ne
    // relancent pas le rendu)
    this.cameras = {};
    this.pistes = {};
    this.canvases = {};
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
    // (l'état d'où part le premier temps, avant même que les pièces soient peintes : rien ne saute ; la partition part
    // quand elles le sont, pour ne pas jouer son début sur du vide)
    this.pose(tempsDe(this.partition, this.beat), 'debut');
    this.paint();
  },
  beforeUnmount() {
    // (la scène s'efface en fondu : ses pièces restent où elles en sont, et se démontent)
    clearTimeout(this.drift);
    this.token = (this.token || 0) + 1;
    this.sortie();
  },
  methods: {
    pivotStyle(plan) {
      const [x, y] = plan.pivot || [SCENE_W / 2, SCENE_W / 2];
      return { transformOrigin: `${pc(x)} ${pc(y)}` };
    },
    // (une pièce couvre son cadre ; un plan, le carré et sa marge de chaque côté)
    cadreDe(plan) {
      const m = plan.marge || 0;
      return plan.cadre || [-m, -m, SCENE_W + 2 * m, SCENE_W + 2 * m];
    },
    planStyle(plan) {
      const [x, y, w, hh] = this.cadreDe(plan);
      return { left: pc(x), top: pc(y), width: pc(w), height: pc(hh) };
    },
    contenu(plan) {
      if (plan.id === 'avatar') return this.$slots.avatar && this.$slots.avatar();
      if (plan.id === 'anime') return this.$slots.anime && this.$slots.anime();
      return [h('canvas', { class: 'sp__plan', style: { position: 'absolute', display: 'block', ...this.planStyle(plan) }, ref: el => { this.canvases[plan.id] = el; } })];
    },
    piste(plan) {
      const kids = this.attachees[plan.id] || [];
      return h('div', { key: plan.id, class: 'sp__piste', style: { ...CADRE, ...this.pivotStyle(plan) }, ref: el => { this.pistes[plan.id] = el; } }, [
        ...kids.filter(k => k.derriere).map(k => this.piste(k)),
        this.contenu(plan),
        ...kids.filter(k => !k.derriere).map(k => this.piste(k))
      ]);
    },
    // Chaque pièce lue une fois à sa taille (raster.js : planSize ; peut-être déjà lue d'avance, preparePlans), puis
    // recopiée dans son canvas ; la première donne la couleur des bords ; la partition part quand toutes sont peintes
    async paint() {
      if (!this.width) return;
      const token = (this.token = (this.token || 0) + 1);
      const px = planPx();
      await Promise.all(this.plans.map(async (plan, i) => {
        if (!plan.href) return;
        const [pw, ph] = planSize(plan, px);
        const image = await rasterOf(plan.href, pw, ph);
        const canvas = this.canvases[plan.id];
        if (token !== this.token || !image || !canvas) return;
        canvas.width = pw;
        canvas.height = ph;
        canvas.getContext('2d').drawImage(image, 0, 0);
        if (i === 0) { const bords = edgeColors(image); this.$emit('edges', bords && { top: assombrir(bords.top), bottom: assombrir(bords.bottom) }); }
      }));
      if (token !== this.token || this.peint) return;
      this.peint = true;
      // (la scène paraît d'un coup, toutes ses pièces peintes : jamais une pièce seule sur le vide)
      this.visible = true;
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
      for (const plan of this.plans) {
        const cam = this.cameras[plan.id], piste = this.pistes[plan.id];
        if (cam) cam.style.transform = cameraTransform(pick(temps.camera), plan.profondeur || 0);
        const cles = temps.pistes && temps.pistes[plan.id];
        if (piste && cles) {
          piste.style.transform = pisteTransform(pick(cles));
          piste.style.opacity = String(pick(cles).o ?? 1);
        }
      }
    },
    // Joue le temps n : la caméra et les pistes, puis le repos ; avec le mouvement réduit, sa fin tout de suite
    play(n) {
      const temps = tempsDe(this.partition, n);
      if (!temps) return;
      this.stop();
      // (le temps commence : l'avatar joue le sien en même temps, SceneArt)
      this.$emit('temps', n);
      if (reducedMotion()) {
        this.pose(temps, 'fin');
        return;
      }
      const options = { duration: temps.duree, fill: 'forwards' };
      for (const plan of this.plans) {
        const d = plan.profondeur || 0, cam = this.cameras[plan.id], piste = this.pistes[plan.id];
        if (cam && temps.camera && temps.camera.length && d) this.running.push(cam.animate(imagesCles(temps.camera, temps.duree, styleCamera(d)), options));
        const cles = temps.pistes && temps.pistes[plan.id];
        if (piste && cles) this.running.push(piste.animate(imagesCles(cles, temps.duree, stylePiste), options));
      }
      const repos = this.partition && this.partition.repos;
      if (repos) this.drift = setTimeout(() => this.rest(temps, repos), temps.duree);
    },
    // Le repos : la caméra va et vient doucement autour de là où le temps l'a laissée ; les pièces qui ont le leur
    // (repos.pistes : { piece: [duree, cle] }) se balancent autour de là où elles sont
    rest(temps, repos) {
      const de = derniere(temps.camera, {}), a = cleRepos(de, repos);
      for (const plan of this.plans) {
        const d = plan.profondeur || 0, cam = this.cameras[plan.id], piste = this.pistes[plan.id];
        if (cam && d && repos.camera) this.running.push(cam.animate([styleCamera(d)(de), styleCamera(d)(a)], { duration: repos.duree, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }));
        const balance = repos.pistes && repos.pistes[plan.id];
        if (piste && balance) this.running.push(piste.animate([{ transform: 'none' }, { transform: pisteTransform(balance[1]) }], { duration: balance[0], iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', composite: 'add' }));
      }
    },
    // Le démontage : chaque pièce part de là où elle en est (sortie : { duree, pistes : { piece : [[t, cle], …] } },
    // des déplacements ajoutés au sien)
    sortie() {
      const sortie = this.partition && this.partition.sortie;
      if (!sortie || !this.peint || reducedMotion()) return;
      for (const [id, cles] of Object.entries(sortie.pistes || {})) {
        const piste = this.pistes[id];
        if (piste) piste.animate(imagesCles(cles, sortie.duree, cle => ({ transform: pisteTransform(cle) })), { duration: sortie.duree, fill: 'forwards', composite: 'add' });
      }
    }
  },
  render() {
    return h('div', { class: 'sp', style: { position: 'absolute', inset: '0', opacity: this.visible ? '1' : '0', transition: 'opacity .25s ease' } }, this.racines.map(plan => h('div', { key: plan.id, class: 'sp__camera', style: CADRE, ref: el => { this.cameras[plan.id] = el; } }, [this.piste(plan)])));
  }
};
