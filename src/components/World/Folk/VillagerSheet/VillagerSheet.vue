<template>
  <GModal :eyebrow="`${villager.role} · ${siteName}`" :title="villager.name" :width="400" align="center" @close="$emit('close')">
    <div class="friend">
      <div class="friend__top">
        <span class="friend__portrait">
          <img :src="portrait" alt="" />
          <span v-if="villager.mood" class="friend__mood-badge" aria-hidden="true"><ElementGlyph :glyph="MOOD_GLYPH[villager.mood]" /></span>
        </span>
        <div class="friend__love">
          <span class="friend__hearts" :aria-label="`${villager.hearts} cœur${villager.hearts > 1 ? 's' : ''} sur 5`">
            <svg v-for="k in 5" :key="k" :class="['friend__heart', { 'is-full': k <= villager.hearts, 'is-new': k === popped }]" viewBox="0 0 24 22" aria-hidden="true">
              <path d="M12,21 C5,15.6 1,11.6 1,7 C1,3.6 3.6,1 6.8,1 C9,1 10.8,2.2 12,4 C13.2,2.2 15,1 17.2,1 C20.4,1 23,3.6 23,7 C23,11.6 19,15.6 12,21 Z" />
            </svg>
          </span>
          <span v-if="villager.next !== null" class="friend__meter" aria-hidden="true"><span :style="{ width: `${progress * 100}%` }"></span></span>
          <span class="friend__points">{{ villager.next !== null ? `${villager.points} / ${villager.next} points d’amitié` : 'Amis pour la vie !' }}</span>
        </div>
      </div>

      <!-- Besoins : humeur et ce qu'elle fait, puis chaque besoin (manger, travailler : à combler avec le stock ; se
           distraire : des créations d'île autour de son bâtiment) -->
      <section v-if="villager.needs" class="friend__needs" aria-label="Besoins">
        <h3 class="friend__title">Besoins · <span :class="['friend__mood', `is-${villager.mood}`]">{{ MOOD_LABEL[villager.mood] }}</span></h3>
        <p class="friend__mood-effect">{{ moodText }}</p>
        <ul class="friend__need-list">
          <li v-for="need in villager.needs" :key="need.id" :class="['friend__need', { 'is-missing': !need.met }]">
            <span class="friend__need-glyph" aria-hidden="true"><ElementGlyph :glyph="NEED_GLYPH[need.id]" /></span>
            <span class="friend__need-body">
              <strong>{{ labelOf(need.id) }}</strong>
              <span>{{ needState(need, siteName) }}</span>
            </span>
            <button
              v-if="need.cost"
              type="button"
              class="friend__fill"
              :disabled="busy || !need.refill || !affordable(need, stock)"
              :aria-label="need.refill ? `${labelOf(need.id)} : donner ${costText(need.cost)}` : `${labelOf(need.id)} : comblé`"
              @click="$emit('fill', need.id)"
            >
              <template v-if="need.refill">
                <span v-for="(n, r) in need.cost" :key="r" class="friend__fill-cost"><ElementGlyph :glyph="GLYPH[r]" />{{ n }}</span>
              </template>
              <template v-else>Comblé</template>
            </button>
            <span v-else :class="['friend__need-tag', { 'is-done': need.met }]">{{ need.met ? 'Comblé' : `${need.have} / ${need.need}` }}</span>
          </li>
        </ul>
      </section>

      <p class="friend__say" aria-live="polite">« {{ said || askOr(villager, talkLine(villager.id, villager.hearts)) }} »</p>
      <!-- Un Savoir tout juste soufflé (bible, § 6.4) : la page où il est noté -->
      <button v-if="savoir" type="button" class="g-btn g-btn--ghost friend__grimoire" @click="$emit('grimoire')">Voir dans le Grimoire</button>

      <button type="button" class="g-btn friend__talk" :disabled="busy || villager.talked" @click="$emit('talk')">
        {{ villager.talked ? 'Vous avez bavardé aujourd’hui' : `Bavarder · +${rules.talk}` }}
      </button>
      <p v-if="art" class="friend__art">{{ art }}</p>

      <section class="friend__gift" aria-label="Offrir un cadeau">
        <h3 class="friend__title">
          Offrir {{ rules.gift.cost }}
          <span v-if="villager.gifted" class="friend__done">· cadeau déjà offert aujourd’hui</span>
        </h3>
        <ul class="friend__gifts">
          <li v-for="r in RESOURCES" :key="r.id">
            <button
              type="button"
              :class="['friend__give', { 'is-loved': r.id === villager.loves, 'is-liked': r.id === villager.likes }]"
              :disabled="busy || villager.gifted || (stock[r.id] || 0) < rules.gift.cost"
              :aria-label="`Offrir ${rules.gift.cost} ${r.label}${r.id === villager.loves ? ' (adore)' : r.id === villager.likes ? ' (aime)' : ''}`"
              @click="$emit('gift', r.id)"
            >
              <span class="friend__glyph" aria-hidden="true"><ElementGlyph :glyph="r.glyph" /></span>
              <span class="friend__taste">{{ r.id === villager.loves ? 'adore' : r.id === villager.likes ? 'aime' : '' }}</span>
              <span class="friend__gain">+{{ gainOf(r.id) }}</span>
            </button>
          </li>
        </ul>
      </section>

      <section class="friend__rewards" aria-label="Récompenses de l’amitié">
        <h3 class="friend__title">À chaque cœur</h3>
        <ol class="friend__steps">
          <li v-for="(reward, k) in rules.rewards" :key="k" :class="{ 'is-got': k < villager.hearts }">
            <span class="friend__step-heart" aria-hidden="true">♥ {{ k + 1 }}</span>
            <span>{{ rewardText(reward) }}</span>
            <span v-if="k < villager.hearts" class="friend__check">reçu</span>
          </li>
        </ol>
      </section>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { RESOURCES, GLYPH } from '@/game/resources';
