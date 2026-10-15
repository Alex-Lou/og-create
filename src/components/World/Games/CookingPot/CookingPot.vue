<template>
  <SceneCard
    class="cook"
    :title="T.title"
    :eyebrow="eyebrow"
    :later="phase !== 'fin' && !paying ? T.later : ''"
    :rule="T.rule[phase] || ''"
    speaker="Marcelle"
    :face="face"
    :say="phase === 'intro' ? T.open : phase === 'fin' ? T.end : ''"
    :action="phase === 'intro' ? T.go : T.next"
    :live="live"
    @later="$emit('close')"
    @act="phase === 'intro' ? start() : $emit('close')"
  >
    <!-- Le coin de Marcelle : elle, sa marmite sur le feu, la planche et ses ingrédients ; au service, la louche et le
         bol. Ce qu'on glisse suit le doigt par transformations posées à chaque mouvement (rien n'est redessiné par Vue) -->
    <div ref="arena" class="cook__arena" :data-phase="phase" :data-level="level">
      <span :key="pose" :class="['cook__cannelle', `is-n${cannelleArt.length}`, { 'is-playing': playing }]" aria-hidden="true">
        <img v-for="(src, i) in cannelleArt" :key="i" :src="src" :style="{ '--i': i }" alt="" draggable="false" />
      </span>

      <!-- La marmite : on y touille (le doigt tourne autour de son centre) ; au clavier, un appui fait un tour -->
      <button
        ref="pot"
        type="button"
        :class="['cook__pot', { 'is-stirring': stirring }]"
        :aria-label="phase === 'touiller' ? T.rule.touiller : T.title"
        @pointerdown="onPotDown"
        @pointermove="onPotMove"
        @pointerup="onPotUp"
        @pointercancel="onPotUp"
        @click="onPotKey"
      >
        <CookingPotArt ref="potArt" :hot="level >= 4" :stirred="!['intro', 'mettre'].includes(phase)" />
      </button>
      <span v-if="level >= 4" class="cook__steam" aria-hidden="true"><i v-for="k in 3" :key="k" :style="{ '--k': k }"></i></span>

      <!-- La planche : chaque ingrédient se glisse (ou se touche) jusqu'à la marmite -->
      <span class="cook__plank" aria-hidden="true"></span>
      <button
        v-for="(id, i) in ITEMS"
        v-show="!added.includes(id)"
        :key="id"
        type="button"
        :class="['cook__item', `cook__item--${id}`]"
        :style="{ left: `${ITEM_X[i]}%`, top: `${ITEM_Y}%` }"
        :aria-label="T.items[id]"
        @pointerdown="onDragDown('item', id, $event)"
        @pointermove="onDragMove"
        @pointerup="onDragUp"
        @pointercancel="onDragCancel"
        @click="onItemKey(id, $event)"
      >
        <span class="cook__item-art"><CookingArt :kind="id" /></span>
        <span class="cook__item-name">{{ T.items[id] }}</span>
      </button>

      <!-- Au service : la louche, dans la marmite, se glisse (ou se touche) jusqu'au bol -->
      <span v-if="phase === 'servir' || phase === 'fin'" class="cook__bowl" :style="at(BOWL)" aria-hidden="true">
        <CookingArt kind="bol" :full="phase === 'fin'" />
        <span v-if="phase === 'fin'" class="cook__steam is-small"><i v-for="k in 3" :key="k" :style="{ '--k': k }"></i></span>
      </span>
      <button
        v-if="phase === 'servir' || phase === 'fin'"
        ref="ladle"
        type="button"
        :class="['cook__ladle', { 'is-poured': paying || phase === 'fin' }]"
        :disabled="phase === 'fin' || paying"
        :aria-label="T.rule.servir"
        @pointerdown="onDragDown('ladle', 'louche', $event)"
        @pointermove="onDragMove"
        @pointerup="onDragUp"
        @pointercancel="onDragCancel"
        @click="onLadleKey"
      >
        <CookingArt kind="louche" :full="paying || phase === 'fin'" />
      </button>

      <!-- Ce qui gicle, les bulles d'un tour, les mots : sur la scène commune (game/stage), par-dessus, sans toucher au doigt -->
      <canvas ref="fx" class="cook__fx" aria-hidden="true"></canvas>

      <!-- Rien fait depuis un moment : la main montre le geste -->
      <span v-if="hint" :class="['cook__hint', `is-${phase}`]" aria-hidden="true"><span class="cook__ring"></span>{{ T.hint[phase] }}</span>
    </div>
  </SceneCard>
