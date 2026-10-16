// Vie ambiante de l'île : habitants et bêtes. Qui vit où, par où ils passent et ce qu'ils font à chaque instant,
// selon l'heure et le temps qu'il fait (sky.js). Rien n'est gardé par le serveur : tout se déduit de l'île (bâtiments
// bâtis, quartiers à soi, décor) et du temps.
// - Habitants : un par bâtiment bâti (son métier), plus la cuisinière du Foyer, dessinés sous trois angles
//   (villagers.js) : ils regardent où ils vont. Chacun suit son agenda (village/agenda.js) : le jour il travaille et
//   fait sa tournée par les chemins, tient son rituel, mange au Foyer à midi, passe voir un camarade ; le soir il
//   rentre au Foyer avec une lanterne ; la nuit il dort couché chez lui. Sous la pluie, un sur deux s'abrite à sa
//   porte, les autres sortent avec un parapluie. Il marche d'une place à l'autre (rien ne saute). Chacun a son allure
//   (traînante quand il est triste), sa file quand il marche, sa place autour d'un arrêt (personne ne marche sur
//   personne), et une journée qui change chaque jour de l'île.
// - Visiteur (lot 7d, vue du serveur) : arrivé en bateau, il flâne entre le Ponton, le Foyer et les bâtiments. Les
//   visiteurs installés travaillent au bâtiment de leur métier et passent par leur maison.
// - Ferme : les poules d’Agathe (Caramel et ses poussins, Flocon, Réglisse), au camp autour de leur cage une fois
//   ouverte, un œuf au sol près de celle dont la bulle attend ; avec les paliers du Potager, vache, moutons, cochon,
//   chèvre, qui broutent autour de lui. Toutes se couchent la nuit et ne bougent plus sous la pluie.
// - Bois : lapins le jour, cerf à l'aube et au crépuscule, renard et hérisson la nuit, écureuil dans les arbres.
//   Touchés, ils s'enfuient. Eau : carpes koï dans l'eau douce, héron le matin.
// - Climats : deux bêtes par climat, une de chaque dans chaque quartier à soi de ce climat, sur une case libre (ni
//   décor, ni bâtiment, ni création, ni annexe, ni la clairière d'un gisement ou d'un lieu remarquable). Chacune a ses
//   heures (le fennec et la salamandre sortent la nuit) ; hors de ses heures, ou sous la pluie, elle se couche sur place.
//   Touchées, elles s'enfuient.
// - Bestiaire (bible, § 6.5 : bestiary.js) : les bêtes écrites dans le Grimoire s'y ajoutent (mésanges et hibou dans
//   les arbres, papillons et abeilles le jour, lucioles la nuit, grenouille et tortue au bord de l'eau douce, une
//   variante de plus à la ferme). Les familiers suivent leur maître, un pas derrière lui ; le bocal de Léo attend
//   près de lui, vide tant que Poisson n'est pas écrit.
// - Anya (bible, § 6.14, v6), une fois révélée : elle erre. Les jours de son passage, à l'aube ou au crépuscule, elle
//   se tient où le serveur l'a tirée, avec son grand cerf blanc et un halo de lucioles, et les bêtes alentour se
//   tournent toutes vers elle. Ses créatures (les loutres) jouent chaque jour au bord de l'eau douce. Avant même la
//   Révélation, Agathe pose chaque soir un bol de soupe « pour la Dame » au bord du Foyer.
//
// Ce fichier assemble le village et répond au toucher ; chaque sujet vit à côté, dans village/ : où l'on marche
// (paths.js), les habitants (residents.js), la ferme (farm.js), les bêtes sauvages (wild.js), Anya (anya.js), le dessin
// d'une bête (beast.js). Les paroles sont dans texts/village.js.
import { bestiaryOf, FAMILIARS } from './bestiary';
import { WORK_LINES, HEN_LINES, SOUNDS, BEAST_NAMES, VILLAGER_SAYS, VILLAGER_SHEETS, TOUCH_HINTS, PET_SAYS, UNKNOWN_BEAST, RITUAL_SAYS, MEAL_SAYS, VISIT_SAYS, MOOD_SAYS, WINTER_SAYS } from '@/texts/village';
import { gridOf, route, doorOf } from './village/paths';
import { residentsOf, plannerOf, drawResidents } from './village/residents';
import { farmOf, drawFarm } from './village/farm';
import { habitatsOf, wildPainter, drawWild, drawKoi, isWild } from './village/wild';
import { drawAnya, anyaSign, storyInfo } from './village/anya';
import { hash } from './village/beast';
import { dayHourOf } from './gameClock';
import { momentOf, visitOf } from './village/agenda';
import { SEASON } from './plants';

