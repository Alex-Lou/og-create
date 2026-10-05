<template>
  <svg class="pa" :class="`pa--${art}`" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <!-- Les images des scènes du tutoriel (HISTOIRE.md, § 9), en SVG : nuit, brume, la troupe dessinée par le
         générateur de l'île (world/villagers.js), Brume comme sur l'île. Le joueur n'est jamais montré (D11). Le cadre
         se recadre sur l'écran (slice) : l'essentiel tient au centre. Une seule racine : la scène l'anime en fondu -->
    <defs>
      <linearGradient id="pa-night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="sky[0]" />
        <stop offset=".62" :stop-color="sky[1]" />
        <stop offset="1" :stop-color="sky[2]" />
      </linearGradient>
      <linearGradient id="pa-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#20354F" />
        <stop offset="1" stop-color="#0E1A2B" />
      </linearGradient>
      <linearGradient id="pa-sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5E5446" />
        <stop offset="1" stop-color="#2E2922" />
      </linearGradient>
      <radialGradient id="pa-moon">
        <stop offset="0" stop-color="rgba(220,235,255,.5)" />
        <stop offset="1" stop-color="rgba(220,235,255,0)" />
      </radialGradient>
      <radialGradient id="pa-glow">
        <stop offset="0" :stop-color="`rgba(${WISP.calm.halo},.55)`" />
        <stop offset="1" :stop-color="`rgba(${WISP.calm.halo},0)`" />
      </radialGradient>
      <radialGradient id="pa-fire">
        <stop offset="0" stop-color="rgba(255,190,100,.55)" />
        <stop offset="1" stop-color="rgba(255,150,60,0)" />
      </radialGradient>
      <radialGradient id="pa-wisp" gradientUnits="userSpaceOnUse" cx="0" cy="-2.4" r="17.6" fx="0" fy="1.6">
        <stop offset="0" :stop-color="WISP.calm.core" />
        <stop offset=".45" :stop-color="WISP.calm.flame" />
        <stop offset="1" :stop-color="WISP.calm.edge" />
      </radialGradient>
      <linearGradient id="pa-leather" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7A2A31" />
        <stop offset="1" stop-color="#3A1214" />
      </linearGradient>
    </defs>

    <!-- Ciel, lune, étoiles -->
    <rect width="400" height="400" fill="url(#pa-night)" />
    <template v-if="art !== 'storm'">
      <circle cx="252" cy="72" r="46" fill="url(#pa-moon)" />
      <circle cx="252" cy="72" r="15" fill="#E6EEF8" opacity=".85" />
      <circle v-for="(s, k) in STARS" :key="`s${k}`" :cx="s[0]" :cy="s[1]" :r="s[2]" fill="#DCE6F5" :opacity="s[3]" class="pa__star" :style="{ '--k': k }" />
    </template>

    <!-- La tempête : l'Hirondelle, quatre silhouettes, une vague, le noir -->
    <g v-if="art === 'storm'">
      <path class="pa__bolt" d="M262 0 L246 62 L262 60 L240 128" fill="none" stroke="#E8F2FF" stroke-width="3" stroke-linejoin="round" />
      <g class="pa__rain"><path v-for="k in 26" :key="`r${k}`" :d="`M${(k * 37) % 420 - 10} ${(k * 53) % 300} l-10 26`" stroke="rgba(190,210,235,.35)" stroke-width="1.4" /></g>
      <path d="M0 250 Q60 220 120 248 T240 244 T400 238 V400 H0 Z" fill="url(#pa-sea)" />
      <g class="pa__ship" transform="translate(200 236)">
        <g transform="rotate(-9)">
          <path d="M-92 0 L92 0 L70 34 L-74 34 Z" fill="#3A2A20" stroke="#1A120C" stroke-width="2" />
          <path d="M-92 0 L92 0" stroke="#6B4A2E" stroke-width="3" />
          <rect x="-3" y="-118" width="6" height="118" fill="#2A1E16" />
          <path d="M3 -110 Q52 -84 36 -34 L3 -30 Z" fill="#C9BFA8" opacity=".9" />
          <path d="M-3 -104 Q-40 -88 -46 -50 L-28 -58 L-34 -40 L-3 -36 Z" fill="#B5AA92" opacity=".75" />
          <text x="40" y="24" font-size="9" fill="#C9A24A" font-family="Georgia, serif" font-style="italic">l’Hirondelle</text>
          <image v-for="(f, k) in crew" :key="f.id" :href="f.href" :x="-60 + k * 30" y="-44" width="28" height="39" class="pa__crew" />
        </g>
      </g>
      <path class="pa__wave" d="M-20 400 L-20 260 Q40 120 150 150 Q230 172 250 120 Q262 92 300 100 Q270 120 284 150 Q320 210 420 230 L420 400 Z" fill="#162740" />
      <path class="pa__wave" d="M-20 260 Q40 120 150 150 Q230 172 250 120 Q262 92 300 100" fill="none" stroke="rgba(220,235,255,.5)" stroke-width="3" />
      <rect class="pa__dark" width="400" height="400" fill="#000" />
    </g>

    <!-- La Grève, la nuit (toutes les autres scènes) -->
    <g v-else>
      <path d="M0 232 H400 V300 H0 Z" fill="url(#pa-sea)" />
      <path d="M0 236 Q100 230 200 236 T400 234" fill="none" stroke="rgba(200,220,240,.18)" stroke-width="1.5" />
      <path d="M0 262 Q90 252 170 262 T400 256 V400 H0 Z" fill="url(#pa-sand)" />
      <!-- Débris du naufrage -->
      <g fill="#3B2E22" stroke="#1E1610" stroke-width="1.5">
        <rect x="106" y="304" width="62" height="8" rx="2" transform="rotate(-8 137 308)" />
        <rect x="264" y="286" width="28" height="22" rx="2" />
        <path d="M264 292 H292 M278 286 V308" stroke="#5A4634" />
      </g>
    </g>

    <!-- Aster dans les vagues, qui tire des caisses -->
    <g v-if="art === 'aster'">
      <rect x="112" y="248" width="26" height="20" rx="2" fill="#5A4634" stroke="#2A1E16" transform="rotate(-6 125 258)" />
      <rect x="252" y="254" width="22" height="17" rx="2" fill="#5A4634" stroke="#2A1E16" transform="rotate(8 263 262)" />
      <image :href="person('ponton', 'se')" x="160" y="150" width="88" height="123" />
      <path d="M120 250 Q160 240 200 250 T290 248 V282 H120 Z" fill="#20354F" opacity=".92" />
      <path d="M128 252 Q168 244 204 252 T286 250" fill="none" stroke="rgba(220,235,255,.45)" stroke-width="2" class="pa__foam" />
    </g>

    <!-- Le Feu de camp -->
    <g v-if="art === 'fire'" transform="translate(212 300)">
      <circle r="120" fill="url(#pa-fire)" class="pa__flicker" />
      <path d="M-30 6 L30 -6 M-28 -6 L30 8" stroke="#4A3020" stroke-width="7" stroke-linecap="round" />
      <g class="pa__flames">
        <path d="M0 0 C-18 -10 -14 -34 0 -58 C14 -34 18 -10 0 0 Z" fill="#F28C28" />
        <path d="M0 0 C-10 -8 -8 -24 0 -40 C8 -24 10 -8 0 0 Z" fill="#FFD166" />
        <path d="M-12 0 C-20 -8 -18 -20 -10 -32 C-6 -18 -4 -8 -12 0 Z" fill="#F25C28" opacity=".9" />
      </g>
    </g>

    <!-- Le rocher derrière lequel Brume se cache -->
    <path v-if="art === 'rock'" d="M166 312 Q166 232 212 218 Q256 206 282 244 Q302 278 296 312 Z" fill="#2B2A2E" stroke="#141316" stroke-width="2" />

    <!-- Le Grimoire fermé, ses sept sceaux et sa gemme -->
    <g v-if="art === 'book' || art === 'seal'" transform="translate(200 224)" class="pa__book">
      <circle r="96" fill="url(#pa-glow)" />
      <rect x="-60" y="-76" width="120" height="156" rx="7" fill="url(#pa-leather)" stroke="#1E0A0A" stroke-width="2" />
      <rect x="-52" y="-68" width="104" height="140" rx="4" fill="none" stroke="rgba(214,170,90,.6)" stroke-width="1.4" />
      <circle r="32" fill="none" stroke="rgba(214,170,90,.7)" stroke-width="1.2" />
      <circle r="8" fill="#C2475A" stroke="#7A5A1E" stroke-width="1.6" />
      <g v-for="(seal, k) in seals" :key="seal.id" :transform="`translate(${seal.x} ${seal.y}) scale(.62) translate(-12 -12)`">
        <path :d="seal.d" fill="none" :stroke="seal.broken ? '#FFE6A8' : '#D6AA5A'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" :class="{ pa__broken: seal.broken }" :style="{ '--k': k }" />
      </g>
      <g v-if="art === 'seal'" :transform="`translate(${saturn.x} ${saturn.y})`">
        <g class="pa__rays">
          <path v-for="k in 10" :key="`ray${k}`" :d="`M0 0 L${(Math.cos(k * 0.63) * 30).toFixed(1)} ${(Math.sin(k * 0.63) * 30).toFixed(1)}`" stroke="rgba(255,226,150,.8)" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>
    </g>

    <!-- Brume, le feu follet -->
    <g v-if="wisp" :transform="`translate(${wisp.x} ${wisp.y}) scale(${wisp.k})`" class="pa__wisp">
      <circle cy="-5" r="26" fill="url(#pa-glow)" />
      <g class="pa__wisp-flame">
        <path d="M0,8 C10.4,8 9.2,-3.6 0,-16.4 C-9.2,-3.6 -10.4,8 0,8 Z" fill="url(#pa-wisp)" />
        <path d="M0,8.4 C5.7,8.4 5.1,2 0,-4.4 C-5.1,2 -5.7,8.4 0,8.4 Z" fill="rgba(255,255,255,.75)" />
      </g>
      <g :fill="WISP.eye" class="pa__eyes">
        <ellipse cx="-2.9" cy="-0.8" rx="1.25" :ry="wisp.wide ? 2.3 : 1.75" />
        <ellipse cx="2.9" cy="-0.8" rx="1.25" :ry="wisp.wide ? 2.3 : 1.75" />
      </g>
    </g>
    <!-- Le rocher devant Brume (elle passe la tête) -->
    <path v-if="art === 'rock'" d="M204 312 Q204 274 232 270 Q262 266 276 286 Q288 302 284 312 Z" fill="#232226" stroke="#141316" stroke-width="1.5" />

    <!-- La brume, qui recule quand le feu prend -->
    <g :class="['pa__mist', { 'is-thin': art === 'fire' || art === 'book' || art === 'seal' || art === 'aster' }]">
      <ellipse v-for="(m, k) in MIST" :key="`m${k}`" :cx="m[0]" :cy="m[1]" :rx="m[2]" :ry="m[3]" fill="rgba(210,222,236,.16)" :style="{ '--k': k }" />
    </g>
  </svg>
