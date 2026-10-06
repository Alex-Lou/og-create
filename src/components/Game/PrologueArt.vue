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
      <filter id="pa-light" x="-20%" y="-60%" width="140%" height="220%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="pa-wisp-gold" gradientUnits="userSpaceOnUse" cx="0" cy="-2.4" r="17.6" fx="0" fy="1.6">
        <stop offset="0" :stop-color="GOLD.core" />
        <stop offset=".45" :stop-color="GOLD.flame" />
        <stop offset="1" :stop-color="GOLD.edge" />
      </radialGradient>
      <radialGradient id="pa-glow-gold">
        <stop offset="0" :stop-color="`rgba(${GOLD.halo},.6)`" />
        <stop offset="1" :stop-color="`rgba(${GOLD.halo},0)`" />
      </radialGradient>
      <radialGradient id="pa-sun">
        <stop offset="0" stop-color="rgba(255,236,170,.95)" />
        <stop offset=".35" stop-color="rgba(255,206,120,.55)" />
        <stop offset="1" stop-color="rgba(255,190,100,0)" />
      </radialGradient>
      <radialGradient id="pa-anya">
        <stop offset="0" stop-color="rgba(250,236,170,.75)" />
        <stop offset=".45" stop-color="rgba(190,230,140,.32)" />
        <stop offset="1" stop-color="rgba(160,220,120,0)" />
      </radialGradient>
      <linearGradient id="pa-leather" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7A2A31" />
        <stop offset="1" stop-color="#3A1214" />
      </linearGradient>
    </defs>

    <!-- Ciel, lune, étoiles -->
    <rect width="400" height="400" fill="url(#pa-night)" />
    <template v-if="art !== 'storm'">
      <template v-if="!dawn">
        <circle cx="252" cy="72" r="46" fill="url(#pa-moon)" />
        <circle cx="252" cy="72" r="15" fill="#E6EEF8" opacity=".85" />
      </template>
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

    <!-- Cannelle grelotte derrière l'épave -->
    <g v-if="art === 'cannelle'">
      <path d="M214 300 L232 236 L318 230 L330 300 Z" fill="#2E2219" stroke="#140D08" stroke-width="2" />
      <path d="M232 236 L252 250 L240 268 L262 282 M286 232 L280 300 M306 231 L310 300" stroke="#4A3626" stroke-width="3" fill="none" />
      <image :href="person('foyer', 'se')" x="150" y="214" width="60" height="84" class="pa__shiver" />
    </g>

    <!-- Rivet trie des vis sous une voile échouée -->
    <g v-if="art === 'rivet'">
      <path d="M138 302 L232 182 L314 302 Z" fill="#C9BFA8" stroke="#8F846E" stroke-width="2" opacity=".92" />
      <path d="M232 182 L232 302" stroke="#5A4634" stroke-width="4" />
      <rect x="244" y="282" width="34" height="20" rx="2" fill="#5A4634" stroke="#2A1E16" />
      <circle v-for="k in 6" :key="`v${k}`" :cx="248 + k * 4.5" :cy="280 - (k % 2) * 2" r="1.6" fill="#C9C4B8" />
      <image :href="person('atelier', 'se', 'work')" x="176" y="212" width="62" height="87" />
    </g>

    <!-- La Source : Ondin réveillé, Cannelle qui accourt -->
    <g v-if="art === 'ondin'">
      <ellipse cx="200" cy="304" rx="96" ry="20" fill="#2E5878" stroke="#1C3A52" stroke-width="2" />
      <ellipse cx="190" cy="300" rx="60" ry="9" fill="rgba(160,210,240,.35)" class="pa__foam" />
      <path v-for="k in 5" :key="`roseau${k}`" :d="`M${112 + k * 5} 306 q-4 -26 2 -40`" stroke="#4E7A36" stroke-width="2" fill="none" />
      <image :href="person('puits', 'se')" x="150" y="226" width="50" height="70" />
      <image :href="person('foyer', 'front', 'walk')" x="236" y="208" width="60" height="84" />
    </g>

    <!-- Veillée : la troupe en cercle autour du feu (ceux du fond derrière les flammes) -->
    <g v-if="art === 'veillee' || art === 'rite' || (art === 'lien' && cast.length > 2)">
      <image v-for="m in ring.back" :key="`b${m.id}`" :href="person(m.id, 'se')" :x="m.x" :y="m.y" :width="m.w" :height="m.h" :transform="m.transform" />
    </g>

    <!-- Un lien : deux naufragés face à face, la recette de leurs Arts en lumière -->
    <g v-if="art === 'lien' && cast.length === 2">
      <image :href="person(cast[0], 'se')" x="122" y="200" width="70" height="98" />
      <image :href="person(cast[1], 'se')" transform="translate(278 200) scale(-1 1)" width="70" height="98" />
    </g>

    <!-- L'étape : l'aube sur les terres à libérer -->
    <g v-if="art === 'horizon'">
      <circle cx="200" cy="246" r="44" fill="#F6D58A" opacity=".85" />
      <path d="M100 240 Q130 214 160 236 Q176 222 196 240 Z M232 242 Q262 206 300 238 Z" fill="#2A2F45" opacity=".9" />
      <path d="M0 240 H400 V300 H0 Z" fill="#3E5470" />
      <path d="M0 246 Q100 240 200 246 T400 244" fill="none" stroke="rgba(255,220,160,.5)" stroke-width="2" />
    </g>

    <!-- Le Feu de camp -->
    <g v-if="['fire', 'cannelle-feu', 'campement', 'veillee', 'rite'].includes(art) || (art === 'lien' && cast.length > 2)" transform="translate(212 300)">
      <circle r="120" fill="url(#pa-fire)" class="pa__flicker" />
      <path d="M-30 6 L30 -6 M-28 -6 L30 8" stroke="#4A3020" stroke-width="7" stroke-linecap="round" />
      <g class="pa__flames">
        <path d="M0 0 C-18 -10 -14 -34 0 -58 C14 -34 18 -10 0 0 Z" fill="#F28C28" />
        <path d="M0 0 C-10 -8 -8 -24 0 -40 C8 -24 10 -8 0 0 Z" fill="#FFD166" />
        <path d="M-12 0 C-20 -8 -18 -20 -10 -32 C-6 -18 -4 -8 -12 0 Z" fill="#F25C28" opacity=".9" />
      </g>
    </g>

    <!-- La recette du rite ou du lien, écrite en lumière au-dessus du feu -->
    <g v-if="recipe && (art === 'rite' || art === 'lien')" class="pa__recipe" filter="url(#pa-light)">
      <text x="200" y="138" text-anchor="middle" class="pa__recipe-name">{{ recipeParts[0] }}</text>
      <text v-if="recipeParts[1]" x="200" y="160" text-anchor="middle" class="pa__recipe-of">{{ recipeParts[1] }}</text>
    </g>

    <!-- Cannelle se redresse devant le feu -->
    <image v-if="art === 'cannelle-feu'" :href="person('foyer', 'front')" x="236" y="206" width="62" height="87" />

    <!-- Le Campement : le feu, le Puits, cinq visages -->
    <g v-if="art === 'campement'">
      <g transform="translate(274 258)">
        <ellipse cx="0" cy="24" rx="20" ry="7" fill="#6E6A66" stroke="#3A3836" stroke-width="2" />
        <rect x="-20" y="4" width="40" height="20" fill="#7E7A74" stroke="#3A3836" stroke-width="2" />
        <path d="M-22 -16 L0 -30 L22 -16 Z" fill="#7A4E2C" stroke="#3A2416" stroke-width="2" />
        <path d="M-16 -16 V4 M16 -16 V4" stroke="#5A4634" stroke-width="3" />
      </g>
      <image :href="person('ponton', 'se')" x="104" y="232" width="46" height="64" />
      <image :href="person('foyer', 'se')" x="146" y="238" width="48" height="67" />
      <image :href="person('atelier', 'front')" x="232" y="240" width="44" height="62" />
      <image :href="person('puits', 'front')" x="186" y="262" width="36" height="50" />
    </g>

    <!-- Le rocher derrière lequel Brume se cache -->
    <path v-if="art === 'rock'" d="M166 312 Q166 232 212 218 Q256 206 282 244 Q302 278 296 312 Z" fill="#2B2A2E" stroke="#141316" stroke-width="2" />

    <!-- Le Grimoire fermé, ses sept sceaux et sa gemme -->
    <g v-if="art === 'book' || art === 'seal' || art === 'gemme'" transform="translate(200 224)" class="pa__book">
      <circle r="96" fill="url(#pa-glow)" />
      <rect x="-60" y="-76" width="120" height="156" rx="7" fill="url(#pa-leather)" stroke="#1E0A0A" stroke-width="2" />
      <rect x="-52" y="-68" width="104" height="140" rx="4" fill="none" stroke="rgba(214,170,90,.6)" stroke-width="1.4" />
      <circle r="32" fill="none" stroke="rgba(214,170,90,.7)" stroke-width="1.2" />
      <circle v-if="art === 'gemme'" r="26" fill="url(#pa-anya)" class="pa__gem-glow" />
      <circle r="8" :fill="art === 'gemme' ? '#9EE07A' : '#C2475A'" stroke="#7A5A1E" stroke-width="1.6" />
      <g v-for="(seal, k) in seals" :key="seal.id" :transform="`translate(${seal.x} ${seal.y}) scale(.62) translate(-12 -12)`">
        <path :d="seal.d" fill="none" :stroke="seal.broken ? '#FFE6A8' : '#D6AA5A'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" :class="{ pa__broken: seal.broken }" :style="{ '--k': k }" />
      </g>
      <g v-if="art === 'seal'" :transform="`translate(${saturn.x} ${saturn.y})`">
        <g class="pa__rays">
          <path v-for="k in 10" :key="`ray${k}`" :d="`M0 0 L${(Math.cos(k * 0.63) * 30).toFixed(1)} ${(Math.sin(k * 0.63) * 30).toFixed(1)}`" stroke="rgba(255,226,150,.8)" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>
    </g>

    <!-- La finale : le Phare de Brume sur son rocher, la mer ; la lanterne bleutée, puis le soleil du phare -->
    <g v-if="lighthouse" :transform="lighthouse.transform">
      <path d="M-200 30 Q-100 20 0 28 T220 26 V140 H-220 Z" :fill="dawn ? '#4A7FA8' : 'url(#pa-sea)'" />
      <path d="M-46 30 Q-40 4 -16 0 H18 Q44 6 48 30 Z" fill="#2B2A2E" stroke="#141316" stroke-width="2" />
      <g v-if="dawn" class="pa__sunrays">
        <circle cx="0" cy="-166" r="96" fill="url(#pa-sun)" />
        <path v-for="k in 12" :key="`sr${k}`" :d="`M${(Math.cos(k * 0.5236) * 30).toFixed(1)} ${(-166 + Math.sin(k * 0.5236) * 30).toFixed(1)} L${(Math.cos(k * 0.5236) * 70).toFixed(1)} ${(-166 + Math.sin(k * 0.5236) * 70).toFixed(1)}`" stroke="rgba(255,226,150,.7)" stroke-width="3" stroke-linecap="round" />
      </g>
      <path d="M-22 0 L-14 -150 H14 L22 0 Z" fill="#E9EEF3" stroke="#2A3346" stroke-width="2" />
      <path d="M-20.5 -30 L-19.2 -52 H19.2 L20.5 -30 Z M-17.6 -88 L-16.4 -110 H16.4 L17.6 -88 Z" fill="#9FC9E6" opacity=".85" />
      <rect x="-20" y="-155" width="40" height="5" fill="#3D3A36" />
      <rect x="-12" y="-179" width="24" height="24" rx="2" :fill="dawn ? '#FFE6A0' : '#BFE3F7'" stroke="#2A3346" stroke-width="1.5" />
      <path d="M-16 -179 L0 -197 L16 -179 Z" fill="#6A3F6E" stroke="#2A3346" stroke-width="1.5" />
      <circle cx="0" cy="-199" r="2.6" fill="#F2C04B" />
      <!-- Rivet sur la galerie, la lentille dans les mains -->
      <template v-if="art === 'phare'">
        <image :href="person('atelier', 'se')" x="-48" y="-196" width="30" height="42" />
        <circle cx="-14" cy="-170" r="7" fill="rgba(220,240,255,.65)" stroke="#D6AA5A" stroke-width="2" class="pa__lens" />
      </template>
    </g>

    <!-- Ondin au bord de l'eau ; dans le reflet, le vrai visage de Brume -->
    <g v-if="art === 'reflet'">
      <path d="M0 262 Q100 250 200 258 T400 256 V400 H0 Z" fill="#1E3A5A" />
      <path d="M0 262 Q100 250 200 258 T400 256" fill="none" stroke="rgba(190,220,240,.35)" stroke-width="2" />
      <g transform="translate(238 320)" class="pa__face" filter="url(#pa-light)">
        <path d="M-34 -10 Q-40 -46 -6 -50 Q30 -54 34 -16 Q40 14 22 30 M-34 -10 Q-38 18 -20 32" fill="none" stroke="rgba(255,214,140,.55)" stroke-width="4" stroke-linecap="round" />
        <ellipse rx="24" ry="30" fill="rgba(255,240,206,.32)" />
        <path d="M-12 -4 q5 4 10 0 M4 -4 q5 4 10 0" fill="none" stroke="rgba(120,90,60,.7)" stroke-width="1.6" stroke-linecap="round" />
        <path d="M-6 14 q6 5 12 0" fill="none" stroke="rgba(120,90,60,.6)" stroke-width="1.6" stroke-linecap="round" />
      </g>
      <path d="M0 300 H400 M0 336 H400 M0 372 H400" stroke="rgba(190,220,240,.12)" stroke-width="1.4" class="pa__ripple" />
      <image :href="person('puits', 'se')" x="106" y="196" width="62" height="87" />
    </g>

    <!-- Anya (HISTOIRE.md, § 6.14) : le Cercle de menhirs à l'aube, les sept sigles, la troupe devant les pierres -->
    <g v-if="menhirRing">
      <path d="M0 300 Q100 284 200 290 T400 292 V400 H0 Z" fill="#4E6A4A" />
      <ellipse cx="200" cy="296" rx="112" ry="34" fill="#5E7A52" />
      <template v-for="s in menhirRing.back" :key="`mb${s.k}`">
        <path :d="s.stone" fill="#8F887B" stroke="#4A453E" stroke-width="1.6" />
        <path :d="s.sigil" :transform="s.at" fill="none" :stroke="menhirRing.lit ? '#FFE29A' : 'rgba(214,170,90,.3)'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" :class="{ pa__sigil: menhirRing.lit }" :style="{ '--k': s.k }" />
      </template>
      <g v-if="art === 'anya'" class="pa__bloom">
        <circle v-for="(f, k) in BLOOM" :key="`fl${k}`" :cx="200 + f[0]" :cy="296 + f[1]" :r="f[2]" :fill="f[3]" />
      </g>
      <template v-if="art !== 'anya'">
        <image v-for="m in menhirRing.troupe" :key="`mt${m.id}`" :href="person(m.id, 'se')" :x="m.x" :y="m.y" width="26" height="36" />
      </template>
    </g>
    <!-- Anya se lève au centre du cercle ; le grand cerf blanc à ses côtés, un halo de lucioles -->
    <g v-if="art === 'anya'" transform="translate(196 316)" class="pa__anya">
      <circle cy="-96" r="124" fill="url(#pa-anya)" />
      <path d="M-44 0 Q-52 -60 -30 -112 Q-12 -128 0 -126 Q12 -128 30 -112 Q52 -60 44 0 Z" fill="#4E7A3E" stroke="#2C4A22" stroke-width="2" />
      <path d="M-30 -30 q6 -8 12 0 M18 -50 q6 -8 12 0 M-22 -78 q5 -7 10 0 M20 -92 q4 -6 8 0" stroke="#A8D07A" stroke-width="2" fill="none" />
      <circle cx="-26" cy="-58" r="3" fill="#F2C04B" /><circle cx="26" cy="-24" r="2.6" fill="#F6A8C8" /><circle cx="-34" cy="-14" r="2.4" fill="#BFE3F7" />
      <path d="M-16 0 Q-20 -60 -12 -118 H12 Q20 -60 16 0 Z" fill="#F4E8CC" stroke="#C9B48A" stroke-width="1" />
      <path d="M0 -114 V-24 M0 -86 l-8 10 M0 -64 l8 10 M0 -44 l-7 9" stroke="rgba(236,196,96,.85)" stroke-width="1.3" fill="none" />
      <path d="M-14 -152 Q-34 -118 -28 -64 Q-20 -98 -11 -130 Z M14 -152 Q34 -118 28 -64 Q20 -98 11 -130 Z" fill="#79B464" stroke="#4E8A44" stroke-width="1" />
      <path d="M-22 -110 l-5 4 M-26 -92 l-5 4 M22 -110 l5 4 M26 -92 l5 4" stroke="#A8D07A" stroke-width="2" stroke-linecap="round" />
      <ellipse cy="-146" rx="12" ry="14" fill="#F2DCC0" stroke="#C9A27A" stroke-width="1" />
      <ellipse cx="-4.6" cy="-147" rx="2.2" ry="1.7" fill="#A8CC52" /><ellipse cx="4.6" cy="-147" rx="2.2" ry="1.7" fill="#A8CC52" />
      <circle cx="-4.6" cy="-147" r=".9" fill="#2A3A1A" /><circle cx="4.6" cy="-147" r=".9" fill="#2A3A1A" />
      <path d="M-3 -139 q3 2 6 0" stroke="#A0705A" stroke-width="1" fill="none" stroke-linecap="round" />
      <path d="M-9 -153 l3 3 M9 -153 l-3 3 M-8 -140 l2 -2 M8 -140 l-2 -2" stroke="rgba(236,196,96,.8)" stroke-width=".8" />
      <path d="M-6 -158 Q-14 -176 -28 -184 M-15 -173 Q-25 -173 -31 -165 M-20 -180 Q-22 -192 -16 -201 M6 -158 Q14 -176 28 -184 M15 -173 Q25 -173 31 -165 M20 -180 Q22 -192 16 -201" stroke="#8B6A4A" stroke-width="3" fill="none" stroke-linecap="round" />
      <circle v-for="(f, k) in CROWN" :key="`cr${k}`" :cx="f[0]" :cy="f[1]" r="2.8" :fill="f[2]" />
      <ellipse cx="22" cy="-188" rx="3.4" ry="2.4" fill="#8FA65A" /><circle cx="24.6" cy="-189.4" r="1.6" fill="#4A7FC1" />
      <circle cx="-11" cy="2" r="3" fill="#F6A8C8" /><circle cx="12" cy="3" r="3" fill="#FFF2A8" /><circle cx="2" cy="5" r="2.4" fill="#BFE3F7" />
      <g class="pa__flies"><circle v-for="(f, k) in FLIES" :key="`ff${k}`" :cx="f[0]" :cy="f[1]" r="1.8" fill="#FFF3A0" :style="{ '--k': k }" /></g>
    </g>
    <g v-if="art === 'anya'" transform="translate(286 312) scale(-1.5 1.5)" class="pa__stag">
      <path d="M-11 0 V-12 M-7 0 V-12 M7 0 V-12 M11 0 V-12" stroke="#E8ECEE" stroke-width="2.4" stroke-linecap="round" />
      <ellipse cy="-16" rx="15" ry="7" fill="#F4F6F8" stroke="#B8C2C8" stroke-width="1" />
      <path d="M10 -20 Q16 -28 18 -34" stroke="#F4F6F8" stroke-width="5" stroke-linecap="round" fill="none" />
      <ellipse cx="21" cy="-36" rx="5" ry="3.4" fill="#F4F6F8" stroke="#B8C2C8" stroke-width="1" />
      <circle cx="22" cy="-37" r=".9" fill="#2A3A4A" />
      <path d="M18 -39 l-4 -8 l-3 -2 M15 -45 l3 -3 M22 -39 l2 -8 l3 -2 M23 -45 l-2 -3" stroke="#D8DEE2" stroke-width="1.2" fill="none" stroke-linecap="round" />
    </g>

    <!-- Une trace d'Anya : une silhouette coiffée de branches, devinée dans la brume, des lucioles -->
    <g v-if="art === 'trace'" transform="translate(200 300)" class="pa__trace">
      <circle cy="-70" r="110" fill="url(#pa-anya)" />
      <path d="M-30 0 Q-34 -70 -14 -120 Q0 -130 14 -120 Q34 -70 30 0 Z" fill="rgba(230,240,210,.16)" />
      <ellipse cy="-134" rx="11" ry="13" fill="rgba(240,240,220,.2)" />
      <path d="M-5 -146 Q-12 -162 -24 -170 M-12 -158 Q-21 -158 -26 -151 M5 -146 Q12 -162 24 -170 M12 -158 Q21 -158 26 -151" stroke="rgba(240,226,180,.45)" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <g class="pa__flies"><circle v-for="(f, k) in FLIES" :key="`tf${k}`" :cx="f[0] * 1.3" :cy="f[1] + 30" r="1.8" fill="#FFF3A0" :style="{ '--k': k }" /></g>
    </g>

    <!-- Brume, le feu follet -->
    <g v-if="wisp" :transform="`translate(${wisp.x} ${wisp.y}) scale(${wisp.k})`" class="pa__wisp">
      <circle cy="-5" r="26" :fill="wisp.gold ? 'url(#pa-glow-gold)' : 'url(#pa-glow)'" />
      <g class="pa__wisp-flame">
        <path d="M0,8 C10.4,8 9.2,-3.6 0,-16.4 C-9.2,-3.6 -10.4,8 0,8 Z" :fill="wisp.gold ? 'url(#pa-wisp-gold)' : 'url(#pa-wisp)'" />
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
    <g :class="['pa__mist', { 'is-thin': art !== 'storm' && art !== 'beach' && art !== 'wisp' && art !== 'rock', 'is-lift': art === 'soleil', 'is-gone': art === 'flammeche' }]">
      <ellipse v-for="(m, k) in MIST" :key="`m${k}`" :cx="m[0]" :cy="m[1]" :rx="m[2]" :ry="m[3]" fill="rgba(210,222,236,.16)" :style="{ '--k': k }" />
    </g>
  </svg>