</template>

<script>
import { guide } from '@/game/guide';
import { vibrate, reducedMotion } from '@/utils/fx';
import { bubbleFace } from '@/world/faces';
import { potOf, addItem, inPot, stir, lift, stirOnce, inBowl, serve, ITEMS, TURNS, BOWL } from '@/game/cooking';
import { COOKING as T } from '@/texts/tutorial/cooking';
import { IN_WORDS, SERVE_WORD, END_WORD, STARS, FILLS, stirWord, soupAt } from '@/game/cookFx';
import { createStage } from '@/game/stage/stage';
import CookingPotArt from '../CookingPotArt/CookingPotArt.vue';
import CookingArt from '../CookingArt/CookingArt.vue';
import SceneCard from '../SceneCard/SceneCard.vue';

// Marcelle, naufragée puis cuisinière (la bibliothèque) : ses poses de la scène (elle salue, tend les mains vers les
// ingrédients, touille, applaudit) et ses expressions en pied, louche en main (contente, rieuse, surprise, gênée) ; la
// marmite et ses pièces : CookingPotArt, CookingArt
const CANNELLE = import.meta.glob('/design/bibliotheque/svg/personnages/{maitres/cannelle/cannelle,naufrages/cannelle/cannelle-naufrage}_{face_louche,face_salut,face_mains-tendues,face_applaudir,expr_content,expr_rire,expr_surpris,expr_gene}_[1-4].svg', { query: '?url', import: 'default', eager: true });
// Les images d'une pose (pose : 'face_salut', 'expr_rire'…), dans l'ordre
const cannelleOf = (castaway, pose) => Object.keys(CANNELLE).filter(path => path.includes(`${castaway ? 'cannelle-naufrage' : '/cannelle'}_${pose}_`)).sort().map(path => CANNELLE[path]);
// Une réaction de Marcelle dure MOOD_MS, puis elle reprend la pose du moment
const MOOD_MS = 1300;
// La planche : où attend chaque ingrédient (pour cent de l'aire de jeu)
const ITEM_X = [22, 50, 78];
const ITEM_Y = 88;
// Un toucher sans glisser (px) ; la main revient après HINT_MS sans geste
const SLOP = 8;
const HINT_MS = 4000;