import { talkLine, rewardText } from '@/world/friends';
import { NEED_GLYPH, MOOD_GLYPH, MOOD_LABEL, needState, affordable, costText, askOr } from '@/world/needs';

// Fiche d'un habitant : son portrait, ses cœurs, ses besoins et son humeur, ce qu'il dit ; combler un besoin, bavarder
// et offrir des ressources (chacun une fois par jour), et ce que rapporte chaque cœur. Le serveur décide (points, jour,
// récompenses, besoins) ; l'île envoie et met à jour.
export default {
  name: 'VillagerSheet',
  components: { GModal, ElementGlyph },
  props: {
    // Vue du serveur : { id, name, role, loves, likes, points, hearts, next, talked, gifted, needs, mood, moodEffect,
    // happyEffect }
    villager: { type: Object, required: true },
    // Règles : { talk, gift: { cost, loves, likes, other }, hearts, rewards }
    rules: { type: Object, required: true },
    // Besoins : { kinds: { besoin: { label, … } } }
    needRules: { type: Object, default: null },
    stock: { type: Object, required: true },
    siteName: { type: String, default: '' },
    portrait: { type: String, default: '' },
    // Dernière réplique (après avoir bavardé ou offert), cœur tout juste gagné (il pulse)
    said: { type: String, default: '' },
    popped: { type: Number, default: 0 },
    busy: { type: Boolean, default: false },
    // Le Savoir du maître (son Art, en clair) ; celui qu'il vient de souffler ({ page, chapter, … }) ou null
    art: { type: String, default: '' },
    savoir: { type: Object, default: null }
  },
  emits: ['talk', 'gift', 'fill', 'close', 'grimoire'],
  data() {
    return { RESOURCES, GLYPH, NEED_GLYPH, MOOD_GLYPH, MOOD_LABEL };
  },
  computed: {
    // Avancée vers le cœur suivant
    progress() {
      const { hearts, points, next } = this.villager;
      const from = hearts ? this.rules.hearts[hearts - 1] : 0;
      return next === null ? 1 : Math.max(0, Math.min(1, (points - from) / (next - from)));
    },
    // Ce que fait son humeur, ou ce que ferait une humeur heureuse
    moodText() {
      const { moodEffect, happyEffect } = this.villager;
      if (moodEffect) return `${moodEffect} à « ${this.siteName} ».`;
      return happyEffect ? `Tous ses besoins comblés : ${happyEffect.charAt(0).toLowerCase()}${happyEffect.slice(1)}.` : '';
    }
  },
  methods: {
    talkLine,
    rewardText,
    needState,
    affordable,
    costText,
    askOr,
    labelOf(id) {
      return this.needRules?.kinds?.[id]?.label || id;
    },
    gainOf(resource) {
      const { gift } = this.rules;
      return resource === this.villager.loves ? gift.loves : resource === this.villager.likes ? gift.likes : gift.other;
    }
  }
};
</script>

<style scoped src="./VillagerSheet.css"></style>
