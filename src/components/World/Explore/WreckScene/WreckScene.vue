<template>
  <div class="world__wreck" role="dialog" aria-label="Un naufrage" @click="$emit('close')">
    <svg class="world__wreck-scene" viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="world-wreck-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1630" /><stop offset="1" stop-color="#22385E" /></linearGradient>
      </defs>
      <rect width="360" height="240" fill="url(#world-wreck-sky)" />
      <circle cx="290" cy="50" r="15" fill="#F4EEDC" opacity=".85" />
      <g fill="#F4EEDC" opacity=".6"><circle cx="40" cy="30" r="1.2" /><circle cx="96" cy="58" r="1" /><circle cx="168" cy="24" r="1.3" /><circle cx="226" cy="70" r="1" /><circle cx="330" cy="96" r="1.1" /></g>
      <rect y="152" width="360" height="88" fill="#132645" />
      <g class="world__wreck-ship" fill="#070E1E">
        <template v-if="wreck.wreck === 'raft'">
          <g transform="translate(176 150) rotate(-9)"><rect x="-30" y="-5" width="60" height="6" rx="3" /><rect x="-26" y="-11" width="52" height="6" rx="3" /><path d="M-4 -11 L4 -44 L7 -43 L1 -11 Z" /><path d="M5 -40 L22 -30 L6 -26 Z" opacity=".8" /></g>
        </template>
        <template v-else-if="wreck.wreck === 'boat'">
          <g transform="translate(180 152) rotate(12)"><path d="M-46 -10 L46 -10 L34 6 L-36 6 Z" /><path d="M-6 -10 L-2 -58 L2 -58 L2 -10 Z" /><path d="M2 -52 L-30 -40 L2 -34 Z" opacity=".75" /><rect x="-26" y="-18" width="12" height="8" /><rect x="-10" y="-18" width="10" height="8" /></g>
        </template>
        <template v-else>
          <g transform="translate(172 152) rotate(-16)"><path d="M-30 -8 Q0 6 30 -8 L24 2 Q0 12 -24 2 Z" /><circle cx="-8" cy="-11" r="2.4" /><circle cx="2" cy="-12" r="2" /><circle cx="10" cy="-10" r="2.2" /></g>
        </template>
      </g>
      <path d="M0 152 Q45 146 90 152 T180 152 T270 152 T360 152" fill="none" stroke="#4A6A9A" stroke-width="2" />
      <g class="world__wreck-fog" fill="#DCE6F2"><ellipse cx="80" cy="146" rx="90" ry="14" opacity=".22" /><ellipse cx="250" cy="140" rx="110" ry="16" opacity=".2" /><ellipse cx="170" cy="160" rx="140" ry="12" opacity=".18" /></g>
    </svg>
    <p class="world__wreck-text">« {{ wreck.text }} »</p>
    <span class="world__wreck-hint">Toucher pour continuer</span>
  </div>
</template>

<script>
// Naufrage (bible, § 6.7 et § 14) : une nuit, une épave au loin, la brume, et Brume ; un toucher pour continuer. Ses
// styles sont ceux de l'île (WorldView, classes world__)
export default {
  name: 'WreckScene',
  props: {
    // { id, villager, zone, wreck : 'raft' | 'boat' | 'barque', text } (world/story.js)
    wreck: { type: Object, required: true }
  },
  emits: ['close']
};
</script>

<style scoped src="./WreckScene.css"></style>
