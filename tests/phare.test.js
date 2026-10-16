// L'arc du Phare dans le jeu (choix de l'auteur, 15 oct. : ecriture/arc_phare.md ; répliques : lot 08, validé) : la
// courbe du vol de la caméra du conseil, les scènes (six bulles au plus), ce que disent les lieux au feu rallumé
import { describe, it, expect } from 'vitest';
import { along, ease, softPath } from '@/world/flight';
import { SCENES } from '@/texts/tutorial/scenes';
import { FIRE_LINES, FIRST_FIRE, FIRE, ARC_LINES, PASSEUR_LANTERN, PHARE_QUESTION } from '@/texts/world/phare';
import { arcMomentsOf, fireLinesOf, arcSceneOf, waitingFireLinesOf } from '@/world/arc';
import { NAMES } from '@/world/faces';

// Les lieux remarquables qui ont un feu (serveur : landmarks.hasFire ; le Lac de lave n'en a pas)
const FIRES = ['grotte', 'lac', 'col', 'menhirs', 'arche', 'saule', 'pilotis', 'oasis', 'pyramide', 'arbre', 'cascade', 'geyser'];

describe('le vol du conseil', () => {
  it('la courbe part du premier point, passe par chacun, finit au dernier', () => {
    const pts = [{ x: 0, y: 0 }, { x: 100, y: 40 }, { x: 220, y: -30 }, { x: 400, y: 10 }];
    expect(along(pts, 0)).toEqual({ x: 0, y: 0 });
    expect(along(pts, 1)).toEqual({ x: 400, y: 10 });
    const mid = along(pts, 1 / 3);
    expect([Math.round(mid.x), Math.round(mid.y)]).toEqual([100, 40]);
    expect(along([{ x: 5, y: 6 }], 0.5)).toEqual({ x: 5, y: 6 });
    expect([ease(0), ease(0.5), ease(1)]).toEqual([0, 0.5, 1]);
  });
  it('le trajet adouci garde ses bouts et son ordre, et tire les quartiers à mi-chemin de la ligne droite', () => {
    const soft = softPath([{ x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: -100 }, { x: 200, y: 0 }]);
    expect([soft[0], soft[3]]).toEqual([{ x: 0, y: 0 }, { x: 200, y: 0 }]);
    expect([soft[1].y, soft[2].y]).toEqual([50, -50]);
    expect(soft[1].x).toBeLessThan(soft[2].x);
  });
});

describe('les scènes de l’arc', () => {
  const bubbles = id => SCENES[id].filter(frame => frame.text).length;
  // (la réplique de Lorena qui voit venir la pluie, validée le 16 oct., tient en deux bulles)
  it('le conseil : le geste de la bûche, puis quatre et trois bulles ; la traversée, six bulles au plus', () => {
    expect(SCENES.conseil[0].gesture.label).toBe('Remettre une bûche dans le feu');
    expect([bubbles('conseil'), bubbles('conseil-suite')]).toEqual([4, 3]);
    expect(bubbles('traversee')).toBeLessThanOrEqual(6);
  });
  // (choix de l'auteur, 16 oct. : le ciel s'assombrit, Lorena annonce la pluie, elle tombe avec Agathe, s'installe avec
  // Léo, et tient après le vol)
  it('le conseil sous la pluie : elle ne tombe qu’après la prévision de Lorena, puis ne faiblit plus', () => {
    const pluie = [...SCENES.conseil, ...SCENES['conseil-suite']].map(f => f.meteo.pluie);
    const lorena = SCENES.conseil.findIndex(f => f.who === 'Lorena' && /nuages/.test(f.text));
    expect(pluie.slice(0, lorena + 2).every(p => p === 0)).toBe(true);
    expect(pluie.every((p, i) => !i || p >= pluie[i - 1])).toBe(true);
    expect(SCENES['conseil-suite'].every(f => f.meteo.pluie === 1)).toBe(true);
  });
});

describe('la Route des feux', () => {
  it('chaque réplique appartient à un lieu qui a un feu, parle par un maître, Brume ou un carnet, et tient en 140 caractères', () => {
    const lines = Object.entries(FIRE_LINES).flatMap(([id, entry]) => {
      expect(FIRES, id).toContain(id);
      return Array.isArray(entry) ? entry : [...entry.before, ...entry.after];
    });
    for (const line of [...lines, FIRST_FIRE]) {
      expect(line.who === 'brume' || Boolean(NAMES[line.who]) || /^Le carnet/.test(line.who), line.who).toBe(true);
      expect(line.text.length, line.text).toBeLessThanOrEqual(140);
    }
    expect(FIRE.done('L’Arche')).toContain('L’Arche');
  });
});

