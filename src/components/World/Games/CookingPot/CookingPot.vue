<template>
  <SceneCard
    class="cook"
    :title="T.title"
    :eyebrow="eyebrow"
    :later="phase !== 'fin' && !paying ? T.later : ''"
    :rule="T.rule[phase] || ''"
    speaker="Cannelle"
    :face="face"
    :say="phase === 'intro' ? T.open : phase === 'fin' ? T.end : ''"
    :action="phase === 'intro' ? T.go : T.next"
    :live="live"
    @later="$emit('close')"
    @act="phase === 'intro' ? start() : $emit('close')"
  >
    <!-- Le coin de Cannelle : elle, sa marmite sur le feu, la planche et ses ingrédients ; au service, la louche et le
         bol. Ce qu'on glisse suit le doigt par transformations posées à chaque mouvement (rien n'est redessiné par Vue) -->
    <div ref="arena" class="cook__arena" :data-phase="phase" :data-level="level">
      <span :class="['cook__cannelle', { 'is-stirring': stirring }]" aria-hidden="true">
        <img v-for="f in [1, 2]" :key="f" :class="`f${f}`" :src="cannelleArt[f - 1]" alt="" draggable="false" />
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

      <!-- Ce qui tombe dans la marmite, les bulles d'un tour, les éclaboussures : des animations CSS, qui s'en vont seules -->
      <span v-for="f in floats" :key="f.key" :class="['cook__float', `is-${f.kind}`]" :style="{ ...at(f), '--dx': `${f.dx || 0}px` }" aria-hidden="true" @animationend="drop(f.key)">{{ f.text }}</span>

      <!-- Rien fait depuis un moment : la main montre le geste -->
      <span v-if="hint" :class="['cook__hint', `is-${phase}`]" aria-hidden="true"><span class="cook__ring"></span>{{ T.hint[phase] }}</span>
    </div>
  </SceneCard>
</template>

<script>
import { guide } from '@/game/guide';
import { vibrate, reducedMotion } from '@/utils/fx';
import { bubbleFace } from '@/world/faces';
import { potOf, addItem, inPot, stir, lift, stirOnce, inBowl, serve, ITEMS, TURNS, POT, BOWL } from '@/game/cooking';
import { COOKING as T } from '@/texts/tutorial/cooking';
import CookingPotArt from '../CookingPotArt/CookingPotArt.vue';
import CookingArt from '../CookingArt/CookingArt.vue';
import SceneCard from '../SceneCard/SceneCard.vue';

// Cannelle qui touille, naufragée puis cuisinière (la bibliothèque) ; la marmite et ses pièces : CookingPotArt, CookingArt
const CANNELLE = import.meta.glob('/design/bibliotheque/svg/personnages/{maitres/cannelle/cannelle,naufrages/cannelle/cannelle-naufrage}_face_louche_{1,2}.svg', { query: '?url', import: 'default', eager: true });
const cannelleOf = (castaway, f) => Object.entries(CANNELLE).find(([path]) => path.endsWith(`${castaway ? 'cannelle-naufrage' : '/cannelle'}_face_louche_${f}.svg`))?.[1] || '';
// La planche : où attend chaque ingrédient (pour cent de l'aire de jeu)
const ITEM_X = [22, 50, 78];
const ITEM_Y = 88;
// Un toucher sans glisser (px) ; la main revient après HINT_MS sans geste
const SLOP = 8;
const HINT_MS = 4000;

// La marmite de Cannelle (choix de l'auteur, 13 oct. : B4, une scène à part comme la chasse aux poules) : plein écran.
// built : les bâtiments fondés (Cannelle naufragée ou non) ; pay : () => Promise<boolean>, la soupe payée au serveur au
// moment de servir (le besoin « Manger » de Cannelle). Émet close à la fin ou pour plus tard. Aucun travail par image :
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
    return { T, ITEMS, ITEM_X, ITEM_Y, BOWL, phase: 'intro', added: [], turns: 0, stirring: false, paying: false, floats: [], hint: false, live: '' };
  },
  computed: {
    castaway() {
      return !this.built.includes('foyer');
    },
    cannelleArt() {
      return [cannelleOf(this.castaway, 1), cannelleOf(this.castaway, 2)];
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
    this.alive = true;
  },
  mounted() {
    // (pendant la marmite, ni Brume ni les aides ne parlent par-dessus : game/guide.js, hold)
    this.release = guide.hold();
  },
  beforeUnmount() {
    this.alive = false;
    clearTimeout(this.hintTimer);
    this.release && this.release();
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
    float(kind, at, text = '', dx = 0) {
      this.floats = [...this.floats, { key: `${kind}:${performance.now()}:${dx}`, kind, x: at.x, y: at.y, text, dx }];
    },
    drop(key) {
      this.floats = this.floats.filter(f => f.key !== key);
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
      this.float('drop', at || { x: POT.x, y: POT.y - 8 }, '');
      this.float('plouf', { x: POT.x, y: POT.y - 14 }, T.plouf);
      this.live = `${T.items[id]} : ${T.plouf}`;
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
        this.float('fast', { x: POT.x, y: POT.y - 22 }, T.fast);
        [-1, 1].forEach(side => this.float('splash', { x: POT.x + side * 12, y: POT.y - 6 }, '', side * 22));
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
      [-8, 0, 8].forEach(dx => this.float('bubble', { x: POT.x + dx, y: POT.y - 4 }, '', dx));
      this.live = T.turn(this.turns, TURNS);
      if (this.pot.phase !== this.phase) {
        this.phase = this.pot.phase;
        this.stirring = false;
        this.stirId = null;
        this.live = T.serve;
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
        this.armHint();
        return;
      }
      serve(this.pot);
      this.phase = this.pot.phase;
      vibrate([10, 40, 10, 40, 16]);
      this.live = T.end;
    }
  }
};
</script>

<style scoped src="./CookingPot.css"></style>
