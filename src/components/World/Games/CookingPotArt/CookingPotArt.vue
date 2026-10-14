<template>
  <span :class="['pot-art', { 'is-hot': hot, 'is-stirred': stirred }]" aria-hidden="true">
    <!-- Le feu, dans son propre calque sous la marmite : il vacille sans faire repeindre la marmite -->
    <span class="pot-art__fire">
      <svg viewBox="40 68 36 27">
        <path d="M44 94 Q40 82 49 73 Q50 82 56 84 Q57 74 64 69 Q63 80 71 84 Q76 88 73 94 Z" fill="#F29A3A" stroke="#3C2819" stroke-width="1.4" stroke-linejoin="round" />
        <path d="M52 94 Q52 87 57 85 Q59 89 63 87 Q66 91 64 94 Z" fill="#FFD36B" />
      </svg>
    </span>
    <!-- La marmite de fonte sur ses pierres ; le bouillon prend la teinte du moment (--cook-soup, CookingPot.css) -->
    <svg class="pot-art__pot" viewBox="0 0 120 100">
      <defs>
        <linearGradient id="pot-art-iron" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#6E5D55" />
          <stop offset=".55" stop-color="#4E433D" />
          <stop offset="1" stop-color="#3A302B" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="95" rx="48" ry="4.5" fill="rgba(80, 50, 20, .22)" />
      <ellipse cx="30" cy="91" rx="10" ry="5.5" fill="#9B927F" stroke="#3C2819" stroke-width="1.4" />
      <ellipse cx="90" cy="91" rx="10" ry="5.5" fill="#9B927F" stroke="#3C2819" stroke-width="1.4" />
      <path d="M15 40 Q4 41 7 51 Q11 57 18 52" fill="none" stroke="#3C2819" stroke-width="4.5" stroke-linecap="round" />
      <path d="M105 40 Q116 41 113 51 Q109 57 102 52" fill="none" stroke="#3C2819" stroke-width="4.5" stroke-linecap="round" />
      <path d="M14 34 Q13 76 40 84 Q60 89 80 84 Q107 76 106 34 Z" fill="url(#pot-art-iron)" stroke="#3C2819" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M24 46 Q25 66 38 75" fill="none" stroke="rgba(255, 255, 255, .16)" stroke-width="4" stroke-linecap="round" />
      <ellipse cx="60" cy="34" rx="46" ry="12" fill="#6A5A52" stroke="#3C2819" stroke-width="1.8" />
      <ellipse cx="60" cy="35" rx="41" ry="9.5" fill="#2A1D14" />
      <ellipse class="pot-art__soup" cx="60" cy="36" rx="40" ry="8.6" />
      <path d="M14 34 A46 12 0 0 0 106 34" fill="none" stroke="#8C7A70" stroke-width="2.4" stroke-linecap="round" />
    </svg>
    <!-- Le remous : un cercle qui tourne dans un plan écrasé en perspective ; son calque à lui, tourné par le GPU (turn) -->
    <span class="pot-art__plane">
      <span ref="swirl" class="pot-art__swirl">
        <svg viewBox="-32 -32 64 64"><path d="M-30 0 A30 30 0 0 1 30 0 M14 0 A14 14 0 0 1 -14 0" /></svg>
      </span>
    </span>
  </span>
</template>

<script>
// La marmite de Marcelle (choix de l'auteur, 13 oct. : B4), dessinée ici en attendant celle de la bibliothèque
// (demande transmise par l'auteur) : sa fonte, son feu, son bouillon et son remous. Rien que le dessin : CookingPot.vue
// décide du reste. hot : la soupe chauffe (le feu vif) ; stirred : on touille (le remous se voit). turn(angle) : le
// remous suit le doigt (radians)
export default {
  name: 'CookingPotArt',
  props: {
    hot: { type: Boolean, default: false },
    stirred: { type: Boolean, default: false }
  },
  methods: {
    turn(angle) {
      this.$refs.swirl.style.transform = `rotate(${((angle * 180) / Math.PI).toFixed(1)}deg)`;
    }
  }
};
</script>

<style scoped src="./CookingPotArt.css"></style>
