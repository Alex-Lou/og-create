<template>
  <!-- La plage de Brumelune, la nuit, sous la pluie (choix de l'auteur, 15 oct.) : le fond de l'éditeur de l'avatar, là
       où le joueur vient de s'échouer. Les calques de la bibliothèque (design/bibliotheque/svg/perso/plage_*, perso.json),
       chacun à sa place dans la scène (360 × 360, en cover depuis le bas) ; ce qui bouge bouge en CSS (les nuages, l'éclat
       de la lune sur la mer, le flot, les palmes, la lueur de la lanterne), la pluie dans deux toiles (pluie.js). Le
       personnage se pose entre le fond et le devant (le slot), ses pieds en scene.pieds. Le parent cale la scène
       (PlageScene.css : --cx, --stage-h, --k) ; elle couvre toute sa place (le panorama, le sable qui descend).
       veil : la brume du lever (« closed », puis « open » : elle s'ouvre, un éclair au loin), et du retour au salut
       (« closing ») ; null : rien (mouvement réduit) -->
  <div :class="['pls', veil && `is-${veil}`]" aria-hidden="true">
    <i v-for="l in BACK" :key="l.id" :class="['pls__l', `pls__l--${l.id}`]" :style="l.style"></i>
    <i class="pls__ombre" :style="at(scene.pieds, 120, 40)"></i>
    <i class="pls__lueur" :style="at(scene.lanterne, 210, 90)"></i>
    <canvas ref="back" class="pls__pluie"></canvas>
    <slot />
    <i v-for="l in FRONT" :key="l.id" :class="['pls__l', `pls__l--${l.id}`]" :style="l.style"></i>
    <i class="pls__halo" :style="at([scene.lanterne[0], scene.lanterne[1] - 14], 90, 90)"></i>
    <canvas ref="front" class="pls__pluie"></canvas>
    <i class="pls__vignette"></i>
    <!-- le lever et le retour : le noir (un rien), le voile de brume, ses trois bancs, l'éclat de l'éclair -->
    <template v-if="veil">
      <i class="pls__noir"></i>
      <i class="pls__voile"></i>
      <i v-for="b in BANCS" :key="b" :class="['pls__banc', `pls__banc--${b}`]" :style="{ '--img': img('plage_brume') }"></i>
      <i class="pls__flash"></i>
    </template>
  </div>
</template>

<script>
import PIECES from '../../../../design/bibliotheque/svg/perso/perso.json';
import { reducedMotion } from '@/utils/fx';
import { pluie } from './pluie';

const FILES = import.meta.glob('/design/bibliotheque/svg/perso/plage_*.svg', { query: '?url', import: 'default', eager: true });
const img = id => `url("${FILES[`/design/bibliotheque/svg/perso/${id}.svg`]}")`;
const SCENE = PIECES.pieces.plage_ciel.zones.scene;
// Un calque à sa place dans la scène (x, y, largeur, hauteur : perso.json, zones.place) ; ses palmes tournent autour du
// haut de leur tronc (scene.origines)
function layer(id) {
  const [x, y, w, h] = PIECES.pieces[id].zones.place;
  const o = SCENE.origines[id];
  return {
    id,
    style: {
      '--x': x, '--y': y, '--w': w, '--h': h, '--img': img(id),
      ...(o ? { transformOrigin: `${((o[0] - x) / w) * 100}% ${((o[1] - y) / h) * 100}%` } : {})
    }
  };
}
// Derrière le personnage (l'éclair, au loin, derrière les nuages qui passent), puis devant lui
const BACK = ['plage_ciel', 'plage_eclair', 'plage_nuages', 'plage_eclat_a', 'plage_eclat_b', 'plage_flot', 'plage_sol', 'plage_brume', 'plage_palmes_g', 'plage_palmier_d', 'plage_palmes_d'].map(layer);
// (le flot : deux, décalés ; la brume : la nappe basse qui dérive derrière ses pieds)
BACK.splice(BACK.findIndex(l => l.id === 'plage_flot') + 1, 0, { ...layer('plage_flot'), id: 'plage_flot2' });
const FRONT = ['plage_lanterne', 'plage_devant'].map(layer);
const BANCS = ['g', 'd', 'bas'];
// L'éclair du lever : l'éclat de la pluie, en marches (ms depuis le lever, force) ; le CSS (pls-flash) suit le même temps
const ECLAIR = [[420, 0.9], [500, 0.2], [580, 0.6], [760, 0.15], [1100, 0]];

export default {
  name: 'PlageScene',
  props: {
    veil: { type: String, default: null }
  },
  data() {
    return { BACK, FRONT, BANCS, scene: SCENE };
  },
  watch: {
    veil(v) {
      if (v === 'open' && this.rain) ECLAIR.forEach(([ms, f]) => this.timers.push(setTimeout(() => this.rain.eclaire(f), ms)));
    }
  },
  created() {
    this.timers = [];
  },
  mounted() {
    // (où la scène est posée : le calque du ciel, qui commence au bord gauche du panorama, en y = 0)
    const ciel = this.$el.querySelector('.pls__l--plage_ciel');
    const repere = () => {
      const r = ciel.getBoundingClientRect(), c = this.$refs.back.getBoundingClientRect();
      return { k: r.width / PIECES.pieces.plage_ciel.zones.place[2], x0: r.left - c.left, y0: r.top - c.top };
    };
    this.rain = pluie(this.$refs.back, this.$refs.front, SCENE, repere);
    if (reducedMotion()) this.rain.fixe();
    else this.rain.lance();
  },
  beforeUnmount() {
    this.timers.forEach(clearTimeout);
    this.rain.arrete();
  },
  methods: {
    img,
    // Une tache de lumière ou d'ombre, centrée sur ce point de la scène, de cette taille (unités de la scène)
    at([x, y], w, h) {
      return { '--x': x - w / 2, '--y': y - h / 2, '--w': w, '--h': h };
    }
  }
};
</script>

<style scoped src="./PlageScene.css"></style>
