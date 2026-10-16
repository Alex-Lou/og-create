// Les règles canoniques du corps habillé (choix de l'auteur, 15 oct.), vérifiées sur le générateur que le jeu charge
// (design/bibliotheque/generateur/avatar.mjs) : l'avatar et son naufragé passent leurs bras à la règle des manches
// (design/personnages/manche.js : une manche est une surface de tissu, jamais un trait épais posé sur le corps) et
// leurs jambes à la règle de la jambe (design/personnages/jambe.js : la cuisse naît de la hanche et s'affine vers la
// cheville, la jambe pivote depuis la hanche).
import { describe, it, expect } from 'vitest';
import { avatar, avatarNaufrage, frame, FORMES } from '../design/bibliotheque/generateur/avatar.mjs';

const HAUTS = Object.keys(FORMES.haut);
const CORPS = [['femme', 'fine'], ['homme', 'large'], ['femme', 'ronde'], ['homme', 'moyenne']];
const VUES = ['front', 'se', 'ne'];
// les bras d'un personnage, pour une vue : le bras gauche (de l'épaule à la main au repos) et le bras droit
const bras = (c, view) => [0, 1].map(i => c.bras({ ...c, view }, c.shoulders[i], c.hands[i]));
// une manche tracée comme un trait épais : un trait de la couleur du tissu, de l'épaisseur du bras
const traitEpais = (s, c) => [...s.matchAll(/stroke="(#[0-9A-Fa-f]{6})" stroke-width="([\d.]+)"/g)]
  .some(([, color, w]) => color.toUpperCase() === c.sleeve.toUpperCase() && +w >= c.armW * 0.6);

describe('la règle des manches', () => {
  for (const [genre, silhouette] of CORPS) {
    for (const haut of HAUTS) {
      for (const [nom, faire] of [['avatar', avatar], ['naufragé', avatarNaufrage]]) {
        it(`${nom} · ${haut} · ${genre} ${silhouette}`, () => {
          const c = faire({ genre, silhouette, haut, bas: 'pantalon' }, { uid: 't' });
          expect(typeof c.bras).toBe('function');
          for (const view of VUES) {
            for (const s of bras(c, view)) {
              // une surface (le tissu, ou la peau d'un bras nu), et le poing
              expect(s).toMatch(/<path d="M[^"]+Z" fill="#[0-9A-Fa-f]{6}"\/>/);
              expect(traitEpais(s, c)).toBe(false);
              expect(s).not.toMatch(/NaN/);
            }
          }
        });
      }
    }
  }
});

