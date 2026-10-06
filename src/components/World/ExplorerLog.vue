<template>
  <GModal eyebrow="Carnet d’explorateur" :title="tab === 'places' ? 'Lieux remarquables' : 'La Chronique'" :width="520" @close="$emit('close')">
    <div class="g-tabs log__tabs" role="tablist" aria-label="Carnet d’explorateur">
      <button type="button" role="tab" :aria-selected="tab === 'places'" @click="tab = 'places'">Lieux</button>
      <button type="button" role="tab" :aria-selected="tab === 'chronicle'" @click="tab = 'chronicle'">Chronique</button>
    </div>
    <!-- La Chronique (bible, § 6.12) : la mémoire du peuple ; tout se déduit des actes finis -->
    <div v-if="tab === 'chronicle'" class="log">
      <p v-if="stage" class="log__progress">Étape : <strong>{{ stage }}</strong></p>
      <p v-if="!vigils.length" class="log__hint">Rien encore : la première veillée se tient à la fin de l’acte I.</p>
      <template v-else>
        <h3 class="log__title">Veillées</h3>
        <ul class="log__list">
          <li v-for="v in vigils" :key="v.act" class="log__row">
            <span class="log__body"><span class="log__name">Veillée {{ v.act }}</span><span class="log__where">{{ v.stage }}</span></span>
            <button type="button" class="log__btn" @click="$emit('replay', v.act)">Revoir</button>
          </li>
        </ul>
        <h3 class="log__title">Liens</h3>
        <ul class="log__list">
          <li v-for="link in links" :key="link.id" class="log__row log__row--link">
            <span class="log__name">{{ link.name }}</span>
            <span class="log__recipe">{{ link.recipe }}</span>
            <span class="log__text">{{ link.text }}</span>
          </li>
        </ul>
      </template>
      <template v-if="memories.length">
        <h3 class="log__title">Souvenirs retrouvés</h3>
        <ul class="log__list">
          <li v-for="m in memories" :key="m.id" class="log__row log__row--link">
            <span class="log__name">{{ m.name }}</span>
            <span class="log__text">« {{ m.line }} »</span>
          </li>
        </ul>
      </template>
      <!-- Anya (bible, § 6.14) : ses traces, une par quartier du cœur libéré, dans l'ordre ; la Révélation, à revoir -->
      <template v-if="anya && (traces.length || anya.revealed)">
        <h3 class="log__title">Traces d’Anya · {{ traces.length }} / {{ TRACE_COUNT }}</h3>
        <ul class="log__list">
          <li v-if="anya.revealed" class="log__row">
            <span class="log__body"><span class="log__name">La Révélation</span><span class="log__where">Anya s’est levée au Cercle de menhirs.</span></span>
            <button type="button" class="log__btn" @click="$emit('replay-anya')">Revoir</button>
          </li>
          <li v-for="n in traces" :key="n" class="log__row log__row--link">
            <span class="log__where">Trace {{ n }}</span>
            <span class="log__text">« {{ TRACES[n - 1] }} »</span>
          </li>
        </ul>
      </template>
      <!-- Les mots d'Héliane (bible, § 6.13) : un par acte, trouvés dans les bouteilles -->
      <template v-if="words.length">
        <h3 class="log__title">Les mots d’Héliane</h3>
        <ul class="log__list">
          <li v-for="w in words" :key="w.act" class="log__row log__row--link">
            <span class="log__where">Acte {{ w.act }}</span>
            <span class="log__text">« {{ w.text }} »</span>
          </li>
        </ul>
      </template>
      <!-- Le Bestiaire (bible, § 6.5) : les bêtes écrites dans le Grimoire, et les familiers venus auprès de leur maître -->
      <h3 class="log__title">Bestiaire · {{ beasts.length }} / {{ BEASTS.length }}</h3>
      <p v-if="!beasts.length" class="log__hint">Aucune bête écrite : ce qu’on écrit dans le Grimoire renaît sur l’île.</p>
      <ul v-else class="log__list log__beasts">
        <li v-for="b in beasts" :key="b.name" class="log__beast"><span class="log__name">{{ b.name }}</span><span class="log__where">{{ b.where }}</span></li>
      </ul>
      <template v-if="familiars.length">
        <h3 class="log__title">Familiers</h3>
        <ul class="log__list">
          <li v-for="f in familiars" :key="f.id" class="log__row log__row--link">
            <span class="log__name">{{ f.name }} · {{ NAMES[f.id] }}</span>
            <span class="log__text">{{ f.text }}</span>
          </li>
        </ul>
      </template>
    </div>
    <div v-else class="log">
      <p class="log__progress">
        <strong>{{ foundCount }} / {{ landmarks.length }}</strong> lieux découverts
        <span v-if="waiting" class="log__waiting">· {{ waiting }} t’attend{{ waiting > 1 ? 'ent' : '' }} sur l’île</span>
      </p>
      <ul class="log__list">
        <li
          v-for="l in landmarks"
          :key="l.id"
          ref="pages"
          :data-id="l.id"
          :class="['log__page', { 'is-found': l.found, 'is-unknown': l.known === false, 'is-focus': l.id === focus }]"
        >
          <span class="log__art" aria-hidden="true">
            <img v-if="l.known !== false" :src="artOf(l.id)" alt="" />
            <span v-else class="log__mystery">?</span>
          </span>
          <span class="log__body">
            <template v-if="l.known === false">
              <span class="log__name">Terre inconnue</span>
              <span class="log__where">Une expédition révélera ce lieu.</span>
            </template>
            <template v-else>
              <span class="log__name">{{ l.name }}</span>
              <span class="log__where">{{ zoneName(l.zone) }}<template v-if="climateOf(l.zone)"> · {{ climateOf(l.zone) }}</template></span>
              <span v-if="l.found" class="log__text">« {{ l.text }} »</span>
              <span :class="['log__effect', { 'is-dim': !l.found }]">{{ l.effect }}</span>
              <span v-if="l.found && l.foundAt" class="log__date">Découvert le {{ dateOf(l.foundAt) }}</span>
              <span v-else class="log__hint">{{ owned(l.zone) ? 'À découvrir : touche-le sur l’île.' : `Achète ${zoneName(l.zone)} pour le découvrir.` }}</span>
              <button type="button" class="log__btn" @click="$emit('show', l.id)">Voir sur l’île</button>
            </template>
          </span>
        </li>
      </ul>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import { spriteUrl } from '@/world/spriteCache';
