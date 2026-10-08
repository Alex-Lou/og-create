<template>
  <div class="world__panel">
    <!-- Embrumé par un égaré (HISTOIRE.md § 6.15) : il ne produit plus jusqu'à sa réparation -->
    <div v-if="blight" class="world__blight" role="status">
      <img v-if="repairArt" :src="repairArt" alt="" class="world__blight-icon" />
      <span class="world__blight-text"><strong>Embrumé</strong> : un égaré l’a atteint cette nuit, il ne produit plus.</span>
      <button type="button" class="g-btn world__blight-btn" :disabled="busy" @click="$emit('repair')">
        Réparer · <ElementGlyph :glyph="GLYPH[blight.repair.resource]" />{{ blight.repair.amount }}
      </button>
    </div>
    <p v-if="site.effect" class="world__site-effect">{{ site.effect }}</p>
    <p v-else class="world__site-effect">{{ site.levels[0].effect }}</p>
    <div v-if="site.produce && site.level" class="world__prod">
      <div class="world__prod-row">
        <span>Par heure</span>
        <strong>+{{ num(perHourOf(site).amount) }} <ElementGlyph :glyph="GLYPH[site.produce]" /> · +{{ num(perHourOf(site).coins) }} écus</strong>
      </div>
      <div v-if="site.bonus" class="world__prod-row">
        <span>Bonus de la boutique</span>
        <strong>+{{ site.bonus }} % de production</strong>
      </div>
      <div v-if="site.moodBonus && friend" :class="['world__prod-row', site.moodBonus > 0 ? 'is-happy' : 'is-sad']">
        <span>Humeur de {{ friend.name }}</span>
        <strong>{{ site.moodBonus > 0 ? '+' : '−' }}{{ Math.abs(site.moodBonus) }} % de production</strong>
      </div>
      <div v-if="site.landmarkBonus" class="world__prod-row">
        <span>Lieux remarquables</span>
        <strong>+{{ site.landmarkBonus }} % de production</strong>
      </div>
      <div v-if="annexYield(site).count" class="world__prod-row">
        <span>Annexes · {{ annexYield(site).count }}</span>
        <strong v-if="annexYield(site).rate">+{{ annexYield(site).rate }} <ElementGlyph :glyph="GLYPH[site.produce]" /> · +{{ annexYield(site).earn }} écus par heure</strong>
        <strong v-else>Réserve agrandie</strong>
      </div>
      <div :class="['world__prod-row', { 'is-full': full }]">
        <span>Réserve</span>
        <strong>{{ site.capHours || capHours }} h de production au plus<template v-if="fullText"> · {{ fullText }}</template></strong>
      </div>
      <p v-if="full" class="world__prod-full" role="status">Sa réserve est pleine : ramasse pour que la production reprenne.</p>
      <div class="world__prod-row is-pending">
        <span>À ramasser</span>
        <strong>+{{ site.pending ? site.pending[site.produce] : 0 }} <ElementGlyph :glyph="GLYPH[site.produce]" /> · +{{ site.pending ? site.pending.coins : 0 }} écus</strong>
      </div>
      <button type="button" class="world__btn" :disabled="busy || !pending" @click="$emit('collect', $event)">Ramasser la production</button>
    </div>
    <!-- Foyer : les habitants de l'île, leurs cœurs, leur humeur ; le besoin qui manque, sinon un point quand l'un
         attend une visite aujourd'hui ; « Tout combler » donne ce qu'il faut à tous, tant que le stock suffit -->
    <p v-if="site.id === 'foyer' && civStage" class="world__civ world__civ--site">Étape : {{ civStage }}</p>
    <section v-if="site.id === 'foyer' && villagers.length" class="world__friends" aria-label="Habitants">
      <h3 class="world__friends-title">Habitants</h3>
      <ul class="world__friends-list">
        <li v-for="v in villagers" :key="v.id">
          <button type="button" class="world__friend" :aria-label="friendLabel(v)" @click="$emit('villager', v.id)">
            <span class="world__friend-face">
              <img :src="portraits[v.id]" alt="" />
              <span v-if="v.mood" class="world__friend-mood" aria-hidden="true"><ElementGlyph :glyph="MOOD_GLYPH[v.mood]" /></span>
            </span>
            <span class="world__friend-name">{{ v.name }}</span>
            <span class="world__friend-hearts" aria-hidden="true">{{ '♥'.repeat(v.hearts) }}<span>{{ '♥'.repeat(5 - v.hearts) }}</span></span>
            <span v-if="missingOf(v).length" class="world__friend-need" aria-hidden="true"><ElementGlyph :glyph="NEED_GLYPH[missingOf(v)[0].id]" /></span>
            <span v-else-if="awaits(v)" class="world__friend-dot" aria-hidden="true"></span>
          </button>
        </li>
        <li v-if="visitor">
          <button type="button" class="world__friend is-guest" :aria-label="`${visitor.name}, ${visitor.role}, de passage`" @click="$emit('visitor')">
            <span class="world__friend-face"><img :src="visitorArt" alt="" /></span>
            <span class="world__friend-name">{{ visitor.name }}</span>
            <span class="world__friend-guest">de passage</span>
            <span v-if="!visitor.satisfied" class="world__friend-need is-quest" aria-hidden="true"><ElementGlyph glyph="ui:spark" /></span>
          </button>
        </li>
      </ul>
      <button v-if="fillAll.count" type="button" class="world__btn world__fill-all" :disabled="busy" @click="$emit('fill-all')">
        Tout combler
        <span v-for="(n, r) in fillAll.cost" :key="r" class="world__fill-cost"><ElementGlyph :glyph="GLYPH[r]" />{{ n }}</span>
      </button>
    </section>
    <!-- Foyer : l'établi des créations d'île -->
    <div v-if="site.id === 'foyer' && crafts" class="world__game">
      <span class="world__game-art" aria-hidden="true"><img :src="benchArt" alt="" /></span>
      <span class="world__game-body">
        <span class="world__game-kind">Établi</span>
        <span class="world__game-name">Créations d’île</span>
        <span class="world__game-text">{{ benchText }}</span>
      </span>
      <button type="button" class="world__game-btn" aria-label="Ouvrir l’établi" :disabled="busy" @click="$emit('bench')">Ouvrir</button>
    </div>
    <!-- Mini-jeu du bâtiment (Ponton, Carrière, Bosquet), ouvert au palier III -->
    <div v-if="gameOf(site)" :class="['world__game', { 'is-locked': !gameOf(site).open }]">
      <span class="world__game-art" aria-hidden="true"><GameIcon :kind="GAME_ICONS[gameOf(site).id]" :size="40" /></span>
      <span class="world__game-body">
        <span class="world__game-kind">Mini-jeu</span>
        <span class="world__game-name">{{ gameOf(site).name }}</span>
        <span class="world__game-text">{{ gameOf(site).open ? `${gameOf(site).plays} / ${gameOf(site).max} parties · jusqu’à ${gameOf(site).cap} écus` : `S’ouvre au palier ${roman(gameOf(site).level)}` }}</span>
      </span>
      <button type="button" class="world__game-btn" :disabled="busy || !gameOf(site).open" @click="$emit('game', gameOf(site).id)">{{ gameOf(site).open ? 'Jouer' : `Palier ${roman(gameOf(site).level)}` }}</button>
    </div>
    <div v-else-if="!site.level" class="world__sheet-actions">
      <button type="button" class="world__btn" @click="$emit('evolution')">Voir ce qu’il faut pour bâtir</button>
    </div>
  </div>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import GameIcon from '../../Games/GameIcon/GameIcon.vue';
