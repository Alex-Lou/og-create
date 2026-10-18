// L'île : ses gens. Les habitants (amitié, besoins, cadeaux, Savoirs soufflés), les bêtes de ferme, les visiteurs,
// Brume et Anya. Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans son
// gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { villagerSprite } from '@/world/villagers';
import { talkLine, giftLine } from '@/world/friends';
import { heardPages, keepSavoir, savoirLine, artOf as savoirOf } from '@/game/savoirs';
import { thanksOf, askOr, affordable } from '@/world/needs';
import { visitorCast, THANKS as VISITOR_THANKS } from '@/world/visitors';
import { ANIMAL_SPRITES } from '@/world/animals';
import { beastPortraitUrl } from '@/world/beastArt';
import { vibrate } from '@/utils/fx';
import { LABEL } from '@/game/resources';
import { spriteUrl } from '@/world/spriteCache';
import { PRESENTIMENTS, BREATH_LINE } from '@/game/anya';
import { BEASTS } from '@/world/bestiary';
import { bubbleFace, builtOf, NAMES } from '@/world/faces';
import { momentsDue, momentLines } from '@/game/firstTimes';
import { masterPortrait, visitorPortraitUrl } from '@/world/masterPortraits';
import { guide } from '@/game/guide';
import { TIPS } from '@/texts/guide/tips';
import { ANYA_RESTED, MEETINGS } from '@/texts/village';
import { coach } from '@/game/coach';
import { FAILED, TOASTS } from '@/texts/world/screens/alerts';
import { BUBBLES } from '@/texts/world/screens/island';

// Une rencontre (meetNow) : chaque bulle tient tant de ms ; la place de la bulle au-dessus de la tête (pixels d'écran)
const MEET_MS = 3000;
const MEET_HEAD = 44;

