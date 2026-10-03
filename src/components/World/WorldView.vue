<template>
  <section class="world" aria-label="Le Monde">
    <header class="world__head">
      <div>
        <span class="world__eyebrow">Ton île · {{ size }} × {{ size }}</span>
        <span class="world__title">Le Monde</span>
      </div>
      <button
        v-if="state"
        type="button"
        :class="['world__collect', { 'is-ready': state.pending > 0 }]"
        :disabled="!state.pending || busy"
        @click="collect"
      >
        <span class="world__coin" aria-hidden="true"></span>
        {{ state.pending > 0 ? `Récolter ${state.pending} écu${state.pending > 1 ? 's' : ''}` : 'Rien à récolter' }}
      </button>
    </header>

    <!-- Invité : l'île demande un compte (ses écus sont gardés par le serveur) -->
    <div v-if="guest" class="world__guest">
      <p class="world__guest-title">Ton île t’attend.</p>
      <p class="world__guest-text">Crée un compte pour y poser tes découvertes : elles y produiront des écus, même quand tu ne joues pas.</p>
      <button type="button" class="world__btn" @click="$emit('login')">Se connecter · créer un compte</button>
    </div>

    <div v-else ref="stage" class="world__stage">
      <canvas
        ref="canvas"
        class="world__canvas"
        role="img"
        :aria-label="canvasLabel"
        @pointerdown="onDown"
        @pointerup="onUp"
      ></canvas>
      <p v-if="loadError" class="world__error" role="alert">
        L’île ne répond pas.
        <button type="button" class="world__btn world__btn--small" @click="load">Réessayer</button>
      </p>
      <p v-else-if="moving" class="world__banner" role="status">
        Touche une case libre pour y poser {{ moving }}.
        <button type="button" class="world__link" @click="moving = null">Annuler</button>
      </p>
      <p v-else-if="state && !state.tiles.length" class="world__banner">Touche une case pour y poser une découverte.</p>

      <!-- Objet touché : déplacer ou retirer -->
      <div v-if="selected && !moving" class="world__menu" :style="menuStyle" role="dialog" :aria-label="`${selected.element}`">
        <span class="world__menu-name">{{ selected.element }}</span>
        <button type="button" class="world__menu-btn" @click="startMove">Déplacer</button>
        <button type="button" class="world__menu-btn world__menu-btn--quiet" @click="removeSelected">Retirer</button>
      </div>
    </div>

    <p v-if="state && !guest" class="world__note">
      Chaque objet produit {{ state.rate }} écu par heure, jusqu’à {{ state.rate * state.capHours }} écus en {{ state.capHours }} h. L’île grandit avec tes découvertes.
    </p>

    <!-- Choix de l'élément à poser -->
    <transition name="world-sheet">
      <div v-if="picking" class="world__sheet-backdrop" @click.self="picking = null">
        <div class="world__sheet" role="dialog" aria-label="Choisir un élément à poser">
          <div class="world__sheet-head">
            <span class="world__sheet-title">Poser sur l’île</span>
            <button type="button" class="world__link" @click="picking = null">Fermer</button>
          </div>
          <input v-model="query" class="world__search" type="search" :placeholder="`Chercher parmi ${available.length}…`" aria-label="Chercher un élément" />
          <div class="world__grid">
            <button
              v-for="name in pickList"
              :key="name"
              type="button"
              class="world__chip"
              :aria-label="`Poser ${name}`"
              @click="place(name, picking.x, picking.y)"
            >
              <span class="world__chip-glyph" aria-hidden="true"><ElementGlyph :glyph="elementEmojis[name]" /></span>
              <span class="world__chip-name">{{ name }}</span>
            </button>
            <p v-if="!pickList.length" class="world__empty">{{ available.length ? 'Aucun élément ne ressemble à cette recherche.' : 'Toutes tes découvertes sont déjà sur l’île.' }}</p>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import playService from '@/services/playService';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { search } from '@/utils/search';
