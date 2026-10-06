// L'île : les coffres (du jour, des chapitres, des quêtes, la bouteille échouée), un par un ou « Tout ouvrir », et ce
// qu'ils donnent (pièces à porter, enseignes). Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de
// l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { noteOf, openableOf } from '@/world/chest';
import { vibrate } from '@/utils/fx';

export default {
  data() {
    return {
      // Coffre tombé pendant la Récolte (ouvert au retour sur l'île) ; liste des coffres ouverte ; coffre en cours
      // d'ouverture : { chest, streak, note, art, wearable } ; coffres ouverts d'un coup (« Tout ouvrir »)
      runChest: null,
      chestsOpen: false,
      reveal: null,
      haul: null
    };
  },
  computed: {
    // Lots de « Tout ouvrir », avec l'aperçu et l'état de leur bâtiment (porté ou non) selon la vue du moment
    haulItems() {
      return (this.haul || []).map(chest => ({ chest, ...this.prizeLook(chest) }));
    },
    // Coffres à ouvrir (ceux que « Tout ouvrir » ouvre) : du jour, des chapitres et des quêtes, bouteille échouée
    chestCount() {
      const chests = this.state && this.state.chests;
      return chests ? openableOf(chests) : 0;
    },
    // Un mot d'Héliane dans la bouteille ouverte par « Tout ouvrir » (bible, § 6.13)
    haulNote() {
      const bottle = (this.haul || []).find(chest => chest.story);
      return bottle ? noteOf(bottle.source, bottle.story) : '';
    }
  },
  methods: {
    // Ouvre un coffre qui attend (jour, bouteille, chapitre, quête) : le serveur tire et donne le lot, l'île le montre
    async openChest(source) {
      if (this.busy) return;
      this.busy = true;
      // Le coffre va s'ouvrir : ni naufrage ni scène par-dessus (ils attendent qu'il se referme)
      const held = this.holdWreck;
      this.holdWreck = true;
      try {
        const { chest, coins, world } = await playService.worldChest(source);
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.chestsOpen = false;
        this.showChest(chest);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le coffre ne s’est pas ouvert.'));
        this.load();
      } finally {
        this.busy = false;
        this.holdWreck = held;
        this.emitQuest();
      }
    },
    // « Tout ouvrir » : le serveur ouvre tout ce qui attend (jour, chapitres, quêtes, bouteille), l'île montre la rafale
    async openAllChests() {
      if (this.busy) return;
      this.busy = true;
      const held = this.holdWreck;
      this.holdWreck = true;
      try {
        const { chests, coins, world } = await playService.worldChestsAll();
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.chestsOpen = false;
        this.haul = chests;
        vibrate([10, 40, 14, 40, 18]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Les coffres ne se sont pas ouverts.'));
        this.load();
      } finally {
        this.busy = false;
        this.holdWreck = held;
        this.emitQuest();
      }
    },
    // Ce qu'un lot montre de son bâtiment (teinte, pièce rare) : l'aperçu paré, s'il peut s'y porter, s'il y est porté
    prizeLook({ prize }) {
      const site = prize.site ? this.state.sites.find(s => s.id === prize.site) : null;
      const item = site ? site.shop.find(i => i.id === prize.item) : null;
      return {
        art: item ? this.itemArt(site, item) : '',
        wearable: Boolean(item && site.level && site.skin !== item.id),
        worn: Boolean(item && site.skin === item.id)
      };
    },
    // Montre un coffre ouvert : sa série (coffre du jour), le mot de la bouteille, l'aperçu du bâtiment paré
    showChest(chest) {
      const { source } = chest;
      const { art, wearable } = this.prizeLook(chest);
      this.reveal = {
        chest,
        streak: source.startsWith('jour:') ? this.state.chests.daily.streak : 0,
        note: source.startsWith('bouteille:') ? noteOf(source, chest.story) : '',
        art,
        wearable
      };
      vibrate([10, 40, 14]);
    },
    // « Porter » à l'ouverture : la teinte ou la pièce rare va tout de suite sur son bâtiment
    async wearRevealed() {
      const { prize } = this.reveal.chest;
      await this.wearSkin(this.state.sites.find(s => s.id === prize.site), prize.item);
      this.reveal = null;
    },
    // Enseigne : un style porté (acheté au passage s'il ne l'est pas : le solde suit), ou le nom écrit dessus
    async chooseSign(site, look) {
      this.busy = true;
      try {
        const { coins, world } = await playService.worldSign(site.id, look.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate([8, 30, 12]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’enseigne n’a pas pu changer.'));
      } finally {
        this.busy = false;
      }
    },
    async renameSigns(name) {
      this.busy = true;
      try {
        this.apply(await playService.worldSignName(name));
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le nom n’a pas pu changer.'));
      } finally {
        this.busy = false;
      }
    },
    // Appui long sur une enseigne : la boutique de son bâtiment, à la section Enseigne
    openNameSign(site) {
      this.site = site;
      this.siteTab = 'shop';
      this.$nextTick(() => {
        if (this.$refs.shop) this.$refs.shop.showSign(this.reduced());
      });
    },
    // « Porter » dans la rafale : la fenêtre reste ouverte, le lot passe à « Porté »
    wearHauled(index) {
      const { prize } = this.haul[index];
      return this.wearSkin(this.state.sites.find(s => s.id === prize.site), prize.item);
    }
  }
};
