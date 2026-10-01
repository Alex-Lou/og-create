<template>
  <GModal eyebrow="Codex" :title="`${unlockedCount} sceaux rompus sur ${achievements.length}`" :width="1040" @close="$emit('close')">
    <p class="g-italic codex__lead">Chaque palier de cinq sceaux ajoute un anneau à ton sceau.</p>
    <ul class="codex__grid">
      <li v-for="achievement in sorted" :key="achievement.name" :class="['codex__cell', { 'is-open': achievement.unlocked }]">
        <img v-if="achievement.unlocked && achievement.image" :src="achievement.image" alt="" class="codex__img" />
        <GSeal v-else-if="achievement.unlocked" />
        <svg v-else width="54" height="54" viewBox="0 0 54 54" aria-hidden="true" class="codex__glyph">
          <circle cx="27" cy="27" r="24" fill="none" stroke="currentColor" stroke-dasharray="2 5"></circle>
          <path d="M18 27h18" stroke="currentColor"></path>
        </svg>
        <h3 class="g-display codex__name">{{ achievement.unlocked ? achievement.name : veiled(achievement.name) }}</h3>
        <p class="codex__desc">
          {{ achievement.unlocked ? achievement.description : 'Scellé — se déchiffre en progressant.' }}
        </p>
      </li>
    </ul>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import GSeal from '@/components/ui/GSeal.vue';

// Écriture inconnue pour les succès encore scellés (même longueur que le vrai nom)
const GLYPHS = '⟟⌇⍀⊑⏃⋏⟒⌰⍜⏁⎍⋔⟊⍙';
function veil(text) {
  return [...text].map((char, i) => (char === ' ' ? ' ' : GLYPHS[(char.charCodeAt(0) + i) % GLYPHS.length])).join('');
}

// Codex des succès : obtenus d'abord, les scellés restent illisibles
export default {
  name: 'CodexModal',
  components: { GModal, GSeal },
  props: {
    achievements: { type: Array, default: () => [] }
  },
  emits: ['close'],
  computed: {
    unlockedCount() {
      return this.achievements.filter(a => a.unlocked).length;
    },
    sorted() {
      return [...this.achievements].sort((a, b) => Number(b.unlocked) - Number(a.unlocked));
    }
  },
  methods: {
    veiled: veil
  }
};
</script>

<style scoped>
.codex__lead { margin: -6px 0 0; }
.codex__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 14px;
}
.codex__cell {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  box-shadow: inset 0 0 0 1px var(--oc-line);
  color: var(--oc-text-faint);
}
.codex__cell.is-open {
  background: var(--oc-gold-soft);
  box-shadow: inset 0 0 0 1px rgba(224, 182, 84, 0.35);
  color: var(--oc-text);
}
.codex__img { width: 54px; height: 54px; object-fit: cover; }
.codex__glyph { color: var(--oc-line-strong); }
.codex__name { margin: 0; font-size: 19px; color: inherit; }
.is-open .codex__name { color: var(--oc-gold); }
.codex__desc { margin: 0; font-size: 15px; line-height: 1.45; color: inherit; }
.is-open .codex__desc { color: var(--oc-text-muted); }
</style>