// La marmite de Marcelle (choix de l'auteur, 13 oct. : B4, une scène à part comme la chasse aux poules) : plein écran.
// built : les bâtiments fondés (Marcelle naufragée ou non) ; pay : () => Promise<boolean>, la soupe payée au serveur au
// moment de servir (le besoin « Manger » de Marcelle). Émet close à la fin ou pour plus tard. Aucun travail par image :
// ce qu'on glisse suit le doigt à chaque mouvement (transform, composé par le GPU), le reste est en CSS
export default {
  name: 'CookingPot',
  props: {
    built: { type: Array, default: () => [] },
    pay: { type: Function, required: true }
  },
  components: { SceneCard, CookingPotArt, CookingArt },
  emits: ['close'],
  data() {
    return { T, ITEMS, ITEM_X, ITEM_Y, BOWL, phase: 'intro', added: [], turns: 0, stirring: false, paying: false, hint: false, live: '', mood: null };
  },
  computed: {
    castaway() {
      return !this.built.includes('foyer');
    },
    // La pose du moment : une réaction passagère (mood) l'emporte ; à la fin, elle applaudit
    pose() {
      if (this.phase === 'fin') return 'face_applaudir';
      if (this.mood) return this.mood;
      if (this.phase === 'intro') return 'face_salut';
      if (this.phase === 'mettre') return 'face_mains-tendues';
      if (this.phase === 'touiller') return 'face_louche';
      return 'expr_content';
    },
    cannelleArt() {
      return cannelleOf(this.castaway, this.pose);
    },
    // (la louche ne tourne que quand on touille ; les autres poses vivent toujours)
    playing() {
      return this.pose !== 'face_louche' || this.stirring;
    },
    face() {
      return bubbleFace('foyer', { castaway: this.castaway, mood: this.phase === 'fin' ? 'malicieux' : 'determine' });
    },
    // (la soupe monte d'un cran par ingrédient, puis par tour : sa teinte, CookingPot.css)
    level() {
      return this.added.length + this.turns;
    },
    eyebrow() {
      if (this.phase === 'touiller') return T.turn(this.turns, TURNS);
      if (this.phase === 'servir' || this.phase === 'fin') return T.serve;
      return T.count(this.added.length, ITEMS.length);
    }
  },
  created() {
    this.pot = potOf();
    this.reduced = reducedMotion();
    // (non réactifs : le glisser en cours, le doigt qui touille, la minuterie de la main)
    this.drag = null;
    this.stirId = null;
    this.hintTimer = 0;
    this.moodTimer = 0;
    this.alive = true;
  },
  mounted() {
    // (pendant la marmite, ni Brume ni les aides ne parlent par-dessus : game/guide.js, hold)
    this.release = guide.hold();
    // (toutes les images de Marcelle, chargées et décodées d'avance : une pose qui change ne laisse pas de trou)
    this.preload = Object.values(CANNELLE).map(src => {
      const img = new Image();
      img.src = src;
      img.decode().catch(() => {});
      return img;
    });
    this.fx = createStage(this.$refs.fx, () => false, { reduced: this.reduced });
  },
  beforeUnmount() {
    this.alive = false;
    clearTimeout(this.hintTimer);
    clearTimeout(this.moodTimer);
    this.release && this.release();
    this.fx && this.fx.destroy();
  },
  methods: {
    // Position dans l'aire de jeu (pour cent) en style
    at(p) {
      return { left: `${p.x}%`, top: `${p.y}%` };
    },
    start() {
      this.phase = this.pot.phase;
      this.armHint();
    },
    // La main revient si rien ne se passe pendant HINT_MS
    armHint() {
      clearTimeout(this.hintTimer);
      this.hint = false;
      if (['mettre', 'touiller', 'servir'].includes(this.phase)) this.hintTimer = setTimeout(() => { this.hint = true; }, HINT_MS);
    },
    // Le point du doigt, en pour cent de l'aire de jeu
    pointOf(event) {
      const r = this.$refs.arena.getBoundingClientRect();
      return { x: ((event.clientX - r.left) / r.width) * 100, y: ((event.clientY - r.top) / r.height) * 100 };
    },
    // Marcelle réagit un instant (une de ses expressions, 'expr_rire'…), puis reprend la pose du moment
    react(mood) {
      this.mood = mood;
      clearTimeout(this.moodTimer);
      this.moodTimer = setTimeout(() => { this.mood = null; }, MOOD_MS);
    },
    // La bouche de la marmite sur la scène (px) et sa largeur, lues sur son dessin
    mouth() {
      const a = this.$refs.arena.getBoundingClientRect();
      const r = this.$refs.pot.getBoundingClientRect();
      return { x: r.left - a.left + r.width / 2, y: r.top - a.top + r.height * 0.36, w: r.width };
    },
    // Un point de l'aire de jeu (pour cent) sur la scène (px)
    px(p) {
      return { x: (p.x / 100) * this.fx.w, y: (p.y / 100) * this.fx.h };
    },
    // Des gouttes de bouillon qui giclent de la bouche (spread : leur éventail ; n : combien)
    splash(m, n, spread) {
      const color = soupAt(this.level);
      this.fx.particles.burst(m.x, m.y, { n, shape: 'drop', colors: [color, color, '#FFFFFF'], speed: [m.w * 0.8, m.w * 1.8], angle: -Math.PI / 2, spread, size: [3, 6], gravity: m.w * 4, life: [450, 750] });
    },

    /* ---------- Glisser : un ingrédient, la louche ---------- */
    onDragDown(kind, id, event) {
      if (this.phase === 'intro') this.start();
      if (this.drag || this.paying || (kind === 'item' && this.phase !== 'mettre') || (kind === 'ladle' && this.phase !== 'servir')) return;
      const el = event.currentTarget;
      el.setPointerCapture(event.pointerId);
      this.drag = { kind, id, el, pointer: event.pointerId, x0: event.clientX, y0: event.clientY, moved: false };
      el.classList.add('is-dragging');
      clearTimeout(this.hintTimer);
      this.hint = false;
    },
    onDragMove(event) {
      const drag = this.drag;
      if (!drag || event.pointerId !== drag.pointer) return;
      const dx = event.clientX - drag.x0;
      const dy = event.clientY - drag.y0;
      if (!drag.moved && Math.hypot(dx, dy) < SLOP) return;
      drag.moved = true;
      drag.el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    },
    // Lâché sur la marmite (ou touché sans glisser) : l'ingrédient y tombe ; la louche, lâchée sur le bol (ou touchée),
    // sert. Ailleurs, il revient à sa place
    onDragUp(event) {
      const drag = this.drag;
      if (!drag || event.pointerId !== drag.pointer) return;
      this.drag = null;
      const p = this.pointOf(event);
      this.settle(drag.el);
      if (drag.kind === 'item' && (!drag.moved || inPot(p))) this.putIn(drag.id, drag.moved ? p : null);
      else if (drag.kind === 'ladle' && (!drag.moved || inBowl(p))) this.serveSoup();
      else this.armHint();
    },
    onDragCancel(event) {
      const drag = this.drag;
      if (!drag || event.pointerId !== drag.pointer) return;
      this.drag = null;
      this.settle(drag.el);
      this.armHint();
    },
    // Ce qu'on glissait reprend sa place (en douceur, CSS)
    settle(el) {
      el.classList.remove('is-dragging');
      el.style.transform = '';
    },
    // Au clavier (un clic sans pointeur) : l'ingrédient tombe, la louche sert
    onItemKey(id, event) {
      if (event.detail !== 0) return;
      if (this.phase === 'intro') this.start();
      if (this.phase === 'mettre') this.putIn(id, null);
    },
    onLadleKey(event) {
      if (event.detail === 0 && this.phase === 'servir') this.serveSoup();
    },
    // Un ingrédient tombe dans la marmite (at : là où on l'a lâché, sinon au bord) : plouf ; le dernier ouvre le temps
    // de touiller
    putIn(id, at) {
      if (!addItem(this.pot, id)) return;
      this.added = [...this.pot.added];
      vibrate(10);
      this.fxIn(id, at);
      this.react(this.added.length === ITEMS.length ? 'expr_rire' : 'expr_content');
      this.live = T.items[id];
      this.phase = this.pot.phase;
      this.armHint();
    },

    /* ---------- Touiller : le doigt tourne autour du centre de la marmite ---------- */
    // Le doigt, en rayons de la marmite autour de son centre (le centre de sa bouche, au tiers de sa hauteur)
    potPoint(event) {
      const r = this.$refs.pot.getBoundingClientRect();
      const radius = r.width * 0.35;
      return { x: (event.clientX - (r.left + r.width / 2)) / radius, y: (event.clientY - (r.top + r.height * 0.36)) / radius };
    },
    onPotDown(event) {
      if (this.phase === 'intro') this.start();
      if (this.phase !== 'touiller' || this.stirId !== null) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      this.stirId = event.pointerId;
      this.stirring = true;
      clearTimeout(this.hintTimer);
      this.hint = false;
      stir(this.pot, this.potPoint(event), event.timeStamp / 1000);
    },
    onPotMove(event) {
      if (event.pointerId !== this.stirId) return;
      const { turned, splash } = stir(this.pot, this.potPoint(event), event.timeStamp / 1000);
      // (le remous suit le doigt)
      this.$refs.potArt.turn(this.pot.angle);
      if (splash) {
        vibrate(6);
        this.react('expr_surpris');
        const m = this.mouth();
        this.splash(m, 10, Math.PI * 1.3);
        this.fx.texts.add({ text: T.fast, x: m.x, y: m.y - m.w * 0.3, size: 18, fill: FILLS.fast, look: 'word', tilt: (Math.random() - 0.5) * 0.3, life: 900, rise: 18 });
        this.fx.wake();
      }
      if (turned) this.turnDone();
    },
    onPotUp(event) {
      if (event.pointerId !== this.stirId) return;
      this.stirId = null;
      this.stirring = false;
      lift(this.pot);
      this.armHint();
    },
    // Au clavier : un tour par appui
    onPotKey(event) {
      if (event.detail !== 0) return;
      if (this.phase === 'intro') this.start();
      if (stirOnce(this.pot)) this.turnDone();
    },
    // Un tour de plus : des bulles montent ; le dernier ouvre le service
    turnDone() {
      this.turns = this.pot.turns;
      vibrate(8);
      this.fxTurn();
      this.live = T.turn(this.turns, TURNS);
      if (this.pot.phase !== this.phase) {
        this.phase = this.pot.phase;
        this.stirring = false;
        this.stirId = null;
        this.live = T.serve;
        this.react('expr_rire');
      }
      this.armHint();
    },

    /* ---------- Servir : la soupe se paie au serveur ---------- */
    async serveSoup() {
      if (this.phase !== 'servir' || this.paying) return;
      this.paying = true;
      clearTimeout(this.hintTimer);
      this.hint = false;
      const ok = await this.pay();
      if (!this.alive) return;
      this.paying = false;
      if (!ok) {
        this.react('expr_gene');
        this.armHint();
        return;
      }
      serve(this.pot);
      this.phase = this.pot.phase;
      vibrate([10, 40, 10, 40, 16]);
      this.live = T.end;
      this.fxServe();
    },

    /* ---------- Le spectacle (game/cookFx.js) ---------- */
    // Un ingrédient tombe (at : là où on l'a lâché) : une onde sur le bouillon, des gouttes, son bruit
    fxIn(id, at) {
      const m = this.mouth();
      if (at) {
        const p = this.px(at);
        this.fx.particles.burst(p.x, p.y, { n: 4, shape: 'circle', colors: ['#FFFFFF', soupAt(this.level)], speed: [20, 60], size: [2, 4], gravity: 200, life: [300, 500] });
      }
      this.fx.particles.burst(m.x, m.y, { n: 1, shape: 'ring', colors: ['#FFFFFF'], speed: [0, 0], size: [m.w * 0.1, m.w * 0.1], size1: 2.6, gravity: 0, spin: 0, life: [480, 480], fade: 1 });
      this.splash(m, 12, Math.PI * 0.9);
      this.fx.texts.add({ text: IN_WORDS[id], x: m.x, y: m.y - m.w * 0.32, size: 24, fill: FILLS.in, look: 'word', tilt: (Math.random() - 0.5) * 0.3, life: 950, rise: 22 });
      this.fx.shake(2);
    },
    // Un tour de louche : des bulles montent ; au dernier, le bouillon est prêt (son mot dans un halo, des étoiles)
    fxTurn() {
      const m = this.mouth();
      const color = soupAt(this.level);
      this.fx.particles.burst(m.x, m.y, { n: 7, shape: 'bubble', colors: [color, '#FFFFFF'], speed: [m.w * 0.15, m.w * 0.4], angle: -Math.PI / 2, spread: 1.2, size: [4, 8], size1: 1.3, gravity: -m.w * 0.3, drag: 1.5, spin: 0, life: [700, 1100], fade: 0.5 });
      const word = stirWord(this.turns, TURNS);
      if (this.turns < TURNS) {
        this.fx.texts.add({ text: word, x: m.x, y: m.y - m.w * 0.32, size: 24, fill: FILLS.stir, look: 'word', tilt: (Math.random() - 0.5) * 0.3, life: 950, rise: 22 });
        this.fx.wake();
        return;
      }
      this.fx.texts.add({ text: word, x: m.x, y: m.y - m.w * 0.42, size: 34, fill: FILLS.stir, font: 'display', look: 'label', rays: true, life: 1500, rise: 16 });
      this.fx.particles.burst(m.x, m.y, { n: 14, shape: 'star', colors: STARS, speed: [m.w * 0.5, m.w * 1.2], size: [3, 6], gravity: m.w * 0.4, life: [700, 1100] });
      this.fx.shake(3);
    },
    // Servi : la louche verse dans le bol (Slurp !), puis la fin (Miam !, des rayons, une gerbe d'étoiles)
    fxServe() {
      const b = this.px({ x: BOWL.x, y: BOWL.y - 6 });
      const color = soupAt(this.level);
      this.fx.particles.burst(b.x, b.y, { n: 10, shape: 'drop', colors: [color, color, '#FFFFFF'], speed: [60, 150], angle: -Math.PI / 2, spread: Math.PI * 0.8, size: [3, 6], gravity: 520, life: [450, 700] });
      this.fx.texts.add({ text: SERVE_WORD, x: b.x, y: b.y - 40, size: 24, fill: FILLS.stir, look: 'word', tilt: -0.15, life: 900, rise: 20 });
      this.fx.wake();
      // (la fin, au-dessus de la marmite, à droite de Marcelle)
      const end = this.px({ x: 58, y: 27 });
      this.fx.texts.add({ text: END_WORD, x: end.x, y: end.y, size: 42, fill: FILLS.end, font: 'display', look: 'label', rays: true, delay: 450, life: 1800, rise: 14 });
      setTimeout(() => {
        if (!this.alive) return;
        this.fx.particles.burst(end.x, end.y, { n: 22, shape: 'star', colors: STARS, speed: [120, 280], size: [3, 7], gravity: 80, life: [800, 1300] });
        this.fx.flash('rgba(255, 244, 205, 1)', 300);
        this.fx.wake();
      }, this.reduced ? 0 : 450);
    }
  }
};
</script>

<style scoped src="./CookingPot.css"></style>
