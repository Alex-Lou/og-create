// L'île : ses bâtiments. Bâtir et faire évoluer, la boutique d'un atelier (achat, annulation, fiche et mode d'emploi
// d'un article), l'apparence portée, le nom, le ramassage de la production. Mixin de WorldView.vue : ses données et
// méthodes s'ajoutent à celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { guideOf, guideKind } from '@/world/itemGuide';
import { vibrate, center } from '@/utils/fx';
import { RESOURCES } from '@/game/resources';
import { itemArt, itemLock, itemBuyable } from '@/world/shop';
import { levelAffordable, levelReady } from '@/world/levels';
import { roman } from '@/utils/roman';
import { guide } from '@/game/guide';
import { FAILED, TOASTS } from '@/texts/world/screens/alerts';

// Achat en un toucher : « Annuler » reste proposé 4 s (le serveur accepte l'annulation un peu plus longtemps)
const UNDO_MS = 4000;
// Sortes d'articles dont le mode d'emploi a déjà été montré (une fois par sorte, sur cet appareil)
const GUIDES_KEY = 'oc_item_guides';
function guidesSeen() {
  try {
    return JSON.parse(localStorage.getItem(GUIDES_KEY) || '[]');
  } catch (error) {
    return [];
  }
}
const guideSeen = kind => guidesSeen().includes(kind);
function markGuideSeen(kind) {
  try {
    localStorage.setItem(GUIDES_KEY, JSON.stringify([...new Set([...guidesSeen(), kind])]));
  } catch (error) {
    // Stockage indisponible : le mode d'emploi reviendra au prochain achat
  }
}

