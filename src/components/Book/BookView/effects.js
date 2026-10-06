// Le Grimoire : les effets d'une découverte (l'éclat des sigles, la puce de chapitre qui salue, l'ouverture d'un
// chapitre), joués une fois la révélation de l'Athanor refermée. Mixin de BookView.vue : ses méthodes s'ajoutent à
// celles du Livre.

import { burst, ring, vibrate, center } from '@/utils/fx';
import { unlockCinematic } from '@/book/fx';
import { CHAPTER_STYLE } from '@/book/painter';
import { guide } from '@/game/guide';

export default {
  methods: {
    // Ce qui a changé depuis le dernier chargement : page inscrite, chapitre ouvert
    queueEffects(previous, data, previousKey) {
      const before = new Map(previous.chapters.flatMap(c => c.pages).map(p => [p.id, p.status]));
      const opened = data.chapters.filter(c => c.open && !previous.chapters.find(p => p.id === c.id)?.open);
      for (const chapter of data.chapters) {
        for (const page of chapter.pages) {
          if (page.status !== 'found' || before.get(page.id) === 'found') continue;
          this.pendingEffects.push({ kind: page.id === previousKey ? 'inscribed-here' : 'inscribed', chapter: chapter.id, name: page.name });
        }
      }
      for (const chapter of opened) this.pendingEffects.push({ kind: 'opened', chapter: chapter.id, name: chapter.name });
      if (!this.revealing) this.flushEffects();
    },
    async flushEffects() {
      const effects = this.pendingEffects.splice(0);
      for (const effect of effects) {
        if (effect.kind === 'inscribed-here' || effect.kind === 'inscribed') this.runeFlash++;
        if (effect.kind === 'inscribed-here') {
          const rect = this.engine && this.engine.rectOf('vignette');
          if (rect) {
            ring(center(rect), rect.width * 1.5);
            burst(center(rect), 22, rect.width * 1.1);
          }
          vibrate([12, 40, 18]);
        } else if (effect.kind === 'inscribed') {
          // Page inscrite ailleurs : la puce de chapitre salue la découverte
          const chip = this.$refs.chapterChip;
          if (chip) {
            chip.classList.remove('is-ping');
            void chip.offsetWidth;
            chip.classList.add('is-ping');
            burst(center(chip.getBoundingClientRect()), 10, 36);
          }
        } else if (effect.kind === 'opened') {
          await unlockCinematic({ id: effect.chapter, name: effect.name }, CHAPTER_STYLE[effect.chapter].wax);
          guide.tip(`chapter-${effect.chapter}`);
          const index = this.chapterState.find(c => c.id === effect.chapter)?.index;
          if (this.engine && index > 0) await this.engine.go(index);
        }
      }
    }
  }
};
