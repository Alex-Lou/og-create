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
import GModal from '@/components/ui/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
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

<style scoped>
/* Ses jetons (couleurs des habitants partagées : tokens/island.css) */
.friend {
  --friend-heart-line: #a3283a;      /* le contour d'un cœur plein */
  --friend-meter-from: #f39aa8;      /* la jauge d'amitié commence rose pâle */
  --friend-sad-ink: #4a5a7a;
  --friend-fill-ink: #3a2410;        /* « Donner » : texte et tranche */
  --friend-fill-edge: #b87420;
  --friend-need-ink: #b86a10;
  --friend-rose-bg: #fff0f1;         /* cadeau adoré, palier obtenu */
  --friend-liked-ring: #f3a8b4;
  --friend-taste-ink: #c2394e;
  --friend-step-radius: 10px;
}
.friend { display: grid; gap: 12px; font-family: var(--font-ui); text-align: left; }
.friend__top { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 14px; }
.friend__portrait { position: relative; display: block; width: 96px; height: 110px; border-radius: var(--r-board); background: var(--island-villager-portrait); }
.friend__portrait img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 6px; box-sizing: border-box; }
.friend__love { display: grid; gap: 6px; }
.friend__hearts { display: flex; gap: 4px; }
.friend__heart { width: 26px; height: 24px; fill: var(--vellum-300); stroke: rgba(var(--shade-rgb), .35); stroke-width: 1.2; }
.friend__heart.is-full { fill: var(--island-villager-heart); stroke: var(--friend-heart-line); }
.friend__heart.is-new { animation: friend-pop .6s cubic-bezier(.3, 1.8, .5, 1); }
.friend__meter { height: 8px; border-radius: var(--r-pill); background: rgba(var(--shade-rgb), .14); overflow: hidden; }
.friend__meter span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--friend-meter-from), var(--island-villager-heart)); transition: width .5s ease; }
.friend__points { font-size: 12px; font-weight: 800; color: var(--ink-500); }
.friend__say {
  position: relative; margin: 0; padding: 10px 14px; border-radius: var(--r-md); background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .1); font-family: var(--font-display); font-style: italic; font-size: 15px; line-height: 1.4;
}
.friend__talk { width: 100%; }
.friend__grimoire { justify-self: center; }
.friend__art { margin: -4px 0 0; font-size: 12.5px; font-weight: 700; color: var(--ink-500); text-align: center; }
.friend__mood-badge { position: absolute; right: -6px; bottom: -6px; display: grid; place-items: center; width: 34px; height: 34px; border-radius: var(--r-round); background: var(--vellum-50); box-shadow: 0 2px 6px var(--island-badge-shadow); font-size: 24px; }
.friend__mood { text-transform: none; letter-spacing: 0; }
.friend__mood.is-heureux { color: var(--oc-success); }
.friend__mood.is-triste { color: var(--friend-sad-ink); }
.friend__mood-effect { margin: -2px 0 6px; font-size: 13px; font-weight: 700; color: var(--ink-700); }
.friend__need-list { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
.friend__need { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--r-tile); background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .1); }
.friend__need.is-missing { background: var(--island-villager-need-bg); box-shadow: inset 0 0 0 2px var(--island-villager-need); }
.friend__need-glyph { font-size: 28px; line-height: 1; }
.friend__need-body { display: grid; gap: 1px; min-width: 0; font-size: 12px; font-weight: 700; color: var(--ink-500); }
.friend__need-body strong { font-size: 14px; font-weight: 900; color: var(--ink-900); }
.friend__fill {
  display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 0 12px; border: 0; border-radius: var(--r-pill);
  background: var(--island-villager-need); color: var(--friend-fill-ink); font-family: var(--font-ui); font-size: 13px; font-weight: 900; cursor: pointer;
  box-shadow: 0 2px 0 var(--friend-fill-edge);
}
.friend__fill:disabled { background: var(--vellum-200); color: var(--ink-500); box-shadow: none; cursor: default; }
.friend__fill-cost { display: inline-flex; align-items: center; gap: 2px; }
.friend__need-tag { font-size: 12px; font-weight: 900; color: var(--friend-need-ink); }
.friend__need-tag.is-done { color: var(--oc-success); }
.friend__title { margin: 0 0 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); }
.friend__done { text-transform: none; letter-spacing: 0; color: var(--oc-success); }
.friend__gifts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 0; padding: 0; list-style: none; }
.friend__give {
  width: 100%; min-height: 66px; display: grid; justify-items: center; align-content: center; gap: 1px; padding: 6px 2px;
  border: 0; border-radius: var(--r-tile); background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(var(--shade-rgb), .12);
  font-family: var(--font-ui); color: var(--ink-900); cursor: pointer;
}
.friend__give.is-loved { box-shadow: inset 0 0 0 2px var(--island-villager-heart); background: var(--friend-rose-bg); }
.friend__give.is-liked { box-shadow: inset 0 0 0 2px var(--friend-liked-ring); }
.friend__give:disabled { opacity: .45; cursor: default; }
.friend__glyph { font-size: 22px; line-height: 1; }
.friend__taste { min-height: 13px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .03em; color: var(--friend-taste-ink); }
.friend__gain { font-size: 13px; font-weight: 900; }
.friend__steps { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; }
.friend__steps li { display: grid; grid-template-columns: 44px 1fr auto; align-items: center; gap: 8px; padding: 6px 10px; border-radius: var(--friend-step-radius); background: var(--vellum-50); font-size: 13px; font-weight: 700; }
.friend__steps li.is-got { background: var(--friend-rose-bg); }
.friend__step-heart { color: var(--island-villager-heart); font-weight: 900; }
.friend__check { color: var(--oc-success); font-size: 12px; font-weight: 900; }
@keyframes friend-pop { 0% { transform: scale(.4); } 60% { transform: scale(1.35); } 100% { transform: none; } }
@media (prefers-reduced-motion: reduce) { .friend__heart.is-new { animation: none; } }
</style>
