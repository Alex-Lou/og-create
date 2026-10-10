// L'île : ses gens. Les habitants (amitié, besoins, cadeaux, Savoirs soufflés), les bêtes de ferme, les visiteurs,
// Brume et Anya. Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans son
// gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { villagerSprite, ROLES } from '@/world/villagers';
import { talkLine, giftLine } from '@/world/friends';
import { heardPages, keepSavoir, savoirLine, artOf as savoirOf } from '@/game/savoirs';
import { THANKS, askOr, affordable } from '@/world/needs';
import { visitorLook, THANKS as VISITOR_THANKS } from '@/world/visitors';
import { ANIMAL_SPRITES } from '@/world/animals';
import { beastPortraitUrl } from '@/world/beastArt';
import { burst, ring, vibrate } from '@/utils/fx';
import { LABEL } from '@/game/resources';
import { spriteUrl } from '@/world/spriteCache';
import { PRESENTIMENTS, BREATH_LINE } from '@/game/anya';
import { BEASTS } from '@/world/bestiary';
import { bubbleFace, builtOf, NAMES } from '@/world/faces';
import { momentsDue, momentLines } from '@/game/firstTimes';
import { masterPortrait } from '@/world/masterPortraits';
import { guide } from '@/game/guide';
import { TIPS } from '@/game/guideTips';
import * as storage from '@/utils/storage';
import { TW } from '@/world/view/constants';
import { ARRIVED_KEY } from '@/world/story';

