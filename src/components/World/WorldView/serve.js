// L'île reçue du serveur : son chargement, puis son application, étape par étape (ce qui a changé et se dit, le sol,
// le décor, la vie, la brume, ce qui était choisi). La vue montre ce que le tutoriel laisse voir (castaways.js :
// unsettledView) ; un changement de ce qu'il laisse voir fait réappliquer la dernière réponse. Mixin de WorldView.vue.

import playService from '@/services/playService';
import { guide } from '@/game/guide';
import { looksOf, hiddenOf } from '@/game/stages';
import { missingOf } from '@/world/needs';
import { secretDue, secretOf } from '@/game/opus';
import { bubbleFace, builtOf } from '@/world/faces';
import { islandOf, liveOf, TerrainCache, FEATHER, pavedAt } from '@/world/terrain';
import { onPathsLoaded } from '@/world/pathArt';
import { FLOATING_ZONE, isletsOf } from '@/world/islets';
import { JUNGLE_ZONE, JUNGLE_FX, JUNGLE_KINDS, JUNGLE_GRANDES } from '@/world/plants';
import { inJungle } from '@/world/jungleLayout';
import { riverLampsOf } from '@/world/pontRiviere';
import { seaOf } from '@/world/sea';
import { memory } from '@/world/view/memory';
import { variantsOf } from '@/world/annexes';
import { villageOf } from '@/world/village';
import { kitNow, loadKit } from '@/game/avatarKit';
import { landmarksShown } from '@/world/landmarks';
import { depositsShown } from '@/world/finds';
import { CLIMATE_NAMES } from '@/world/climates';
import { gatheredBetween } from '@/world/pending';
import { dueIn } from '@/world/due';
import { TOASTS } from '@/texts/world/screens/alerts';
import { loadText, saveText } from '@/utils/storage';

// Le dernier arrivant vu accoster sur cet appareil (son id, en texte)
const ARRIVAL_SEEN_KEY = 'oc_arrival_seen';

