<template>
  <!-- La vue aux jumelles de Lorena, pendant le vol du conseil (choix de l'auteur, 16 oct. : on voit ce qu'elle voit, le
       phare éteint sous l'orage, dans les deux ronds des jumelles ; WorldView, phare.js). Rien n'est dessiné de l'île ici :
       l'île vole dessous, ce cache n'en laisse voir que les deux verres.
       phase : 'haut' (elle les porte à ses yeux et cherche : la buée du verre, le compas qui défile), 'net' (la mise au
       point sur la tour ; la foudre s'allume dans le verre, à l'heure des deux coups de phare.js), 'bas' (elle les baisse).
       Tout s'anime par le compositeur (transformations, opacité) : rien ne se repeint d'une image à l'autre, sauf les
       gouttes et le compas, petits -->
  <div :class="['jm', `jm--${phase}`, { 'jm--still': still }]" aria-hidden="true">
    <div class="jm__sway">
      <svg class="jm__layer jm__haze" :viewBox="box">
        <path :d="lenses" fill="#B4C2D8" />
      </svg>
      <svg class="jm__layer jm__flash" :viewBox="box">
        <path :d="lenses" fill="#F4F7FF" />
      </svg>
      <svg class="jm__layer" :viewBox="box">
        <defs>
          <clipPath :id="`${uid}-verre`"><path :d="lenses" /></clipPath>
          <clipPath :id="`${uid}-bande`"><rect :x="g.cx2 - g.r * 0.62" :y="g.band" :width="g.r * 1.24" :height="g.r * 0.2" /></clipPath>
          <radialGradient :id="`${uid}-vignette`" r="0.5">
            <stop offset="0.8" stop-color="#03050C" stop-opacity="0" />
            <stop offset="0.93" stop-color="#03050C" stop-opacity="0.3" />
            <stop offset="1" stop-color="#03050C" stop-opacity="0.78" />
          </radialGradient>
          <radialGradient :id="`${uid}-goutte`" cx="0.42" cy="0.38" r="0.6">
            <stop offset="0" stop-color="#DDE6F6" stop-opacity="0.08" />
            <stop offset="0.7" stop-color="#22324E" stop-opacity="0.16" />
            <stop offset="1" stop-color="#0B1222" stop-opacity="0.5" />
          </radialGradient>
          <radialGradient :id="`${uid}-coque`" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.3" stop-color="#0E1426" />
            <stop offset="1" stop-color="#020308" />
          </radialGradient>
        </defs>
        <g :clip-path="`url(#${uid}-verre)`">
          <!-- le bord du verre qui s'assombrit (seulement tout au bord : là où les deux verres se croisent, au milieu, la
               tour reste claire) -->
          <circle :cx="g.cx1" :cy="g.cy" :r="g.r" :fill="`url(#${uid}-vignette)`" />
          <circle :cx="g.cx2" :cy="g.cy" :r="g.r" :fill="`url(#${uid}-vignette)`" />
          <!-- les gouttes de pluie sur le verre -->
          <g v-for="(d, i) in drops" :key="i" class="jm__drop" :style="d.style">
            <g class="jm__drop-run">
              <ellipse :cx="d.x" :cy="d.y" :rx="d.s" :ry="d.s * 1.12" :fill="`url(#${uid}-goutte)`" />
              <path :d="`M${d.x + d.s * 0.62},${d.y + d.s * 0.25} A${d.s * 0.72},${d.s * 0.78} 0 0 1 ${d.x - d.s * 0.2},${d.y + d.s * 0.98}`" fill="none" stroke="#070B16" stroke-opacity="0.45" :stroke-width="Math.max(0.8, d.s * 0.22)" stroke-linecap="round" />
              <ellipse :cx="d.x - d.s * 0.36" :cy="d.y - d.s * 0.42" :rx="d.s * 0.26" :ry="d.s * 0.17" fill="#FFFFFF" fill-opacity="0.75" :transform="`rotate(-32 ${d.x - d.s * 0.36} ${d.y - d.s * 0.42})`" />
            </g>
          </g>
          <!-- le compas de la navigatrice, éclairé, au bas du verre droit : il défile pendant qu'elle cherche, puis
               s'arrête sur le cap de la tour -->
          <g :clip-path="`url(#${uid}-bande)`">
            <g class="jm__compas" :style="{ '--jm-from': `${(COMPAS.to - COMPAS.from) * COMPAS.step}px` }">
              <g :transform="`translate(${g.cx2 - COMPAS.to * COMPAS.step} ${g.band})`">
                <path :d="ticks" fill="none" stroke="#FFC46B" stroke-opacity="0.82" stroke-width="1" />
                <text v-for="n in numbers" :key="n" class="jm__cap" :x="n * COMPAS.step" :y="g.r * 0.185" :font-size="g.r * 0.1" text-anchor="middle">{{ String(n).padStart(3, '0') }}</text>
              </g>
            </g>
            <path :d="`M${g.cx2 - 4},${g.band} L${g.cx2 + 4},${g.band} L${g.cx2},${g.band + 6} Z`" fill="#FFD48A" />
          </g>
        </g>
        <!-- la mise au point : deux franges colorées qui se resserrent sur le bord du verre -->
        <g class="jm__point">
          <circle class="jm__frange" :cx="g.cx1" :cy="g.cy" :r="g.r - 2" stroke="#8FE0FF" />
          <circle class="jm__frange" :cx="g.cx2" :cy="g.cy" :r="g.r - 2" stroke="#8FE0FF" />
          <circle class="jm__frange jm__frange--chaude" :cx="g.cx1" :cy="g.cy" :r="g.r - 5" stroke="#FFB27A" />
          <circle class="jm__frange jm__frange--chaude" :cx="g.cx2" :cy="g.cy" :r="g.r - 5" stroke="#FFB27A" />
        </g>
        <!-- le cache : tout l'écran (et bien au-delà, pour le tremblé), sauf les deux verres -->
        <path :d="`M${-g.w},${-g.h} H${2 * g.w} V${2 * g.h} H${-g.w} Z ${lenses}`" fill-rule="evenodd" :fill="`url(#${uid}-coque)`" />
        <!-- le bord du verre : l'œilleton de caoutchouc et son reflet, son ombre sur le verre, puis le laiton qui accroche la
             lumière -->
        <path :d="lenses" fill="none" stroke="#1C2438" stroke-width="20" />
        <path :d="cup(g.cx1)" fill="none" stroke="#4A5878" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round" />
        <path :d="cup(g.cx2)" fill="none" stroke="#4A5878" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round" />
        <path :d="lenses" fill="none" stroke="#000000" stroke-opacity="0.55" stroke-width="7" />
        <path :d="lenses" fill="none" stroke="#3A3022" stroke-opacity="0.9" stroke-width="1.6" />
        <g class="jm__reflet">
          <path :d="glint(g.cx1)" fill="none" stroke="#F1CF8C" stroke-width="2.2" stroke-linecap="round" />
          <path :d="glint(g.cx2)" fill="none" stroke="#F1CF8C" stroke-width="2.2" stroke-linecap="round" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