</template>

<script>
import { WISP, STAGES } from '@/world/brume';
import { SIGILS, CHAPTER_IDS } from '@/book/grimoire';
import { faceHref } from '@/world/faces';

// Étoiles (x, y, rayon, opacité) et nappes de brume (x, y, rayons), fixes
const STARS = [[40, 40, 1.2, 0.8], [92, 70, 0.9, 0.6], [150, 30, 1.4, 0.9], [210, 58, 0.8, 0.5], [356, 140, 1, 0.7], [250, 24, 1.1, 0.8], [120, 120, 0.8, 0.5], [380, 40, 1.2, 0.7], [20, 150, 1, 0.6]];
const MIST = [[80, 250, 140, 18], [300, 262, 160, 20], [190, 300, 200, 24], [60, 330, 130, 16], [330, 346, 150, 18]];
// Où est Brume dans chaque image (x, y, échelle ; wide : yeux grands ouverts)
const WISPS = {
  wisp: { x: 200, y: 214, k: 1.3 },
  rock: { x: 238, y: 250, k: 2, wide: true },
  fire: { x: 150, y: 262, k: 2.2 },
  book: { x: 200, y: 114, k: 1.7 },
  cannelle: { x: 252, y: 196, k: 1.4, wide: true },
  'cannelle-feu': { x: 150, y: 262, k: 2 },
  rivet: { x: 132, y: 236, k: 1.3 },
  ondin: { x: 140, y: 196, k: 1.5 },
  campement: { x: 212, y: 206, k: 1.5 },
  veillee: { x: 212, y: 196, k: 1.5 },
  rite: { x: 212, y: 196, k: 1.3 },
  horizon: { x: 120, y: 150, k: 1.4 },
  seal: { x: 128, y: 118, k: 1.7, wide: true },
  phare: { x: 252, y: 146, k: 1.1 },
  cercle: { x: 200, y: 200, k: 1.4 },
  'cercle-sceaux': { x: 200, y: 200, k: 1.4 },
  anya: { x: 140, y: 150, k: 1.2 },
  gemme: { x: 200, y: 114, k: 1.4 },
  reflet: { x: 236, y: 200, k: 1.6 },
  flammeche: { x: 168, y: 250, k: 3, gold: true }
};
// Le Cercle fleuri (fleurs autour du centre, x, y, rayon, couleur), la couronne d'Anya et ses lucioles
const BLOOM = [[-40, 6, 4, '#F6A8C8'], [-24, 14, 3.4, '#FFF2A8'], [-6, 18, 4, '#FFFFFF'], [14, 15, 3.6, '#F6A8C8'], [32, 8, 4, '#BFE3F7'], [44, -2, 3, '#FFF2A8'],
  [-50, -4, 3, '#FFFFFF'], [-30, -8, 2.6, '#F2C04B'], [24, -10, 2.8, '#FFFFFF'], [4, -12, 3, '#F6C8D8']];
