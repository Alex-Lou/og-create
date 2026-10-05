<template>
  <GModal :eyebrow="`${villager.role} · ${siteName}`" :title="villager.name" :width="400" align="center" @close="$emit('close')">
    <div class="friend">
      <div class="friend__top">
        <span class="friend__portrait"><img :src="portrait" alt="" /></span>
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

      <p class="friend__say" aria-live="polite">« {{ said || talkLine(villager.id, villager.hearts) }} »</p>

      <button type="button" class="g-btn friend__talk" :disabled="busy || villager.talked" @click="$emit('talk')">
        {{ villager.talked ? 'Vous avez bavardé aujourd’hui' : `Bavarder · +${rules.talk}` }}
      </button>

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
import GModal from '@/components/ui/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { RESOURCES } from '@/game/resources';
import { talkLine, rewardText } from '@/world/friends';

// Fiche d'un habitant : son portrait, ses cœurs, ce qu'il dit ; bavarder et offrir des ressources (chacun une fois par
// jour), et ce que rapporte chaque cœur. Le serveur décide (points, jour, récompenses) ; l'île envoie et met à jour.
export default {
  name: 'VillagerSheet',
  components: { GModal, ElementGlyph },
  props: {
    // Vue du serveur : { id, name, role, loves, likes, points, hearts, next, talked, gifted }
    villager: { type: Object, required: true },
    // Règles : { talk, gift: { cost, loves, likes, other }, hearts, rewards }
    rules: { type: Object, required: true },
    stock: { type: Object, required: true },
    siteName: { type: String, default: '' },
    portrait: { type: String, default: '' },
    // Dernière réplique (après avoir bavardé ou offert), cœur tout juste gagné (il pulse)
    said: { type: String, default: '' },
    popped: { type: Number, default: 0 },
    busy: { type: Boolean, default: false }
  },
  emits: ['talk', 'gift', 'close'],
  data() {
    return { RESOURCES };
  },
  computed: {
    // Avancée vers le cœur suivant
    progress() {
      const { hearts, points, next } = this.villager;
      const from = hearts ? this.rules.hearts[hearts - 1] : 0;
      return next === null ? 1 : Math.max(0, Math.min(1, (points - from) / (next - from)));
    }
  },
  methods: {
    talkLine,
    rewardText,
    gainOf(resource) {
      const { gift } = this.rules;
      return resource === this.villager.loves ? gift.loves : resource === this.villager.likes ? gift.likes : gift.other;
    }
  }
};
</script>

<style scoped>
.friend { display: grid; gap: 12px; font-family: var(--font-ui); text-align: left; }
.friend__top { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 14px; }
.friend__portrait { position: relative; display: block; width: 96px; height: 110px; border-radius: 18px; background: radial-gradient(circle at 50% 75%, #FFE9C4, var(--vellum-200) 74%); }
.friend__portrait img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 6px; box-sizing: border-box; }
.friend__love { display: grid; gap: 6px; }
.friend__hearts { display: flex; gap: 4px; }
.friend__heart { width: 26px; height: 24px; fill: var(--vellum-300); stroke: rgba(74, 52, 38, .35); stroke-width: 1.2; }
.friend__heart.is-full { fill: #E8566A; stroke: #A3283A; }
.friend__heart.is-new { animation: friend-pop .6s cubic-bezier(.3, 1.8, .5, 1); }
.friend__meter { height: 8px; border-radius: 999px; background: rgba(74, 52, 38, .14); overflow: hidden; }
.friend__meter span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #F39AA8, #E8566A); transition: width .5s ease; }
.friend__points { font-size: 12px; font-weight: 800; color: var(--ink-500); }
.friend__say {
  position: relative; margin: 0; padding: 10px 14px; border-radius: 16px; background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .1); font-family: var(--font-display); font-style: italic; font-size: 15px; line-height: 1.4;
}
.friend__talk { width: 100%; }
.friend__title { margin: 0 0 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); }
.friend__done { text-transform: none; letter-spacing: 0; color: #4E8A3A; }
.friend__gifts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 0; padding: 0; list-style: none; }
.friend__give {
  width: 100%; min-height: 66px; display: grid; justify-items: center; align-content: center; gap: 1px; padding: 6px 2px;
  border: 0; border-radius: 14px; background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .12);
  font-family: var(--font-ui); color: var(--ink-900); cursor: pointer;
}
.friend__give.is-loved { box-shadow: inset 0 0 0 2px #E8566A; background: #FFF0F1; }
.friend__give.is-liked { box-shadow: inset 0 0 0 2px #F3A8B4; }
.friend__give:disabled { opacity: .45; cursor: default; }
.friend__glyph { font-size: 22px; line-height: 1; }
.friend__taste { min-height: 13px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .03em; color: #C2394E; }
.friend__gain { font-size: 13px; font-weight: 900; }
.friend__steps { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; }
.friend__steps li { display: grid; grid-template-columns: 44px 1fr auto; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 10px; background: var(--vellum-50); font-size: 13px; font-weight: 700; }
.friend__steps li.is-got { background: #FFF0F1; }
.friend__step-heart { color: #E8566A; font-weight: 900; }
.friend__check { color: #4E8A3A; font-size: 12px; font-weight: 900; }
@keyframes friend-pop { 0% { transform: scale(.4); } 60% { transform: scale(1.35); } 100% { transform: none; } }
@media (prefers-reduced-motion: reduce) { .friend__heart.is-new { animation: none; } }
</style>
