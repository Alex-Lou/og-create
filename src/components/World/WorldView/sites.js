// L'île : ses bâtiments. Bâtir et faire évoluer, la boutique d'un atelier (achat, annulation, fiche et mode d'emploi
// d'un article), l'apparence portée, le nom, le ramassage de la production. Mixin de WorldView.vue : ses données et
// méthodes s'ajoutent à celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { guideOf, guideKind } from '@/world/itemGuide';
import { burst, ring, vibrate, center } from '@/utils/fx';
import { LABEL, RESOURCES } from '@/game/resources';
import { itemArt, itemLock, itemBuyable } from '@/world/shop';
import { levelAffordable, levelReady } from '@/world/levels';
import { roman } from '@/utils/roman';

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
    // Ressources du palier suivant réunies ; palier suivant prêt à bâtir (world/levels.js)
    affordable(site) {
      return levelAffordable(site, this.state.stock);
    },
    canBuild(site) {
      return levelReady(site, this.state.stock, this.coins);
    },
    /* ---------- Boutique d'un atelier (règles : world/shop.js ; onglet : SiteShop) ---------- */
    itemArt,
    // Raison pour laquelle un article ne s'achète pas encore (texte du bouton), ou ''
    lockOf(site, item) {
      return itemLock(site, item, this.coins);
    },
    canBuy(site, item) {
      return itemBuyable(site, item, this.coins);
    },

    /* ---------- Actions ---------- */
    async build(site) {
      this.busy = true;
      try {
        const { built, coins, world } = await playService.worldBuild(site.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.site = null;
        this.$nextTick(() => {
          const at = center(this.screenRectOf(site.x + (site.w - 1) / 2, site.y + (site.h - 1) / 2));
          ring(at, 120);
          burst(at, 26, 90);
          vibrate([14, 40, 20]);
        });
        this.$emit('show-alert', `Nouveau sur ton île : ${built}\u00a0!`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le chantier n’a pas pu être bâti.'));
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
          this.$emit('show-alert', `${site.name} se renommera au palier ${roman(site.renameLevel)}.`);
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
        this.$emit('show-alert', messageOf(error, 'Le nom n’a pas pu changer.'));
      } finally {
        this.busy = false;
      }
    },
    // Ramassage de la production des bâtiments ; at = point de l'écran d'où partent les éclats
    async collect(at = null) {
      if (this.busy) return;
      const from = at && at.currentTarget ? center(at.currentTarget.getBoundingClientRect()) : at;
      this.busy = true;
      try {
        const { gained, stock, coins, world } = await playService.worldCollect();
        this.apply(world);
        this.$emit('coins-updated', coins);
        const goods = Object.entries(stock || {}).filter(([, n]) => n > 0).map(([r, n]) => `+${n} ${LABEL[r]}`);
        if (gained > 0 || goods.length) {
          if (from) {
            ring(from, 90);
            burst(from, 20, 70);
          }
          vibrate([12, 40, 18]);
          this.$emit('show-alert', `Production ramassée : ${[...goods, ...(gained ? [`+${gained} écu${gained > 1 ? 's' : ''}`] : [])].join(' · ')}`);
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La production n’a pas pu être ramassée.'));
      } finally {
        this.busy = false;
      }
    },
    // Achat d'un article en un toucher ; « Annuler » reste proposé UNDO_MS
    async buyItem(site, item, event) {
      // Pas encore achetable : sa fiche dit pourquoi (palier, écus, butins)
      if (!this.canBuy(site, item)) {
        this.describeItem(site, item);
        return;
      }
      const from = event && event.currentTarget ? center(event.currentTarget.getBoundingClientRect()) : null;
      this.busy = true;
      try {
        const { bought, coins, world } = await playService.worldItem(item.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (from) {
          ring(from, 80);
          burst(from, 18, 60);
        }
        vibrate([12, 40, 18]);
        this.$emit('show-alert', item.kind === 'skin' ? `Skin porté : ${bought}\u00a0!` : `Nouveau sur ton île : ${bought}\u00a0!`);
        clearTimeout(this.undoTimer);
        this.undoable = { id: item.id, name: bought };
        // Premier achat de cette sorte : son mode d'emploi, une fois l'achat devenu définitif
        const firstOfKind = !guideSeen(guideKind(item)) ? { siteId: site.id, itemId: item.id } : null;
        this.undoTimer = setTimeout(() => {
          this.undoable = null;
          if (firstOfKind && !this.gone) this.guide = firstOfKind;
        }, UNDO_MS);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’achat n’a pas pu se faire.'));
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
        this.$emit('show-alert', `Achat annulé : ${undone}.`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’achat n’a pas pu être annulé.'));
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
        this.$emit('show-alert', messageOf(error, 'Le skin n’a pas pu être changé.'));
      } finally {
        this.busy = false;
      }
    }
  }
};
