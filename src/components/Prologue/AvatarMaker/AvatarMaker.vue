<template>
  <!-- L'éditeur de l'avatar (HISTOIRE.md § 6.17) : le personnage en grand, sur la plage de Brumelune où il vient de
       s'échouer, au couchant (PlageScene ; choix de l'auteur, 15 oct.) ; dessous (ou à côté, sur un écran
       couché), la feuille des choix : un onglet par partie (son icône : le personnage lui-même), une rangée à la fois, des
       vignettes vivantes (le personnage avec chaque choix) et des nuanciers. Seul ce qui est libre se choisit ici (ce qui
       se gagne viendra de la boutique et des coffres). Sur la plage, on le voit échoué (ou tel qu'avant la vague : rien
       ne s'enregistre) ; son expression se choisit avec son visage (onglet Visage). thought : la pensée posée en haut de la plage ; actions : les
       boutons sous la feuille. La brume se lève sur lui ; bow() : il s'ébroue, hoche la tête, la brume revient -->
  <div :class="['avm', { 'is-bowing': bowing, 'is-veiled': veil === 'closed' }]">
    <!-- une seule page : la plage en fond, partout (la feuille flotte dessus) -->
    <PlageScene :veil="veil">
      <!-- son reflet dans le sable mouillé ; le personnage (il respire), éclairé par le couchant (couchant.js : le soleil
           bas, d'or rose ; la lanterne, chaude, qui vacille) ; l'image d'avant qui fond par-dessus, les gouttes là où ça change -->
      <div v-if="figure" ref="mirror" class="avm__body avm__body--reflet" aria-hidden="true">
        <img class="avm__figure" :src="figure" alt="" draggable="false" />
      </div>
      <div v-if="figure" ref="body" class="avm__body">
        <img class="avm__figure" :src="figure" :alt="MAKER.figure" draggable="false" />
        <img v-if="fading" :key="fadeKey" class="avm__figure avm__figure--out" :src="fading" alt="" draggable="false" @animationend="fading = null" />
        <span v-if="burst" :key="burst.key" class="avm__burst" :style="{ top: burst.y }" aria-hidden="true" @animationend.self="burst = null">
          <i v-for="spark in SPARKS" :key="spark.id" :style="spark.style"></i>
        </span>
      </div>
    </PlageScene>
    <!-- la place du personnage : on l'y fait tourner au doigt ; ses commandes -->
    <div class="avm__stage" @pointerdown="grab" @pointermove="drag" @pointerup="release" @pointercancel="release">
      <span v-if="!figure" class="avm__wait g-italic">{{ MAKER.wait }}</span>
      <div class="avm__thought"><slot name="thought" /></div>
      <!-- échoué, ou tel qu'avant la vague : un bouton qui bascule (il dit ce qu'on verra) -->
      <button v-if="figure && vague" type="button" class="avm__vague" :aria-pressed="!castawayLook" @pointerdown.stop @click.stop="castawayLook = !castawayLook">
        {{ castawayLook ? MAKER.vague.avant : MAKER.vague.echoue }}
      </button>
      <button type="button" class="avm__turn avm__turn--left" aria-label="Tourner vers la gauche" @click.stop="turn(-1)">↺</button>
      <button type="button" class="avm__turn avm__turn--right" aria-label="Tourner vers la droite" @click.stop="turn(1)">↻</button>
      <button type="button" class="avm__luck" @click.stop="luck">Au hasard</button>
    </div>

    <div class="avm__sheet">
      <!-- (au clavier : seul l'onglet ouvert se prend à la tabulation ; les flèches, Début et Fin passent d'un onglet à l'autre) -->
      <div class="avm__tabs" role="tablist" aria-label="Ce que tu changes" @keydown="tabKey">
        <button
          v-for="t in TABS" :id="`avm-tab-${t.id}`" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" aria-controls="avm-panel"
          :tabindex="tab === t.id ? 0 : -1" :class="['avm__tab', { 'is-on': tab === t.id }]" @click="tab = t.id"
        >
          <span class="avm__tab-icon" aria-hidden="true"><img v-if="tabIcon(t)" :src="tabIcon(t)" alt="" draggable="false" /></span>
          <span class="avm__tab-label">{{ t.label }}</span>
        </button>
      </div>

      <div id="avm-panel" ref="panel" class="avm__panel" role="tabpanel" :aria-labelledby="`avm-tab-${tab}`">
        <!-- les rangées de l'onglet : une à la fois -->
        <div v-if="rows.length > 1" ref="rowBar" class="avm__rowbar">
          <button
            v-for="r in rows" :key="r.key" type="button" :aria-pressed="row && row.key === r.key"
            :class="['avm__rowbtn', { 'is-on': row && row.key === r.key }]" @click="pickRow(r.key)"
          >{{ r.label }}</button>
        </div>
        <template v-if="row">
          <p class="avm__chosen"><span>{{ row.label }}</span> <strong>{{ chosenName }}</strong></p>
          <div v-if="row.swatch" class="avm__swatches" role="radiogroup" :aria-label="row.label">
            <button
              v-for="opt in row.options" :key="opt.id" type="button" role="radio" :aria-checked="row.value === opt.id"
              :class="['avm__swatch', { 'is-on': row.value === opt.id, 'is-none': !opt.color }]"
              :style="opt.color ? { '--sw': opt.color } : null" :title="opt.name" :aria-label="opt.name" @click="row.pick(opt.id)"
            ></button>
          </div>
          <div v-else class="avm__thumbs" role="radiogroup" :aria-label="row.label">
            <button
              v-for="opt in row.options" :key="opt.id" type="button" role="radio" :aria-checked="row.value === opt.id"
              :class="['avm__thumb', { 'is-on': row.value === opt.id }]" @click="row.pick(opt.id)"
            >
              <span class="avm__thumb-art"><img v-if="thumb(opt)" :src="thumb(opt)" alt="" draggable="false" /></span>
              <span class="avm__thumb-name">{{ opt.name }}</span>
            </button>
          </div>
          <!-- un objet porté : ses couleurs -->
          <div v-for="(zone, z) in row.zones || []" :key="`zone-${z}`" class="avm__zone">
            <p class="avm__chosen"><span>{{ zone.label }}</span> <strong>{{ zone.chosen }}</strong></p>
            <div class="avm__swatches" role="radiogroup" :aria-label="zone.label">
              <button
                v-for="opt in zone.options" :key="opt.id" type="button" role="radio" :aria-checked="zone.value === opt.id"
                :class="['avm__swatch', { 'is-on': zone.value === opt.id }]" :style="{ '--sw': opt.color }" :title="opt.name" :aria-label="opt.name"
                @click="tint(row.place, z, opt.id)"
              ></button>
            </div>
          </div>
        </template>
      </div>
      <div class="avm__actions"><slot name="actions" /></div>
    </div>
  </div>
</template>

<script>
import { TURN, turnFrame, kitNow, loadKit, cropFrame } from '@/game/avatarKit';
import PlageScene from '../PlageScene/PlageScene.vue';
import { eclairer } from './couchant';
import { CATALOG } from '@/game/avatarCatalog';
import { reducedMotion } from '@/utils/fx';
import { MAKER } from '@/texts/ui/prologue';

// L'icône d'un onglet sans pièce (le sac) : par son adresse livrée (la bibliothèque n'est pas servie telle quelle)
const SAC_ICONE = Object.values(import.meta.glob('/design/bibliotheque/svg/interface/sac_icone.svg', { query: '?url', import: 'default', eager: true }))[0];

const TABS = [
  { id: 'corps', label: 'Corps', icon: 'pied', rows: ['genre', 'age', 'taille', 'silhouette', 'peau'] },
  { id: 'visage', label: 'Visage', icon: 'tete', rows: ['expression', 'visage', 'menton', 'yeux', 'formeYeux', 'cils', 'sourcils', 'barbe', 'moustache', 'bouche', 'levres', 'rousseur', 'joues', 'grain', 'cicatrice'] },
  { id: 'cheveux', label: 'Cheveux', icon: 'coiffure', rows: ['coupe', 'cheveux', 'meches', 'couleurMeches'] },
  { id: 'tenue', label: 'Tenue', icon: 'buste', rows: ['haut', 'couleurHaut', 'motifHaut', 'couleurHaut2', 'bas', 'couleurBas', 'motifBas', 'couleurBas2', 'formeChaussures', 'chaussures'] },
  { id: 'objets', label: 'Objets', icon: null }
];
const LABELS = {
  genre: 'Genre', menton: 'Menton', age: 'Âge', cicatrice: 'Cicatrice', taille: 'Taille', silhouette: 'Silhouette', peau: 'Peau', visage: 'Visage', yeux: 'Yeux', formeYeux: 'Forme des yeux', cils: 'Cils',
  sourcils: 'Sourcils', barbe: 'Barbe', moustache: 'Moustache', bouche: 'Bouche', expression: 'Expression', levres: 'Lèvres', rousseur: 'Taches de rousseur', joues: 'Joues', grain: 'Grain de beauté',
  coupe: 'Coupe', cheveux: 'Couleur', meches: 'Mèches', couleurMeches: 'Couleur des mèches', haut: 'Haut', couleurHaut: 'Couleur du haut',
  bas: 'Bas', couleurBas: 'Couleur du bas', motifHaut: 'Motif du haut', couleurHaut2: 'Seconde couleur du haut',
  motifBas: 'Motif du bas', couleurBas2: 'Seconde couleur du bas', formeChaussures: 'Chaussures', chaussures: 'Couleur des chaussures'
};
// La vignette de chaque choix de forme : le cadre qui le montre (game/avatarKit.js : CROPS)
const CROP_OF = {
  genre: 'pied', age: 'pied', taille: 'pied', silhouette: 'pied', coupe: 'coiffure', meches: 'coiffure',
  haut: 'buste', motifHaut: 'buste', bas: 'jambes', motifBas: 'jambes', formeChaussures: 'pieds'
};
// … et celle d'un objet, selon où il se porte
const CROP_OF_PLACE = { tete: 'coiffure', cheveux: 'coiffure', visage: 'tete', joues: 'tete', oreilles: 'tete', cou: 'buste', dessus: 'buste', pieds: 'pieds' };
// Une vignette de la tête ou de la coiffure se voit sans couvre-chef (il cacherait la coupe et le front)
const bareHead = (o, crop) => {
  if ((crop !== 'tete' && crop !== 'coiffure') || !(o.accessoires || {}).tete) return o;
  const accessoires = { ...o.accessoires };
  delete accessoires.tete;
  return { ...o, accessoires };
};
// Les accessoires qu'on choisit ici : les gratuits, hors tenues de saison (elles servent sur l'île, la saison venue)
const FREE = Object.entries(CATALOG.accessoires).filter(([, a]) => a.source === 'gratuit' && !a.saison);
// À qui va un choix (catalogue : genres) : une valeur sans genre va aux deux
const GENRES = CATALOG.genres || {};
const genreOf = (key, value) => Object.entries(GENRES[key] || {}).find(([, values]) => values.includes(value))?.[0] || null;
const fits = (key, value, genre) => { const g = genreOf(key, value); return !g || g === genre; };
// Les choix ramenés au genre qu'on vient de choisir : ce qui va à l'autre genre prend la valeur de repli, ses accessoires
// s'enlèvent, les cils et les sourcils prennent ceux du corps (catalogue : liesAuCorps) ; on peut les changer ensuite
function forGenre(o) {
  const next = { ...o, accessoires: { ...(o.accessoires || {}) } };
  for (const key of CATALOG.liesAuCorps || []) { const v = (CATALOG.defautGenre || {})[next.genre]?.[key]; if (v) next[key] = v; }
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
// Les vignettes se dessinent par petits paquets, au plus PAINT_MS par image (le doigt ne sent rien)
const PAINT_MS = 8;
// Le personnage vit (choix de l'auteur, 13 oct.), sonné : il vient de s'échouer (15 oct.). À chaque choix, il réagit (un
// sursaut pour ce qu'il porte, un hochement pour son visage et ses cheveux) et quelques gouttes d'eau sautent de là où
// ça change ; il se tourne vers nous
// une vue à la fois ; au doigt, il tourne en suivant le geste, et continue sur sa lancée.
// La région de chaque choix (sa hauteur sur le personnage, du haut) et son geste
const REGION = { coiffure: '14%', tete: '24%', buste: '60%', jambes: '80%', pieds: '93%', pied: '52%' };
const REGION_OF = {
  cheveux: 'coiffure', couleurMeches: 'coiffure', yeux: 'tete', levres: 'tete', peau: 'pied',
  couleurHaut: 'buste', couleurHaut2: 'buste', couleurBas: 'jambes', couleurBas2: 'jambes', chaussures: 'pieds'
};
const NOD = new Set(['visage', 'cheveux']);
// Les gouttes : huit en couronne, chacune sa direction, sa distance, sa taille (elles retombent : AvatarMaker.css)
const SPARKS = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2 + (i % 2) * 0.3;
  const d = 30 + (i % 3) * 8;
  return { id: i, style: { '--dx': `${Math.round(Math.cos(a) * d)}px`, '--dy': `${Math.round(Math.sin(a) * d * 0.8)}px`, '--s': `${11 + (i % 3) * 3}px`, animationDelay: `${(i % 3) * 30}ms` } };
});
// Au doigt : une vue tous les STEP_PX ; la lancée ralentit de FRICTION par image (16 ms), s'arrête sous STOP (px/ms) ;
// un choix ramène le personnage de face une vue tous les FACE_MS
const STEP_PX = 42;
const FRICTION = 0.9;
const STOP = 0.06;
const FACE_MS = 90;
// La brume (choix de l'auteur, 15 oct.) : elle se lève RAISE_MS après que le personnage est prêt (PlageScene) ; à « C'est
// moi », le personnage s'ébroue et hoche la tête BOW_MS, puis la brume revient en CLOSE_MS (le CSS les suit)
const RAISE_MS = 250;
const BOW_MS = 1100;
const CLOSE_MS = 900;

export default {
  name: 'AvatarMaker',
  components: { PlageScene },
  props: {
    // Les choix complets (game/avatarCatalog.js, freeChoicesOf)
    modelValue: { type: Object, required: true },
    // Vu d'abord en naufragé (le prologue) ; sinon, tel qu'avant la vague (Mon compte)
    castaway: { type: Boolean, default: true },
    // Le bouton échoué / avant la vague (pas pour un arrivant : il n'a pas fait naufrage)
    vague: { type: Boolean, default: true }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      TABS, MAKER, SPARKS, tab: 'corps', rowOf: {}, step: 0, blink: 0, dragX: null, restUntil: 0, thumbs: {}, lastThumb: {},
      fading: null, fadeKey: 0, burst: null,
      // la brume : fermée, puis levée ; elle revient au salut (rien en mouvement réduit)
      veil: reducedMotion() ? null : 'closed', bowing: false,
      // sur la plage, on le voit échoué ou non (rien ne s'enregistre)
      castawayLook: this.castaway
    };
  },
  computed: {
    figure() {
      return eclairer(turnFrame(this.modelValue, TURN[this.step], this.step === 0 ? this.blink : 0, this.castawayLook));
    },
    // Les rangées de l'onglet : { key, label, swatch, options ([{ id, name, color | choices, crop, slot }]), value,
    // pick(id) } ; pour un objet, ses couleurs (zones) et son emplacement (place)
    rows() {
      const o = this.modelValue;
      if (this.tab === 'objets') return this.places;
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
          const ids = CATALOG.choix[key].options.filter(id => fits(key, id, o.genre));
          const row = { key, label: LABELS[key], value: o[key], pick: id => this.set(key, id) };
          if (dans !== 'formes') return { ...row, swatch: true, options: swatches(dans).filter(opt => ids.includes(opt.id)) };
          const crop = CROP_OF[key] || 'tete';
          return {
            ...row,
            options: ids.map(id => ({
              id, name: CATALOG.formes[key][id], crop, slot: `${key}|${id}`,
              choices: bareHead(key === 'genre' ? forGenre({ ...o, genre: id }) : { ...o, [key]: id }, crop)
            }))
          };
        });
    },
    places() {
      // les gratuits du genre choisi, rangés par emplacement ; « Rien » d'abord
      const o = this.modelValue;
      // (un objet d'ailleurs que la tête se voit sans couvre-chef, comme les autres vignettes de la tête)
      const without = place => { const accessoires = { ...(o.accessoires || {}) }; delete accessoires[place]; return { ...o, accessoires }; };
      const seen = (place, choices, crop) => (place === 'tete' ? choices : bareHead(choices, crop));
      return Object.entries(CATALOG.emplacements)
        .map(([place, label]) => {
          const items = FREE.filter(([id, a]) => a.emplacement === place && fits('accessoires', id, o.genre));
          const crop = CROP_OF_PLACE[place] || 'pied';
          return {
            key: `objet:${place}`, label, place, value: this.wornId(place) || 'rien', pick: id => this.wear(place, id === 'rien' ? null : id),
            zones: this.zonesOf(place),
            options: [
              { id: 'rien', name: 'Rien', crop, slot: `${place}|rien`, choices: seen(place, without(place), crop) },
              ...items.map(([id, a]) => ({
                id, name: a.nom, crop, slot: `${place}|${id}`,
                choices: seen(place, { ...o, accessoires: { ...(o.accessoires || {}), [place]: { id, couleurs: [...a.defaut] } } }, crop)
              }))
            ],
            count: items.length
          };
        })
        .filter(place => place.count);
    },
    // La rangée montrée : celle qu'on a choisie dans cet onglet, sinon la première
    row() {
      return this.rows.find(r => r.key === this.rowOf[this.tab]) || this.rows[0] || null;
    },
    // Le nom de ce qui est choisi dans la rangée (une couleur se lit aussi au doigt)
    chosenName() {
      const r = this.row;
      const opt = r && r.options.find(x => x.id === r.value);
      return opt ? opt.name : '';
    },
    // Les vignettes à dessiner : les icônes des onglets, puis celles de la rangée montrée
    wanted() {
      const icons = TABS.filter(t => t.icon).map(t => ({ choices: bareHead(this.modelValue, t.icon), crop: t.icon, slot: `onglet|${t.id}` }));
      const opts = this.row && !this.row.swatch ? this.row.options : [];
      return [...icons, ...opts].map(w => ({ ...w, k: `${w.crop}|${JSON.stringify(w.choices)}` }));
    }
  },
  watch: {
    // Un autre onglet se lit depuis le haut
    tab() {
      if (this.$refs.panel) this.$refs.panel.scrollTop = 0;
    },
    wanted() {
      this.paint();
    },
    // Une autre image : l'ancienne fond par-dessus (un fondu bref ; le clignement aussi)
    figure(next, prev) {
      // Seul un choix (une tenue, une couleur, une humeur…) fond d'une image à l'autre ; un pas du tour ou un clignement
      // change net, comme une image d'animation (deux poses fondues l'une dans l'autre se doublaient : yeux, sourcils)
      const pose = `${this.step}|${this.blink}`;
      const moved = pose !== this.lastPose;
      this.lastPose = pose;
      if (!prev || !next || reducedMotion() || moved) { this.fading = null; return; }
      this.fading = prev;
      this.fadeKey += 1;
    }
  },
  mounted() {
    loadKit().then(() => this.paint()).catch(() => {}).then(() => {
      if (this.veil) this.timers.push(setTimeout(() => { this.veil = 'open'; }, RAISE_MS));
    });
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
  created() {
    this.timers = [];
    this.lastPose = '0|0';
  },
  beforeUnmount() {
    this.timers.forEach(clearTimeout);
    clearInterval(this.timer);
    clearTimeout(this.faceTimer);
    cancelAnimationFrame(this.paintRaf);
    cancelAnimationFrame(this.spinRaf);
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
      this.react(REGION_OF[key] || CROP_OF[key] || 'tete', NOD.has(this.tab) ? 'nod' : 'startle');
    },
    // Il réagit à un choix : il se tourne vers nous, une vue à la fois ; un geste (startle : un sursaut, nod : un
    // hochement, shake : il s'ébroue) ; les gouttes sautent de la région qui change
    react(region, gesture) {
      this.toFront();
      if (reducedMotion()) return;
      this.burst = { key: (this.burst ? this.burst.key : 0) + 1, y: REGION[region] || REGION.pied };
      this.$nextTick(() => {
        const el = this.$refs.body;
        if (!el) return;
        // (son reflet fait le même geste, retourné)
        for (const e of [el, this.$refs.mirror].filter(Boolean)) {
          e.classList.remove('is-startle', 'is-nod', 'is-shake');
          void e.offsetWidth;
          e.classList.add(`is-${gesture}`);
        }
      });
    },
    // De face, une vue à la fois par le plus court (tout de suite en mouvement réduit)
    toFront() {
      clearTimeout(this.faceTimer);
      cancelAnimationFrame(this.spinRaf);
      this.restUntil = Date.now() + REST_MS;
      if (reducedMotion()) {
        this.face(0);
        return;
      }
      const n = TURN.length;
      const go = () => {
        if (this.step === 0) return;
        this.face(this.step + (this.step <= n / 2 ? -1 : 1));
        this.faceTimer = setTimeout(go, FACE_MS);
      };
      go();
    },
    // Les onglets au clavier (le modèle des onglets WAI-ARIA) : ← → d'un onglet au voisin (en boucle), Début et Fin au
    // premier et au dernier ; l'onglet atteint s'ouvre et prend le focus
    tabKey(event) {
      const i = TABS.findIndex(t => t.id === this.tab), n = TABS.length;
      const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[event.key];
      if (to === undefined) return;
      event.preventDefault();
      this.tab = TABS[to].id;
      this.$el.querySelector(`#avm-tab-${TABS[to].id}`).focus();
    },
    pickRow(key) {
      this.rowOf = { ...this.rowOf, [this.tab]: key };
      if (this.$refs.panel) this.$refs.panel.scrollTop = 0;
    },
    // La vignette d'un choix : la sienne une fois dessinée, sinon la dernière qu'il a eue (rien ne clignote)
    thumb(opt) {
      return this.thumbs[`${opt.crop}|${JSON.stringify(opt.choices)}`] || this.lastThumb[opt.slot] || null;
    },
    tabIcon(t) {
      if (!t.icon) return SAC_ICONE;
      return this.thumbs[`${t.icon}|${JSON.stringify(bareHead(this.modelValue, t.icon))}`] || this.lastThumb[`onglet|${t.id}`] || null;
    },
    // Dessine les vignettes qui manquent, PAINT_MS par image au plus ; puis oublie celles qui ne servent plus
    paint() {
      cancelAnimationFrame(this.paintRaf);
      if (!kitNow()) return;
      const todo = this.wanted.filter(w => !(w.k in this.thumbs));
      const step = () => {
        const t0 = performance.now();
        const done = {};
        while (todo.length && performance.now() - t0 < PAINT_MS) {
          const w = todo.shift();
          done[w.k] = cropFrame(w.choices, w.crop);
          if (done[w.k]) this.lastThumb[w.slot] = done[w.k];
        }
        this.thumbs = { ...this.thumbs, ...done };
        if (todo.length) this.paintRaf = requestAnimationFrame(step);
        else this.thumbs = Object.fromEntries(this.wanted.map(w => [w.k, this.thumbs[w.k]]).filter(([, url]) => url !== undefined));
      };
      this.paintRaf = requestAnimationFrame(step);
    },
    rest(step = this.step) {
      this.step = step;
      this.blink = 0;
      this.restUntil = Date.now() + REST_MS;
    },
    turn(dir) {
      clearTimeout(this.faceTimer);
      this.rest((this.step + dir + TURN.length) % TURN.length);
    },
    // Une vue du tour (step, ramené dans le tour) ; l'aperçu se repose un moment
    face(step) {
      this.step = ((step % TURN.length) + TURN.length) % TURN.length;
      this.blink = 0;
      this.restUntil = Date.now() + REST_MS;
    },
    // « C'est moi » : il se tourne vers nous, s'ébroue (il sort de l'eau), hoche la tête, puis la brume revient ; la
    // promesse se tient quand elle est revenue (tout de suite en mouvement réduit)
    bow() {
      if (!this.veil) return Promise.resolve();
      this.face(0);
      this.restUntil = Infinity;
      this.bowing = true;
      this.react('buste', 'shake');
      return new Promise(resolve => {
        this.timers.push(
          setTimeout(() => this.react('tete', 'nod'), 620),
          setTimeout(() => { this.veil = 'closing'; }, BOW_MS),
          setTimeout(resolve, BOW_MS + CLOSE_MS)
        );
      });
    },
    // Au doigt : le personnage suit le geste (une vue tous les STEP_PX), puis continue sur sa lancée
    grab(event) {
      if (this.bowing || event.target.closest('button')) return;
      clearTimeout(this.faceTimer);
      cancelAnimationFrame(this.spinRaf);
      this.dragX = event.clientX;
      this.dragFrom = this.step;
      this.lastX = event.clientX;
      this.lastT = performance.now();
      this.vel = 0;
      this.moved = false;
    },
    drag(event) {
      if (this.dragX === null) return;
      const now = performance.now();
      const dt = now - this.lastT;
      if (dt > 0) this.vel = 0.6 * this.vel + 0.4 * ((event.clientX - this.lastX) / dt);
      this.lastX = event.clientX;
      this.lastT = now;
      const dx = event.clientX - this.dragX;
      if (!this.moved && Math.abs(dx) < 8) return;
      if (!this.moved) event.currentTarget.setPointerCapture?.(event.pointerId);
      this.moved = true;
      this.face(this.dragFrom - Math.round(dx / STEP_PX));
    },
    release() {
      if (this.dragX === null) return;
      this.dragX = null;
      if (!this.moved || reducedMotion() || Math.abs(this.vel) < STOP * 3) return;
      // (la lancée : chaque STEP_PX parcouru tourne d'une vue, la vitesse s'éteint)
      let v = this.vel, run = 0, last = performance.now();
      const tick = now => {
        const dt = Math.min(48, now - last);
        last = now;
        run += v * dt;
        v *= FRICTION ** (dt / 16);
        while (Math.abs(run) >= STEP_PX) {
          this.face(this.step - Math.sign(run));
          run -= Math.sign(run) * STEP_PX;
        }
        if (Math.abs(v) > STOP) this.spinRaf = requestAnimationFrame(tick);
      };
      this.spinRaf = requestAnimationFrame(tick);
    },
    // « Au hasard » : le tirage assorti (une tenue accordée, des accessoires sobres et gratuits : avatar_choix.js, assorti ;
    // choix de l'auteur, 18 oct.)
    luck() {
      const kit = kitNow();
      if (!kit) return;
      this.emit(kit.assorti(Math.floor(Math.random() * 2 ** 31), { gratuit: true }));
      this.react('pied', 'startle');
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
      this.react(CROP_OF_PLACE[place] || 'pied', 'startle');
    },
    tint(place, z, color) {
      const a = this.worn(place);
      const couleurs = [...a.couleurs];
      couleurs[z] = color;
      this.emit({ ...this.modelValue, accessoires: { ...this.modelValue.accessoires, [place]: { ...a, couleurs } } });
      this.react(CROP_OF_PLACE[place] || 'pied', 'startle');
    },
    // Les zones de couleur de l'objet porté à cet emplacement : un nuancier de tissus ou de métaux chacune, la couleur
    // portée (value) et son nom (chosen)
    zonesOf(place) {
      const a = this.worn(place);
      if (!a) return [];
      const def = CATALOG.accessoires[a.id];
      return def.zones.map((zone, i) => {
        const options = swatches(zone === 'metal' ? 'metaux' : 'tissus');
        const value = a.couleurs[i];
        return {
          label: def.zones.length > 1 ? `${def.nom}, couleur ${i + 1}` : def.nom,
          options, value, chosen: (options.find(x => x.id === value) || {}).name || ''
        };
      });
    }
  }
};
</script>

<style scoped src="./AvatarMaker.css"></style>