// le haut d'une jambe (son point le plus haut et sa largeur là), et sa largeur au bas, dans un dessin de jambe
function largeurs(s) {
  const d = (s.match(/<path d="(M[^"]+Z)" fill="#[0-9A-Fa-f]{6}"\/>/) || [])[1];
  const pts = [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(m => [+m[1], +m[2]]);
  const ys = pts.map(p => p[1]), haut = Math.min(...ys), bas = Math.max(...ys);
  const a = y => { const xs = pts.filter(p => Math.abs(p[1] - y) < 0.6).map(p => p[0]); return Math.max(...xs) - Math.min(...xs); };
  return { haut, largeurHaut: a(haut), largeurBas: a(bas) };
}

describe('la règle de la jambe', () => {
  for (const [genre, silhouette] of CORPS) {
    for (const [nom, faire] of [['avatar', avatar], ['naufragé', avatarNaufrage]]) {
      it(`${nom} · ${genre} ${silhouette}`, () => {
        const c = faire({ genre, silhouette, haut: 'tshirt', bas: 'pantalon' }, { uid: 't' });
        expect(typeof c.jambe).toBe('function');
        for (const view of VUES) {
          const cc = { ...c, view, uid: `t${view}` };
          // la cheville au repos, puis le pied en avant (la marche) : le haut de la cuisse ne bouge pas
          const [x] = c.legX[view];
          const repos = largeurs(c.jambe(cc, x, c.ground, 0, 0)), pas = largeurs(c.jambe(cc, x - 1.7, c.ground + 1, 0, 0));
          expect(repos.largeurHaut).toBeGreaterThan(repos.largeurBas);
          expect(repos.largeurHaut).toBeGreaterThanOrEqual(c.k.hw * 0.8);
          expect(pas.haut).toBeCloseTo(repos.haut, 5);
        }
      });
    }
  }
});

// La tête qui tourne (design/personnages/tour.js, choix de l'auteur, 15 oct.) : de trois quarts, la tête se dessine de
// face puis tourne comme une sphère ; une seule règle pour toutes les coupes et tous les accessoires de tête
describe('la tête qui tourne', () => {
  const TETES = [{}, { tete: { id: 'bonnet' } }, { tete: { id: 'casquette' } }, { tete: { id: 'paille' } }, { visage: { id: 'lunettesRondes' } }, { tete: { id: 'cacheOreilles' } }];
  for (const coupe of Object.keys(FORMES.coupe)) {
    it(coupe, () => {
      for (const accessoires of TETES) {
        const c = avatar({ coupe, accessoires }, { uid: 't' });
        const tq = frame(c, 'se', 'marche', 1), face = frame(c, 'front', 'repos', 0);
        expect(tq).not.toMatch(/NaN|undefined|data-tour/);
        // de trois quarts, la tête n'est plus le dessin de face glissé : ses ellipses sont devenues des chemins tournés
        expect(tq).not.toBe(face);
      }
    });
  }
  it('l\'oreille du fond passe derrière la tête, celle de la nuque reste', () => {
    const c = avatar({ genre: 'homme', coupe: 'courte' }, { uid: 't' });
    const oreilles = s => [...s.matchAll(/<ellipse cx="([\d.]+)" cy="22.8" rx="1.5" ry="2.1"/g)].length;
    expect(oreilles(c.head({ ...c, view: 'front' }, { view: 'front', expr: 'neutre', n: 0 }, {}))).toBe(2);
    const tq = c.head({ ...c, view: 'se' }, { view: 'se', expr: 'neutre', n: 0 }, {});
    // (de trois quarts, tout est en chemins ; l'oreille gardée est la seule forme peau à droite du visage)
    expect(oreilles(tq)).toBe(0);
    const peau = [...tq.matchAll(/<path d="M([\d.]+),([\d.]+)[^"]*" fill="([^"]+)"/g)].filter(([, x, , f]) => f === c.skin && +x > 33);
    expect(peau.length).toBe(1);
  });
});

// Jamais d'attribut sur le mauvais genre (choix de l'auteur, 15 oct.) : un avatar se dessine toujours dans son genre,
// même un ancien enregistrement qui aurait gardé un choix de l'autre
describe('le genre au dessin', () => {
  it('une femme n\'a ni barbe, ni coupe ou accessoire d\'homme', () => {
    const { o } = avatar({ genre: 'femme', barbe: 'pleine', moustache: 'guidon', coupe: 'courte', menton: 'fort', visage: 'carre', accessoires: { tete: { id: 'tricorne' }, visage: { id: 'monocle' } } });
    expect([o.barbe, o.moustache, o.menton]).toEqual(['sans', 'sans', 'doux']);
    expect(['courte', 'carre']).not.toContain(o.coupe);
    expect(o.visage).not.toBe('carre');
    expect(o.accessoires).toEqual({});
  });
  it('un homme n\'a ni robe, ni coupe, maquillage ou accessoire de femme', () => {
    const { o } = avatar({ genre: 'homme', coupe: 'longue', bas: 'robe', formeChaussures: 'ballerines', levres: 'rouge', joues: 'roses', visage: 'coeur', accessoires: { visage: { id: 'lunettesCoeur' }, oreilles: { id: 'anneaux' } } });
    expect([o.coupe, o.bas, o.formeChaussures, o.levres, o.joues]).toEqual(['courte', 'pantalon', 'souliers', 'naturelles', 'sans']);
    expect(o.visage).not.toBe('coeur');
    expect(o.accessoires).toEqual({});
  });
  it('le naufragé aussi', () => {
    expect(avatarNaufrage({ genre: 'homme', bas: 'jupe', coupe: 'tresses' }).o.coupe).toBe('courte');
  });
});
