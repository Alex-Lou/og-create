<template>
  <div class="world__sheet-backdrop" @click.self="$emit('close')">
    <div class="world__sheet" role="dialog" aria-label="Brume, le feu follet">
      <div class="world__sheet-head">
        <span class="world__sheet-title world__brume-title"><BrumeWisp :size="30" :ready="Boolean(quest && quest.done)" :stage="stage" /> Brume</span>
        <button type="button" class="world__link" @click="$emit('close')">Fermer</button>
      </div>
      <template v-if="quest">
        <span class="world__eyebrow world__quest-eyebrow">{{ quest.act === 'T' ? 'Prologue' : `Acte ${quest.act}` }} · quête {{ quest.step }} sur {{ quest.total }}</span>
        <span v-if="civStage" class="world__civ">{{ civStage }}</span>
        <p class="world__brume-say">« {{ quest.say }} »</p>
        <div class="world__quest">
          <span class="world__quest-label">{{ quest.label }}</span>
          <span class="world__quest-count">{{ quest.have }}/{{ quest.need }}</span>
          <span class="world__quest-bar" role="progressbar" :aria-valuenow="quest.have" aria-valuemin="0" :aria-valuemax="quest.need">
            <i :style="{ width: `${(100 * quest.have) / quest.need}%` }"></i>
          </span>
          <span class="world__quest-reward">Récompense : <strong>{{ quest.coins }} écus</strong></span>
        </div>
        <p v-if="quest.chapter && !quest.done" class="world__quest-lock">
          Ouvre d’abord le chapitre {{ quest.chapter }} du Grimoire : écris de nouvelles découvertes.
        </p>
        <!-- Le fil d'Ariane (bible, § 6.1 à 6.3) : la cible et les pages qui restent -->
        <p v-else-if="quest.ariane && !quest.done" class="world__quest-lock">
          {{ ['level', 'craft'].includes(quest.kind) ? 'Le Grimoire connaît cette invention. ' : '' }}Vers : <strong>{{ quest.ariane.target }}</strong> —
          {{ quest.ariane.remaining > 1 ? `encore ${quest.ariane.remaining} pages` : 'dernière page' }}
        </p>
        <div class="world__sheet-actions">
          <button v-if="quest.done" type="button" class="world__btn" :disabled="busy" @click="$emit('claim')">Réclamer · {{ quest.coins }} écus{{ quest.chest ? ' + un coffre' : '' }}</button>
          <button v-else-if="quest.kind === 'runs'" type="button" class="world__btn" :disabled="busy || !charges" @click="$emit('harvest')">
            {{ charges ? 'Lancer une Récolte' : `Récolte : ${chargesText}` }}
          </button>
          <!-- Le nom du peuple (bible, § 6.11) : même règle que les autres noms -->
          <form v-else-if="quest.kind === 'name'" class="world__people" @submit.prevent="$emit('name')">
            <input v-model="people" class="world__people-input" type="text" maxlength="22" placeholder="Le peuple de…" aria-label="Nom du peuple" />
            <button type="submit" class="world__btn" :disabled="busy || people.trim().length < 2">Nommer</button>
          </form>
          <button v-else-if="action" type="button" class="world__btn" @click="$emit('action')">{{ action }}</button>
        </div>
      </template>
      <p v-else class="world__brume-say">« {{ brume.rested }} »</p>
      <!-- Le Savoir de Brume (bible, § 6.4) : maîtresse du sceau ☉, qu'elle révèle à la fin, le Phare allumé -->
      <template v-if="savoir && savoir.open">
        <p class="world__brume-art">{{ art }}</p>
        <p v-if="said" class="world__brume-say">« {{ said }} »</p>
        <div class="world__sheet-actions">
          <button v-if="hint" type="button" class="world__btn world__btn--quiet" @click="$emit('grimoire')">Voir dans le Grimoire</button>
          <button type="button" class="world__btn" :disabled="busy || savoir.talked" @click="$emit('talk')">
            {{ savoir.talked ? 'Un autre Savoir demain' : 'Bavarder' }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BrumeWisp from '@/components/ui/BrumeWisp.vue';
import { artOf } from '@/game/savoirs';
// Fiche de Brume : sa réplique, la quête active, son avancée, sa récompense ; après le Phare, son Savoir. Les actions
// (réclamer, Récolte, nom du peuple, bavarder…) restent à l'île, qui les reçoit en événements. Ses styles sont ceux de
// l'île (WorldView, classes world__)
export default {
  name: 'BrumeSheet',
  components: { BrumeWisp },
  props: {
    // Vue de Brume (serveur) : sa réplique de repos quand toutes les quêtes sont faites
    brume: { type: Object, required: true },
    // Quête active, ou null
    quest: { type: Object, default: null },
    // Étape de civilisation (bible, § 6.10), ou null
    civStage: { type: String, default: null },
    // Stade de Brume (game/opus.js : brumeLook), qui donne sa couleur
    stage: { type: Number, default: null },
    // Parties de Récolte en réserve, et leur texte (« 2/3 parties », « dans 12 min »)
    charges: { type: Number, default: 0 },
    chargesText: { type: String, default: '' },
    // Ce que propose Brume pour la quête pas encore faite (« Ouvrir l’établi »…), ou ''
    action: { type: String, default: '' },
    // Le Savoir de Brume (bible, § 6.4) : { open, talked }, ou null ; sa dernière réplique ; un indice à voir
    savoir: { type: Object, default: null },
    said: { type: String, default: '' },
    hint: { type: Boolean, default: false },
    // Nom du peuple en cours de saisie (v-model:people-name) : gardé par l'île, la fiche fermée
    peopleName: { type: String, default: '' },
    busy: { type: Boolean, default: false }
  },
  emits: ['close', 'claim', 'harvest', 'name', 'action', 'talk', 'grimoire', 'update:peopleName'],
  data() {
    return { art: artOf('brume') };
  },
  computed: {
    people: {
      get() {
        return this.peopleName;
      },
      set(value) {
        this.$emit('update:peopleName', value);
      }
    }
  }
};
</script>

<style scoped src="./BrumeSheet.css"></style>