</template>

<script>
import { WISP } from '@/world/brume';
import { SIGILS, CHAPTER_IDS } from '@/book/grimoire';
import { villagerSprite, ROLES } from '@/world/villagers';

// Étoiles (x, y, rayon, opacité) et nappes de brume (x, y, rayons), fixes
const STARS = [[40, 40, 1.2, 0.8], [92, 70, 0.9, 0.6], [150, 30, 1.4, 0.9], [210, 58, 0.8, 0.5], [356, 140, 1, 0.7], [250, 24, 1.1, 0.8], [120, 120, 0.8, 0.5], [380, 40, 1.2, 0.7], [20, 150, 1, 0.6]];
const MIST = [[80, 250, 140, 18], [300, 262, 160, 20], [190, 300, 200, 24], [60, 330, 130, 16], [330, 346, 150, 18]];
// Couleurs fixes des personnages dans les scènes (sur l'île, elles suivent le tirage du village)
const LOOKS = {
  ponton: { skin: '#F2C9A0', hair: '#B94E3A' },
  foyer: { skin: '#E9B98F', hair: '#7A4E2C' },
  atelier: { skin: '#F6D3B3' },
  puits: { skin: '#C98B5E', hair: '#3A2A1E' }
};
// Où est Brume dans chaque image (x, y, échelle ; wide : yeux grands ouverts)
const WISPS = {
  wisp: { x: 200, y: 214, k: 1.3 },
  rock: { x: 238, y: 250, k: 2, wide: true },
  fire: { x: 150, y: 262, k: 2.2 },
  book: { x: 200, y: 114, k: 1.7 },
  seal: { x: 128, y: 118, k: 1.7, wide: true }
};