export default {
  beforeUnmount() {
    clearTimeout(this.meetTimer);
  },
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
    // Une rencontre entre camarades (le village : la visite du jour, agenda.js ; texts/village.js : MEETINGS) : la bulle
    // du visiteur, puis celle de son hôte, une fois par visite, quand on voit les deux et que rien d'autre ne parle
    meetNow(meets) {
      if (this.tip || this.meeting || guide.current || coach.state.lesson || !this.geo) return;
      const seen = this.meetsSeen || (this.meetsSeen = new Set());
      const screen = (x, y) => {
        const g = this.ground(x, y);
        const p = this.toScreen(g.x, g.y);
        return p.x > 40 && p.x < this.geo.width - 40 && p.y > 120 && p.y < this.geo.height - 120 ? p : null;
      };
      for (const m of meets) {
        // (une rencontre par paire, dans un sens de visite ou dans l'autre : qui parle d'abord est dans sa clé)
        const ahead = MEETINGS[`${m.from}>${m.to}`];
        const lines = ahead || MEETINGS[`${m.to}>${m.from}`];
        const id = `${m.from}>${m.to}:${m.day}`;
        if (!lines || seen.has(id)) continue;
        const guest = screen(m.x, m.y);
        const host = screen(m.host.x, m.host.y);
        if (!guest || !host) continue;
        seen.add(id);
        this.meeting = true;
        const name = role => ((this.state.villagers || []).find(v => v.id === role) || {}).name || '';
        const [first, reply] = lines;
        const [a, b] = ahead ? [guest, host] : [host, guest];
        const [who, other] = ahead ? [m.from, m.to] : [m.to, m.from];
        this.showTip(a.x, a.y - MEET_HEAD, { title: name(who), text: first, meet: true }, MEET_MS);
        this.meetTimer = setTimeout(() => {
          // (si on a touché quelque chose entre-temps, sa bulle reste : la réponse se tait)
          if (!this.tip || this.tip.meet) this.showTip(b.x, b.y - MEET_HEAD, { title: name(other), text: reply, meet: true }, MEET_MS);
          this.meetTimer = setTimeout(() => { this.meeting = false; }, MEET_MS);
        }, MEET_MS);
        return;
      }
    },
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
    // Portrait d'un visiteur (le visiteur du moment ou un installé) : le même visiteur de la bibliothèque que sur l'île
    // (village/residents.js : visitorCast, sur les mêmes graines dans le même ordre)
    visitorPortrait(v) {
      const settlers = (this.state.villagers || []).filter(s => s.seed !== undefined).map(s => s.seed);
      return visitorPortraitUrl(visitorCast([...settlers, this.state.visitor && this.state.visitor.seed]).get(v.seed));
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
        this.$emit('show-alert', TOASTS.visitorThanks(guest.name), 'gain', this.gainsOf({}, reward));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.visitor), 'error');
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
        this.$emit('show-alert', TOASTS.settled(settled));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.settle), 'error');
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
      return { ...info, title: `${friend.name} · ${friend.role}`, text: ask ? askOr(friend, info.text) : info.text, hint: BUBBLES.hold };
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
      return masterPortrait(id, resident ? resident.castaway : false);
    },
    openBeast(id) {
      this.site = null;
      this.villagerId = null;
      this.beastId = id;
    },
    // Portrait d'une bête de ferme : son dessin, de la race que montre la ferme (celui de la bibliothèque, de trois
    // quarts avant, sinon celui du code)
    beastPortrait(id) {
      const a = this.village && this.village.farm.find(f => f.beast === id);
      const species = a ? a.species : this.beastView.species;
      const variant = a ? a.variant : '';
      return beastPortraitUrl(species, variant) || spriteUrl(`portrait-beast-${species}-${variant}`, () => ANIMAL_SPRITES[species](0, variant));
    },
    openVillager(id) {
      this.site = null;
      this.villagerId = id;
      this.villagerSaid = '';
      this.villagerPopped = 0;
      this.villagerSavoir = null;
    },
    savoirOf,
    // Les dialogues de première fois (game/firstTimes.js) : chacun par celui qui le montre, une fois ; après le
    // tutoriel, ou pendant s'il en fait partie (bâtir le Puits)
    firstTimes(state) {
      const met = new Set((state.villagers || []).map(v => v.id));
      const due = momentsDue({
        state, met, ready: site => this.canBuild(site), deposits: this.readyDeposits, said: id => guide.state.seen.has(id)
      });
      // (pendant le tutoriel, seul le premier chantier, celui du Puits, en fait partie)
      due.filter(({ id }) => id === 'premier-chantier' || !this.thickMist(state)).forEach(({ id, after }) => this.sayMoment(id, after));
    },
    sayMoment(id, after = false) {
      const built = builtOf(this.state && this.state.villagers);
      momentLines(id, after).forEach(line => guide.say({
        id: line.id, text: line.text, ...(line.who === 'brume' ? {} : { who: NAMES[line.who], ...bubbleFace(line.who, { castaway: !built.includes(line.who), mood: line.mood }) })
      }));
    },
    // Les Savoirs et le Bestiaire, dits une fois (bible, § 6.4 et § 6.5) : un maître à qui bavarder ; Bulle revenu dans
    // le bocal de Léo ; une bête écrite qui vit sur l'île (Maerys la présente, si elle est là)
    bestiaryTips(state) {
      const troupe = new Set((state.villagers || []).map(v => v.id));
      // (après le tutoriel : une chose à la fois)
      if (troupe.size && !this.thickMist()) guide.tip('savoirs');
      const written = new Set(this.elements);
      if (troupe.has('puits') && written.has('Poisson')) guide.tip('bulle');
      if (BEASTS.some(name => name !== 'Poisson' && written.has(name)) && !this.thickMist(state)) {
        const sylve = troupe.has('bosquet');
        guide.say({ id: 'bestiaire', ...(sylve ? { text: TIPS.bestiaireSylve, who: 'Maerys', ...bubbleFace('bosquet', { castaway: !builtOf(state.villagers).includes('bosquet'), mood: 'emerveille' }) } : { text: TIPS.bestiaire }) });
        // Le troisième pressentiment d'Anya (bible, § 10, acte IV) : les bêtes se tournent vers la Lande aux Menhirs
        // (plus de pressentiment une fois Anya éveillée)
        if (!(state.anya && state.anya.awake)) PRESENTIMENTS.betes.forEach(line => guide.say(line));
      }
      // Le deuxième (acte III) : au Cercle de menhirs, la rune de Celle-qui-donne-souffle
      if ((state.landmarks || []).some(l => l.id === 'menhirs' && l.found) && !(state.anya && state.anya.awake)) {
        const built = builtOf(state.villagers);
        PRESENTIMENTS.rune.forEach(line => guide.say({ id: line.id, text: line.text, who: line.who, ...bubbleFace(line.face, { castaway: !built.includes(line.face) }) }));
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
        this.showTip(px, py, { title: 'Anya', text: ANYA_RESTED });
        return;
      }
      this.busy = true;
      try {
        const { savoir, world } = await playService.villagerTalk('anya', heardPages());
        this.apply(world);
        if (savoir) keepSavoir(savoir, 'Anya');
        const text = savoir ? BUBBLES.anyaBreath(BREATH_LINE, savoir.chapter, savoir.ingredient) : BUBBLES.anyaNoPage;
        this.showTip(px, py, { title: 'Anya', text });
        vibrate([8, 30, 8]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.anya), 'error');
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
        this.brumeSaid = savoir ? savoirLine('brume', savoir) : BUBBLES.brumeNoPage;
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.brume), 'error');
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
        if (gained) this.$emit('show-alert', TOASTS.friendCoins(friend.name), 'gain', this.gainsOf({}, gained));
        const chests = rewards.filter(r => r.chest).map(r => r.chest);
        if (chests.length === 1) this.showChest(chests[0]);
        else if (chests.length > 1) this.haul = chests;
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.villager), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Combler un besoin depuis la fiche (le serveur prend les ressources du stock) : l'habitant remercie
    async fillNeed(need) {
      if (this.busy || !this.villagerView) return;
      // (la soupe d’Agathe, au tutoriel : sa marmite, cooking.js)
      if (this.cooksNow(this.villagerView.id, need)) {
        this.villagerId = null;
        this.openCooking();
        return;
      }
      this.busy = true;
      try {
        const { coins, world } = await playService.villagerNeed(this.villagerView.id, need);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.villagerSaid = thanksOf(need, this.villagerView.id) || '';
        vibrate(10);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.need), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Toucher la bulle d'un besoin (la faim, la soif… d'un habitant ; la faim d'une poule) : il est comblé tout de suite
    // si la réserve suffit (ce qui attend dans les bâtiments compte) ; sinon une bulle dit ce qui manque et mène à la
    // Récolte. Un besoin sans prix (se distraire) ouvre la fiche. Sans bulle, toucher l'habitant ouvre sa fiche
    async tapNeed(asking, px, py) {
      if (this.busy || !this.state) return;
      const friend = asking.beast ? null : (this.state.villagers || []).find(v => v.id === asking.id);
      const need = friend ? (friend.needs || []).find(n => n.id === asking.need) : null;
      if (friend && (!need || !need.cost)) {
        this.openVillager(friend.id);
        return;
      }
      const cost = asking.beast ? (this.state.beasts && this.state.beasts.cost) || {} : need.cost;
      if (!affordable({ cost }, this.stockPaid)) {
        const lacking = Object.entries(cost).filter(([r, n]) => (this.stockPaid[r] || 0) < n)
          .map(([r, n]) => BUBBLES.lackingItem(n, LABEL[r].toLowerCase(), this.stockPaid[r] || 0)).join(', ');
        this.choose({
          key: `manque:${asking.beast || asking.id}`, action: 'Jouer une Récolte',
          info: { title: BUBBLES.lackingTitle, text: BUBBLES.lacking(lacking) },
          ring: { x: asking.x, y: asking.y, rx: asking.r + 3, ry: (asking.r + 3) * 0.55 },
          run: () => this.startHarvest()
        }, px, py);
        return;
      }
      // (la soupe d’Agathe, au tutoriel : sa marmite, cooking.js ; le prix est déjà là, il se paie au service)
      if (friend && this.cooksNow(friend.id, need.id)) {
        this.openCooking();
        return;
      }
      this.busy = true;
      try {
        const { coins, world } = asking.beast ? await playService.beastFeed(asking.beast) : await playService.villagerNeed(friend.id, need.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.sparkle('petille', { x: asking.x, y: asking.y + asking.r, top: asking.r * 2 });
        vibrate(10);
        const thanks = friend && thanksOf(need.id, friend.id);
        if (thanks) this.showTip(px, py, { title: friend.name, text: thanks });
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.need), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Nourrir la bête dont la fiche est ouverte (2 vivres du stock ; sa bulle est ramassée d'abord)
    async feedBeast() {
      if (this.busy || !this.beastView) return;
      this.busy = true;
      try {
        const { collected, coins, world } = await playService.beastFeed(this.beastView.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate(10);
        if (collected) this.$emit('show-alert', TOASTS.beastBubble, 'gain', this.gainsOf({ food: collected }));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.beast), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Ramasser les bulles de toutes les bêtes : chaque bulle pleine pétille, la première montre ce qu'on gagne
    // (world/fetes.js) ; at : point de l'écran touché (s'il n'y avait aucune bulle à l'écran, c'est là que ça pétille)
    async collectBeasts(at = null) {
      if (this.busy) return;
      const full = (this.needBubbles || []).filter(b => b.ready).map(b => ({ x: b.x, y: b.y + b.r, top: b.r * 2 }));
      // (des œufs à ramasser : Agathe le dit, la première fois)
      const eggs = Boolean(this.state && this.state.beasts && this.state.beasts.list.some(b => b.species === 'hen' && b.ready > 0));
      this.busy = true;
      try {
        const { food, world } = await playService.beastsCollect();
        this.apply(world);
        if (food && eggs) this.coopLines(world, true);
        if (food) {
          const gains = this.gainsOf({ food });
          if (full.length) full.forEach((spot, i) => this.sparkle('petille', spot, i ? [] : gains));
          else this.sparkleAt('petille', at, gains);
          vibrate([10, 30, 14]);
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.bubbles), 'error');
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
        this.$emit('show-alert', TOASTS.needsFilled(n));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.needs), 'error');
      } finally {
        this.busy = false;
      }
    }
  }
};
