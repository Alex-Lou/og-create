<template>
  <!-- L'éditeur de l'avatar (HISTOIRE.md § 6.17) : le personnage en pied, en grand, qui tourne sur lui-même ; dessous,
       les choix rangés par onglets (le corps, le visage, les cheveux, la tenue, les objets), et « Au hasard ».
       Seul ce qui est libre se choisit ici (ce qui se gagne viendra de la boutique et des coffres) -->
  <div class="avm">
    <div class="avm__stage" @pointerdown="grab" @pointerup="release" @pointercancel="dragX = null">
      <img v-if="figure" class="avm__figure" :src="figure" alt="Ton personnage, en pied" draggable="false" />
      <span v-else class="avm__wait g-italic">La photo se compose…</span>
      <button type="button" class="avm__turn avm__turn--left" aria-label="Tourner vers la gauche" @click.stop="turn(-1)">↺</button>
      <button type="button" class="avm__turn avm__turn--right" aria-label="Tourner vers la droite" @click.stop="turn(1)">↻</button>
      <button type="button" class="avm__luck" @click.stop="luck">Au hasard</button>
    </div>

    <div class="avm__tabs" role="tablist" aria-label="Ce que tu changes">
      <button v-for="t in TABS" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" :class="['avm__tab', { 'is-on': tab === t.id }]" @click="tab = t.id">{{ t.label }}</button>
    </div>

    <div ref="panel" class="avm__panel" role="tabpanel">
      <template v-if="tab !== 'objets'">
        <div v-for="row in rows" :key="row.key" class="avm__row" role="radiogroup" :aria-label="row.label">
          <span class="avm__label">{{ row.label }}</span>
          <div :class="['avm__options', { 'avm__options--swatches': row.swatch }]">
            <button
              v-for="opt in row.options" :key="opt.id" type="button" role="radio" :aria-checked="modelValue[row.key] === opt.id"
              :class="[row.swatch ? 'avm__swatch' : 'avm__chip', { 'is-on': modelValue[row.key] === opt.id, 'is-none': row.swatch && !opt.color }]"
              :style="row.swatch && opt.color ? { '--sw': opt.color } : null" :title="opt.name" :aria-label="opt.name"
              @click="set(row.key, opt.id)"
            >{{ row.swatch ? '' : opt.name }}</button>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="place in places" :key="place.id" class="avm__row" role="radiogroup" :aria-label="place.label">
          <span class="avm__label">{{ place.label }}</span>
          <div class="avm__options">
            <button type="button" role="radio" :aria-checked="!worn(place.id)" :class="['avm__chip', { 'is-on': !worn(place.id) }]" @click="wear(place.id, null)">Rien</button>
            <button
              v-for="item in place.items" :key="item.id" type="button" role="radio" :aria-checked="wornId(place.id) === item.id"
              :class="['avm__chip', { 'is-on': wornId(place.id) === item.id }]" @click="wear(place.id, item.id)"
            >{{ item.name }}</button>
          </div>
          <div v-for="(zone, z) in zonesOf(place.id)" :key="`${place.id}-${z}`" class="avm__options avm__options--swatches avm__zone">
            <button
              v-for="opt in zone.options" :key="opt.id" type="button" :class="['avm__swatch', { 'is-on': worn(place.id).couleurs[z] === opt.id }]"
              :style="{ '--sw': opt.color }" :title="opt.name" :aria-label="`${zone.label} : ${opt.name}`" @click="tint(place.id, z, opt.id)"
            ></button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { TURN, turnFrame, kitNow } from '@/game/avatarKit';
import { CATALOG } from '@/game/avatarCatalog';
import { reducedMotion } from '@/utils/fx';

