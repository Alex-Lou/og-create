// Vie ambiante de l'île : habitants et bêtes. Qui vit où, par où ils passent et ce qu'ils font à chaque instant,
// selon l'heure et le temps qu'il fait (sky.js). Rien n'est gardé par le serveur : tout se déduit de l'île (bâtiments
// bâtis, quartiers à soi, décor) et du temps.
// - Habitants : un par bâtiment bâti (son métier), plus la cuisinière du Foyer, dessinés sous trois angles
//   (villagers.js) : ils regardent où ils vont. Le jour ils travaillent et font leurs tournées par les chemins ; le soir ils rentrent au Foyer avec une lanterne ; la nuit ils dorment. Sous la pluie,
//   un sur deux reste à l'abri, les autres sortent avec un parapluie. Chacun a son allure, sa file quand il marche,
//   sa place autour d'un arrêt (personne ne marche sur personne), et une tournée qui change chaque jour.
// - Visiteur (lot 7d, vue du serveur) : arrivé en bateau, il flâne entre le Ponton, le Foyer et les bâtiments. Les
//   visiteurs installés travaillent au bâtiment de leur métier et passent par leur maison.
// - Ferme : les poules de Cannelle (Paprika et ses poussins, Brioche, Madame), au camp autour de leur cage une fois
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
//   variante de plus à la ferme). Les familiers suivent leur maître, un pas derrière lui ; le bocal d'Ondin attend
//   près de lui, vide tant que Poisson n'est pas écrit.
// - Anya (bible, § 6.14, v6), une fois révélée : elle erre. Les jours de son passage, à l'aube ou au crépuscule, elle
//   se tient où le serveur l'a tirée, avec son grand cerf blanc et un halo de lucioles, et les bêtes alentour se
//   tournent toutes vers elle. Ses créatures (les loutres) jouent chaque jour au bord de l'eau douce. Avant même la
//   Révélation, Cannelle pose chaque soir un bol de soupe « pour la Dame » au bord du Foyer.
//
// Ce fichier assemble le village et répond au toucher ; chaque sujet vit à côté, dans village/ : où l'on marche
// (paths.js), les habitants (residents.js), la ferme (farm.js), les bêtes sauvages (wild.js), Anya (anya.js), le dessin
// d'une bête (beast.js). Les paroles sont dans texts/village.js.
import { bestiaryOf, FAMILIARS } from './bestiary';
import { WORK_LINES, HEN_LINES, SOUNDS, BEAST_NAMES } from '@/texts/village';
import { gridOf, route, doorOf } from './village/paths';
import { residentsOf, plannerOf, drawResidents } from './village/residents';
import { farmOf, drawFarm } from './village/farm';
import { habitatsOf, wildPainter, drawWild, drawKoi, isWild } from './village/wild';
import { drawAnya, anyaSign, storyInfo } from './village/anya';
import { hash } from './village/beast';

export { BEAST_NAMES, isWild };