// Les deux verres : leur rayon (part de la largeur, au plus de la hauteur), l'écart de leurs centres (part du rayon :
// ils se chevauchent, en huit)
const LENS_W = 0.4;
const LENS_H = 0.31;
const GAP = 0.74;
// Le compas : un trait par degré (px), du cap du feu à celui de la tour
const COMPAS = { from: 12, to: 47, step: 6, span: [0, 90] };
// Les gouttes sur les verres : [verre (0, 1), x et y (part du rayon, depuis le centre), taille (px), départ et durée (s)]
const DROPS = [
  [0, -0.42, -0.36, 5.2, 0.4, 4.6], [0, 0.18, 0.44, 3.4, 1.7, 5.2], [0, -0.66, 0.2, 2.6, 2.9, 4.1], [0, 0.4, -0.58, 2.2, 0.9, 5.8],
  [1, 0.46, -0.3, 4.4, 1.1, 5], [1, -0.2, -0.62, 2.8, 2.3, 4.4], [1, 0.62, 0.28, 3, 0.2, 5.6], [1, -0.5, 0.06, 2, 3.4, 4.8]
];
let seq = 0;

export default {
  name: 'BinocularView',
  props: {
    // 'haut', 'net' ou 'bas'
    phase: { type: String, required: true },
    // Mouvement réduit : les verres, sans rien qui bouge
    still: { type: Boolean, default: false }
  },
  data() {
    return { COMPAS, uid: `jm${++seq}`, w: window.innerWidth, h: window.innerHeight };
  },
  computed: {
    box() {
      return `0 0 ${this.w} ${this.h}`;
    },
    g() {
      const { w, h } = this;
      const r = Math.min(w * LENS_W, h * LENS_H);
      const d = r * GAP;
      return { w, h, r, d, cx1: w / 2 - d, cx2: w / 2 + d, cy: h / 2, band: h / 2 + r * 0.6 };
    },
    // Les deux verres d'un seul trait : le huit qu'ils dessinent ensemble
    lenses() {
      const { r, d, cy, w } = this.g;
      const k = Math.sqrt(r * r - d * d);
      const x = w / 2;
      return `M${x},${cy - k} A${r},${r} 0 1 0 ${x},${cy + k} A${r},${r} 0 1 0 ${x},${cy - k} Z`;
    },
    ticks() {
      const { step, span } = COMPAS;
      const unit = this.g.r * 0.2;
      let path = '';
      for (let n = span[0]; n <= span[1]; n++) {
        const len = n % 10 === 0 ? unit * 0.42 : n % 5 === 0 ? unit * 0.28 : unit * 0.16;
        path += `M${n * step},${unit * 0.02} V${len}`;
      }
      return path;
    },
    numbers() {
      const out = [];
      for (let n = COMPAS.span[0]; n <= COMPAS.span[1]; n += 10) out.push(n);
      return out;
    },
    drops() {
      const { r, cx1, cx2, cy } = this.g;
      return DROPS.map(([lens, fx, fy, s, delay, dur]) => ({
        x: (lens ? cx2 : cx1) + fx * r,
        y: cy + fy * r,
        s,
        style: { '--jm-delay': `${delay}s`, '--jm-dur': `${dur}s`, '--jm-run': `${Math.round(12 + s * 6)}px` }
      }));
    }
  },
  mounted() {
    // (sa taille est celle de l'île, au-dessus de la barre d'onglets : la caméra vise son centre)
    const measure = () => {
      const { width, height } = this.$el.getBoundingClientRect();
      if (width && height) {
        this.w = width;
        this.h = height;
      }
    };
    measure();
    if (window.ResizeObserver) {
      this.observer = new ResizeObserver(measure);
      this.observer.observe(this.$el);
    }
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
  },
  methods: {
    // Le reflet de l'œilleton : un arc en haut à gauche, juste hors du verre
    cup(cx) {
      const { r, cy } = this.g;
      const at = a => `${cx + Math.cos(a) * (r + 7)},${cy + Math.sin(a) * (r + 7)}`;
      return `M${at(-2.75)} A${r + 7},${r + 7} 0 0 1 ${at(-1.6)}`;
    },
    // Le reflet du laiton : un arc en haut à gauche d'un verre
    glint(cx) {
      const { r, cy } = this.g;
      const at = a => `${cx + Math.cos(a) * (r - 4)},${cy + Math.sin(a) * (r - 4)}`;
      return `M${at(-2.55)} A${r - 4},${r - 4} 0 0 1 ${at(-1.85)}`;
    }
  }
};
</script>

<style scoped src="./BinocularView.css"></style>