export default {
  watch: {
    // Le tutoriel avance (game/stages.js) : sa scène vue, il débarque sous nos yeux sur notre plage (même si cet appareil
    // l'a déjà compté, l'île ayant pu se relire avant que l'App ne le sache) ; son camp choisi, son coin et sa zone se
    // découvrent ; sa scène vue, son chantier se montre
    stage(now, before) {
      if (!this.served || JSON.stringify(now) === JSON.stringify(before)) return;
      // (pendant la chasse aux poules, une prise retenue ne relance rien sous la scène : l'île se relit à sa fin, hens.js)
      if (this.henChase) {
        this.stageLater = true;
        return;
      }
      const away = hiddenOf(before, 'arrived');
      this.landing(away.filter(id => looksOf(now, id).arrived));
      this.apply(this.served, { quiet: true });
    }
  },
  methods: {
    // Les conseils de l'île (dits une fois, un seul par arrivée : game/guide.js) : à chaque arrivée, et quand le tutoriel
    // finit sous nos yeux (App, story.js : refusés pendant le tutoriel, ils attendaient sinon un aller-retour au Grimoire)
    islandTips(state = this.state) {
      if (!state) return;
      // Premier bâtiment au palier II : ses annexes s'ouvrent
      if (state.sites.some(s => s.level >= 2 && !s.locked)) guide.tip('annexes');
      // Deux habitants ou plus : ils ont un prénom, on peut s'en faire des amis (après le tutoriel : une chose à la fois)
      if ((state.villagers || []).length >= 2 && !this.thickMist(state)) guide.tip('friends');
      // Un habitant à qui il manque quelque chose : ses besoins et son humeur
      if ((state.villagers || []).some(v => missingOf(v).length)) guide.tip('needs');
      // Un arrivant vient d'accoster
      if (state.arrival) guide.tip('visitor');
      // Premier mini-jeu ouvert (Ponton, Carrière ou Bosquet au palier III)
      if ((state.games || []).some(g => g.open)) guide.tip('games');
      this.bestiaryTips(state);
    },
    async load() {
      // (une action appliquée pendant la relecture est plus récente qu'elle : sa réponse n'est pas écrasée par l'île d'avant)
      const seq = this.appliedSeq;
      try {
        const state = await playService.world();
        if (this.gone || this.appliedSeq !== seq) return;
        this.apply(state, { quiet: true });
        this.guest = false;
        this.loadError = false;
        this.islandTips(state);
        // Acte VI : Robby a lu la dernière rune ; Brume comprend (dit une fois)
        if (secretDue(state.brume && state.brume.acts, state.brume && state.brume.quest)) {
          const built = builtOf(state.villagers);
          secretOf(Boolean(state.anya && state.anya.awake)).forEach(line => guide.say({ id: line.id, text: line.text, ...(line.who ? { who: line.who, ...bubbleFace(line.face, { castaway: !built.includes(line.face) }) } : {}) }));
        }
      } catch (error) {
        if (this.gone) return;
        // (rien à attendre : l'île montre son invitation ou son erreur)
        this.endLoading();
        if ([401, 402].includes(error.response?.status)) {
          this.guest = true;
          this.state = null;
          return;
        }
        console.error('Erreur lors du chargement de l’île:', error);
        // (une relecture de fond qui échoue ne cache pas l'île ni ses barres : elle se retente d'elle-même)
        this.loadError = !this.state;
      }
    },
    // quiet : une simple relecture de l'île (rien n'a été ramassé en passant), ou « Tout ramasser », qui le dit lui-même
    apply(served, { quiet = false } = {}) {
      // (ce que le serveur a envoyé, gardé tel quel ; l'île montre ce que le tutoriel laisse voir : unsettledView)
      this.served = served;
      this.appliedSeq = (this.appliedSeq || 0) + 1;
      const before = this.state;
      const state = this.unsettledView(served);
      this.noticeChanges(state, quiet);
      this.syncGeometry(state);
      this.syncDecor(state);
      this.syncLife(state);
      this.state = state;
      // (l'arc du Phare : une quête réclamée, un palier, un quartier acheté ; phare.js ; dit avant que l'application
      // ne l'apprenne : une scène de l'arc attend ses répliques)
      this.arcLines(before, state);
      this.emitQuest();
      this.firstTimes(state);
      this.coopLines(state);
      this.$nextTick(() => this.checkNights());
      this.syncMist(state);
      this.syncSelection(state);
      this.$nextTick(() => {
        this.setup();
        this.draw(performance.now());
        this.syncLoop();
      });
    },
    // Ce qui a changé depuis la dernière vue et se dit ou se montre : remboursement, réveil, bâtiment qui s'élève,
    // expédition revenue, ramassé en passant (rien si quiet)
    noticeChanges(state, quiet) {
      // Les décorations de l'ancienne règle viennent d'être remboursées (une seule fois) : le solde suit, l'île le dit
      if (state.refund) {
        const { count, coins, balance } = state.refund;
        this.$emit('coins-updated', balance);
        this.$emit('show-alert', TOASTS.refund(count, coins));
      }
      // Un dormeur qu'on vient de réveiller (bible, § 6.7) : l'île le dit
      if (this.state) {
        const slept = new Set((this.state.villagers || []).filter(v => v.asleep).map(v => v.id));
        (state.villagers || []).filter(v => slept.has(v.id) && !v.asleep).forEach(v => {
          this.$emit('show-alert', TOASTS.awake(v.name));
          // (réveillé loin de sa place, à l'orée de sa forêt : il y marche, sous nos yeux ; castaways.js, bedsOf)
          this.wakeWalk(state, v.id);
        });
      }
      // Un niveau gagné depuis le dernier état : c'est la fête (le bâtiment s'élève sous les yeux du joueur : fetes.js)
      if (this.state) {
        const before = new Map(this.state.sites.map(site => [site.id, site]));
        state.sites.forEach(site => {
          const was = before.get(site.id);
          if (was && site.level > was.level) this.celebrate(site, was.level, was.look);
        });
      }
      // Expédition revenue : le quartier qu'elle a découvert se dévoile (nom, climat, relief)
      if (this.state) {
        const unknown = new Set(this.state.map.zones.filter(z => z.known === false).map(z => z.id));
        const found = state.map.zones.filter(z => unknown.has(z.id) && z.known !== false);
        if (found.length) {
          found.forEach(z => this.unveils.set(z.id, performance.now()));
          // (un quartier à l'écran a sa Fête de découverte ; hors de l'écran, une notification le dit : choix de
          // l'auteur, 13 oct.)
          const away = found.filter(z => !this.celebrateZone(z));
          if (away.length) this.$emit('show-alert', away.map(z => TOASTS.expeditionBack(z.name, CLIMATE_NAMES[z.climate])).join(' '));
        }
      }
      // Une action a ramassé en passant ce qui attendait (le serveur encaisse avant de payer) : l'île le dit
      if (this.state && !quiet) {
        const { coins = 0, ...stock } = gatheredBetween(this.state, state);
        const got = this.gainsOf(stock, coins);
        if (got.length) this.$emit('show-alert', TOASTS.gathered, 'gain', got);
      }
    },
    // Le sol (relief, eaux, lave, îlots, cases des quartiers, rivage) : refait seulement quand ses calques changent
    syncGeometry(state) {
      const geoKey = state.map.key ? `${state.map.key}:${state.size}` : null;
      if (!geoKey || geoKey !== this.geoKey) {
        // Calques du sol ; la brume est peinte dans les carrés du sol : un quartier acheté fait refaire les siens
        const M = islandOf(state.map, state.size, state.map.zones.findIndex(z => z.id === FLOATING_ZONE));
        // (les cases pavées : terrain.js, pavedAt ; la clé de la carte change avec elles, serveur : world/paths.js)
        const paved = new Set(((state.roads && state.roads.paved) || []).map(([x, y]) => y * state.size + x));
        M.isPaved = (x, y) => paved.has(y * state.size + x);
        // (la jungle du départ : son sol, son air ; terrain.js, lumiere/jungle.js)
        const jungleZone = state.map.zones.findIndex(z => z.id === JUNGLE_ZONE);
        M.jungle = (x, y) => inJungle(x, y, jungleZone >= 0 && M.zone(x, y) === jungleZone);
        if (!this.terrain) this.terrain = new TerrainCache(M, (x, y) => this.veilAt(x, y), (ctx, x, y) => this.standAt(ctx, x, y));
        else if (this.M) {
          // Le sol a changé (un chemin tracé, un quartier dévoilé) : les carrés des cases changées et de leurs voisines
          // (les raccords des chemins) sont refaits
          const old = this.M;
          const changed = [];
          for (let y = 0; y < state.size; y++) {
            for (let x = 0; x < state.size; x++) {
              if (old.ground(x, y) === M.ground(x, y) && pavedAt(old, x, y) === pavedAt(M, x, y)) continue;
              for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) changed.push([x + dx, y + dy]);
            }
          }
          this.terrain.M = M;
          // (une boîte par grappe de cases : un chemin ici et un quartier là-bas ne refont pas toute l'île entre eux)
          for (let i = 0; i < changed.length; i += 9) this.terrain.invalidate(changed.slice(i, i + 9));
        }
        // Les chemins de la bibliothèque arrivent peu à peu (pathArt.js) : leurs carrés de sol sont refaits
        const paths = [];
        for (let y = 0; y < state.size; y++) for (let x = 0; x < state.size; x++) if (M.ground(x, y) === 'p') paths.push([x, y]);
        onPathsLoaded(() => { if (this.terrain && this.M === M) this.terrain.invalidate(paths); });
        this.M = M;
        this.live = liveOf(M);
        // Cases de lave : elles luisent la nuit (gx, gy : leur case, pour la règle des lumières : draw/air.js)
        this.lavaCells = [];
        for (let y = 0; y < state.size; y++) for (let x = 0; x < state.size; x++) if (M.ground(x, y) === 'o') this.lavaCells.push({ ...this.ground(x, y), gx: x, gy: y });
        // Îlots des chapitres VI et VII : île flottante, colonie de mouettes, barque du passeur, lanternes du pont
        this.islets = isletsOf(M, (x, y) => (state.map.zones[M.zone(x, y)] || {}).id);
        // Lanternes des ponts de la rivière : elles s'allument la nuit (pas sous la brume : draw/air.js)
        this.riverLamps = riverLampsOf(M);
        if (!this.sea) this.sea = seaOf(M);
        // (ajoutées en place : recopier la liste à chaque case coûtait le carré de la taille du quartier)
        this.zoneTiles = new Map();
        for (let y = 0; y < state.size; y++) {
          for (let x = 0; x < state.size; x++) {
            const zone = state.map.zones[M.zone(x, y)];
            if (!zone) continue;
            if (!this.zoneTiles.has(zone.id)) this.zoneTiles.set(zone.id, []);
            this.zoneTiles.get(zone.id).push([x, y]);
          }
        }
        this.shore = this.shoreOf(state);
        this.geoKey = geoKey;
      }
    },
    // Le décor : la fiche ouverte avant de quitter l'île, les annexes, la nature (cuite dans le sol ou dessinée à part)
    syncDecor(state) {
      // Retour sur l'île : la fiche qui était ouverte se rouvre
      if (!this.state && memory.view && memory.view.site) {
        this.site = state.sites.find(s => s.id === memory.view.site) || null;
        this.siteTab = memory.view.siteTab || 'overview';
      }
      this.annexVariants = variantsOf(state.annexes || []);
      this.props = this.natureOf(state);
      // (la jungle du départ : ce qui luit la nuit, ce qui a ses effets animés ; rangés une fois, pas à chaque image)
      this.jungleGlows = this.props.filter(prop => prop.glow);
      this.jungleFx = this.props.filter(prop => JUNGLE_FX.has(prop.kind));
      // Décor par case, cuit dans le sol sauf de près ; celui qui entoure ce qui se tient debout reste dessiné à part
      // (liveProps), pour passer devant dans l'ordre du relief. Si le décor cuit a changé, ses carrés seront refaits
      const live = this.liveCellsOf(state);
      this.liveProps = this.props.filter(prop => live.has(prop.y * state.size + prop.x));
      // (de près, la petite jungle loin de ce qui se tient debout est cuite dans le sol, elle aussi : still ; terrain.js,
      // NEAR_BAKE ; ses grandes plantes non : elles plient au souffle, world/plants.js : JUNGLE_GRANDES)
      for (const prop of this.props) prop.still = JUNGLE_KINDS.has(prop.kind) && !JUNGLE_GRANDES.has(prop.kind) && !live.has(prop.y * state.size + prop.x);
      this.nearProps = this.props.filter(prop => !prop.still);
      this.propsAt = new Map();
      for (const prop of this.props) {
        const key = prop.y * state.size + prop.x;
        if (live.has(key)) continue;
        this.propsAt.set(key, [...(this.propsAt.get(key) || []), prop]);
      }
      const propsKey = [...this.propsAt.values()].flat().map(p => `${p.kind}${p.x},${p.y}`).join(';');
      if (this.propsKey !== undefined && propsKey !== this.propsKey) this.terrain.restand();
      this.propsKey = propsKey;
    },
    // La vie : mouettes, bouteille à la mer, habitants et bêtes, naufragés qui débarquent, bateau du visiteur
    syncLife(state) {
      this.perches = this.perchesOf(state);
      // Le rivage où sautent les poissons : devant la terre des quartiers à soi (sous la brume, rien)
      const owned = (x, y) => this.landAt(x, y) && Boolean((state.map.zones[this.M.zone(x, y)] || {}).owned);
      this.fishShore = this.shore.filter(c => owned(c.x - 1, c.y) || owned(c.x, c.y - 1));
      this.bottleSpot = this.bottleSpotOf(state);
      this.bottleAshore(state);
      // Habitants et bêtes : ils vivent dans les quartiers à soi, autour des bâtiments bâtis
      this.arrivals = this.arrivalsOf(state);
      // (chaque case du camp des naufragés : on n'y marche pas, et les bêtes la contournent)
      const camp = (state.camp || []).flatMap(c => Array.from({ length: c.w * c.h }, (_, i) => ({ x: c.x + (i % c.w), y: c.y + Math.floor(i / c.w) })));
      this.village = villageOf({
        n: state.size, M: this.M, sites: state.sites, crafts: state.crafts ? state.crafts.placed : [], props: this.props, annexes: state.annexes || [],
        owned: new Set(state.map.zones.map((z, i) => (z.owned ? i : -1)).filter(i => i >= 0)), visitor: state.arrival || null,
        settlers: (state.villagers || []).filter(v => v.seed !== undefined),
        zoneIds: state.map.zones.map(z => z.id),
        // (les lieux, les gisements et le camp : on les contourne)
        avoid: [...landmarksShown(state), ...depositsShown(state), ...camp],
        camp,
        // La troupe rencontrée (serveur) : bâtie, au camp, ou endormie (qui n'a pas encore paru n'y est pas)
        troupe: (state.villagers || []).filter(v => v.seed === undefined && looksOf(this.stage, v.id).arrived).map(v => ({ id: v.id, built: v.built !== false, asleep: Boolean(v.asleep), mood: v.mood || null })),
        // Pendant le tutoriel, chacun se tient là où son étape se joue : débarqué sur notre plage, près de l'épave ; son
        // camp choisi, à son chantier, même pas encore bâti (pas au Feu)
        posts: this.postsOf(state),
        beds: this.bedsOf(state),
        written: this.elements,
        // Anya révélée : elle erre (son passage du jour, tiré par le serveur) ; le bol de la Dame, dès qu'on la pressent
        // (le Cercle trouvé, une trace)
        anya: state.anya && state.anya.revealed ? { visit: state.anya.visit || null } : null,
        dame: Boolean((state.landmarks || []).some(l => l.id === 'menhirs' && l.found) || (state.anya && state.anya.traces.length)),
        coop: this.coopOf(state),
        // Le tutoriel : chacun à sa place, pas encore de bêtes des bois ; les naufragés qui débarquent (castaways.js)
        calm: this.thickMist(state),
        acts: state.brume ? state.brume.acts : [],
        arrivals: this.arrivals,
        // (le village d'avant : ses chemins et ses tournées resservent, chacun repart d'où il se tenait)
        before: this.village
      });
      this.showArrivals();
      // (les habitants venus d'ailleurs se dessinent par le générateur de l'avatar, chargé à la demande : l'île se
      // redessine quand il arrive ; arrivantArt.js)
      if (!kitNow() && (state.arrival || (state.villagers || []).some(v => v.seed !== undefined))) loadKit().then(() => this.draw(performance.now()));
      // Arrivant : sa barque s'amarre près du Ponton ; un arrivant jamais vu sur cet appareil arrive sous les yeux
      this.visitorDock = state.arrival ? this.dockOf(state, this.M) : null;
      if (state.arrival && this.visitorDock && !this.reduced()) {
        if (loadText(ARRIVAL_SEEN_KEY) !== String(state.arrival.id)) {
          this.boatArrival = { id: state.arrival.id, at: performance.now() / 1000 };
          saveText(ARRIVAL_SEEN_KEY, String(state.arrival.id));
        }
      }
    },
    // La brume : les quartiers (à soi, épaisse, connue, inconnue) et les cases du cœur encore voilées ; ce qui change
    // refait ses carrés de sol, et ceux de ses voisins sur FEATHER cases (le voile s'y épaissit ou s'éclaircit)
    syncMist(state) {
      // Brume et sol d'un quartier : à soi (o), sous la brume épaisse du tutoriel (t), connu (k), inconnu (u) ; un
      // changement refait ses carrés de sol
      const mistKey = state.map.zones.map(z => `${z.id}:${z.owned ? 'o' : this.zoneThick(z, state) ? 't' : z.known === false ? 'u' : 'k'}`).join();
      // Les cases du cœur encore sous la brume (world/reveal.js) : celles qui changent refont leurs carrés de sol
      const veiled = this.veiledOf(state);
      if (this.veiled) {
        const changed = [...new Set([...veiled, ...this.veiled])].filter(k => veiled.has(k) !== this.veiled.has(k));
        if (changed.length && this.terrain) this.terrain.invalidate(changed.map(k => [k % state.size, Math.floor(k / state.size)]), FEATHER);
      }
      this.veiled = veiled;
      if (this.mistKey !== null && mistKey !== this.mistKey) {
        const before = new Set(this.mistKey.split(',')), after = new Set(mistKey.split(','));
        const changed = [...new Set([...before, ...after].map(k => k.split(':')[0]))].filter(id => [...before].find(k => k.startsWith(`${id}:`)) !== [...after].find(k => k.startsWith(`${id}:`)));
        this.terrain.invalidate(changed.flatMap(id => this.zoneTiles.get(id) || []), FEATHER);
      }
      this.mistKey = mistKey;
    },
    // L'horloge de la vue, et ce qui était choisi (fiche, pose en cours), s'il a encore lieu d'être
    syncSelection(state) {
      this.loadedAt = Date.now();
      this.clock = this.loadedAt;
      this.dueIn = dueIn(state, this.loadedAt);
      if (this.site) this.site = state.sites.find(s => s.id === this.site.id) || null;
      // Pose d'annexe en cours : abandonnée si le bâtiment n'a plus de case libre ; de même pour une création
      if (this.annexPlacing && !this.annexSpots.length) this.cancelAnnex();
      if (this.craftPlacing && !this.craftSpots.length) this.cancelCraft();
      if (this.craftMenu && !this.crafted.some(c => c.x === this.craftMenu.x && c.y === this.craftMenu.y)) this.craftMenu = null;
    }
  }
};
