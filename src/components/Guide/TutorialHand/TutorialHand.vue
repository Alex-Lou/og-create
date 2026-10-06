<template>
  <!-- Le tutoriel montre où toucher : un doigt qui tapote et un anneau doré sur l'élément visé (sélecteur CSS). Il suit
       l'élément (défilement, redimensionnement) et ne bloque jamais le toucher -->
  <div v-if="at" class="hand" :style="{ left: `${at.x}px`, top: `${at.y}px` }" aria-hidden="true">
    <span class="hand__ring"></span>
    <svg class="hand__finger" viewBox="0 0 32 40">
      <path d="M12 4c0-2 3.6-2 3.6 0v14l1-1c0-2 3.4-2 3.4 0v2l.8-.6c0-2 3.4-2 3.4 0v2l.6-.4c0-2 3.2-2 3.2 .2V30c0 5-4 8-9 8h-2c-3.4 0-5.2-1.4-7-4L4 25c-1.2-1.8 1.2-3.8 2.8-2.2L12 27V4z" fill="#FFF8E8" stroke="#3E2A1E" stroke-width="1.6" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'TutorialHand',
  props: {
    target: { type: String, required: true }
  },
  data() {
    return { at: null };
  },
  mounted() {
    // L'élément visé vient au milieu de l'écran (au-dessus de la bulle de Brume et de l'Athanor)
    document.querySelector(this.target)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const follow = () => {
      const el = document.querySelector(this.target);
      const rect = el && el.getBoundingClientRect();
      const shown = rect && rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      const next = shown ? { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) } : null;
      if (!next !== !this.at || (next && (next.x !== this.at.x || next.y !== this.at.y))) this.at = next;
      this.raf = requestAnimationFrame(follow);
    };
    follow();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.raf);
  }
};
</script>

<style scoped src="./TutorialHand.css"></style>