export default {
  name: 'PrologueArt',
  props: {
    // storm | beach | wisp | rock | fire | book | seal | aster
    art: { type: String, required: true }
  },
  data() {
    return { WISP, STARS, MIST };
  },
  computed: {
    sky() {
      if (this.art === 'storm') return ['#05080F', '#121D2E', '#0B1220'];
      if (this.art === 'aster') return ['#1B2A44', '#3E5470', '#6E7F92'];
      return ['#070D1A', '#14213A', '#1D2B44'];
    },
    wisp() {
      return WISPS[this.art] || null;
    },
    // La troupe sur le pont : un ciré jaune, une louche, des lunettes à loupes, une baguette fourchue
    crew() {
      return ['ponton', 'foyer', 'atelier', 'puits'].map(id => ({ id, href: this.person(id, 'front') }));
    },
    // Les sept sceaux en couronne ; celui de Saturne (chapitre II) se brise à la scène du sceau
    seals() {
      return CHAPTER_IDS.map((id, k) => {
        const a = -Math.PI / 2 + (k * Math.PI * 2) / 7;
        return { id, d: SIGILS[id].d, x: Math.cos(a) * 44, y: Math.sin(a) * 44, broken: this.art === 'seal' && id === 'II' };
      });
    },
    saturn() {
      return this.seals.find(seal => seal.id === 'II');
    }
  },
  methods: {
    person(id, view) {
      const { svg } = villagerSprite({ skin: '#F2C9A0', hair: '#3A2A1E', ...LOOKS[id], ...ROLES[id] }, { pose: 'idle', view });
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
  }
};
</script>

<style scoped>
.pa { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.pa__star { animation: pa-twinkle 4s ease-in-out calc(var(--k) * -.7s) infinite; }
.pa__mist ellipse { animation: pa-drift 14s ease-in-out calc(var(--k) * -2.6s) infinite alternate; }
.pa__mist { transition: opacity 1.6s ease; }
.pa__mist.is-thin { opacity: .35; }
.pa__wisp-flame { transform-origin: 0 8px; animation: pa-flick 2.2s ease-in-out infinite; }
.pa__wisp { animation: pa-float 4s ease-in-out infinite; }
.pa__eyes { animation: pa-blink 5s steps(1, end) infinite; transform-origin: 0 -1px; transform-box: fill-box; }
.pa__flames { transform-origin: 0 0; animation: pa-flick 0.9s ease-in-out infinite; }
.pa__flicker { animation: pa-glow 1.6s ease-in-out infinite; }
.pa__foam { animation: pa-foam 3s ease-in-out infinite; }
/* La tempête : éclair, roulis, la vague qui monte, puis le noir */
.pa__bolt { opacity: 0; animation: pa-bolt 3.2s linear infinite; }
.pa__rain { animation: pa-rain .5s linear infinite; }
.pa__ship { animation: pa-roll 3s ease-in-out infinite; }
.pa__crew { filter: brightness(.55) saturate(.8); }
.pa__wave { transform: translateY(260px); animation: pa-wave 6.2s cubic-bezier(.5, 0, .3, 1) forwards; }
.pa__dark { opacity: 0; animation: pa-dark 1s ease-in 6s forwards; }
.pa__broken { animation: pa-crack 1.4s ease-out forwards; transform-box: fill-box; transform-origin: center; }
.pa__rays { opacity: 0; animation: pa-rays 1.6s ease-out .4s forwards; }
@keyframes pa-twinkle { 0%, 100% { opacity: .9; } 50% { opacity: .35; } }
@keyframes pa-drift { from { transform: translateX(-14px); } to { transform: translateX(14px); } }
@keyframes pa-flick { 0%, 100% { transform: scaleY(1) skewX(0deg); } 50% { transform: scaleY(1.08) skewX(-3deg); } }
@keyframes pa-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -5px; } }
@keyframes pa-blink { 0%, 92%, 100% { transform: scaleY(1); } 94% { transform: scaleY(.1); } }
@keyframes pa-glow { 0%, 100% { opacity: .85; } 50% { opacity: 1; } }
@keyframes pa-foam { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
@keyframes pa-bolt { 0%, 8%, 14%, 100% { opacity: 0; } 9%, 12% { opacity: 1; } }
@keyframes pa-rain { from { transform: translate(0, 0); } to { transform: translate(-8px, 26px); } }
@keyframes pa-roll { 0%, 100% { transform: translate(200px, 236px) rotate(-4deg); } 50% { transform: translate(200px, 240px) rotate(5deg); } }
@keyframes pa-wave { 0% { transform: translateY(260px); } 70% { transform: translateY(40px); } 100% { transform: translateY(-40px); } }
@keyframes pa-dark { to { opacity: 1; } }
@keyframes pa-crack { 0% { transform: scale(1); filter: none; } 40% { transform: scale(1.5); filter: drop-shadow(0 0 4px #FFE29A); } 100% { transform: scale(1.15); filter: drop-shadow(0 0 3px #FFE29A); opacity: .55; } }
@keyframes pa-rays { 0% { opacity: 0; transform: scale(.4); } 50% { opacity: 1; } 100% { opacity: .6; transform: scale(1); } }
/* Mouvement réduit : des images fixes (la tempête montre directement la vague) */
@media (prefers-reduced-motion: reduce) {
  .pa *, .pa { animation: none !important; }
  .pa__wave { transform: translateY(40px); }
  .pa__bolt, .pa__rays { opacity: .8; }
}
</style>