/* ---------- Le village ---------- */
// sites : bâtiments de l'île ({ id, x, y, w, h, level, locked, name }) ; owned : indices des quartiers à soi ;
// crafts : créations d'île posées ({ x, y }) ; props : décor naturel ({ kind, x, y }) ; annexes : annexes posées ({ x, y, site }) ;
// visitor : visiteur du moment (vue du serveur) ou null ; settlers : visiteurs installés ({ id, seed, role, site, home }) ;
// climates : climat de chaque quartier (par indice) ; avoid : cases à laisser libres autour (gisements, lieux remarquables) ;
// troupe : la troupe rencontrée, vue du serveur ({ id, built, asleep } : bible, § 6.6), ou null (un par bâtiment bâti) ;
// written : les éléments écrits dans le Grimoire (le Bestiaire et les familiers), ou null ; anya : une fois Anya
// révélée, { visit } (son passage du jour, vu du serveur : { slot, x, y }, ou null), sinon null ; dame : le bol de soupe
// du soir « pour la Dame »
// coop : les poules de Cannelle et leur cage ouverte ({ x, y, hens: [{ id, name, ready }] }), ou null
// calm : le tutoriel (choix de l'auteur, 8 oct. : le joueur doit comprendre, un personnage à la fois) : chacun reste
// près de sa place (CALM_REACH), et ni bêtes des bois ni koï : elles arrivent à la fin du tutoriel
// posts : pendant le tutoriel, où se tient chacun (Map rôle → { x, y } : la case où l'on marche la plus proche, sur la
// plage où il a débarqué ; 'site' : à son chantier, même pas encore bâti, plutôt qu'au camp du Feu), ou null
// arrivals : les naufragés qui débarquent sous les yeux (Map rôle → { from: case près de l'épave, at: instant, s }) :
// ils marchent de l'épave à leur place (ARRIVE_SPEED), s'y arrêtent ARRIVE_PAUSE, puis reprennent leur journée
export function villageOf({ n, M, sites, owned, crafts = [], props, annexes = [], visitor = null, settlers = [], climates = [], avoid = [], troupe = null, written = null, anya = null, dame = false, coop = null, calm = false, arrivals = null, acts = [], posts = null }) {
  const grid = gridOf({ n, M, sites, owned, crafts, props, annexes });
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

  const residents = residentsOf({ grid, sites, built, doors, home, foyer, troupe, posts, settlers, visitor, annexes, bestiary });
  const { planOf, introOf } = plannerOf({ grid, stops, home, calm, routeOf });
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
    // Le jour (les tournées des habitants et les places des bêtes en changent)
    const day = Math.floor(Date.now() / 86400000);
    const tapped = (id, span) => {
      const s = scared.get(id);
      return s && t - s.at < span ? (t - s.at) / span : null;
    };
    const dawn = h > phase.rise - 0.6 && h < phase.rise + 1.6;
    const dusk = h > phase.set - 1.2 && h < phase.set + 0.6;
    const dayTime = h > phase.rise + 0.5 && h < phase.set - 0.5;
    const night = phase.night > 0.5;
    const f = { t, h, rain, day, phase, tapped, out, lights, dawn, dusk, dayTime, night };
    drawResidents(f, { residents, planOf, introOf, arrivals, bestiary });
    drawFarm(f, farm, loose);
    const paint = wildPainter(f, calm);
    drawWild(f, paint, { habitats, bestiary, doneAct, doors, home, climates });
    const here = drawAnya(f, paint, { anya, banks: habitats.banks, dame, home });
    drawKoi(f, habitats.water, calm);
    anyaSign(out, here);
    // La lueur des lucioles, la nuit (la teinte de la nuit éteindrait le halo de leur dessin)
    for (const b of out) if (b.glow) lights.push({ x: b.x, y: b.y, dx: 0, dy: -b.z, r: 9, color: '255,236,140', a: b.glow });
    return { list: out, lights };
  }
  // Ce que dit un familier qu'on touche, ou sa fiche courte (appui long)
  function petInfo(who, long) {
    const id = who.id.split(':')[1];
    if (who.id === 'fam:atelier:amie') return { title: 'L’amie de Tic-Tac', text: long ? 'Une vraie abeille : Rivet l’a fabriquée pour Tic-Tac quand Abeille a été écrite.' : 'Bzz !' };
    if (id === 'puits') {
      if (!bestiary.bulle) return { title: 'Le bocal d’Ondin', text: long ? 'Vide : « Bulle est retourné dans la mer. » Ce qu’on fabrique renaît…' : '« Bulle est retourné dans la mer. »' };
      return { title: 'Bulle', text: long ? 'Le petit poisson d’Ondin, revenu quand Poisson a été fabriqué : ce qu’on fabrique renaît.' : 'Blub !' };
    }
    const f = FAMILIARS[id];
    return { title: long ? `${f.name} · familier` : f.name, text: long ? f.text : f.says };
  }
  // Ce que dit un habitant ou une bête de la ferme qu'on touche ; null pour les bêtes sauvages (elles s'enfuient)
  function say(who, phase) {
    if (who.id && who.id.startsWith('fam:')) return petInfo(who, false);
    if (who.id && (who.id.startsWith('anya:') || who.id === 'dame:bol')) return storyInfo(who, false);
    if (who.kind === 'villager') {
      const r = residents.find(v => v.id === who.id);
      if (!r) return null;
      if (r.guest) return { title: r.guest.name, text: '' };
      if (r.asleep) return { title: r.look.label, text: 'Zzz…' };
      const evening = phase.hour >= phase.set + 0.4;
      const lines = phase.weather.storm > 0.5
        ? ['L’orage gronde, mieux vaut rentrer !']
        : phase.weather.rain > 0.5
          ? ['Quel temps ! Heureusement, j’ai mon parapluie.']
          : evening
            ? ['Belle soirée… je rentre au Foyer.', 'Les étoiles sont de sortie.']
            : phase.hour < phase.rise + 1.5
              ? ['Bonjour ! Le jour se lève sur l’île.', ...WORK_LINES[r.role]]
              : WORK_LINES[r.role];
      return { title: r.look.label, text: lines[Math.floor(hash(Math.floor(Date.now() / 7000), r.k) * lines.length)] };
    }
    const hen = coop && who.beast && coop.hens.find(h => h.id === who.beast);
    if (hen) return { title: hen.name, text: SOUNDS.hen };
    return SOUNDS[who.species] ? { title: BEAST_NAMES[who.species][0], text: SOUNDS[who.species] } : null;
  }
  // Fiche courte (appui long)
  function describe(who) {
    if (who.kind === 'villager') {
      const r = residents.find(v => v.id === who.id);
      if (r && r.guest) return { title: `${r.guest.name} · ${r.guest.role}`, text: 'De passage sur l’île : son bateau attend au Ponton.', hint: 'Toucher : lui parler' };
      if (r && r.asleep) return { title: r.look.label, text: 'Il dort dans la brume. Parle-lui pour le réveiller.', hint: 'Toucher : lui parler' };
      if (r && r.camp) return { title: r.look.label, text: `Vit au camp, près de « ${r.site} », en attendant son bâtiment.`, hint: 'Toucher : lui parler' };
      if (r && r.waiting) return { title: r.look.label, text: `Attend que « ${r.site} » sorte de terre, tout près.`, hint: 'Toucher : lui parler' };
      return r ? { title: r.look.label, text: `Travaille à « ${r.site} » le jour, rentre au Foyer le soir.`, hint: 'Toucher : lui parler' } : null;
    }
    if (who.id && who.id.startsWith('fam:')) return { ...petInfo(who, true), hint: 'Toucher : le saluer' };
    if (who.id && (who.id.startsWith('anya:') || who.id === 'dame:bol')) return storyInfo(who, true);
    // Une poule de Cannelle : son prénom
    const hen = coop && who.beast && coop.hens.find(h => h.id === who.beast);
    if (hen) return { title: hen.name, text: HEN_LINES[hen.id] || BEAST_NAMES.hen[1], hint: 'Toucher : la faire réagir' };
    const [title, text] = BEAST_NAMES[who.species] || ['Une bête', ''];
    return { title, text, hint: isWild(who.species) ? 'Toucher : il sursaute' : 'Toucher : la faire réagir' };
  }
  return { residents, farm, at, say, describe, home, foyer };
}
