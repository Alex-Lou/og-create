// Le fil conducteur des dévoilements (game/stages.js) : à chaque étape du tutoriel, où en est chaque personnage
import { describe, it, expect } from 'vitest';
import { stageOf, looksOf, hiddenOf, TIMELINE, HENS } from '@/game/stages';
import { PROLOGUE, scenesBefore } from '@/game/prologue';

// Les scènes de chaque personnage, et la quête où elle se joue (game/prologue.js : SCENE_AT)
const MET = { ponton: 'recolte', foyer: 'cannelle', atelier: 'rivet', puits: 'ondin' };

describe('le fil conducteur des dévoilements', () => {
  it('le fil porte les quatre premiers personnages, la cage et les trois poules, rien d’autre', () => {
    expect(Object.keys(TIMELINE).sort()).toEqual([...Object.keys(MET), 'cage', ...HENS].sort());
  });
  it('hors du tutoriel : tout le monde est chez soi', () => {
    expect(stageOf({ running: false, quest: 'caisse', seen: [] })).toEqual({});
  });
  it('le jour de Lorena : elle nage au pied de son Ponton, puis sur notre plage, puis son camp choisi, puis chez elle', () => {
    const at = (quest, seen) => stageOf({ running: true, quest, seen: ['cannelle', 'rivet', 'ondin', ...seen] }).ponton;
    expect(at('nuit', [])).toBeUndefined(); // (le serveur ne l'envoie pas encore)
    expect(at('caisse', [])).toBe('nage');
    expect(at('caisse', ['recolte'])).toBe('plage');
    expect(at('recolte', ['recolte'])).toBe('plage');
    expect(at('recolte', ['recolte', 'longue-vue'])).toBe('campe');
    expect(at('premier-ponton', ['recolte', 'longue-vue'])).toBeUndefined();
  });
  it('Agathe, Nathan, Léo : rien d’eux avant leur scène', () => {
    const stage = stageOf({ running: true, quest: 'soupe', seen: ['recolte', 'longue-vue'] });
    // (la cage, au large : invisible jusqu'à ce que la longue-vue de Lorena la voie)
    expect(stage).toEqual({ foyer: 'loin', atelier: 'vagues', puits: 'vagues', cage: 'large' });
    expect(looksOf(stage, 'foyer')).toEqual({ arrived: false, site: true, coin: false, zone: false, eau: false, lisiere: false, rive: false, planche: false, loose: false });
    expect(looksOf(stage, 'puits')).toMatchObject({ arrived: false, site: false, coin: false, zone: false });
    expect(hiddenOf(stage, 'zone').sort()).toEqual(['atelier', 'foyer', 'puits']);
    expect(stageOf({ running: true, quest: 'soupe', seen: ['recolte', 'longue-vue', 'cannelle'] }).foyer).toBeUndefined();
  });
  it('le jour de Léo : rien de lui jusqu’à ce que Lorena voie la planche ; endormi dessus, puis chez lui, sa scène vue', () => {
    const at = (quest, seen) => stageOf({ running: true, quest, seen: ['recolte', 'longue-vue', 'cannelle', 'rivet', ...seen] }).puits;
    expect(at('nuit-rivet', [])).toBe('vagues');
    expect(at('eveil-ondin', [])).toBe('vagues');
    expect(at('eveil-ondin', ['planche'])).toBe('planche');
    expect(at('souvenir-ondin', ['planche'])).toBe('planche');
    // (une partie arrivée là avant la planche : il dort déjà dessus, échouée)
    expect(at('souvenir-ondin', [])).toBe('planche');
    expect(at('souvenir-ondin', ['planche', 'ondin'])).toBeUndefined();
    expect(at('puits-ondin', ['ondin'])).toBeUndefined();
    expect(looksOf({ puits: 'planche' }, 'puits')).toMatchObject({ arrived: true, site: false, coin: false, zone: false, planche: true });
  });
  it('à chaque quête du prologue : rien d’un personnage dont la scène n’est pas vue', () => {
    for (const quest of PROLOGUE) {
      // (les scènes des étapes passées sont vues, celle de l'étape en cours pas encore)
      const seen = scenesBefore(quest);
      for (const id of Object.keys(MET)) {
        if (seen.includes(MET[id]) || (id === 'ponton' && quest !== 'caisse')) continue; // (Lorena ne paraît qu'au matin de sa caisse)
        const looks = looksOf(stageOf({ running: true, quest, seen }), id);
        // (Lorena, avant sa scène, nage au pied de son Ponton ; Nathan, au matin de son jour, sort de la brume ; Léo dort sur
        // sa planche échouée : on les voit, leur chantier, leur coin et leur zone non)
        if (id === 'ponton' || (id === 'atelier' && quest === 'deco') || (id === 'puits' && quest === 'souvenir-ondin')) {
          expect(looks, `${quest} / ${id}`).toMatchObject({ arrived: true, site: false, coin: false, zone: false });
          expect(looks.eau || looks.lisiere || looks.planche, `${quest} / ${id}`).toBe(true);
          continue;
        }
        // (le Feu d’Agathe est celui du joueur : il se voit toujours, test suivant)
        if (id !== 'foyer') expect(looks.site, `${quest} / ${id}`).toBe(false);
        expect([looks.arrived, looks.coin, looks.zone], `${quest} / ${id}`).toEqual([false, false, false]);
      }
    }
  });
  it('le jour d’Agathe : la cage au large jusqu’à la longue-vue de Lorena ; ses poules échappées jusqu’à ce qu’on les attrape, une à une', () => {
    const at = (quest, seen) => stageOf({ running: true, quest, seen: ['recolte', 'longue-vue', 'cannelle', ...seen] });
    expect(looksOf(at('cage', []), 'cage').coin).toBe(false);
    expect(looksOf(at('cage', ['cage-vue']), 'cage').coin).toBe(true);
    expect(looksOf(at('soupe', []), 'cage').coin).toBe(false);
    expect(looksOf(at('poules', ['cage-vue']), 'cage').coin).toBe(true);
    expect(HENS.map(id => looksOf(at('poules', ['poule:poule-blanche']), id).loose)).toEqual([true, false, true]);
    expect(HENS.map(id => looksOf(at('poulailler', []), id).loose)).toEqual([false, false, false]);
    expect(hiddenOf(at('cage', []), 'coin')).toEqual(['atelier', 'puits', 'cage']);
  });
  it('le Feu de camp, bâti par le joueur dès le premier soir, se voit à chaque étape (même avant Agathe, sa cuisinière)', () => {
    for (const quest of PROLOGUE) for (const seen of [[], scenesBefore(quest)]) expect(looksOf(stageOf({ running: true, quest, seen }), 'foyer').site, quest).toBe(true);
  });
  it('le dévoilement ne recule jamais : une scène de plus ne cache rien qui se voyait', () => {
    const FLAGS = ['arrived', 'site', 'coin', 'zone'];
    for (const quest of PROLOGUE) {
      let seen = [];
      let before = stageOf({ running: true, quest, seen });
      for (const scene of [...Object.values(MET), 'longue-vue']) {
        seen = [...seen, scene];
        const now = stageOf({ running: true, quest, seen });
        for (const id of Object.keys(MET)) {
          for (const flag of FLAGS) if (looksOf(before, id)[flag]) expect(looksOf(now, id)[flag], `${quest} / ${scene} / ${id}.${flag}`).toBe(true);
        }
        before = now;
      }
    }
  });
});
