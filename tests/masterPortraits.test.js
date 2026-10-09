// Portraits des maîtres hors de l'île (world/masterPortraits.js) : lus au nom des fichiers, sans quotidien.json (allégé
// du code chargé au démarrage). Ils doivent rester exactement ceux que quotidien.json désigne, pour chaque maître, en
// naufragé et en maître, de face et de trois quarts, à chaque pose ; une pose absente revient au repos.
import { describe, it, expect } from 'vitest';
import { maitres, naufrages } from '../design/bibliotheque/svg/personnages/quotidien.json';
import { masterPortrait, MASTERS, VIEWS, POSES } from '@/world/masterPortraits';

// La règle d'avant, lue dans quotidien.json : le premier fichier de la pose, sinon du repos
function expected(role, castaway, view, pose) {
  const set = (castaway ? naufrages : maitres)[MASTERS[role]];
  const drawn = VIEWS[view];
  const files = set && (set.fichiers[`${drawn}_${POSES[pose]}`] || set.fichiers[`${drawn}_repos`]);
  return files ? files[0] : null;
}

describe('portraits des maîtres', () => {
  it('le même fichier que quotidien.json, pour chaque maître, tenue, vue et pose', () => {
    let checked = 0;
    for (const role of Object.keys(MASTERS)) {
      for (const castaway of [true, false]) {
        for (const view of ['front', 'se']) {
          for (const pose of ['idle', 'work', 'walk', 'sit']) {
            const file = expected(role, castaway, view, pose);
            const url = masterPortrait(role, castaway, { view, pose });
            const label = `${role} ${castaway ? 'naufragé' : 'maître'} ${view} ${pose}`;
            if (!file) expect(url, label).toBeNull();
            else expect(url, label).toMatch(new RegExp(`${file.split('/').pop().replace('.svg', '')}\\.svg$`));
            checked += 1;
          }
        }
      }
    }
    expect(checked).toBe(7 * 2 * 2 * 4);
  });
  it('un rôle ou une vue inconnus : rien', () => {
    expect(masterPortrait('phare', false)).toBeNull();
    expect(masterPortrait('foyer', false, { view: 'nw' })).toBeNull();
  });
});