import { GLYPH } from '@/game/resources';
import { roman } from '@/utils/roman';
import { awaits } from '@/world/friends';
import { NEED_GLYPH, MOOD_GLYPH, MOOD_LABEL, missingOf, fillAllOf, leftText } from '@/world/needs';
import { annexYield } from '@/world/annexes';
import { spriteUrl } from '@/world/spriteCache';
import { craftThumb } from '@/world/craftSprites';
import { creationThumb } from '@/world/creations';
import { repairIcon } from '@/world/nightArt';

// Mini-jeux : l'icône de chaque jeu dans la fiche de son bâtiment
const GAME_ICONS = { peche: 'dore', filon: 'diamant', cueillette: 'fraise' };

// Onglet « Aperçu » de la fiche d'un bâtiment : ce qu'il fait, sa production (et ce qui la change), ce qui attend
// d'être ramassé ; au Foyer, l'étape de civilisation, les habitants et l'établi ; le mini-jeu du bâtiment. Les actions
// (ramasser, ouvrir une fiche, combler, jouer) restent à l'île, qui les reçoit en événements. Ses styles sont ceux de
// l'île (WorldView, classes world__)
export default {
  name: 'SiteOverview',
  components: { ElementGlyph, GameIcon },
  props: {
    site: { type: Object, required: true },
    // Production de base par palier ({ produce, coins }) et réserve par défaut (heures), de la vue du serveur
    rates: { type: Object, required: true },
    capHours: { type: Number, default: 0 },
    // Ce qui attend dans tous les bâtiments, écus ou ressources (« Ramasser » s'éteint quand il n'y a rien)
    pending: { type: Number, default: 0 },
    // Temps passé depuis cette vue du serveur (ms) : la réserve se remplit
    elapsed: { type: Number, default: 0 },
    // L'habitant qui travaille ici (son humeur change la production), ou null
    friend: { type: Object, default: null },
    // Étape de civilisation (bible, § 6.10), ou null
    civStage: { type: String, default: null },
    // Habitants, règles des besoins (leurs noms), portraits par habitant ; visiteur de passage et son portrait
    villagers: { type: Array, default: () => [] },
    needs: { type: Object, default: null },
    portraits: { type: Object, default: () => ({}) },
    visitor: { type: Object, default: null },
    visitorArt: { type: String, default: '' },
    // Établi (vue du serveur : catalogue, créations posées), ou null ; mini-jeux de l'île
    crafts: { type: Object, default: null },
    games: { type: Array, default: () => [] },
    // Embrumé (nuits) : { site, since, repair: { resource, amount } }, ou null
    blight: { type: Object, default: null },
    busy: { type: Boolean, default: false }
  },
  emits: ['collect', 'villager', 'visitor', 'fill-all', 'bench', 'game', 'evolution', 'repair'],
  data() {
    return { GLYPH, GAME_ICONS, NEED_GLYPH, MOOD_GLYPH, repairArt: repairIcon() };
  },
  computed: {
    // Réserve de production : pleine (elle attend le ramassage), ou pleine dans tant de temps
    full() {
      return this.site.fullIn !== null && this.site.fullIn !== undefined && this.site.fullIn - this.elapsed <= 0;
    },
    fullText() {
      if (this.site.fullIn === null || this.site.fullIn === undefined) return '';
      return this.full ? 'pleine' : `pleine dans ${leftText(this.site.fullIn - this.elapsed)}`;
    },
    // « Tout combler » : besoins renouvelables de tous les habitants et leur prix
    fillAll() {
      return fillAllOf(this.villagers);
    },
    // Établi : son dessin, ce qui attend
    benchArt() {
      return creationThumb('cloture') ?? spriteUrl('craft-thumb-cloture', () => craftThumb('cloture'));
    },
    benchText() {
      const { catalog } = this.crafts;
      const ready = catalog.filter(c => !c.block).length;
      const reserve = catalog.reduce((n, c) => n + c.reserve, 0);
      return [`${this.crafts.placed.length} sur l’île`, reserve ? `${reserve} en réserve` : '', ready ? `${ready} à assembler` : ''].filter(Boolean).join(' · ');
    }
  },
  methods: {
    roman,
    awaits,
    missingOf,
    annexYield,
    perHourOf(site) {
      return site.perHour || { amount: this.rates.produce * site.level, coins: this.rates.coins * site.level };
    },
    num(n) {
      return Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    },
    friendLabel(v) {
      const missing = missingOf(v).map(n => this.needs?.kinds?.[n.id]?.label || n.id);
      return `${v.name}, ${v.role} : ${v.hearts} cœur${v.hearts > 1 ? 's' : ''}, ${MOOD_LABEL[v.mood] || ''}${missing.length ? `, besoin : ${missing.join(', ')}` : ''}`;
    },
    gameOf(site) {
      return this.games.find(g => g.site === site.id) || null;
    }
  }
};
</script>

<style scoped src="./SiteOverview.css"></style>