import { landmarkThumb } from '@/world/landmarkSprites';
import { CLIMATE_NAMES } from '@/world/climates';
import { ACTS, stageOf, linksOf, peopleOf } from '@/game/vigils';
import { MEMORIES } from '@/world/story';
import { NAMES } from '@/world/faces';
import { BEASTS, beastsOf, familiarsOf } from '@/world/bestiary';
import { HELIANE } from '@/world/chest';
import { TRACES, TRACE_COUNT, tracesOf } from '@/game/anya';

// Les souvenirs retrouvés : chacun dans l'acte de sa quête (la Chronique les montre une fois l'acte fini)
const MEMORY_ACTS = { 'souvenir-ondin': 'T', 'souvenir-sylve': 'I', 'souvenir-galet': 'II', 'eveil-melisse': 'III', 'souvenir-aster': 'IV' };

// Le Carnet d'explorateur : une page par lieu remarquable. Découvert : son dessin, ce qu'il raconte, son effet durable,
// le jour de sa découverte ; connu : son effet et comment le découvrir ; inconnu : rien qu'un point d'interrogation.
// « Voir sur l'île » y mène la caméra. Tout vient de la vue de l'île (serveur).
export default {
  name: 'ExplorerLog',
  components: { GModal },
  props: {
    // [{ id, name, zone, text, effect, found, foundAt } | { id, zone, known: false }]
    landmarks: { type: Array, required: true },
    // Quartiers de la carte (nom, climat, à soi)
    zones: { type: Array, required: true },
    // Page ouverte d'emblée (appui long sur un lieu), ou null
    focus: { type: String, default: null },
    // Actes finis (Brume) et nom du peuple : la Chronique
    acts: { type: Array, default: () => [] },
    people: { type: String, default: null },
    // Éléments écrits dans le Grimoire : le Bestiaire et les familiers
    elements: { type: Array, default: () => [] },
    // Les actes dont le mot d'Héliane a été trouvé (serveur : heliane.found)
    heliane: { type: Array, default: () => [] },
    // Anya (serveur : { traces, awake, revealed, visit }), ou null
    anya: { type: Object, default: null }
  },
  emits: ['show', 'close', 'replay', 'replay-anya'],
  data() {
    return { tab: 'places', BEASTS, NAMES, TRACES, TRACE_COUNT };
  },
  computed: {
    stage() {
      return stageOf(this.acts, this.people);
    },
    vigils() {
      return ACTS.filter(act => this.acts.includes(act)).map(act => ({ act, stage: act === 'V' ? peopleOf(this.people) : stageOf([act], this.people) }));
    },
    links() {
      return linksOf(this.acts);
    },
    words() {
      return ACTS.filter(act => this.heliane.includes(act)).map(act => ({ act, text: HELIANE[act] }));
    },
    // Les traces d'Anya trouvées, en numéros (1 … n)
    traces() {
      return tracesOf(this.anya);
    },
    beasts() {
      return beastsOf(this.elements);
    },
    familiars() {
      return familiarsOf(this.elements);
    },
    memories() {
      return Object.entries(MEMORY_ACTS).filter(([, act]) => this.acts.includes(act)).map(([id]) => ({ id, name: NAMES[MEMORIES[id].villager], line: MEMORIES[id].line }));
    },
    foundCount() {
      return this.landmarks.filter(l => l.found).length;
    },
    waiting() {
      return this.landmarks.filter(l => l.known !== false && !l.found && this.owned(l.zone)).length;
    }
  },
  mounted() {
    const el = this.focus && (this.$refs.pages || []).find(page => page.dataset.id === this.focus);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center' });
  },
  methods: {
    zoneOf(id) {
      return this.zones.find(z => z.id === id) || null;
    },
    zoneName(id) {
      const zone = this.zoneOf(id);
      return zone && zone.name ? zone.name : 'ce quartier';
    },
    climateOf(id) {
      const zone = this.zoneOf(id);
      return zone ? CLIMATE_NAMES[zone.climate] || '' : '';
    },
    owned(id) {
      const zone = this.zoneOf(id);
      return Boolean(zone && zone.owned);
    },
    artOf(id) {
      return spriteUrl(`landmark-thumb-${id}`, () => landmarkThumb(id));
    },
    dateOf(at) {
      return new Date(at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
};
</script>

<style scoped>
/* Ses jetons : les encres dorées (recette et effet ; en attente et indice), le fond d'un lieu */
.log { --log-gold-ink: #6a4a12; --log-wait-ink: #8a5a12; --log-art: radial-gradient(circle at 50% 70%, #dcebf5, var(--vellum-200) 72%); }
.log { display: flex; flex-direction: column; gap: 10px; font-family: var(--font-ui); }
.log__tabs { margin-bottom: 10px; }
.log__title { margin: 6px 0 0; font-family: var(--font-display); font-size: 16px; }
.log__row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--r-tile); background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .1); }
.log__row--link { flex-direction: column; align-items: flex-start; gap: 2px; }
/* Bestiaire : deux colonnes de petites cartes */
.log__beasts { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 8px; }
.log__beast { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: var(--r-sm); background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .1); }
.log__row .log__body { flex: 1; }
.log__row .log__btn { align-self: center; }
.log__recipe { font-size: 12px; font-weight: 900; color: var(--log-gold-ink); }
.log__progress { margin: 0; padding: 8px 12px; border-radius: var(--r-sm); background: var(--vellum-200); font-size: 13px; font-weight: 700; }
.log__waiting { color: var(--log-wait-ink); font-weight: 900; }
.log__list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.log__page {
  display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 10px; align-items: start;
  padding: 8px; border-radius: var(--r-md); background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .1);
}
.log__page.is-found { box-shadow: inset 0 0 0 2px var(--gold-400); }
.log__page.is-focus { background: var(--gold-100); }
.log__art {
  position: relative; display: block; height: 100px; border-radius: var(--r-sm);
  background: var(--log-art);
}
.log__art img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 4px; box-sizing: border-box; object-fit: contain; }
.log__page:not(.is-found) .log__art img { filter: grayscale(.85) opacity(.5); }
.log__mystery { display: grid; place-items: center; height: 100%; font-family: var(--font-display); font-size: 40px; color: var(--ink-500); }
.log__body { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.log__name { font-family: var(--font-display); font-weight: 700; font-size: 17px; line-height: 1.15; }
.log__page.is-unknown .log__name { color: var(--ink-500); }
.log__where { color: var(--ink-700); font-size: 12px; font-weight: 700; }
.log__text { font-family: var(--font-display); font-style: italic; font-size: 14px; line-height: 1.35; }
.log__effect {
  align-self: flex-start; margin-top: 2px; padding: 2px 9px; border-radius: var(--r-pill);
  background: var(--gold-100); box-shadow: inset 0 0 0 1px var(--gold-300); font-size: 12px; font-weight: 900; color: var(--log-gold-ink);
}
.log__effect.is-dim { background: var(--vellum-200); box-shadow: none; color: var(--ink-700); }
.log__date, .log__hint { color: var(--ink-700); font-size: 12px; font-weight: 700; }
.log__hint { color: var(--log-wait-ink); }
.log__btn {
  align-self: flex-end; min-height: 36px; padding: 4px 14px; border: 0; border-radius: var(--r-pill);
  background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 13px;
  cursor: pointer; touch-action: manipulation;
}
</style>
