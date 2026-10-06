// Le Grimoire : les pages. Du Livre calculé par le serveur aux modèles que le moteur peint (sommaire, titres de
// chapitre, tables, pages inscrites ou à portée). Mixin de BookView.vue : ses méthodes s'ajoutent à celles du Livre.

// Pages par feuille de table de chapitre (deux colonnes de 8)
const INDEX_SIZE = 16;

export default {
  methods: {
    chapterOfKey(key) {
      const model = this.models.find(m => m.key === key);
      return model && model.chapter ? model.chapter.id : null;
    },
    buildModels(data) {
      const chapterIndex = {};
      const models = [{ type: 'toc', key: 'toc', chapters: data.chapters, chapterIndex }];
      for (const chapter of data.chapters) {
        chapterIndex[chapter.id] = models.length;
        models.push({ type: 'chapter', key: `ch-${chapter.id}`, chapter });
        // Chapitre scellé : seule la page marquée du fil d'Ariane s'y ouvre
        if (!chapter.open) {
          chapter.pages.filter(page => page.marked).forEach(page => models.push(this.reachModel(chapter, page)));
          continue;
        }
        // Table du chapitre, sur autant de feuilles qu'il faut : pages à trouver d'abord, puis inscrites
        const listed = [...chapter.pages.filter(p => p.status !== 'found'), ...chapter.pages.filter(p => p.status === 'found')];
        const parts = Math.ceil(listed.length / INDEX_SIZE);
        for (let part = 0; part < parts; part++) {
          const entries = listed.slice(part * INDEX_SIZE, (part + 1) * INDEX_SIZE).map(page => ({ key: page.id, page, index: -1 }));
          models.push({ type: 'index', key: `idx-${chapter.id}-${part + 1}`, chapter, entries, part: part + 1, parts });
        }
        for (const page of chapter.pages) {
          models.push(page.status === 'found'
            ? { type: 'found', key: page.id, chapter, page }
            : this.reachModel(chapter, page));
        }
        if (chapter.far || chapter.sealed) models.push({ type: 'far', key: `far-${chapter.id}`, chapter, count: chapter.far, waiting: chapter.sealed || 0 });
      }
      // Chaque case d'une table connaît la page où elle mène
      const at = new Map(models.map((model, index) => [model.key, index]));
      models.forEach(model => {
        if (model.type === 'index') model.entries.forEach(entry => { entry.index = at.get(entry.key) ?? -1; });
      });
      return models;
    },
    reachModel(chapter, page) {
      const aim = this.aims[page.id] || null;
      const need = page.freeInkAfter;
      const freeInk = Boolean(aim && aim.freeInk) || (need > 0 && page.misses >= need);
      // Ingrédient révélé par l'Encre : retenu par le serveur (ink) ; l'appareil garde les achats d'avant
      const revealed = page.ink || this.revealed[page.id] || null;
      // Un premier essai sur la page (compté par le serveur, ou fait pendant la session) dévoile les familles
      const tried = Boolean(aim) || page.misses > 0;
      // Ce qu'un maître a soufflé sur la page : { who, ingredient } ou { who, family }
      const whisper = this.savoirs[page.id] || null;
      return { type: 'reach', key: page.id, chapter, page, revealed, aim, freeInk, tried, whisper };
    }
  }
};