describe('les déclencheurs de l’arc (world/arc.js)', () => {
  const stateOf = ({ quest = null, sites = {}, zones = [] } = {}) => ({
    brume: { quest },
    sites: Object.entries(sites).map(([id, level]) => ({ id, level })),
    map: { zones: ['foret', 'cratere', 'coeur'].map(id => ({ id, owned: zones.includes(id) })) }
  });
  const keys = (a, b) => arcMomentsOf(a, b).map(m => m.key);
  it('une quête réclamée : sa réplique ; rien au premier chargement, ni pour une quête pas encore faite', () => {
    expect(keys(stateOf({ quest: { id: 'lanterne', done: true } }), stateOf({ quest: { id: 'colline', done: false } }))).toEqual(['quete-lanterne']);
    expect(keys(null, stateOf({ quest: { id: 'colline' } }))).toEqual([]);
    expect(keys(stateOf({ quest: { id: 'lanterne', done: false } }), stateOf({ quest: { id: 'lanterne', done: true } }))).toEqual([]);
    expect(keys(stateOf({ quest: { id: 'vie', done: true } }), stateOf({ quest: { id: 'souvenir-sylve' } }))).toEqual([]);
    expect(arcMomentsOf(stateOf({ quest: { id: 'ile-legendes', done: true } }), stateOf({ quest: { id: 'feu-follet' } }))[0].lines.map(l => l.text))
      .toEqual(['Une seule traversée. Monte, ou reste.', 'La mer peut attendre.']);
  });
  it('un palier atteint (la Mine de cristal, le jardin de lune), une seule fois ; un quartier acheté (la Forêt, le Cratère)', () => {
    expect(keys(stateOf({ sites: { carriere: 5 } }), stateOf({ sites: { carriere: 6 } }))).toEqual(['palier-carriere-6']);
    expect(keys(stateOf({ sites: { carriere: 6 } }), stateOf({ sites: { carriere: 7 } }))).toEqual([]);
    expect(keys(stateOf({ sites: { potager: 2 } }), stateOf({ sites: { potager: 3 } }))).toEqual(['palier-potager-3']);
    expect(keys(stateOf(), stateOf({ zones: ['foret', 'cratere'] }))).toEqual(['quartier-foret', 'quartier-cratere']);
    expect(keys(stateOf({ zones: ['foret'] }), stateOf({ zones: ['foret'] }))).toEqual([]);
    // (au Cratère, la didascalie : sans locuteur)
    expect(arcMomentsOf(stateOf(), stateOf({ zones: ['cratere'] }))[0].lines[1]).toMatchObject({ aside: true });
  });
  it('les variantes des quartiers selon l’acte : les Roselières avant ou après l’acte VII, la Cascade avant ou après l’acte VI', () => {
    expect(fireLinesOf('saule', ['I', 'VI'])[0].text).toMatch(/^Pas par là/);
    expect(fireLinesOf('saule', ['VI', 'VII'])[0].text).toMatch(/^C’est là que je me suis cachée/);
    expect(fireLinesOf('cascade', ['V'])[0].text).toMatch(/^J’aime cet endroit/);
    expect(fireLinesOf('cascade', ['VI'])[0].text).toMatch(/^C’est ici que je naissais/);
    expect(fireLinesOf('menhirs', ['VI'])).toEqual([]);
  });
  it('les lieux à deux temps : le Saule découvert avant l’acte VII (son feu attend) parle à sa découverte ; la Cascade rallumée avant l’acte VI parle quand il finit', () => {
    // (à la découverte : seulement un feu qui attend son acte)
    expect(waitingFireLinesOf({ id: 'saule', found: true, fire: false })[0].text).toMatch(/^Pas par là/);
    expect(waitingFireLinesOf({ id: 'saule', found: true, fire: true })).toEqual([]);
    expect(waitingFireLinesOf({ id: 'cascade', found: true, fire: true })).toEqual([]);
    expect(waitingFireLinesOf({ id: 'menhirs', found: true, fire: false })).toEqual([]);
    expect(waitingFireLinesOf(null)).toEqual([]);
    // (l'acte fini : un feu déjà rallumé dit sa variante d'après, une fois)
    const at = (acts, lit) => ({ ...stateOf(), brume: { quest: null, acts }, landmarks: [{ id: 'cascade', lit }, { id: 'menhirs', lit: true }] });
    expect(keys(at(['V'], true), at(['V', 'VI'], true))).toEqual(['feu-cascade-apres']);
    expect(arcMomentsOf(at(['V'], true), at(['V', 'VI'], true))[0].lines[0].text).toMatch(/^C’est ici que je naissais/);
    expect(keys(at(['V'], false), at(['V', 'VI'], false))).toEqual([]);
    expect(keys(at(['V', 'VI'], true), at(['V', 'VI'], true))).toEqual([]);
  });
  it('les scènes de l’arc : la première due ; le navire attend la veillée VII', () => {
    expect(arcSceneOf(['conseil', 'phare'], [], [])).toBe('conseil');
    expect(arcSceneOf(['conseil', 'phare'], ['conseil'], [])).toBe('phare');
    expect(arcSceneOf(['navire'], [], ['VI'])).toBe(null);
    expect(arcSceneOf(['navire'], [], ['VI', 'VII'])).toBe('navire');
  });
});

describe('les scènes du phare et du navire, et les répliques de l’île', () => {
  it('six bulles au plus par scène, deux au plus sur l’île, 140 caractères', () => {
    const bubbles = id => SCENES[id].filter(frame => frame.text).length;
    expect([bubbles('phare'), bubbles('navire')]).toEqual([4, 6]);
    const island = [...Object.values(ARC_LINES.quests), ...Object.values(ARC_LINES.levels).map(l => l.lines), ...Object.values(ARC_LINES.zones), PHARE_QUESTION];
    for (const lines of island) {
      expect(lines.length).toBeLessThanOrEqual(2);
      for (const line of lines) expect(line.text.length, line.text).toBeLessThanOrEqual(140);
    }
    expect(PASSEUR_LANTERN.text.length).toBeLessThanOrEqual(140);
    expect(PHARE_QUESTION[1]).toMatchObject({ aside: true, text: '(Tu ne réponds pas.)' });
  });
});
