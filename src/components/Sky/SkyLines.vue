<template>
  <svg class="lines" :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true">
    <line
      v-for="l in lines"
      :key="l.key"
      :x1="l.x1"
      :y1="l.y1"
      :x2="l.x2"
      :y2="l.y2"
      :stroke="l.color"
      class="lines__trait"
    />
    <template v-if="tether">
      <line :x1="tether.x" :y1="tether.y" :x2="tetherEnd.x" :y2="tetherEnd.y" class="lines__fil" />
      <circle :cx="tether.x" :cy="tether.y" r="30" :class="['lines__trace', { 'is-target': tether.self }]" />
    </template>
  </svg>
</template>

<script>
// Traits des constellations et fil du glissé. Lit les positions partagées : seul ce calque suit le doigt
export default {
  name: 'SkyLines',
  props: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    // [{ key, color, found: [noms] }]
    families: { type: Array, required: true },
    positions: { type: Object, required: true },
    // Glissé en cours : { name, x, y (place d'origine), self (retour sur sa trace) } ou null
    tether: { type: Object, default: null }
  },
  computed: {
    lines() {
      const out = [];
      this.families.forEach(f => {
        for (let i = 1; i < f.found.length; i++) {
          const p = this.positions[f.found[i - 1]];
          const q = this.positions[f.found[i]];
          if (p && q) out.push({ key: `${f.key}-${i}`, x1: p.x, y1: p.y, x2: q.x, y2: q.y, color: f.color });
        }
      });
      return out;
    },
    tetherEnd() {
      const p = this.tether && this.positions[this.tether.name];
      return p ? { x: p.x + (p.px || 0), y: p.y + (p.py || 0) } : { x: 0, y: 0 };
    }
  }
};
</script>

<style scoped>
.lines { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.lines__trait { stroke-width: calc(1.6px * var(--inv-line, 1)); stroke-opacity: 0.42; stroke-linecap: round; }
.lines__fil {
  stroke: var(--oc-gold-strong);
  stroke-width: calc(2px * var(--inv-line, 1));
  stroke-dasharray: calc(6px * var(--inv-line, 1)) calc(7px * var(--inv-line, 1));
  stroke-opacity: 0.8;
  stroke-linecap: round;
}
.lines__trace {
  fill: rgba(240, 212, 136, 0.06);
  stroke: var(--oc-gold-strong);
  stroke-width: calc(2px * var(--inv-line, 1));
  stroke-dasharray: calc(6px * var(--inv-line, 1)) calc(7px * var(--inv-line, 1));
}
.lines__trace.is-target { fill: rgba(240, 212, 136, 0.28); animation: glow 0.8s infinite; }
@keyframes glow { 50% { opacity: 0.55; } }
</style>