const TABS = [
  { id: 'corps', label: 'Corps', rows: ['genre', 'age', 'taille', 'silhouette', 'peau'] },
  { id: 'visage', label: 'Visage', rows: ['visage', 'menton', 'yeux', 'formeYeux', 'cils', 'sourcils', 'barbe', 'moustache', 'bouche', 'levres', 'rousseur', 'joues', 'grain', 'cicatrice'] },
  { id: 'cheveux', label: 'Cheveux', rows: ['coupe', 'cheveux', 'meches', 'couleurMeches'] },
  { id: 'tenue', label: 'Tenue', rows: ['haut', 'couleurHaut', 'motifHaut', 'couleurHaut2', 'bas', 'couleurBas', 'motifBas', 'couleurBas2', 'formeChaussures', 'chaussures'] },
  { id: 'objets', label: 'Objets' }
];
const LABELS = {
  genre: 'Genre', menton: 'Menton', age: 'Âge', cicatrice: 'Cicatrice', taille: 'Taille', silhouette: 'Silhouette', peau: 'Peau', visage: 'Visage', yeux: 'Yeux', formeYeux: 'Forme des yeux', cils: 'Cils',
  sourcils: 'Sourcils', barbe: 'Barbe', moustache: 'Moustache', bouche: 'Bouche', levres: 'Lèvres', rousseur: 'Taches de rousseur', joues: 'Joues', grain: 'Grain de beauté',
  coupe: 'Coupe', cheveux: 'Couleur', meches: 'Mèches', couleurMeches: 'Couleur des mèches', haut: 'Haut', couleurHaut: 'Couleur du haut',
  bas: 'Bas', couleurBas: 'Couleur du bas', motifHaut: 'Motif du haut', couleurHaut2: 'Seconde couleur du haut',
  motifBas: 'Motif du bas', couleurBas2: 'Seconde couleur du bas', formeChaussures: 'Chaussures', chaussures: 'Couleur des chaussures'
};
// Les accessoires qu'on choisit ici : les gratuits, hors tenues de saison (elles servent sur l'île, la saison venue)
const FREE = Object.entries(CATALOG.accessoires).filter(([, a]) => a.source === 'gratuit' && !a.saison);
// À qui va un choix (catalogue : genres) : une valeur sans genre va aux deux
const GENRES = CATALOG.genres || {};
const genreOf = (key, value) => Object.entries(GENRES[key] || {}).find(([, values]) => values.includes(value))?.[0] || null;
const fits = (key, value, genre) => { const g = genreOf(key, value); return !g || g === genre; };
// Les choix ramenés au genre : ce qui va à l'autre genre prend la valeur de repli, ses accessoires s'enlèvent
function forGenre(o) {
  const next = { ...o, accessoires: { ...(o.accessoires || {}) } };
  for (const key of Object.keys(GENRES)) {
    if (key !== 'accessoires' && !fits(key, next[key], next.genre)) next[key] = (CATALOG.defautGenre || {})[next.genre]?.[key] ?? CATALOG.defaut[key];
  }
  for (const [place, a] of Object.entries(next.accessoires)) if (a && !fits('accessoires', a.id, next.genre)) delete next.accessoires[place];
  return next;
}
const swatches = from => Object.entries(CATALOG.nuanciers[from]).map(([id, color]) => ({ id, color, name: CATALOG.noms[from][id] }));
// Le tour sur soi-même : une vue par temps ; l'aperçu se repose un moment après qu'on l'a touché
const TURN_MS = 1100;
const REST_MS = 5000;

