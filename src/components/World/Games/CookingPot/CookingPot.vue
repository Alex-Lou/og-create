<template>
  <div class="cook" role="dialog" aria-modal="true" :aria-label="T.title">
    <div class="cook__card">
      <header class="cook__head">
        <div>
          <span class="cook__eyebrow">{{ eyebrow }}</span>
          <span class="cook__title">{{ T.title }}</span>
        </div>
        <button v-if="phase !== 'fin' && !paying" type="button" class="cook__later" @click="$emit('close')">{{ T.later }}</button>
      </header>

      <!-- Le coin de Cannelle : elle, sa marmite sur le feu, la planche et ses ingrédients ; au service, la louche et le
           bol. Ce qu'on glisse suit le doigt par transformations posées à chaque mouvement (rien n'est redessiné par Vue) -->
      <div ref="arena" class="cook__arena" :style="{ '--soup': soup }" :data-phase="phase">
        <span :class="['cook__cannelle', { 'is-stirring': stirring }]" aria-hidden="true">
          <img v-for="f in [1, 2]" :key="f" :class="`f${f}`" :src="cannelleArt[f - 1]" alt="" draggable="false" />
        </span>

        <!-- La marmite : on y touille (le doigt tourne autour de son centre) ; au clavier, un appui fait un tour -->
        <button
          ref="pot"
          type="button"
          :class="['cook__pot', { 'is-hot': level >= 4, 'is-stirring': stirring }]"
          :aria-label="phase === 'touiller' ? T.rule.touiller : T.title"
          @pointerdown="onPotDown"
          @pointermove="onPotMove"
          @pointerup="onPotUp"
          @pointercancel="onPotUp"
          @click="onPotKey"
        >
          <!-- (le feu, dans son propre calque sous la marmite : il vacille sans faire repeindre la marmite) -->
          <span class="cook__fire" aria-hidden="true">
            <svg viewBox="40 68 36 27">
              <path d="M44 94 Q40 82 49 73 Q50 82 56 84 Q57 74 64 69 Q63 80 71 84 Q76 88 73 94 Z" fill="#F29A3A" stroke="#3C2819" stroke-width="1.4" stroke-linejoin="round" />
              <path d="M52 94 Q52 87 57 85 Q59 89 63 87 Q66 91 64 94 Z" fill="#FFD36B" />
            </svg>
          </span>
          <svg class="cook__pot-art" viewBox="0 0 120 100" aria-hidden="true">
            <defs>
              <linearGradient id="cook-iron" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#6E5D55" />
                <stop offset=".55" stop-color="#4E433D" />
                <stop offset="1" stop-color="#3A302B" />
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="95" rx="48" ry="4.5" fill="rgba(80, 50, 20, .22)" />
            <ellipse cx="30" cy="91" rx="10" ry="5.5" fill="#9B927F" stroke="#3C2819" stroke-width="1.4" />
            <ellipse cx="90" cy="91" rx="10" ry="5.5" fill="#9B927F" stroke="#3C2819" stroke-width="1.4" />
            <path d="M15 40 Q4 41 7 51 Q11 57 18 52" fill="none" stroke="#3C2819" stroke-width="4.5" stroke-linecap="round" />
            <path d="M105 40 Q116 41 113 51 Q109 57 102 52" fill="none" stroke="#3C2819" stroke-width="4.5" stroke-linecap="round" />
            <path d="M14 34 Q13 76 40 84 Q60 89 80 84 Q107 76 106 34 Z" fill="url(#cook-iron)" stroke="#3C2819" stroke-width="1.8" stroke-linejoin="round" />
            <path d="M24 46 Q25 66 38 75" fill="none" stroke="rgba(255, 255, 255, .16)" stroke-width="4" stroke-linecap="round" />
            <ellipse cx="60" cy="34" rx="46" ry="12" fill="#6A5A52" stroke="#3C2819" stroke-width="1.8" />
            <ellipse cx="60" cy="35" rx="41" ry="9.5" fill="#2A1D14" />
            <ellipse class="cook__soup" cx="60" cy="36" rx="40" ry="8.6" />
            <path d="M14 34 A46 12 0 0 0 106 34" fill="none" stroke="#8C7A70" stroke-width="2.4" stroke-linecap="round" />
          </svg>
          <!-- (le remous : un cercle qui tourne, écrasé en perspective ; son calque à lui, tourné par le GPU, pour que le
               doigt qui touille ne fasse pas repeindre la marmite) -->
          <span class="cook__swirl-plane" aria-hidden="true">
            <span ref="swirl" class="cook__swirl">
              <svg viewBox="-32 -32 64 64"><path d="M-30 0 A30 30 0 0 1 30 0 M14 0 A14 14 0 0 1 -14 0" /></svg>
            </span>
          </span>
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
          <span class="cook__item-art" aria-hidden="true">
            <span v-if="id === 'coquillages'" class="cook__crop"><img :src="SHELLS_ART" alt="" draggable="false" /></span>
            <svg v-else-if="id === 'algues'" viewBox="0 0 60 60">
              <ellipse cx="30" cy="54" rx="20" ry="4" fill="rgba(80, 50, 20, .2)" />
              <g v-for="s in WEED" :key="s.d" fill="none" stroke-linecap="round">
                <path :d="s.d" stroke="#3C2819" stroke-width="7.4" />
                <path :d="s.d" :stroke="s.c" stroke-width="4.4" />
              </g>
            </svg>
            <svg v-else viewBox="0 0 60 60">
              <ellipse cx="30" cy="55" rx="19" ry="3.6" fill="rgba(80, 50, 20, .2)" />
              <path d="M12 19 Q30 -4 48 19" fill="none" stroke="#3C2819" stroke-width="2.2" stroke-linecap="round" />
              <path d="M12 19 L17 52 Q30 57 43 52 L48 19 Z" fill="#B07A45" stroke="#3C2819" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M14 31 Q30 35 46 31 M16 44 Q30 48 44 44" fill="none" stroke="#6B4322" stroke-width="2.4" />
              <ellipse cx="30" cy="19" rx="18" ry="5" fill="#6FA7BB" stroke="#3C2819" stroke-width="1.8" />
              <ellipse cx="25" cy="18" rx="6" ry="1.4" fill="rgba(255, 255, 255, .45)" />
            </svg>
          </span>
          <span class="cook__item-name">{{ T.items[id] }}</span>
        </button>

        <!-- Au service : la louche, dans la marmite, se glisse (ou se touche) jusqu'au bol -->
        <span v-if="phase === 'servir' || phase === 'fin'" :class="['cook__bowl', { 'is-full': phase === 'fin' }]" :style="at(BOWL)" aria-hidden="true">
          <svg viewBox="0 0 80 50">
            <ellipse cx="40" cy="45" rx="30" ry="4.5" fill="rgba(80, 50, 20, .2)" />
            <path d="M8 18 Q10 43 40 43 Q70 43 72 18 Z" fill="#C4874F" stroke="#3C2819" stroke-width="1.8" stroke-linejoin="round" />
            <path d="M16 28 Q22 37 34 39" fill="none" stroke="rgba(255, 255, 255, .25)" stroke-width="3" stroke-linecap="round" />
            <ellipse cx="40" cy="18" rx="32" ry="8" fill="#8A5A2E" stroke="#3C2819" stroke-width="1.8" />
            <ellipse class="cook__bowl-soup" cx="40" cy="19" rx="27" ry="5.4" />
          </svg>
          <span v-if="phase === 'fin'" class="cook__steam is-small"><i v-for="k in 3" :key="k" :style="{ '--k': k }"></i></span>
        </span>
        <button
          v-if="phase === 'servir' || phase === 'fin'"
          ref="ladle"
          type="button"
          :class="['cook__ladle', { 'is-full': paying || phase === 'fin', 'is-poured': paying || phase === 'fin' }]"
          :disabled="phase === 'fin' || paying"
          :aria-label="T.rule.servir"
          @pointerdown="onDragDown('ladle', 'louche', $event)"
          @pointermove="onDragMove"
          @pointerup="onDragUp"
          @pointercancel="onDragCancel"
          @click="onLadleKey"
        >
          <svg viewBox="0 0 60 100" aria-hidden="true">
            <line x1="46" y1="6" x2="25" y2="72" stroke="#3C2819" stroke-width="7.5" stroke-linecap="round" />
            <line x1="46" y1="6" x2="25" y2="72" stroke="#C27C45" stroke-width="4" stroke-linecap="round" />
            <path d="M5 76 Q7 95 22 95 Q37 95 39 76 Z" fill="#C27C45" stroke="#3C2819" stroke-width="1.8" stroke-linejoin="round" />
            <ellipse class="cook__ladle-soup" cx="22" cy="76" rx="17" ry="5" stroke="#3C2819" stroke-width="1.8" />
          </svg>
        </button>

        <!-- Ce qui tombe dans la marmite, les bulles d'un tour, les éclaboussures : des animations CSS, qui s'en vont seules -->
        <span v-for="f in floats" :key="f.key" :class="['cook__float', `is-${f.kind}`]" :style="{ ...at(f), '--dx': `${f.dx || 0}px` }" aria-hidden="true" @animationend="drop(f.key)">{{ f.text }}</span>

        <!-- Rien fait depuis un moment : la main montre le geste -->
        <span v-if="hint" :class="['cook__hint', `is-${phase}`]" aria-hidden="true"><span class="cook__ring"></span>{{ T.hint[phase] }}</span>
      </div>

      <p v-if="phase !== 'intro' && phase !== 'fin'" class="cook__rule">{{ T.rule[phase] }}</p>

      <!-- Cannelle ouvre la scène, puis la ferme -->
      <div v-if="phase === 'intro' || phase === 'fin'" class="cook__talk">
        <div class="cook__bubble">
          <img :class="['cook__face', { 'is-bust': face.bust }]" :src="face.face" alt="" />
          <p><strong>Cannelle</strong>{{ phase === 'intro' ? T.open : T.end }}</p>
        </div>
        <button type="button" class="cook__btn" @click="phase === 'intro' ? start() : $emit('close')">{{ phase === 'intro' ? T.go : T.next }}</button>
      </div>
      <p class="cook__sr" aria-live="polite">{{ live }}</p>
    </div>
  </div>
