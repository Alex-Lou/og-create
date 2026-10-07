// L'île : ses gens. Les habitants (amitié, besoins, cadeaux, Savoirs soufflés), les bêtes de ferme, les visiteurs,
// Brume et Anya. Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans son
// gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { villagerSprite, ROLES } from '@/world/villagers';
import { talkLine, giftLine } from '@/world/friends';
import { heardPages, keepSavoir, savoirLine, artOf as savoirOf } from '@/game/savoirs';
import { THANKS, askOr } from '@/world/needs';
import { visitorLook, THANKS as VISITOR_THANKS } from '@/world/visitors';
import { ANIMAL_SPRITES } from '@/world/animals';
import { burst, vibrate } from '@/utils/fx';
import { LABEL } from '@/game/resources';
import { spriteUrl } from '@/world/spriteCache';
import { PRESENTIMENTS, BREATH_LINE } from '@/game/anya';
import { BEASTS } from '@/world/bestiary';
import { faceHref, builtOf } from '@/world/faces';
import { masterPortrait } from '@/world/masterArt';
import { guide } from '@/game/guide';
import { TIPS } from '@/game/guideTips';

export default {
  data() {
    return {
      // Habitant dont la fiche est ouverte, sa dernière réplique, le cœur tout juste gagné
      villagerId: null,
      beastId: null,
      villagerSaid: '',
      villagerPopped: 0,
      // Savoir que le maître vient de souffler (bible, § 6.4) : { page, chapter, ingredient | family } ou null
      villagerSavoir: null,
      // Le Savoir de Brume, après le Phare : sa réplique et l'indice soufflé
      brumeSaid: '',
      brumeHint: null,
      visitorOpen: false,
      visitorSaid: ''
    };
  },
  computed: {
    // Habitant dont la fiche est ouverte (vue du serveur, à jour) et le nom de son lieu de travail
    villagerView() {
      return this.villagerId && this.state ? (this.state.villagers || []).find(v => v.id === this.villagerId) || null : null;
    },
    villagerSiteName() {
      return this.villagerView ? this.siteName(this.villagerView.site || this.villagerView.id) : '';
    },
    // Bête de ferme dont la fiche est ouverte (vue du serveur, à jour)
    beastView() {
      return this.beastId && this.state && this.state.beasts ? this.state.beasts.list.find(b => b.id === this.beastId) || null : null;
    }
  },
  methods: {
    // Habitants : celui qu'on touche (who : { kind: 'villager', id: 'vil:<bâtiment>' }) dans la vue du serveur
    friendOf(who) {
      if (!who || who.kind !== 'villager' || !this.state) return null;
      return (this.state.villagers || []).find(v => `vil:${v.id}` === who.id) || null;
    },
    // La bête de ferme qu'on touche (who.beast : son nom au serveur), vue du serveur, ou null (variante du Bestiaire,
    // serveur d'avant les bêtes)
    beastOf(who) {
      if (!who || !who.beast || !this.state || !this.state.beasts) return null;
      return this.state.beasts.list.find(b => b.id === who.beast) || null;
    },
    // Le visiteur qu'on touche (who : { kind: 'villager', id: 'vis:<id>' }), ou null
    guestOf(who) {
      const v = this.state && this.state.visitor;
      return v && who && who.id === `vis:${v.id}` ? v : null;
    },
    // Case de mer où s'amarre le bateau du visiteur : la plus proche du Ponton, et d'où il arrive (vers le large)
    dockOf(state, M) {
      const site = state.sites.find(s => s.id === 'ponton');
      if (!site) return null;
      const cx = site.x + site.w / 2;
      const cy = site.y + site.h / 2;
      let best = null;
      for (let y = site.y - 3; y < site.y + site.h + 3; y++) {
        for (let x = site.x - 3; x < site.x + site.w + 3; x++) {
          if (M.ground(x, y) !== '~') continue;
          const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) - (x + y) * 0.01;
          if (!best || d < best.d) best = { x: x + 0.5, y: y + 0.5, d };
        }
      }
      if (!best) return null;
      const len = Math.hypot(best.x - cx, best.y - cy) || 1;
      const dx = (best.x - cx) / len;
      const dy = (best.y - cy) / len;
      return { x: best.x, y: best.y, dx, dy, flip: dx - dy > 0 };
    },
    visitorPortrait(v) {
      return spriteUrl(`portrait-vis-${v.seed}`, () => villagerSprite(visitorLook(v.seed, v.role)));
    },
    openVisitor() {
      if (!this.state || !this.state.visitor) return;
      this.site = null;
      this.villagerId = null;
      this.visitorSaid = '';
      this.visitorOpen = true;
    },
    // Combler la demande du visiteur : le serveur vérifie, prend les ressources et verse les écus
    async satisfyVisitor() {
      const guest = this.state && this.state.visitor;
      if (this.busy || !guest) return;
      this.busy = true;
      try {
        const { reward, coins, world } = await playService.visitorSatisfy(guest.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.visitorSaid = VISITOR_THANKS;
        vibrate([12, 40, 18]);
        this.$emit('show-alert', `${guest.name} te remercie : +${reward} écus !`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le visiteur n’a pas pu être comblé.'));
      } finally {
        this.busy = false;
      }
    },
    // Un visiteur comblé reste dans une maison libre : il devient habitant
    async settleVisitor() {
      const guest = this.state && this.state.visitor;
      if (this.busy || !guest) return;
      this.busy = true;
      try {
        const { settled, coins, world } = await playService.visitorSettle(guest.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.visitorOpen = false;
        vibrate([12, 40, 18]);
        this.$emit('show-alert', `${settled} s’installe sur ton île : bienvenue !`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le visiteur n’a pas pu s’installer.'));
      } finally {
        this.busy = false;
      }
    },
    // Demande de Récoltes : on ferme sa fiche et on lance une partie
    visitorHarvest() {
      this.visitorOpen = false;
      this.startHarvest();
    },
    // Habitant d'un bâtiment (vue du serveur), ou null
    friendAt(siteId) {
      return (this.state.villagers || []).find(v => v.id === siteId) || null;
    },
    // Bulle d'un habitant : son prénom et son métier ; l'appui long ouvre sa fiche. ask : quand on lui parle, il dit
    // d'abord ce qui lui manque
    named(info, who, ask = false) {
      const friend = this.friendOf(who);
      if (!info || !friend) return info;
      return { ...info, title: `${friend.name} · ${friend.role}`, text: ask ? askOr(friend, info.text) : info.text, hint: 'Appui long : sa fiche' };
    },
    // Portrait d'un habitant : son allure sur l'île (teint, cheveux), de face ; un visiteur installé, d'après sa graine
    // Portraits des habitants pour l'Aperçu du Foyer : refaits à chaque rendu de l'île, comme quand le gabarit appelait
    // portraitOf (le village, d'où vient l'apparence, n'est pas réactif)
    villagerPortraits() {
      return Object.fromEntries((this.state.villagers || []).map(v => [v.id, this.portraitOf(v.id)]));
    },
    portraitOf(id) {
      const settler = (this.state.villagers || []).find(v => v.id === id && v.seed !== undefined);
      if (settler) return this.visitorPortrait(settler);
      const resident = this.village && this.village.residents.find(r => r.role === id);
      // Un maître : son portrait de la bibliothèque, en naufragé tant que son bâtiment n'est pas fondé
      const art = masterPortrait(id, resident ? resident.castaway : false);
      if (art) return art;
      const look = resident ? resident.look : { skin: '#F6D3B3', hair: '#7A4E2C', ...ROLES[id] };
      return spriteUrl(`portrait-${id}-${look.skin}-${look.hair}`, () => villagerSprite(look));
    },
    openBeast(id) {
      this.site = null;
      this.villagerId = null;
      this.beastId = id;
    },
    // Portrait d'une bête de ferme : son dessin, de la race que montre la ferme
    beastPortrait(id) {
      const a = this.village && this.village.farm.find(f => f.beast === id);
      const species = a ? a.species : this.beastView.species;
      const variant = a ? a.variant : '';
      return spriteUrl(`portrait-beast-${species}-${variant}`, () => ANIMAL_SPRITES[species](0, variant));
    },
    openVillager(id) {
      this.site = null;
      this.villagerId = id;
      this.villagerSaid = '';
      this.villagerPopped = 0;
      this.villagerSavoir = null;
    },
    savoirOf,
    // Les Savoirs et le Bestiaire, dits une fois (bible, § 6.4 et § 6.5) : un maître à qui bavarder ; Bulle revenu dans
    // le bocal d'Ondin ; une bête écrite qui vit sur l'île (Sylve la présente, si elle est là)
    bestiaryTips(state) {
      const troupe = new Set((state.villagers || []).map(v => v.id));
      if (troupe.size) guide.tip('savoirs');
      const written = new Set(this.elements);
      if (troupe.has('puits') && written.has('Poisson')) guide.tip('bulle');
      if (BEASTS.some(name => name !== 'Poisson' && written.has(name))) {
        const sylve = troupe.has('bosquet');
        guide.say({ id: 'bestiaire', ...(sylve ? { text: TIPS.bestiaireSylve, who: 'Sylve', face: faceHref('bosquet', { castaway: !builtOf(state.villagers).includes('bosquet') }) } : { text: TIPS.bestiaire }) });
        // Le troisième pressentiment d'Anya (bible, § 10, acte IV) : les bêtes se tournent vers la Lande aux Menhirs
        // (plus de pressentiment une fois Anya éveillée)
        if (!(state.anya && state.anya.awake)) PRESENTIMENTS.betes.forEach(line => guide.say(line));
      }
      // Le deuxième (acte III) : au Cercle de menhirs, la rune de Celle-qui-donne-souffle
      if ((state.landmarks || []).some(l => l.id === 'menhirs' && l.found) && !(state.anya && state.anya.awake)) {
        const built = builtOf(state.villagers);
        PRESENTIMENTS.rune.forEach(line => guide.say({ id: line.id, text: line.text, who: line.who, face: faceHref(line.face, { castaway: !built.includes(line.face) }) }));
      }
    },
    // Bavarder : au premier bavardage du jour, un maître souffle un Savoir sur une page de son Art ; l'appareil le
    // garde (comme l'Encre) et dit au serveur les pages dont il a déjà un indice
    async talkVillager() {
      await this.befriend(() => playService.villagerTalk(this.villagerId, heardPages()), (v, hearts, { savoir }) => {
        if (!savoir) return talkLine(v.id, hearts);
        keepSavoir(savoir, v.name);
        this.villagerSavoir = savoir;
        return savoirLine(v.id, savoir);
      });
    },
    // Le Souffle d'Anya (bible, § 6.14) : une fois par passage, un ingrédient sur n'importe quelle page à portée, gardé
    // comme un Savoir
    async breatheAnya(px, py) {
      if (this.busy) return;
      if (this.state.anya && this.state.anya.breathed) {
        this.showTip(px, py, { title: 'Anya', text: 'Va. La terre se repose aussi. Je repasserai.' });
        return;
      }
      this.busy = true;
      try {
        const { savoir, world } = await playService.villagerTalk('anya', heardPages());
        this.apply(world);
        if (savoir) keepSavoir(savoir, 'Anya');
        const text = savoir ? `${BREATH_LINE} Sur une page du chapitre ${savoir.chapter}, il faut « ${savoir.ingredient} ».` : 'Le Grimoire n’a pas de page qui m’attende. Écris encore.';
        this.showTip(px, py, { title: 'Anya', text });
        vibrate([8, 30, 8]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Anya n’a pas pu souffler.'));
      } finally {
        this.busy = false;
      }
    },
    // Bavarder avec Brume, le Phare allumé : un Savoir par jour sur les Légendes ; s'il n'y a pas de page, rien n'est compté
    async talkBrume() {
      if (this.busy) return;
      this.busy = true;
      try {
        const { savoir, world } = await playService.villagerTalk('brume', heardPages());
        this.apply(world);
        this.brumeHint = savoir;
        if (savoir) keepSavoir(savoir, 'Brume');
        this.brumeSaid = savoir ? savoirLine('brume', savoir) : 'Aucune page des Légendes n’est encore à portée : écris encore, et reviens me voir.';
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Brume n’a pas pu répondre.'));
      } finally {
        this.busy = false;
      }
    },
    openBrumeSavoir() {
      const { page } = this.brumeHint;
      this.questOpen = false;
      this.$emit('go', 'infinite', page);
    },
    // « Voir dans le Grimoire » : le Grimoire s'ouvre sur la page soufflée
    openSavoir() {
      const { page } = this.villagerSavoir;
      this.villagerId = null;
      this.$emit('go', 'infinite', page);
    },
    async giftVillager(resource) {
      await this.befriend(() => playService.villagerGift(this.villagerId, resource), v => giftLine(v.id, v, resource));
    },
    // Bavarder ou offrir : le serveur compte les points ; la réplique s'affiche, un cœur gagné pulse et sa récompense
    // arrive (écus annoncés, coffre ouvert par-dessus la fiche)
    async befriend(call, lineOf) {
      if (this.busy) return;
      const friend = this.villagerView;
      this.busy = true;
      try {
        const reply = await call();
        const { hearts, rewards, coins, world } = reply;
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.villagerSaid = lineOf(friend, hearts, reply);
        this.villagerPopped = hearts > friend.hearts ? hearts : 0;
        vibrate(hearts > friend.hearts ? [12, 40, 18] : 8);
        const gained = rewards.filter(r => r.kind === 'coins').reduce((sum, r) => sum + r.amount, 0);
        if (gained) this.$emit('show-alert', `${friend.name} t’offre ${gained} écus pour votre amitié !`);
        const chests = rewards.filter(r => r.chest).map(r => r.chest);
        if (chests.length === 1) this.showChest(chests[0]);
        else if (chests.length > 1) this.haul = chests;
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’habitant n’a pas pu répondre.'));
      } finally {
        this.busy = false;
      }
    },
    // Combler un besoin depuis la fiche (le serveur prend les ressources du stock) : l'habitant remercie
    async fillNeed(need) {
      if (this.busy || !this.villagerView) return;
      this.busy = true;
      try {
        const { coins, world } = await playService.villagerNeed(this.villagerView.id, need);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.villagerSaid = THANKS[need] || '';
        vibrate(10);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Ce besoin n’a pas pu être comblé.'));
      } finally {
        this.busy = false;
      }
    },
    // Nourrir la bête dont la fiche est ouverte (2 vivres du stock ; sa bulle est ramassée d'abord)
    async feedBeast() {
      if (this.busy || !this.beastView) return;
      this.busy = true;
      try {
        const { collected, world } = await playService.beastFeed(this.beastView.id);
        this.apply(world);
        vibrate(10);
        if (collected) this.$emit('show-alert', `Sa bulle, ramassée d’abord : +${collected} ${LABEL.food}`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La bête n’a pas pu être nourrie.'));
      } finally {
        this.busy = false;
      }
    },
    // Ramasser les bulles de toutes les bêtes ; at : point de l'écran d'où partent les éclats
    async collectBeasts(at = null) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { food, world } = await playService.beastsCollect();
        this.apply(world);
        if (food) {
          if (at) burst(at, 14, 60);
          vibrate([10, 30, 14]);
          this.$emit('show-alert', `Bulles ramassées : +${food} ${LABEL.food}`);
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Les bulles n’ont pas pu être ramassées.'));
      } finally {
        this.busy = false;
      }
    },
    // « Tout combler » (fiche du Foyer) : tout ce qui peut l'être, tant que le stock suffit
    async fillAllNeeds() {
      if (this.busy) return;
      this.busy = true;
      try {
        const { filled, coins, world } = await playService.villagersNeeds();
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate([10, 30, 10]);
        const n = filled.length;
        this.$emit('show-alert', `${n} besoin${n > 1 ? 's' : ''} comblé${n > 1 ? 's' : ''} : tes habitants te remercient !`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Les besoins n’ont pas pu être comblés.'));
      } finally {
        this.busy = false;
      }
    }
  }
};