export default {
  name: 'AvatarMaker',
  props: {
    // Les choix complets (game/avatarCatalog.js, freeChoicesOf)
    modelValue: { type: Object, required: true }
  },
  emits: ['update:modelValue'],
  data() {
    return { TABS, tab: 'corps', step: 0, blink: 0, dragX: null, restUntil: 0 };
  },
  computed: {
    figure() {
      return turnFrame(this.modelValue, TURN[this.step], this.step === 0 ? this.blink : 0);
    },
    rows() {
      const o = this.modelValue;
      return TABS.find(t => t.id === this.tab).rows
        // les mèches d'une seule couleur n'en ont pas d'autre ; la robe d'une pièce remplace le haut
        .filter(key => !(key === 'couleurMeches' && o.meches === 'sans') && !((key === 'haut' || key === 'couleurHaut') && o.bas === 'robeEntiere'))
        // la seconde couleur d'un habit ne sert qu'au dégradé ; la barbe et la moustache ne se proposent qu'à l'homme
        .filter(key => !(key === 'couleurHaut2' && o.motifHaut === 'uni') && !(key === 'couleurBas2' && o.motifBas === 'uni'))
        .filter(key => !((key === 'barbe' || key === 'moustache' || key === 'menton') && o.genre !== 'homme'))
        .filter(key => CATALOG.choix[key])
        .map(key => {
          const { dans } = CATALOG.choix[key];
          // seulement ce qui va au genre choisi
          const options = CATALOG.choix[key].options.filter(id => fits(key, id, o.genre));
          if (dans === 'formes') return { key, label: LABELS[key], options: options.map(id => ({ id, name: CATALOG.formes[key][id] })) };
          return { key, label: LABELS[key], swatch: true, options: swatches(dans).filter(opt => options.includes(opt.id)) };
        });
    },
    places() {
      // les gratuits du genre choisi, rangés par emplacement
      const genre = this.modelValue.genre;
      return Object.entries(CATALOG.emplacements)
        .map(([id, label]) => ({ id, label, items: FREE.filter(([key, a]) => a.emplacement === id && fits('accessoires', key, genre)).map(([key, a]) => ({ id: key, name: a.nom })) }))
        .filter(place => place.items.length);
    }
  },
  watch: {
    // Un autre onglet se lit depuis le haut
    tab() {
      if (this.$refs.panel) this.$refs.panel.scrollTop = 0;
    }
  },
  mounted() {
    kitNow();
    if (reducedMotion()) return;
    this.timer = setInterval(() => {
      if (this.dragX !== null || Date.now() < this.restUntil) return;
      // De face, un clignement avant de tourner
      if (this.step === 0 && !this.blink) this.blink = 1;
      else {
        this.blink = 0;
        this.step = (this.step + 1) % TURN.length;
      }
    }, TURN_MS);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    emit(next) {
      this.$emit('update:modelValue', next);
    },
    set(key, value) {
      let next = { ...this.modelValue, [key]: value };
      // changer de genre remplace ce qui va à l'autre (coupe, barbe, accessoires…)
      if (key === 'genre') next = forGenre(next);
      this.emit(next);
      // Ce qu'on vient de changer se voit de face
      this.rest(0);
    },
    rest(step = this.step) {
      this.step = step;
      this.blink = 0;
      this.restUntil = Date.now() + REST_MS;
    },
    turn(dir) {
      this.rest((this.step + dir + TURN.length) % TURN.length);
    },
    grab(event) {
      this.dragX = event.clientX;
    },
    release(event) {
      if (this.dragX === null) return;
      const dx = event.clientX - this.dragX;
      this.dragX = null;
      if (Math.abs(dx) > 24) this.turn(dx < 0 ? 1 : -1);
    },
    luck() {
      const kit = kitNow();
      if (!kit) return;
      this.emit(kit.auHasard(Math.floor(Math.random() * 2 ** 31), { gratuit: true }));
      this.rest(0);
    },
    worn(place) {
      return (this.modelValue.accessoires || {})[place] || null;
    },
    wornId(place) {
      const a = this.worn(place);
      return a ? a.id : null;
    },
    wear(place, id) {
      const accessoires = { ...(this.modelValue.accessoires || {}) };
      if (id) accessoires[place] = { id, couleurs: [...CATALOG.accessoires[id].defaut] };
      else delete accessoires[place];
      this.emit({ ...this.modelValue, accessoires });
      this.rest(0);
    },
    tint(place, z, color) {
      const a = this.worn(place);
      const couleurs = [...a.couleurs];
      couleurs[z] = color;
      this.emit({ ...this.modelValue, accessoires: { ...this.modelValue.accessoires, [place]: { ...a, couleurs } } });
      this.rest(0);
    },
    // Les zones de couleur de l'objet porté à cet emplacement : un nuancier de tissus ou de métaux chacune
    zonesOf(place) {
      const a = this.worn(place);
      if (!a) return [];
      const def = CATALOG.accessoires[a.id];
      return def.zones.map((zone, i) => ({
        label: def.zones.length > 1 ? `${def.nom}, couleur ${i + 1}` : def.nom,
        options: swatches(zone === 'metal' ? 'metaux' : 'tissus')
      }));
    }
  }
};
</script>

<style scoped src="./AvatarMaker.css"></style>