const CROWN = [[-28, -184, '#F6C8D8'], [-31, -165, '#FFFFFF'], [-16, -201, '#F6A8C8'], [28, -184, '#FFFFFF'], [31, -165, '#F6C8D8'], [16, -201, '#FFF2A8'], [-20, -178, '#FFFFFF']];
const FLIES = [[-60, -120], [-48, -60], [52, -140], [64, -80], [-70, -30], [40, -36], [-20, -190], [30, -170]];
// Les sept pierres du Cercle (le sigle de son chapitre au-dessus), et la troupe devant (Sylve et Mélisse se partagent ♀)
const MASTERS = ['ponton', 'carriere', 'puits', 'bosquet', 'foyer', 'atelier', 'potager'];

// Le Phare de Brume dans les images de la finale (pied du phare, échelle) ; sur un écran en hauteur, seul le milieu du
// cadre (x de 100 à 300) se voit
const LIGHTHOUSES = { phare: [206, 336, 1.05], soleil: [200, 344, 1.05], flammeche: [262, 296, 0.5] };

export default {
  name: 'PrologueArt',
  props: {
    // storm | beach | wisp | rock | fire | book | seal | aster | cannelle | cannelle-feu | rivet | ondin | campement |
    // veillee | rite | lien | horizon | phare | reflet | soleil | flammeche (la finale) | cercle | cercle-sceaux | anya |
    // gemme | trace (Anya)
    art: { type: String, required: true },
    // Veillées : qui est là (bâtiments de la troupe), et la recette écrite en lumière
    cast: { type: Array, default: () => [] },
    recipe: { type: String, default: '' }
  },
  data() {
    return { WISP, GOLD: STAGES[7], STARS, MIST, BLOOM, CROWN, FLIES };
  },
  computed: {
    sky() {
      if (this.art === 'storm') return ['#05080F', '#121D2E', '#0B1220'];
      if (this.art === 'aster') return ['#1B2A44', '#3E5470', '#6E7F92'];
      if (this.art === 'horizon') return ['#1B2A44', '#7E6A8A', '#E8A87C'];
      if (this.dawn) return ['#2A3A5E', '#B9806E', '#F6D58A'];
      return ['#070D1A', '#14213A', '#1D2B44'];
    },
    // La finale et la Révélation : l'aube se lève
    dawn() {
      return ['soleil', 'flammeche', 'cercle', 'cercle-sceaux', 'anya', 'trace'].includes(this.art);
    },
    // Le Cercle de menhirs : sept pierres en ellipse (celles du fond d'abord), leur sigle, la troupe devant
    menhirRing() {
      if (!['cercle', 'cercle-sceaux', 'anya'].includes(this.art)) return null;
      const stones = CHAPTER_IDS.map((id, k) => {
        const a = -Math.PI / 2 + (k * Math.PI * 2) / 7;
        const x = 200 + Math.cos(a) * 92, y = 292 + Math.sin(a) * 24;
        const h = 34 - Math.sin(a) * 6;
        return {
          k, y,
          stone: `M${(x - 8).toFixed(1)} ${y.toFixed(1)} V${(y - h + 6).toFixed(1)} Q${x.toFixed(1)} ${(y - h - 4).toFixed(1)} ${(x + 8).toFixed(1)} ${(y - h + 6).toFixed(1)} V${y.toFixed(1)} Z`,
          sigil: SIGILS[id].d, at: `translate(${(x - 7.2).toFixed(1)} ${(y - h - 22).toFixed(1)}) scale(.6)`
        };
      }).sort((p, q) => p.y - q.y);
      const troupe = MASTERS.map((id, k) => {
        const a = -Math.PI / 2 + (k * Math.PI * 2) / 7;
        return { id, x: 200 + Math.cos(a) * 64 - 13, y: 300 + Math.sin(a) * 16 - 36 };
      });
      return { back: stones, troupe, lit: this.art !== 'cercle' };
    },
    lighthouse() {
      const at = LIGHTHOUSES[this.art];
      return at ? { transform: `translate(${at[0]} ${at[1]}) scale(${at[2]})` } : null;
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
    // La recette en lumière : le résultat, puis ses ingrédients (« Lanterne = Feu + Lumière »)
    recipeParts() {
      return this.recipe.split('=').map(part => part.trim());
    },
    // La troupe en arc de cercle derrière le feu (centre 212, 290), tournée vers lui, en deux groupes de part et d'autre
    // des flammes : ceux de gauche de trois quarts, ceux de droite en miroir
    ring() {
      const n = this.cast.length;
      const w = n > 5 ? 38 : 46;
      const left = Math.ceil(n / 2);
      const back = this.cast.map((id, k) => {
        const side = k < left ? k / Math.max(1, left - 1) : (k - left) / Math.max(1, n - left - 1);
        const a = Math.PI * (k < left ? 1.1 + 0.3 * side : 1.6 + 0.3 * side);
        const x = 208 + Math.cos(a) * 76 - w / 2, y = 290 + Math.sin(a) * 24 - w * 1.4;
        const flip = x + w / 2 > 212;
        return { id, w, h: w * 1.4, x: flip ? 0 : x, y: flip ? 0 : y, transform: flip ? `translate(${(x + w).toFixed(1)} ${y.toFixed(1)}) scale(-1 1)` : null };
      });
      return { back };
    },
    saturn() {
      return this.seals.find(seal => seal.id === 'II');
    }
  },
  methods: {
    person(id, view, pose = 'idle') {
      return faceHref(id, { view, pose });
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
.pa__shiver { animation: pa-shiver .18s linear infinite; }
.pa__recipe { font-family: var(--font-fell); fill: #FFE6A8; animation: pa-glow 2.4s ease-in-out infinite; }
.pa__recipe-name { font-size: 24px; }
.pa__recipe-of { font-size: 15px; font-style: italic; }
/* La tempête : éclair, roulis, la vague qui monte, puis le noir */
.pa__bolt { opacity: 0; animation: pa-bolt 3.2s linear infinite; }
.pa__rain { animation: pa-rain .5s linear infinite; }
.pa__ship { animation: pa-roll 3s ease-in-out infinite; }
.pa__crew { filter: brightness(.55) saturate(.8); }
.pa__wave { transform: translateY(260px); animation: pa-wave 6.2s cubic-bezier(.5, 0, .3, 1) forwards; }
.pa__dark { opacity: 0; animation: pa-dark 1s ease-in 6s forwards; }
.pa__broken { animation: pa-crack 1.4s ease-out forwards; transform-box: fill-box; transform-origin: center; }
.pa__rays { opacity: 0; animation: pa-rays 1.6s ease-out .4s forwards; }
/* La finale : la lentille brille, le visage ondule, le soleil du phare tourne, la brume se lève */
.pa__lens { animation: pa-glow 1.2s ease-in-out infinite; }
.pa__face { animation: pa-float 5s ease-in-out infinite; opacity: .95; }
.pa__ripple { animation: pa-foam 4s ease-in-out infinite; }
.pa__sunrays { transform-origin: 0 -166px; animation: pa-spin 24s linear infinite; }
.pa__mist.is-lift { animation: pa-lift 4.5s ease-out forwards; }
.pa__mist.is-gone { opacity: 0; }
/* Anya : les sigles s'allument un à un, la lueur respire, les lucioles clignent, la gemme s'éveille */
.pa__sigil { opacity: 0; animation: pa-sigil .6s ease-out calc(var(--k) * .35s) forwards; filter: drop-shadow(0 0 3px rgba(255, 214, 120, .9)); }
.pa__anya { animation: pa-rise 2.4s ease-out both; }
.pa__flies circle { animation: pa-twinkle 2.6s ease-in-out calc(var(--k) * -.4s) infinite; }
.pa__bloom { animation: pa-glow 3s ease-in-out infinite; }
.pa__trace { animation: pa-glow 2.8s ease-in-out infinite; }
.pa__gem-glow { animation: pa-glow 1.8s ease-in-out infinite; }
@keyframes pa-twinkle { 0%, 100% { opacity: .9; } 50% { opacity: .35; } }
@keyframes pa-drift { from { transform: translateX(-14px); } to { transform: translateX(14px); } }
@keyframes pa-flick { 0%, 100% { transform: scaleY(1) skewX(0deg); } 50% { transform: scaleY(1.08) skewX(-3deg); } }
@keyframes pa-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -5px; } }
@keyframes pa-blink { 0%, 92%, 100% { transform: scaleY(1); } 94% { transform: scaleY(.1); } }
@keyframes pa-glow { 0%, 100% { opacity: .85; } 50% { opacity: 1; } }
@keyframes pa-foam { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
@keyframes pa-shiver { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1.2px); } }
@keyframes pa-bolt { 0%, 8%, 14%, 100% { opacity: 0; } 9%, 12% { opacity: 1; } }
@keyframes pa-rain { from { transform: translate(0, 0); } to { transform: translate(-8px, 26px); } }
@keyframes pa-roll { 0%, 100% { transform: translate(200px, 236px) rotate(-4deg); } 50% { transform: translate(200px, 240px) rotate(5deg); } }
@keyframes pa-wave { 0% { transform: translateY(260px); } 70% { transform: translateY(40px); } 100% { transform: translateY(-40px); } }
@keyframes pa-dark { to { opacity: 1; } }
@keyframes pa-crack { 0% { transform: scale(1); filter: none; } 40% { transform: scale(1.5); filter: drop-shadow(0 0 4px #FFE29A); } 100% { transform: scale(1.15); filter: drop-shadow(0 0 3px #FFE29A); opacity: .55; } }
@keyframes pa-rays { 0% { opacity: 0; transform: scale(.4); } 50% { opacity: 1; } 100% { opacity: .6; transform: scale(1); } }
@keyframes pa-spin { to { transform: rotate(360deg); } }
@keyframes pa-sigil { to { opacity: 1; } }
@keyframes pa-rise { from { opacity: 0; translate: 0 18px; } to { opacity: 1; translate: 0 0; } }
@keyframes pa-lift { from { opacity: .35; transform: translateY(0); } to { opacity: 0; transform: translateY(-60px); } }
/* Mouvement réduit : des images fixes (la tempête montre directement la vague) */
@media (prefers-reduced-motion: reduce) {
  .pa *, .pa { animation: none !important; }
  .pa__wave { transform: translateY(40px); }
  .pa__bolt, .pa__rays { opacity: .8; }
  .pa__sigil { opacity: 1; }
}
</style>