export { BEAST_NAMES, isWild };

/* ---------- Le village ---------- */
// sites : bâtiments de l'île ({ id, x, y, w, h, level, locked, name }) ; owned : indices des quartiers à soi ;
// crafts : créations d'île posées ({ x, y }) ; props : décor naturel ({ kind, x, y }) ; annexes : annexes posées ({ x, y, site }) ;
// visitor : visiteur du moment (vue du serveur) ou null ; settlers : visiteurs installés ({ id, seed, role, site, home }) ;
// climates : climat de chaque quartier (par indice) ; avoid : cases à laisser libres autour (gisements, lieux remarquables) ;
// camp : les cases des objets du camp des naufragés ({ x, y }), où l'on ne marche pas ;
// troupe : la troupe rencontrée, vue du serveur ({ id, built, asleep } : bible, § 6.6), ou null (un par bâtiment bâti) ;
// written : les éléments écrits dans le Grimoire (le Bestiaire et les familiers), ou null ; anya : une fois Anya
// révélée, { visit } (son passage du jour, vu du serveur : { slot, x, y }, ou null), sinon null ; dame : le bol de soupe
// du soir « pour la Dame »
// coop : les poules d’Agathe et leur cage ouverte ({ x, y, hens: [{ id, name, ready }] }), ou null
// calm : le tutoriel (choix de l'auteur, 8 oct. : le joueur doit comprendre, un personnage à la fois) : chacun reste
// près de sa place (CALM_REACH), et ni bêtes des bois ni koï : elles arrivent à la fin du tutoriel
// posts : pendant le tutoriel, où se tient chacun (Map rôle → { x, y } : la case où l'on marche la plus proche, sur la
// plage où il a débarqué ; 'site' : à son chantier, même pas encore bâti, plutôt qu'au camp du Feu), ou null
// arrivals : les naufragés qui débarquent sous les yeux (Map rôle → { from: case près de l'épave, at: instant, s }) :
// ils marchent de l'épave à leur place (ARRIVE_SPEED), s'y arrêtent ARRIVE_PAUSE, puis reprennent leur journée
export function villageOf({ n, M, sites, owned, crafts = [], props, annexes = [], visitor = null, settlers = [], climates = [], avoid = [], camp = [], troupe = null, written = null, anya = null, dame = false, coop = null, calm = false, arrivals = null, acts = [], posts = null, beds = null }) {
  const grid = gridOf({ n, M, sites, owned, crafts, props, annexes, camp });
  const bestiary = bestiaryOf(written);
  // Les bêtes des bois arrivent peu à peu, acte après acte (choix de l'auteur : pas toutes d'un coup sur l'île)
  const doneAct = id => acts.includes(id);
  const built = sites.filter(s => s.level > 0 && !s.locked);
  const doors = Object.fromEntries(built.map(s => [s.id, doorOf(grid, s)]).filter(([, d]) => d));
  const foyer = built.find(s => s.id === 'foyer');
  const home = doors.foyer || Object.values(doors)[0] || null;
  const routes = new Map();
  const routeOf = (a, b) => {
    const key = `${a.x},${a.y}>${b.x},${b.y}`;
    if (!routes.has(key)) routes.set(key, route(grid, a, b));
    return routes.get(key);
  };
  const stops = Object.values(doors);

  const residents = residentsOf({ grid, M, sites, built, doors, home, foyer, troupe, posts, beds, settlers, visitor, annexes, bestiary });
  const planner = plannerOf({ grid, stops, home, calm, routeOf });
  const farm = farmOf({ grid, M, built, coop, bestiary });
  const habitats = habitatsOf({ n, M, owned, grid, props, avoid, climates });

  // Tout ce qui vit à l'instant t (secondes) sous ce ciel : [{ id, kind, species, x, y, z, flip, sprite: [clé, dessin] }]
  // et les lanternes [{ x, y }] ; scared : touchers récents (Map id → { at }) ; loose : les poules échappées du tutoriel
  // (WorldView, hens.js : Map id → { from, to, at, span }), chacune à sa place, qui bondit quand elle s'esquive
  function at(t, phase, scared = new Map(), loose = null) {
    const out = [];
    const lights = [];
    const h = phase.hour;
    const rain = phase.weather.rain;
    // Le jour (les places des bêtes en changent) ; celui de l'île, pour l'agenda des habitants (gameClock.js : il change
    // à minuit, toutes les 90 min)
    const day = Math.floor(Date.now() / 86400000);
    const islandDay = dayHourOf(Date.now()).day;
    const tapped = (id, span) => {
      const s = scared.get(id);
      return s && t - s.at < span ? (t - s.at) / span : null;
    };
    const dawn = h > phase.rise - 0.6 && h < phase.rise + 1.6;
    const dusk = h > phase.set - 1.2 && h < phase.set + 0.6;
    const dayTime = h > phase.rise + 0.5 && h < phase.set - 0.5;
    const night = phase.night > 0.5;
    const meets = [];
    const f = { t, h, rain, day, islandDay, phase, tapped, out, lights, meets, dawn, dusk, dayTime, night };
    drawResidents(f, { residents, ...planner, arrivals, bestiary, calm });
    drawFarm(f, farm, loose);
    const paint = wildPainter(f, calm);
    drawWild(f, paint, { habitats, bestiary, doneAct, doors, home, climates });
    const here = drawAnya(f, paint, { anya, banks: habitats.banks, dame, home });
    drawKoi(f, habitats.water, calm);
    anyaSign(out, here);
    // La lueur des lucioles, la nuit (la teinte de la nuit éteindrait le halo de leur dessin)
    for (const b of out) if (b.glow) lights.push({ x: b.x, y: b.y, dx: 0, dy: -b.z, r: 9, color: '255,236,140', a: b.glow });
    return { list: out, lights, meets };
  }
  // Ce que dit un familier qu'on touche, ou sa fiche courte (appui long)
  function petInfo(who, long) {
    const id = who.id.split(':')[1];
    const pet = who.id === 'fam:atelier:amie' ? PET_SAYS.amie : id === 'puits' ? PET_SAYS[bestiary.bulle ? 'bulle' : 'bocal'] : null;
    if (pet) return { title: pet.title, text: long ? pet.long : pet.short };
    const f = FAMILIARS[id];
    return { title: long ? `${f.name} · familier` : f.name, text: long ? f.text : f.says };
  }
  // Ce que fait un maître à cet instant (agenda.js), sa visite du jour comprise
  function moment(r, phase) {
    const day = dayHourOf(Date.now()).day;
    const others = residents.filter(o => o.master && !o.asleep && !o.swim && o !== r).map(o => o.role);
    return momentOf(r, phase.hour, phase, { rain: phase.weather.rain, calm, visit: r.master && !calm ? visitOf(r, day, others) : null });
  }
  // La dernière réplique de chacun (il ne la redit pas tout de suite)
  const lastSaid = new Map();
  // Ce que dit un habitant ou une bête de la ferme qu'on touche ; null pour les bêtes sauvages (elles s'enfuient)
  function say(who, phase) {
    if (who.id && who.id.startsWith('fam:')) return petInfo(who, false);
    if (who.id && (who.id.startsWith('anya:') || who.id === 'dame:bol')) return storyInfo(who, false);
    if (who.kind === 'villager') {
      const r = residents.find(v => v.id === who.id);
      if (!r) return null;
      if (r.guest) return { title: r.guest.name, text: '' };
      // (endormi : il ne dit rien, sa pose et ses « z » suffisent)
      if (r.asleep) return { title: r.look.label, text: '' };
      const evening = phase.hour >= phase.set + 0.4;
      // (le temps qu'il fait : la réplique du maître, ou la commune pour un voyageur installé)
      const voice = r.key.startsWith('vil-') ? r.role : null;
      // Ce qu'il fait (agenda.js, lot B) : la réplique de son rituel, du repas, de sa visite, d'abord
      const now = voice && moment(r, phase);
      // (il dort sa nuit : il ne dit rien, comme un dormeur)
      if (now && now.mode === 'nuit') return { title: r.look.label, text: '' };
      const doing = now && (now.ritual ? RITUAL_SAYS : now.mode === 'repas' ? MEAL_SAYS : now.mode === 'visite' ? VISIT_SAYS : null);
      if (doing && doing[voice]) return { title: r.look.label, text: doing[voice] };
      const weather = says => says[voice] || says.common;
      const lines = phase.weather.storm > 0.5
        ? [weather(VILLAGER_SAYS.storm)]
        : phase.weather.rain > 0.5
          ? [weather(VILLAGER_SAYS.rain)]
          : evening
            ? [weather(VILLAGER_SAYS.evening)]
            : phase.hour < phase.rise + 1.5
              ? [weather(VILLAGER_SAYS.dawn), ...WORK_LINES[r.role]]
              : WORK_LINES[r.role];
      // (son humeur et l'hiver s'y ajoutent ; jamais deux fois de suite la même)
      const pool = [...lines, ...(voice && MOOD_SAYS[r.mood] ? [MOOD_SAYS[r.mood][voice]] : []), ...(voice && SEASON === 'hiver' ? [WINTER_SAYS[voice]] : [])];
      let i = Math.floor(hash(Math.floor(Date.now() / 7000), r.k) * pool.length);
      if (pool.length > 1 && pool[i] === lastSaid.get(r.id)) i = (i + 1) % pool.length;
      lastSaid.set(r.id, pool[i]);
      return { title: r.look.label, text: pool[i] };
    }
    const hen = coop && who.beast && coop.hens.find(h => h.id === who.beast);
    if (hen) return { title: hen.name, text: SOUNDS[hen.species] || SOUNDS.hen };
    return SOUNDS[who.species] ? { title: BEAST_NAMES[who.species][0], text: SOUNDS[who.species] } : null;
  }
  // Fiche courte (appui long)
  function describe(who) {
    if (who.kind === 'villager') {
      const r = residents.find(v => v.id === who.id);
      const hint = TOUCH_HINTS.talk;
      if (r && r.guest) return { title: `${r.guest.name} · ${r.guest.role}`, text: VILLAGER_SHEETS.guest, hint };
      if (r && r.asleep) return { title: r.look.label, text: r.plank ? VILLAGER_SHEETS.plank : VILLAGER_SHEETS.asleep, hint };
      if (r && r.camp) return { title: r.look.label, text: VILLAGER_SHEETS.camp(r.site), hint };
      if (r && r.waiting) return { title: r.look.label, text: VILLAGER_SHEETS.waiting(r.site), hint };
      return r ? { title: r.look.label, text: VILLAGER_SHEETS.work(r.site), hint } : null;
    }
    if (who.id && who.id.startsWith('fam:')) return { ...petInfo(who, true), hint: TOUCH_HINTS.greet };
    if (who.id && (who.id.startsWith('anya:') || who.id === 'dame:bol')) return storyInfo(who, true);
    // Une poule d’Agathe : son prénom
    const hen = coop && who.beast && coop.hens.find(h => h.id === who.beast);
    if (hen) return { title: hen.name, text: HEN_LINES[hen.id] || BEAST_NAMES.hen[1], hint: hen.species === 'hen' ? TOUCH_HINTS.reactShe : TOUCH_HINTS.reactHe };
    const [title, text] = BEAST_NAMES[who.species] || [UNKNOWN_BEAST, ''];
    return { title, text, hint: isWild(who.species) ? TOUCH_HINTS.startle : TOUCH_HINTS.reactShe };
  }
  return { residents, farm, at, say, describe, home, foyer };
}
