<template>
  <div class="annexes">
    <p v-if="site.level < 2" class="annexes__note">Les annexes s’ouvrent au palier II de ce bâtiment.</p>
    <p v-else class="annexes__note">
      Pose-les toi-même autour du bâtiment, sur une case libre de son quartier, à deux cases au plus. Elles travaillent dès
      leur pose, et se déplacent gratuitement.
    </p>
    <ul class="annexes__list">
      <li v-for="annex in site.annexes" :key="annex.id" :class="['annexes__card', `is-${stateOf(annex).state}`]">
        <span class="annexes__art">
          <img :src="artOf(annex)" alt="" />
          <span class="annexes__palier" :aria-label="`Palier ${roman(annex.levels[0])}`">{{ roman(annex.levels[0]) }}</span>
          <span v-if="annex.built" class="annexes__badge">{{ annex.max > 1 ? `${annex.built}/${annex.max}` : '✓' }}</span>
        </span>
        <span class="annexes__body">
          <span class="annexes__kind">{{ KIND_LABEL[annex.kind] }}<template v-if="annex.max > 1"> · jusqu’à {{ annex.max }} (paliers {{ annex.levels.map(roman).join(', ') }})</template></span>
          <span class="annexes__name">{{ annex.name }}</span>
          <span class="annexes__effect">{{ annex.effect }}</span>
          <ul v-if="annex.next" class="annexes__cost" :aria-label="`Coût : ${costLabel(annex)}`">
            <li v-for="(n, r) in annex.next.cost" :key="r" :class="{ 'is-missing': (stock[r] || 0) < n }">
              <ElementGlyph :glyph="GLYPH[r]" /> {{ n }}
            </li>
            <li v-for="(n, f) in annex.next.finds || {}" :key="f" :class="{ 'is-missing': (stock[f] || 0) < n }">
              <ElementGlyph :glyph="FIND_GLYPH[f]" /> {{ n }}
            </li>
            <li :class="{ 'is-missing': coins !== null && coins < annex.next.coins }"><ElementGlyph glyph="ui:coin" /> {{ annex.next.coins }}</li>
          </ul>
        </span>
        <button
          v-if="annex.next"
          type="button"
          :class="['annexes__btn', { 'is-off': stateOf(annex).state !== 'ready' }]"
          :disabled="busy || stateOf(annex).state !== 'ready'"
          :aria-label="stateOf(annex).state === 'ready' ? `Poser ${annex.name}` : `${annex.name} : ${stateOf(annex).text}`"
          @click="$emit('place', annex)"
        >{{ stateOf(annex).text }}</button>
        <span v-else class="annexes__done">Sur ton île</span>
      </li>
    </ul>
  </div>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import { GLYPH, LABEL } from '@/game/resources';
import { roman } from '@/utils/roman';
import { spriteUrl } from '@/world/spriteCache';
import { annexThumb } from '@/world/annexSprites';
import { annexState, KIND_LABEL } from '@/world/annexes';
import { FIND_GLYPH } from '@/world/finds';

// Onglet « Annexes » de la fiche d'un bâtiment : ses trois annexes, ce qu'elles font, ce qu'elles coûtent, et le bouton
// qui lance la pose sur l'île (le choix de la case se fait sur la carte)
export default {
  name: 'AnnexPanel',
  components: { ElementGlyph },
  props: {
    site: { type: Object, required: true },
    // Ressources et trouvailles de climat
    stock: { type: Object, required: true },
    // Solde connu, ou null (le serveur tranchera)
    coins: { type: Number, default: null },
    busy: { type: Boolean, default: false }
  },
  emits: ['place'],
  data() {
    return { GLYPH, KIND_LABEL, FIND_GLYPH };
  },
  methods: {
    roman,
    stateOf(annex) {
      return annexState(annex, this.site, this.stock, this.coins);
    },
    // Vignette : l'exemplaire suivant (ce qui y poussera), ou le premier si tout est posé
    artOf(annex) {
      const variant = annex.next && annex.max > 1 ? annex.built : 0;
      return spriteUrl(`annex-thumb-${annex.id}-${variant}`, () => annexThumb(annex.id, variant));
    },
    costLabel(annex) {
      return [...Object.entries(annex.next.cost).map(([r, n]) => `${n} ${LABEL[r]}`), ...Object.entries(annex.next.finds || {}).map(([f, n]) => `${n} ${f}`), `${annex.next.coins} écus`].join(', ');
    }
  }
};
</script>

<style scoped>
.annexes { display: flex; flex-direction: column; gap: 10px; }
.annexes__note { margin: 0; padding: 8px 12px; border-radius: 12px; background: var(--vellum-200); font-weight: 700; font-size: 13px; line-height: 1.4; }
.annexes__list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.annexes__card {
  display: grid; grid-template-columns: 84px minmax(0, 1fr); grid-template-rows: auto auto; gap: 6px 10px; align-items: center;
  padding: 8px; border-radius: 16px; background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .1);
}
.annexes__card.is-ready { box-shadow: inset 0 0 0 2px var(--gold-400); }
.annexes__art {
  grid-row: 1 / span 2; position: relative; display: grid; place-items: center; height: 92px; border-radius: 12px;
  background: radial-gradient(circle at 50% 72%, #CFE8B8, var(--vellum-200) 72%);
}
.annexes__art img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 6px; box-sizing: border-box; object-fit: contain; }
.annexes__card.is-locked .annexes__art img { filter: grayscale(.7) opacity(.6); }
.annexes__palier {
  position: absolute; top: 5px; left: 5px; min-width: 22px; padding: 1px 6px; border-radius: 999px;
  background: var(--ink-900); color: var(--gold-300); font-family: var(--font-display); font-weight: 700; font-size: 12px; text-align: center;
}
.annexes__card.is-locked .annexes__palier { background: var(--vellum-300); color: var(--ink-700); }
.annexes__badge { position: absolute; top: 5px; right: 5px; padding: 1px 7px; border-radius: 999px; background: #4E8A3A; color: #FFFFFF; font-size: 11px; font-weight: 900; }
.annexes__body { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.annexes__kind { color: var(--ink-500); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .03em; }
.annexes__name { font-family: var(--font-display); font-weight: 700; font-size: 17px; line-height: 1.15; }
.annexes__effect { color: var(--ink-700); font-size: 13px; font-weight: 700; line-height: 1.3; }
.annexes__cost { margin: 4px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 4px 10px; font-size: 13px; font-weight: 900; color: #4E8A3A; }
.annexes__cost li { display: inline-flex; align-items: center; gap: 3px; }
.annexes__cost li.is-missing { color: #B0503A; }
.annexes__btn {
  justify-self: end; min-height: 40px; min-width: 96px; padding: 6px 14px; border: 0; border-radius: 999px;
  background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 14px;
  cursor: pointer; touch-action: manipulation;
}
.annexes__btn.is-off, .annexes__btn:disabled { background: var(--vellum-300); color: var(--ink-500); cursor: default; font-size: 12px; }
.annexes__done { justify-self: end; color: #4E8A3A; font-size: 13px; font-weight: 900; }
</style>