import { glyph } from '@/book/painter';
import { burst, ring, buzz, center } from '@/book/fx';

const FRAME_MS = 33; // ~30 images/s : l'île respire, sans user la batterie

// Le Monde : l'île du joueur en isométrique, dessinée en Canvas 2D.
// L'état vient du serveur (objets posés, écus en attente) ; le dessin et la boucle d'animation
// sont non réactifs et s'arrêtent quand l'onglet est caché ou le composant démonté.
export default {
  name: 'WorldView',
  components: { ElementGlyph },
  props: {
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    isLoggedIn: { type: Boolean, default: false }
  },
  emits: ['coins-updated', 'show-alert', 'login'],
  data() {
    return {
      state: null,
      guest: false,
      loadError: false,
      busy: false,
      picking: null,
      selected: null,
      moving: null,
      query: '',
      menuPos: { x: 0, y: 0 }
    };
  },
  computed: {
    size() {
      return this.state ? this.state.size : 6;
    },
    placedNames() {
      return new Set(this.state ? this.state.tiles.map(t => t.element) : []);
    },
    available() {
      return [...this.discoveredElements].reverse().filter(name => !this.placedNames.has(name));
    },
    pickList() {
      return this.query.trim() ? search(this.available, this.query) : this.available;
    },
    menuStyle() {
      return { left: `${this.menuPos.x}px`, top: `${this.menuPos.y}px` };
    },
    canvasLabel() {
      if (!this.state) return 'Ton île';
      const names = this.state.tiles.map(t => t.element);
      return `Ton île de ${this.size} cases de côté${names.length ? `, avec ${names.join(', ')}` : ', encore vide'}.`;
    }
  },
  watch: {
    isLoggedIn() {
      this.load();
    }
  },
  created() {
    // Non réactifs : géométrie, horloge, animations de pose
    this.geo = null;
    this.raf = 0;
    this.lastFrame = 0;
    this.pops = new Map();
    this.down = null;
    this.ac = null;
    this.observer = null;
  },
  async mounted() {
    this.ac = new AbortController();
    document.addEventListener('visibilitychange', () => this.syncLoop(), { signal: this.ac.signal });
    await this.load();
  },
  beforeUnmount() {
    if (this.ac) this.ac.abort();
    if (this.observer) this.observer.disconnect();
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  },
  methods: {
    reduced() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    async load() {
      try {
        this.apply(await playService.world());
        this.guest = false;
        this.loadError = false;
      } catch (error) {
        if ([401, 402].includes(error.response?.status)) {
          this.guest = true;
          this.state = null;
          return;
        }
        console.error('Erreur lors du chargement de l’île:', error);
        this.loadError = true;
      }
    },
    apply(state) {
      this.state = state;
      this.$nextTick(() => {
        this.setup();
        this.draw(performance.now());
        this.syncLoop();
      });
    },
    // Taille du canvas et géométrie de l'île (recalculées au redimensionnement)
    setup() {
      const stage = this.$refs.stage;
      const canvas = this.$refs.canvas;
      if (!stage || !canvas) return;
      if (!this.observer) {
        this.observer = new ResizeObserver(() => {
          this.setup();
          this.draw(performance.now());
        });
        this.observer.observe(stage);
      }
      const width = stage.clientWidth;
      const height = Math.round(Math.min(width * 0.9, 520));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = `${height}px`;
      const n = this.size;
      const tw = Math.min((width * 0.8) / n, (height * 0.8) / (n * 0.5 + 0.9));
      const th = tw / 2;
      const depth = th * 0.95;
      const ox = width / 2;
      const oy = (height - (n * th + depth)) / 2 + th / 2;
      this.geo = { width, height, dpr, n, tw, th, depth, ox, oy };
    },
    tileCenter(x, y) {
      const { ox, oy, tw, th } = this.geo;
      return { x: ox + ((x - y) * tw) / 2, y: oy + ((x + y) * th) / 2 };
    },
    tileAt(px, py) {
      const { ox, oy, tw, th, n } = this.geo;
      const a = (px - ox) / (tw / 2);
      const b = (py - oy) / (th / 2);
      const x = Math.round((a + b) / 2);
      const y = Math.round((b - a) / 2);
      return x >= 0 && y >= 0 && x < n && y < n ? { x, y } : null;
    },
    objectAt(px, py) {
      if (!this.state) return null;
      const { tw } = this.geo;
      // Les objets se tiennent debout au-dessus de leur case : on teste leur silhouette, du plus proche au plus loin
      const sorted = [...this.state.tiles].sort((p, q) => (q.x + q.y) - (p.x + p.y));
      return sorted.find(tile => {
        const c = this.tileCenter(tile.x, tile.y);
        return Math.abs(px - c.x) < tw * 0.36 && py > c.y - tw * 0.85 && py < c.y + tw * 0.15;
      }) || null;
    },
    syncLoop() {
      const run = !document.hidden && !this.reduced() && this.state && !this.guest;
      if (run && !this.raf) this.raf = requestAnimationFrame(this.frame);
      if (!run && this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
    },
    frame(now) {
      this.raf = 0;
      if (now - this.lastFrame >= FRAME_MS) {
        this.lastFrame = now;
        this.draw(now);
      }
      this.syncLoop();
    },
    draw(now) {
      const canvas = this.$refs.canvas;
      if (!canvas || !this.geo || !this.state) return;
      const ctx = canvas.getContext('2d');
      const { width, height, dpr, n, tw, th, depth, ox, oy } = this.geo;
      const t = this.reduced() ? 0 : now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const midY = oy + ((n - 1) * th) / 2;
      // Lueur chaude derrière l'île
      let g = ctx.createRadialGradient(ox, midY, 0, ox, midY, width * 0.6);
      g.addColorStop(0, 'rgba(255, 220, 160, .16)');
      g.addColorStop(1, 'rgba(255, 220, 160, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      // Eau et ronds qui s'éloignent
      // L'eau reste dans le cadre : on garde ses proportions en la plafonnant à la largeur
      const fit = Math.min(1, (width * 0.49) / (n * tw * 0.66));
      const rx = n * tw * 0.66 * fit, ry = n * th * 0.78 * fit;
      const wy = midY + depth * 0.6;
      g = ctx.createRadialGradient(ox, wy, rx * 0.2, ox, wy, rx);
      g.addColorStop(0, '#8FD3EE');
      g.addColorStop(0.75, '#5DAAD8');
      g.addColorStop(1, 'rgba(93, 170, 216, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(ox, wy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let k = 0; k < 3; k++) {
        const phase = ((t * 0.22 + k / 3) % 1);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * (1 - phase)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(ox, wy, rx * (0.62 + phase * 0.34), ry * (0.62 + phase * 0.34), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Falaises (faces avant de l'île)
      const side = (x0, y0, x1, y1, color) => {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1, y1 + depth);
        ctx.lineTo(x0, y0 + depth);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      for (let i = 0; i < n; i++) {
        const left = this.tileCenter(i, n - 1);
        side(left.x - tw / 2, left.y, left.x, left.y + th / 2, i % 2 ? '#9C6A3A' : '#A87444');
        const right = this.tileCenter(n - 1, i);
        side(right.x, right.y + th / 2, right.x + tw / 2, right.y, i % 2 ? '#7E5229' : '#875A2F');
      }
      ctx.strokeStyle = 'rgba(60, 35, 15, .25)';
      ctx.lineWidth = 1;
      const front = this.tileCenter(n - 1, n - 1);
      const leftTip = this.tileCenter(0, n - 1);
      const rightTip = this.tileCenter(n - 1, 0);
      for (const f of [0.4, 0.72]) {
        ctx.beginPath();
        ctx.moveTo(leftTip.x - tw / 2, leftTip.y + depth * f);
        ctx.lineTo(front.x, front.y + th / 2 + depth * f);
        ctx.lineTo(rightTip.x + tw / 2, rightTip.y + depth * f);
        ctx.stroke();
      }
      // Cases d'herbe
      const occupied = new Set(this.state.tiles.map(tile => `${tile.x},${tile.y}`));
      for (let s = 0; s <= 2 * (n - 1); s++) {
        for (let x = 0; x < n; x++) {
          const y = s - x;
          if (y < 0 || y >= n) continue;
          const c = this.tileCenter(x, y);
          ctx.beginPath();
          ctx.moveTo(c.x, c.y - th / 2);
          ctx.lineTo(c.x + tw / 2, c.y);
          ctx.lineTo(c.x, c.y + th / 2);
          ctx.lineTo(c.x - tw / 2, c.y);
          ctx.closePath();
          ctx.fillStyle = (x + y) % 2 ? '#93CE70' : '#9ED67B';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, .18)';
          ctx.lineWidth = 1;
          ctx.stroke();
          const free = !occupied.has(`${x},${y}`);
          if (this.moving && free) {
            ctx.setLineDash([4, 3]);
            ctx.strokeStyle = 'rgba(255, 250, 220, .9)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
          }
          if ((this.selected && this.selected.x === x && this.selected.y === y) || (this.picking && this.picking.x === x && this.picking.y === y)) {
            ctx.strokeStyle = '#F2C04B';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }
        }
      }
      // Objets, du plus loin au plus proche
      const objects = [...this.state.tiles].sort((p, q) => (p.x + p.y) - (q.x + q.y));
      for (const tile of objects) {
        const c = this.tileCenter(tile.x, tile.y);
        const started = this.pops.get(tile.element);
        let scale = 1;
        if (started) {
          const k = Math.min(1, (now - started) / 450);
          const s = 1.7;
          scale = 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
          if (k >= 1) this.pops.delete(tile.element);
        }
        const bob = Math.sin(t * 1.6 + tile.x * 0.8 + tile.y * 1.3) * tw * 0.025;
        // Ombre, socle et objet
        ctx.fillStyle = 'rgba(40, 60, 20, .28)';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y + th * 0.08, tw * 0.3, th * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#E8DCC2';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, tw * 0.22, th * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FBF6EA';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y - th * 0.08, tw * 0.22, th * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        const size = tw * 0.58 * scale;
        glyph(ctx, tile.emoji, c.x, c.y - tw * 0.36 + bob, size, () => this.draw(performance.now()));
        // Écus prêts : une étincelle dorée scintille au-dessus des objets
        if (this.state.pending > 0 && !this.reduced()) {
          const tw2 = (Math.sin(t * 3 + tile.x * 2 + tile.y) + 1) / 2;
          ctx.fillStyle = `rgba(255, 214, 110, ${0.35 + tw2 * 0.6})`;
          ctx.beginPath();
          ctx.arc(c.x + tw * 0.2, c.y - tw * 0.72 + bob, 2 + tw2 * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    point(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    },
    onDown(event) {
      this.down = this.point(event);
    },
    onUp(event) {
      if (!this.down || !this.state || this.busy) return;
      const p = this.point(event);
      const moved = Math.hypot(p.x - this.down.x, p.y - this.down.y);
      this.down = null;
      if (moved > 12) return;
      const object = this.moving ? null : this.objectAt(p.x, p.y);
      const tile = object ? { x: object.x, y: object.y } : this.tileAt(p.x, p.y);
      if (!tile) {
        this.selected = null;
        this.draw(performance.now());
        return;
      }
      const there = this.state.tiles.find(t => t.x === tile.x && t.y === tile.y);
      if (this.moving) {
        if (there) {
          this.$emit('show-alert', 'Cette case est déjà occupée.');
          return;
        }
        const name = this.moving;
        this.moving = null;
        this.place(name, tile.x, tile.y);
        return;
      }
      if (there) {
        const c = this.tileCenter(there.x, there.y);
        this.menuPos = { x: Math.max(70, Math.min(this.geo.width - 70, c.x)), y: Math.max(8, c.y - this.geo.tw * 1.05) };
        this.selected = there;
        buzz(6);
      } else {
        this.selected = null;
        this.query = '';
        this.picking = tile;
      }
      this.draw(performance.now());
    },
    screenOf(x, y) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const c = this.tileCenter(x, y);
      return { left: rect.left + c.x - 30, top: rect.top + c.y - this.geo.tw * 0.5, width: 60, height: 60 };
    },
    async place(name, x, y) {
      this.picking = null;
      this.busy = true;
      try {
        this.pops.set(name, performance.now());
        this.apply(await playService.worldPlace(name, x, y));
        this.$nextTick(() => {
          const at = center(this.screenOf(x, y));
          burst(at, 14, 50);
          buzz([10, 30, 10]);
        });
      } catch (error) {
        this.pops.delete(name);
        this.$emit('show-alert', error.response?.data?.message || 'L’objet n’a pas pu être posé.');
      } finally {
        this.busy = false;
      }
    },
    startMove() {
      this.moving = this.selected.element;
      this.selected = null;
      this.draw(performance.now());
    },
    async removeSelected() {
      const tile = this.selected;
      this.selected = null;
      this.busy = true;
      try {
        this.apply(await playService.worldRemove(tile.x, tile.y));
      } catch (error) {
        this.$emit('show-alert', error.response?.data?.message || 'L’objet n’a pas pu être retiré.');
      } finally {
        this.busy = false;
      }
    },
    async collect(event) {
      const button = event.currentTarget;
      this.busy = true;
      try {
        const { gained, coins, world } = await playService.worldCollect();
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (gained > 0) {
          const at = center(button.getBoundingClientRect());
          ring(at, 90);
          burst(at, 20, 70);
          buzz([12, 40, 18]);
          this.$emit('show-alert', `+${gained} écu${gained > 1 ? 's' : ''} récoltés sur ton île.`);
        }
      } catch (error) {
        this.$emit('show-alert', error.response?.data?.message || 'La récolte n’a pas pu se faire.');
      } finally {
        this.busy = false;
      }
    }
  }
};
</script>

<style scoped>
.world { position: relative; }
.world__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; padding: 4px 2px 10px; }
.world__eyebrow { display: block; font-family: var(--oc-font-mono, monospace); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--oc-text-faint); }
.world__title { display: block; font-family: var(--oc-font-display); font-size: 22px; line-height: 1.1; color: var(--oc-text); }
.world__collect {
  flex: none; display: inline-flex; align-items: center; gap: 8px;
  min-height: 40px; padding: 6px 14px;
  border: 1px solid rgba(224, 182, 84, .3); border-radius: 999px;
  background: rgba(224, 182, 84, .08); color: var(--oc-text-faint);
  font-family: Nunito, system-ui, sans-serif; font-weight: 800; font-size: 14px;
  cursor: pointer;
}
.world__collect.is-ready { background: #F5C344; border-color: #F5C344; color: #4A3426; box-shadow: 0 4px 0 #B8872A; animation: world-glow 2s ease-in-out infinite; }
.world__collect:disabled { cursor: default; }
@keyframes world-glow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
.world__coin { width: 16px; height: 16px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFE7A0, #E9AE2E 70%); box-shadow: inset 0 0 0 1.5px rgba(59, 42, 32, .5); }
.world__stage { position: relative; }
.world__canvas { display: block; width: 100%; touch-action: manipulation; cursor: pointer; }
.world__banner, .world__error {
  position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%);
  max-width: 92%; margin: 0; padding: 8px 14px; border-radius: 14px;
  background: rgba(30, 22, 16, .82); color: #F6EEDD;
  font-family: Nunito, system-ui, sans-serif; font-size: 13px; font-weight: 700; text-align: center;
}
.world__link { margin-left: 6px; border: 0; background: none; color: #F2C04B; font: inherit; font-weight: 900; cursor: pointer; text-decoration: underline; }
.world__menu {
  position: absolute; transform: translate(-50%, -100%);
  display: flex; align-items: center; gap: 6px;
  padding: 6px 8px; border-radius: 16px;
  background: #FBF6EA; color: #4A3426;
  box-shadow: 0 10px 26px rgba(0, 0, 0, .45);
  font-family: Nunito, system-ui, sans-serif;
  z-index: 2;
}
.world__menu-name { font-weight: 900; font-size: 13px; padding: 0 4px; white-space: nowrap; }
.world__menu-btn { min-height: 34px; padding: 4px 12px; border: 0; border-radius: 999px; background: #4A3426; color: #FFFDF8; font: inherit; font-weight: 800; font-size: 13px; cursor: pointer; }
.world__menu-btn--quiet { background: #EFE5D0; color: #8A7262; }
.world__note { margin: 8px 2px 0; color: var(--oc-text-faint); font-size: 13px; font-style: italic; }
.world__guest { padding: 28px 20px; border-radius: 22px; background: #FBF6EA; color: #4A3426; text-align: center; font-family: Nunito, system-ui, sans-serif; }
.world__guest-title { margin: 0; font-family: Fraunces, Georgia, serif; font-size: 26px; font-weight: 700; }
.world__guest-text { margin: 10px 0 18px; color: #8A7262; }
.world__btn { min-height: 46px; padding: 10px 22px; border: 0; border-radius: 999px; background: #4A3426; color: #FFFDF8; font-family: Nunito, system-ui, sans-serif; font-weight: 900; font-size: 15px; cursor: pointer; }
.world__btn--small { min-height: 32px; padding: 4px 12px; font-size: 13px; margin-left: 6px; }

.world__sheet-backdrop { position: fixed; inset: 0; z-index: 70; background: rgba(10, 8, 6, .55); display: flex; align-items: flex-end; justify-content: center; }
.world__sheet {
  width: min(100%, 560px); max-height: 70dvh; display: flex; flex-direction: column;
  padding: 14px 14px calc(14px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0; background: #FBF6EA; color: #4A3426;
  font-family: Nunito, system-ui, sans-serif;
}
.world__sheet-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.world__sheet-title { font-family: Fraunces, Georgia, serif; font-size: 20px; font-weight: 700; }
.world__sheet .world__link { color: #8A5A1C; }
.world__search { width: 100%; padding: 8px 12px; border-radius: 12px; border: 1px solid #E3D6BC; background: #FFFDF8; color: #4A3426; font: inherit; font-size: 15px; }
.world__grid { margin-top: 10px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 8px; padding-bottom: 6px; }
.world__chip { display: flex; flex-direction: column; align-items: center; gap: 3px; min-height: 72px; padding: 8px 3px 6px; border: 0; border-radius: 16px; background: #FFFDF8; box-shadow: 0 3px 0 rgba(74, 52, 38, .12), inset 0 0 0 1px rgba(74, 52, 38, .06); cursor: pointer; }
.world__chip:active { transform: scale(.94); }
.world__chip-glyph { font-size: 28px; line-height: 1; }
.world__chip-name { font-size: 11px; font-weight: 800; color: #8A7262; max-width: 66px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.world__empty { grid-column: 1 / -1; color: #8A7262; font-style: italic; text-align: center; }
.world-sheet-enter-active, .world-sheet-leave-active { transition: opacity .25s ease; }
.world-sheet-enter-active .world__sheet, .world-sheet-leave-active .world__sheet { transition: transform .3s cubic-bezier(.3, 1.2, .5, 1); }
.world-sheet-enter-from, .world-sheet-leave-to { opacity: 0; }
.world-sheet-enter-from .world__sheet, .world-sheet-leave-to .world__sheet { transform: translateY(100%); }
@media (prefers-reduced-motion: reduce) {
  .world__collect.is-ready { animation: none; }
}
</style>