</template>

<script>
import { guide } from '@/game/guide';
import { vibrate, reducedMotion } from '@/utils/fx';
import { bubbleFace } from '@/world/faces';
import { potOf, addItem, inPot, stir, lift, stirOnce, inBowl, serve, ITEMS, TURNS, POT, BOWL } from '@/game/cooking';
import { COOKING as T } from '@/texts/tutorial/cooking';

// Les dessins de la bibliothèque : Cannelle qui touille (naufragée, puis cuisinière), les coquillages. La marmite, la
// louche, le bol, les algues et le seau n'y sont pas encore : dessinés ici en attendant (demande transmise par l'auteur)
const CANNELLE = import.meta.glob('/design/bibliotheque/svg/personnages/{maitres/cannelle/cannelle,naufrages/cannelle/cannelle-naufrage}_face_louche_{1,2}.svg', { query: '?url', import: 'default', eager: true });
const cannelleOf = (castaway, f) => Object.entries(CANNELLE).find(([path]) => path.endsWith(`${castaway ? 'cannelle-naufrage' : '/cannelle'}_face_louche_${f}.svg`))?.[1] || '';
const SHELLS_ART = Object.values(import.meta.glob('/design/bibliotheque/svg/plantes/coquillages_nacres.svg', { query: '?url', import: 'default', eager: true }))[0];
// Les algues : trois brins ondulés
const WEED = [
  { d: 'M22 52 Q14 40 22 30 Q30 20 22 9', c: '#5E9A4A' },
  { d: 'M32 53 Q40 42 32 31 Q25 22 33 12', c: '#7DB55C' },
  { d: 'M40 52 Q47 44 42 36', c: '#4E8A44' }
];
// La planche : où attend chaque ingrédient (pour cent de l'aire de jeu)
const ITEM_X = [22, 50, 78];
const ITEM_Y = 88;
// Le bouillon, du fond d'eau à la soupe dorée : un cran par ingrédient, puis par tour de louche
const SOUP = ['transparent', '#9CC3CF', '#A9C29A', '#C7BB8A', '#D6B474', '#E2AC5C', '#E8A44C'];
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
  emits: ['close'],
  data() {
    return { T, ITEMS, ITEM_X, ITEM_Y, BOWL, WEED, SHELLS_ART, phase: 'intro', added: [], turns: 0, stirring: false, paying: false, floats: [], hint: false, live: '' };
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
    // (la soupe monte d'un cran par ingrédient, puis par tour)
    level() {
      return this.added.length + this.turns;
    },
    soup() {
      return SOUP[Math.min(SOUP.length - 1, this.level)];
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
      if (this.$refs.swirl) this.$refs.swirl.style.transform = `rotate(${((this.pot.angle * 180) / Math.PI).toFixed(1)}deg)`;
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
