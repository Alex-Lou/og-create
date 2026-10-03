<template>
  <button
    type="button"
    :class="['star', { 'star--hover': hover, 'star--drag': dragging, 'star--picked': picked }]"
    :style="{ transform, '--c': color }"
    :aria-label="name"
    @pointerdown="$emit('down', $event, name)"
    @click="onClick"
    @contextmenu.prevent
  >
    <span :key="pulseKey" :class="['star__body', pulseClass]">
      <span class="star__ink" aria-hidden="true"><ElementGlyph :glyph="glyph" /></span>
    </span>
    <span class="star__name">{{ name }}</span>
  </button>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph.vue';

// Une étoile du ciel. Sa position vit dans `pos` (objet partagé) : la déplacer ne redessine qu'elle
export default {
  name: 'SkyStar',
  components: { ElementGlyph },
  props: {
    name: { type: String, required: true },
    glyph: { type: String, default: '' },
    color: { type: String, default: 'rgb(233, 223, 200)' },
    // { x, y, px, py } : place de l'étoile et attraction vers une cible pendant un glissé
    pos: { type: Object, required: true },
    hover: { type: Boolean, default: false },
    dragging: { type: Boolean, default: false },
    picked: { type: Boolean, default: false },
    // { kind: 'born' | 'echo' | 'shake', n } : animation à rejouer
    pulse: { type: Object, default: null }
  },
  emits: ['down', 'key'],
  computed: {
    transform() {
      const x = this.pos.x + (this.pos.px || 0) - 32;
      const y = this.pos.y + (this.pos.py || 0) - 32;
      const scale = this.dragging || this.hover ? 1.2 : 1;
      return `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale})`;
    },
    pulseKey() {
      return this.pulse ? `${this.pulse.kind}-${this.pulse.n}` : 'calme';
    },
    pulseClass() {
      return this.pulse ? `star__body--${this.pulse.kind}` : '';
    }
  },
  methods: {
    // Le doigt et la souris passent par pointerdown/pointerup (gérés par le ciel) ; le clavier par click
    onClick(event) {
      if (event.detail === 0) this.$emit('key', this.name);
    }
  }
};
</script>

<style scoped>
.star {
  appearance: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 64px;
  height: 64px;
  padding: 0;
  border: 0;
  background: none;
  cursor: grab;
  touch-action: none;
  will-change: transform;
  transition: transform 0.5s cubic-bezier(0.34, 1.45, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
}
.star--drag { cursor: grabbing; z-index: 6; transition: transform 0.06s linear; }
.star--hover { z-index: 5; }
.star:focus-visible { outline: 2px solid var(--oc-gold); outline-offset: 4px; border-radius: 50%; }
.star__body {
  position: absolute;
  inset: 2px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #13111b;
  box-shadow: 0 0 0 1.5px var(--c), 0 0 22px color-mix(in srgb, var(--c) 45%, transparent);
  transition: box-shadow 0.2s;
}
.star__ink { font-size: 30px; line-height: 1; }
.star--hover .star__body { box-shadow: 0 0 0 3px var(--oc-gold-strong), 0 0 48px var(--oc-gold-strong); }
.star--picked .star__body { animation: picked 1.3s infinite; }
.star__body--born { animation: born 0.95s cubic-bezier(0.2, 0.8, 0.2, 1); }
.star__body--echo { animation: echo 0.6s ease-out; }
.star__body--shake { animation: shake 0.45s ease-out; }
/* Le nom garde la même taille à l'écran quel que soit le zoom (--inv = 1 / zoom, posé par le ciel) */
.star__name {
  position: absolute;
  top: 66px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: calc(13px * var(--inv, 1));
  color: var(--oc-text-strong);
  text-shadow: 0 0 calc(6px * var(--inv, 1)) #07060a, 0 0 calc(3px * var(--inv, 1)) #07060a;
  pointer-events: none;
  opacity: var(--names, 1);
  transition: opacity 0.3s;
}
@keyframes born {
  0% { transform: scale(0) rotate(-40deg); }
  55% { transform: scale(1.45) rotate(8deg); }
  100% { transform: none; }
}
@keyframes echo {
  40% { transform: scale(1.3); }
}
@keyframes shake {
  20% { transform: translateX(-9px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(4px); }
}
@keyframes picked {
  0%, 100% { box-shadow: 0 0 0 2px var(--oc-gold), 0 0 22px rgba(224, 182, 84, 0.7); }
  50% { box-shadow: 0 0 0 3px var(--oc-gold-strong), 0 0 46px rgba(240, 212, 136, 1); }
}
@media (prefers-reduced-motion: reduce) {
  .star, .star__body, .star__name { transition: none; }
  .star__body--born, .star__body--echo, .star__body--shake, .star--picked .star__body { animation: none; }
}
</style>