export default {
  data() {
    return {
      site: null,
      // Onglet de la fiche d'un bâtiment : aperçu ou évolution
      siteTab: 'overview',
      // Dernier achat de la boutique, encore annulable : { id, name }
      undoable: null,
      // Article de la boutique dont la fiche est ouverte (id, dans la boutique du bâtiment ouvert)
      // Fiche d'un article ouverte : { siteId, itemId } ; mode d'emploi après un premier achat (même forme)
      sheet: null,
      guide: null,
      // Bâtiment ou quartier en train d'être renommé : { kind: 'site' | 'zone', id }
      renaming: null
    };
  },
  computed: {
    // Ce qu'on renomme : son nom actuel et celui d'origine
    renameTarget() {
      if (!this.renaming || !this.state) return null;
      const { kind, id } = this.renaming;
      const place = kind === 'site' ? this.state.sites.find(s => s.id === id) : this.state.map.zones.find(z => z.id === id);
      if (!place) return null;
      return { eyebrow: kind === 'site' ? 'Bâtiment' : 'Quartier', title: `Renommer ${place.name}`, current: place.name, base: place.baseName || place.name };
    },
    // « Tout ramasser » : ce qui attend dans les bâtiments, écus puis ressources : [{ id, glyph, n, label }]
    harvestable() {
      if (!this.state) return [];
      const stock = this.state.pendingStock || {};
      return [{ id: 'coins', glyph: 'ui:coin', n: this.state.pending, label: 'écus' }, ...RESOURCES.map(r => ({ id: r.id, glyph: r.glyph, n: stock[r.id], label: r.label }))]
        .map(g => ({ ...g, n: Math.floor(g.n || 0) }))
        .filter(g => g.n > 0);
    },
    sheetSite() {
      return this.sheet && this.state ? this.state.sites.find(s => s.id === this.sheet.siteId) || null : null;
    },
    sheetItem() {
      return this.sheetSite ? this.sheetSite.shop.find(item => item.id === this.sheet.itemId) || null : null;
    },
    guideSite() {
      return this.guide && this.state ? this.state.sites.find(s => s.id === this.guide.siteId) || null : null;
    },
    guideItem() {
      return this.guideSite ? this.guideSite.shop.find(item => item.id === this.guide.itemId) || null : null;
    },
    guideText() {
      return guideOf(this.guideItem, this.guideSite);
    }
  },
  methods: {
    // Ressources du palier suivant réunies ; palier suivant prêt à bâtir (world/levels.js). Ce qui attend dans les
    // bâtiments compte : le serveur l'encaisse avant de bâtir
    affordable(site) {
      return levelAffordable(site, this.stockPaid);
    },
    canBuild(site) {
      return levelReady(site, this.stockPaid, this.coinsPaid);
    },
    /* ---------- Boutique d'un atelier (règles : world/shop.js ; onglet : SiteShop) ---------- */
    itemArt,
    // Raison pour laquelle un article ne s'achète pas encore (texte du bouton), ou ''
    // (les écus qui attendent dans les bâtiments comptent : le serveur les encaisse avant l'achat)
    lockOf(site, item) {
      return itemLock(site, item, this.coinsPaid);
    },
    canBuy(site, item) {
      return itemBuyable(site, item, this.coinsPaid);
    },

    /* ---------- Actions ---------- */
    async build(site) {
      this.busy = true;
      try {
        const { coins, world } = await playService.worldBuild(site.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.site = null;
        // (la fête se joue sur l'île même, avec son mot au-dessus du bâtiment : world/fetes.js, lancée par apply)
        vibrate([14, 40, 20]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.build), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Nom d'un bâtiment de l'île (celui que le joueur lui a donné)
    siteName(id) {
      const site = this.state && this.state.sites.find(s => s.id === id);
      return site ? site.name : '';
    },
    // Renommer : un bâtiment dès son palier III (avant, on dit quand), un quartier à soi
    startRename(kind, id) {
      if (kind === 'site') {
        const site = this.state.sites.find(s => s.id === id);
        if (site.level < site.renameLevel) {
          this.$emit('show-alert', TOASTS.renameLater(site.name, roman(site.renameLevel)));
          return;
        }
      }
      this.renaming = { kind, id };
    },
    // Nouveau nom (vide : celui d'origine), gardé par le serveur ; l'île et ses étiquettes suivent
    async saveName(name) {
      const { kind, id } = this.renaming;
      this.busy = true;
      try {
        this.apply(await playService.worldName(kind, id, name));
        this.renaming = null;
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.rename), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Ramassage de la production des bâtiments : chacun pétille et montre ce qu'il donne (world/fetes.js) ; at = point
    // de l'écran touché (s'il n'y avait rien d'attendu sur l'île, c'est là que pétille ce qu'on gagne)
    async collect(at = null) {
      if (this.busy) return;
      const from = at && at.currentTarget ? center(at.currentTarget.getBoundingClientRect()) : at;
      // (ce qui attendait dans chaque bâtiment, avant que le serveur ne le vide)
      const waiting = (this.state ? this.state.sites : []).filter(s => !s.locked && s.pending && Object.values(s.pending).some(n => n > 0))
        .map(s => ({ at: this.siteAt(s), pending: s.pending }));
      this.busy = true;
      try {
        const { gained, stock, coins, world } = await playService.worldCollect();
        this.apply(world, { quiet: true });
        this.$emit('coins-updated', coins);
        const got = gained > 0 || Object.values(stock || {}).some(n => n > 0);
        // (la première production ramassée : Agathe dit la suite, si elle l'a montrée)
        if (got && guide.state.seen.has('dlg-premiere-production-1')) this.sayMoment('premiere-production', true);
        if (got) {
          if (waiting.length) {
            waiting.forEach(({ at: spot, pending: { coins: earned = 0, ...made } }) => this.sparkle('petille', spot, this.gainsOf(made, earned)));
          } else this.sparkleAt('petille', from, this.gainsOf(stock, gained));
          vibrate([12, 40, 18]);
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.collect), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Achat d'un article en un toucher ; « Annuler » reste proposé UNDO_MS
    async buyItem(site, item) {
      // Pas encore achetable : sa fiche dit pourquoi (palier, écus, butins)
      if (!this.canBuy(site, item)) {
        this.describeItem(site, item);
        return;
      }
      this.busy = true;
      try {
        const { bought, coins, world } = await playService.worldItem(item.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        // (l'article tombe à sa place sur le bâtiment, la poussière roule à son pied, et son nom monte : world/fetes.js ;
        // un habillage n'a pas de dessin à poser)
        if (item.kind !== 'skin') this.pops.set(`item:${site.id}:${item.id}`, performance.now());
        this.sparkle('pose', this.siteAt(site), [{ text: bought }]);
        vibrate([12, 40, 18]);
        clearTimeout(this.undoTimer);
        this.undoable = { id: item.id, name: bought };
        // Premier achat de cette sorte : son mode d'emploi, une fois l'achat devenu définitif
        const firstOfKind = !guideSeen(guideKind(item)) ? { siteId: site.id, itemId: item.id } : null;
        this.undoTimer = setTimeout(() => {
          this.undoable = null;
          if (firstOfKind && !this.gone) this.guide = firstOfKind;
        }, UNDO_MS);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.buy), 'error');
      } finally {
        this.busy = false;
      }
    },
    // « Annuler » juste après un achat : l'article est rendu, ses écus remboursés par le serveur
    async undoItem() {
      const item = this.undoable;
      if (!item || this.busy) return;
      clearTimeout(this.undoTimer);
      this.undoable = null;
      this.busy = true;
      try {
        const { undone, coins, world } = await playService.worldItemUndo(item.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.$emit('show-alert', TOASTS.undone(undone));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.undo), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Fiche d'un article (toucher sur son dessin, appui long sur son prix)
    describeItem(site, item) {
      vibrate(10);
      this.sheet = { siteId: site.id, itemId: item.id };
    },
    // Achat depuis la fiche : elle se ferme, l'achat reste annulable depuis la boutique
    buyFromSheet(event) {
      const [site, item] = [this.sheetSite, this.sheetItem];
      this.sheet = null;
      if (item) this.buyItem(site, item, event);
    },
    // Mode d'emploi du premier achat d'une sorte : « Voir sur l'île » ferme les fiches et montre l'article, qui sautille
    closeGuide() {
      if (this.guideItem) markGuideSeen(guideKind(this.guideItem));
      this.guide = null;
    },
    showGuideOnIsland() {
      const [site, item] = [this.guideSite, this.guideItem];
      this.closeGuide();
      if (!site) return;
      this.site = null;
      const c = this.centerOf(site);
      this.cam.x = c.x;
      this.cam.y = c.y - 20;
      this.cam.s = Math.max(this.cam.s, 1.3);
      this.clampCam();
      if (item && item.kind !== 'skin') this.scared.set(`item:${site.id}:${item.id}`, { at: performance.now() / 1000 });
      this.draw(performance.now());
    },
    // Skin porté par un bâtiment ('' : apparence d'origine)
    async wearSkin(site, skin) {
      this.busy = true;
      try {
        this.apply(await playService.worldSkin(site.id, skin));
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.skin), 'error');
      } finally {
        this.busy = false;
      }
    }
  }
};
