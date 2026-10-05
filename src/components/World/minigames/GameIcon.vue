<template>
  <svg class="game-icon" viewBox="-16 -16 32 32" :width="size" :height="size" aria-hidden="true">
    <!-- Pêche -->
    <g v-if="kind === 'gardon'">
      <path d="M-11,0 C-6,-7 6,-7 10,0 C6,7 -6,7 -11,0 Z" fill="#8FA9B8" stroke="#3E5A6A" stroke-width="1.2" />
      <path d="M10,0 L15,-5 L15,5 Z" fill="#7C96A6" stroke="#3E5A6A" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M-6,-3 C-2,-5 3,-5 6,-3" fill="none" stroke="#C9DCE6" stroke-width="1.2" stroke-linecap="round" />
      <circle cx="-7" cy="-1" r="1.4" fill="#1E2B33" />
      <path d="M-1,4 L2,8 L4,4" fill="#C0574A" />
    </g>
    <g v-else-if="kind === 'truite'">
      <path d="M-13,0 C-7,-7 7,-7 11,0 C7,7 -7,7 -13,0 Z" fill="#A7B87A" stroke="#4E5E33" stroke-width="1.2" />
      <path d="M11,0 L16,-5 L16,5 Z" fill="#94A66A" stroke="#4E5E33" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M-9,1.5 C-3,3.5 4,3.5 9,1" fill="none" stroke="#E79AA0" stroke-width="2" stroke-linecap="round" />
      <circle v-for="(d, i) in [[-4, -3], [0, -4], [4, -3], [-1, -1.5], [6, -1]]" :key="i" :cx="d[0]" :cy="d[1]" r="0.9" fill="#3C4A28" />
      <circle cx="-9" cy="-1" r="1.4" fill="#1E2B33" />
    </g>
    <g v-else-if="kind === 'dore'">
      <path d="M-11,0 C-6,-7 6,-7 10,0 C6,7 -6,7 -11,0 Z" fill="#F2C04B" stroke="#9A6A14" stroke-width="1.2" />
      <path d="M10,0 L15,-5 L15,5 Z" fill="#E8A92E" stroke="#9A6A14" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M-5,-3.5 C-1,-5.5 4,-5 6,-3" fill="none" stroke="#FFF1C2" stroke-width="1.4" stroke-linecap="round" />
      <circle cx="-7" cy="-1" r="1.4" fill="#4A3010" />
      <path d="M8,-11 l1,2.4 2.4,1 -2.4,1 -1,2.4 -1,-2.4 -2.4,-1 2.4,-1z" fill="#FFF6D0" />
    </g>
    <g v-else-if="kind === 'botte'">
      <path d="M-6,-12 H3 V2 H10 C13,2 14,5 13,8 H-7 Z" fill="#6A4A34" stroke="#3A2618" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M-7,8 H13 V10 H-7 Z" fill="#3A2618" />
      <path d="M-6,-12 H3 V-8 H-6 Z" fill="#83604A" />
      <path d="M-2,-4 C0,-2 0,0 -2,2" fill="none" stroke="#3A2618" stroke-width="0.9" />
      <path d="M8,-2 c2,-3 5,-3 6,0" fill="none" stroke="#4E8A3A" stroke-width="1.4" stroke-linecap="round" />
    </g>
    <!-- Filon -->
    <g v-else-if="kind === 'quartz'">
      <path d="M-5,10 L-8,-2 L-4,-11 L0,-3 Z" fill="#F4F2EE" stroke="#9C9A95" stroke-width="1" stroke-linejoin="round" />
      <path d="M0,10 L-2,-6 L3,-13 L6,-4 L4,10 Z" fill="#FFFFFF" stroke="#9C9A95" stroke-width="1" stroke-linejoin="round" />
      <path d="M4,10 L7,0 L11,-5 L10,10 Z" fill="#E6E3DC" stroke="#9C9A95" stroke-width="1" stroke-linejoin="round" />
      <path d="M1,-6 L3,-11" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" />
    </g>
    <g v-else-if="kind === 'amethyste'">
      <path d="M-9,10 L-10,-1 L-6,-9 L-3,0 L-3,10 Z" fill="#B48AE0" stroke="#5E3A8C" stroke-width="1" stroke-linejoin="round" />
      <path d="M-3,10 L-4,-5 L1,-13 L5,-5 L4,10 Z" fill="#9B6BD6" stroke="#5E3A8C" stroke-width="1" stroke-linejoin="round" />
      <path d="M4,10 L5,-2 L9,-8 L11,-1 L10,10 Z" fill="#C3A0EA" stroke="#5E3A8C" stroke-width="1" stroke-linejoin="round" />
      <path d="M0,-6 L1,-11" stroke="#EADCFA" stroke-width="1.3" stroke-linecap="round" />
    </g>
    <g v-else-if="kind === 'rubis'">
      <path d="M-10,-3 L-5,-10 H5 L10,-3 L0,11 Z" fill="#E0445A" stroke="#7A1424" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M-10,-3 H10 M-5,-10 L-3,-3 L0,11 M5,-10 L3,-3 L0,11" fill="none" stroke="#9E1E30" stroke-width="0.9" stroke-linejoin="round" />
      <path d="M-6,-8 L-3,-5" stroke="#FFC2CC" stroke-width="1.4" stroke-linecap="round" />
    </g>
    <g v-else-if="kind === 'diamant'">
      <path d="M-11,-3 L-6,-10 H6 L11,-3 L0,12 Z" fill="#CFEFFF" stroke="#4A88B0" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M-11,-3 H11 M-6,-10 L-2,-3 L0,12 M6,-10 L2,-3 L0,12 M-2,-3 L0,-10 L2,-3" fill="none" stroke="#7FB8DA" stroke-width="0.9" stroke-linejoin="round" />
      <path d="M-7,-8 L-4,-5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
      <path d="M10,-13 l0.9,2.1 2.1,0.9 -2.1,0.9 -0.9,2.1 -0.9,-2.1 -2.1,-0.9 2.1,-0.9z" fill="#FFFFFF" />
    </g>
    <!-- Cueillette -->
    <g v-else-if="kind === 'mure'">
      <path d="M0,-12 C-2,-9 -1,-7 0,-6" fill="none" stroke="#4E8A3A" stroke-width="1.4" stroke-linecap="round" />
      <path d="M0,-7 l-5,-3 3,4 -4,1 5,0z M0,-7 l5,-3 -3,4 4,1 -5,0z" fill="#6FAE4E" />
      <circle v-for="(d, i) in DRUPES" :key="i" :cx="d[0]" :cy="d[1]" r="3" fill="#3A1F44" stroke="#1E0F26" stroke-width="0.6" />
      <circle v-for="(d, i) in DRUPES" :key="`h${i}`" :cx="d[0] - 0.9" :cy="d[1] - 0.9" r="0.8" fill="rgba(255,255,255,.45)" />
    </g>
    <g v-else-if="kind === 'fraise'">
      <path d="M-9,-4 C-9,6 -3,12 0,12 C3,12 9,6 9,-4 C6,-7 -6,-7 -9,-4 Z" fill="#E8404E" stroke="#8A1622" stroke-width="1.2" />
      <path d="M0,-6 l-7,-3 4,4 -5,2 6,-1 2,3 2,-3 6,1 -5,-2 4,-4z" fill="#5FA04A" stroke="#2E6A1E" stroke-width="0.7" stroke-linejoin="round" />
      <ellipse v-for="(d, i) in SEEDS" :key="i" :cx="d[0]" :cy="d[1]" rx="0.6" ry="0.9" fill="#FFE59A" />
    </g>
    <g v-else-if="kind === 'myrtille'">
      <circle cx="-5" cy="3" r="5.6" fill="#4A6AC8" stroke="#22357A" stroke-width="1" />
      <circle cx="5" cy="4" r="5.2" fill="#5A7AD6" stroke="#22357A" stroke-width="1" />
      <circle cx="0" cy="-4" r="5.4" fill="#4F70CF" stroke="#22357A" stroke-width="1" />
      <path d="M-1.6,-6.4 l1.6,1.2 1.6,-1.2" fill="none" stroke="#22357A" stroke-width="1" stroke-linecap="round" />
      <circle cx="-7" cy="1" r="1.3" fill="rgba(255,255,255,.4)" /><circle cx="-2" cy="-6" r="1.2" fill="rgba(255,255,255,.4)" />
    </g>
    <g v-else-if="kind === 'cepe'">
      <path d="M-4,1 C-5,7 -4,11 -2,12 H2 C4,11 5,7 4,1 Z" fill="#F4EAD6" stroke="#9A8A6A" stroke-width="1" />
      <path d="M-12,2 C-12,-8 12,-8 12,2 C8,4 -8,4 -12,2 Z" fill="#9A5A2E" stroke="#5A3218" stroke-width="1.2" />
      <path d="M-8,-3 C-4,-6 3,-6 7,-3" fill="none" stroke="#C88A52" stroke-width="1.5" stroke-linecap="round" />
      <path d="M11,-12 l0.9,2.1 2.1,0.9 -2.1,0.9 -0.9,2.1 -0.9,-2.1 -2.1,-0.9 2.1,-0.9z" fill="#FFE07A" />
    </g>
    <g v-else-if="kind === 'guepes'">
      <path d="M0,-12 C8,-12 10,-2 7,6 C5,11 -5,11 -7,6 C-10,-2 -8,-12 0,-12 Z" fill="#C9C1B0" stroke="#7E7564" stroke-width="1" />
      <path d="M-7,-4 C-2,-2 2,-2 7,-4 M-8,2 C-3,4 3,4 8,2" fill="none" stroke="#A39A87" stroke-width="1" />
      <ellipse cx="0" cy="8" rx="2" ry="1.4" fill="#3A342A" />
      <g transform="translate(10 -9)"><ellipse rx="3" ry="2" fill="#F2C24B" stroke="#2A2418" stroke-width="0.6" /><path d="M-1,-2 V2 M1,-2 V2" stroke="#2A2418" stroke-width="0.9" /><ellipse cx="0" cy="-2.6" rx="1.8" ry="1" fill="rgba(220,240,255,.85)" /></g>
    </g>
  </svg>
</template>

<script>
// Grains de la mûre, graines de la fraise
const DRUPES = [[-3, -2], [3, -2], [0, 1], [-4, 3], [4, 3], [-1, 6], [2, 6], [0, -3.5]];
const SEEDS = [[-5, -1], [-1, -2], [3, -1], [6, 1], [-6, 3], [-2, 3], [2, 4], [5, 5], [-3, 7], [1, 8]];

// Icône d'une prise des mini-jeux (poissons, pierres précieuses, baies, guêpes), en SVG net à toutes les tailles
export default {
  name: 'GameIcon',
  props: {
    kind: { type: String, required: true },
    size: { type: Number, default: 28 }
  },
  data() {
    return { DRUPES, SEEDS };
  }
};
</script>

<style scoped>
.game-icon { display: inline-block; vertical-align: middle; overflow: visible; }
</style>
