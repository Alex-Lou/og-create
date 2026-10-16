<template>
  <!-- Les cases d'une pièce de l'assemblage : du bois clair, cerclé de brun et d'or sur ses bords du dehors seulement (la
       pièce se lit d'un seul tenant), chacune avec son morceau du dessin de la création -->
  <span class="bits" aria-hidden="true">
    <span v-for="(bit, k) in bits" :key="k" class="bits__bit" :style="bitStyle(bit)">
      <span v-if="bit.home && art" class="bits__frag" :style="bit.deg ? { transform: `rotate(${bit.deg}deg)` } : null">
        <img :src="art" alt="" :style="artStyle(bit)" />
      </span>
    </span>
  </span>
</template>

<script>
import { turnKeep } from '@/world/crafts';

// Le sens de chaque bord (haut, droite, bas, gauche) pour son trait, une ombre portée vers l'intérieur
const INWARD = [[0, 1], [-1, 0], [0, -1], [1, 0]];

export default {
  name: 'PuzzleBits',
  props: {
    // Les cases de la pièce (serveur, non tournées) et son quart de tour
    cells: { type: Array, required: true },
    rot: { type: Number, default: 0 },
    // Sa place dans une solution ({ rot, cells }, crafts.homesOf), ou null : sans dessin
    home: { type: Object, default: null },
    // Taille d'une case (px), dessin de la création et sa place sur le gabarit (crafts.artFit : { x, y, w, h }, en cases)
    size: { type: Number, required: true },
    art: { type: String, default: '' },
    fit: { type: Object, required: true }
  },
  computed: {
    // Chaque case : sa place dans la pièce tournée, celle de son morceau du dessin, le quart de tour qui l'en sépare,
    // et ses bords du dehors (ceux qui ne touchent pas une autre case de la pièce)
    bits() {
      const cells = turnKeep(this.cells, this.rot);
      const has = new Set(cells.map(([x, y]) => `${x},${y}`));
      return cells.map(([cx, cy], j) => ({
        cx, cy,
        home: this.home ? this.home.cells[j] : null,
        deg: this.home ? ((((this.rot - this.home.rot) % 4) + 4) % 4) * 90 : 0,
        edges: [[0, -1], [1, 0], [0, 1], [-1, 0]].map(([dx, dy]) => !has.has(`${cx + dx},${cy + dy}`))
      }));
    }
  },
  methods: {
    bitStyle({ cx, cy, edges }) {
      const { size } = this;
      const w = size > 30 ? 2 : 1.5;
      const line = (width, color) => edges.map((on, k) => on && `inset ${INWARD[k][0] * width}px ${INWARD[k][1] * width}px 0 ${color}`).filter(Boolean);
      const [t, r, b, l] = edges;
      const round = `${Math.round(size * 0.2)}px`;
      const corner = on => (on ? round : '0');
      return {
        left: `${cx * size}px`, top: `${cy * size}px`, width: `${size}px`, height: `${size}px`,
        borderRadius: `${corner(t && l)} ${corner(t && r)} ${corner(b && r)} ${corner(b && l)}`,
        '--bits-edges': [...line(w, 'var(--bits-ink)'), ...line(w + 1.5, 'var(--bits-gilt)')].join(', ') || 'none'
      };
    },
    // Le dessin entier, à sa place sur le gabarit, décalé pour que la case montre son morceau
    artStyle({ home: [hx, hy] }) {
      const { size, fit } = this;
      return { width: `${fit.w * size}px`, height: `${fit.h * size}px`, left: `${(fit.x - hx) * size}px`, top: `${(fit.y - hy) * size}px` };
    }
  }
};
</script>

<style scoped src="./PuzzleBits.css"></style>