// Le premier débarque un instant après la vue (le temps de souffler), le suivant un peu après (s)
const ARRIVE_DELAY = 0.8;
const ARRIVE_GAP = 6;

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
  beforeUnmount() {
    clearTimeout(this.arrivalTimer);
  },
  methods: {
    // Les naufragés qui débarquent (choix de l'auteur, 8 oct. : un personnage à la fois, qu'on voit arriver) : ceux de
    // la troupe que cet appareil n'a jamais vus arrivent à pied depuis l'épave (village.js, arrivals) ; un dormeur
    // trouvé à sa place ne débarque pas. Le premier passage sur un appareil (rien de retenu) ne rejoue rien. Rend la
    // Map rôle → { from, at } pour villageOf, et la liste des nouveaux dans arrivalNews
    arrivalsOf(state) {
      this.arrivalNews = [];
      const troupe = (state.villagers || []).filter(v => v.seed === undefined);
      const known = storage.load(ARRIVED_KEY, null);
      if (!Array.isArray(known)) {
        storage.save(ARRIVED_KEY, troupe.map(v => v.id));
        return this.arrivals || null;
      }
      const fresh = troupe.filter(v => !known.includes(v.id));
      if (!fresh.length) return this.arrivals || null;
      storage.save(ARRIVED_KEY, [...known, ...fresh.map(v => v.id)]);
      const wreck = (state.camp || []).find(c => c.art === 'hirondelle');
      const walking = fresh.filter(v => !v.asleep);
      if (!wreck || !walking.length || this.reduced()) return this.arrivals || null;
      const arrivals = new Map(this.arrivals || []);
      const now = performance.now() / 1000;
      walking.forEach((v, i) => arrivals.set(v.id, { from: { x: wreck.x + (wreck.w || 1), y: wreck.y + (wreck.h || 1) }, at: now + ARRIVE_DELAY + i * ARRIVE_GAP }));
      this.arrivalNews = walking.map((v, i) => ({ id: v.id, name: v.name, delay: ARRIVE_DELAY + i * ARRIVE_GAP }));
      return arrivals;
    },
    // Chaque naufragé qui débarque : la caméra glisse vers sa place, une bulle dit qui arrive (après villageOf)
    showArrivals() {
      const news = this.arrivalNews || [];
      clearTimeout(this.arrivalTimer);
      const next = k => {
        const v = news[k];
        if (!v || !this.village) return;
        const r = this.village.residents.find(res => res.role === v.id);
        if (r && this.geo) {
          const g = this.ground(r.work.x, r.work.y);
          this.glideTo({ x: g.x, y: g.y, s: Math.max(this.cam.s, 1.1) });
          const camp = r.camp || r.role === 'foyer';
          this.$nextTick(() => this.showTip(this.geo.width / 2, this.geo.height / 2 - TW, { title: v.name, text: camp ? 'débarque et rejoint le camp.' : 'débarque sur l’île.' }));
        }
        if (news[k + 1]) this.arrivalTimer = setTimeout(() => next(k + 1), (news[k + 1].delay - v.delay) * 1000);
      };
      if (news.length) this.arrivalTimer = setTimeout(() => next(0), news[0].delay * 1000);
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
    // Les poules de Cannelle autour de leur cage ouverte (le camp, vu du serveur) : { x, y, hens }, ou null
    coopOf(state) {
      const cage = (state.camp || []).find(c => c.id === 'cage' && c.art === 'cage_ouverte');
      const hens = state.beasts ? state.beasts.list.filter(b => b.species === 'hen') : [];
      return cage && hens.length ? { x: cage.x, y: cage.y, hens: hens.map(b => ({ id: b.id, name: b.name, ready: b.ready })) } : null;
    },
    // Toucher la cage coincée sous les rochers : elle s'ouvre, Paprika, Brioche et Madame sortent (étape 8 du tutoriel)
    async openCage(at = null) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { world } = await playService.beastsCage();
        this.apply(world);
        if (at && !this.reduced()) {
          ring(at, 90);
          burst(at, 22, 70);
        }
        vibrate([12, 40, 18]);
        this.$emit('show-alert', 'Cannelle : « Mes filles ! Elles ont tenu le coup, mes filles ! » Brioche, Paprika et Madame sont sorties.');
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La cage n’a pas pu s’ouvrir.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
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
        id: line.id, text: line.text, ...(line.who === 'brume' ? {} : { who: NAMES[line.who], ...bubbleFace(line.who, { castaway: !built.includes(line.who) }) })
      }));
    },
    // Les Savoirs et le Bestiaire, dits une fois (bible, § 6.4 et § 6.5) : un maître à qui bavarder ; Bulle revenu dans
    // le bocal d'Ondin ; une bête écrite qui vit sur l'île (Sylve la présente, si elle est là)
    bestiaryTips(state) {
      const troupe = new Set((state.villagers || []).map(v => v.id));
      // (après le tutoriel : une chose à la fois)
      if (troupe.size && !this.thickMist()) guide.tip('savoirs');
      const written = new Set(this.elements);
      if (troupe.has('puits') && written.has('Poisson')) guide.tip('bulle');
      if (BEASTS.some(name => name !== 'Poisson' && written.has(name)) && !this.thickMist(state)) {
        const sylve = troupe.has('bosquet');
        guide.say({ id: 'bestiaire', ...(sylve ? { text: TIPS.bestiaireSylve, who: 'Sylve', ...bubbleFace('bosquet', { castaway: !builtOf(state.villagers).includes('bosquet'), mood: 'emerveille' }) } : { text: TIPS.bestiaire }) });
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
          .map(([r, n]) => `${n} ${LABEL[r].toLowerCase()} (tu en as ${this.stockPaid[r] || 0})`).join(', ');
        this.choose({
          key: `manque:${asking.beast || asking.id}`, action: 'Jouer une Récolte',
          info: { title: 'Il te manque de quoi', text: `Il faut ${lacking}. La Récolte en donne ; la mer en rend aussi sur le rivage, et les poules nourries pondent.` },
          ring: { x: asking.x, y: asking.y, rx: asking.r + 3, ry: (asking.r + 3) * 0.55 },
          run: () => this.startHarvest()
        }, px, py);
        return;
      }
      this.busy = true;
      try {
        const { coins, world } = asking.beast ? await playService.beastFeed(asking.beast) : await playService.villagerNeed(friend.id, need.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        const sp = this.toScreen(asking.x, asking.y);
        burst(this.canvasPoint(sp.x, sp.y), 12, 50);
        vibrate(10);
        if (friend && THANKS[need.id]) this.showTip(px, py, { title: friend.name, text: THANKS[need.id] });
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
        const { collected, coins, world } = await playService.beastFeed(this.beastView.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
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
