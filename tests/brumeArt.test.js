// Brume dessinée dans la bibliothèque (design/bibliotheque/svg/vivants/brume) : chaque regard que le jeu lui donne
// (game/opus.js : brumeLook, ses huit stades, pâlie, le Phénix, le soleil du phare ; la récompense prête) a ses quatre
// images, sur l'île comme dans les fiches ; le stade 0 pendant le prologue
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { brumeArtId, brumeArtLayer, brumeArtUrls, BRUME_MS, composeExpression, EXPRESSIONS } from '@/world/brumeArt';
import { brumeLook } from '@/game/opus';

const LOOKS = [
  ...Array.from({ length: 8 }, (_, stage) => ({ stage })),
  { stage: 6, pale: true }, { stage: 6, burst: true }, { stage: 7, sun: true }
];

describe('Brume de la bibliothèque', () => {
  it('chaque regard a son dessin, ses quatre images ; la récompense prête l’emporte', () => {
    for (const look of LOOKS) {
      expect(brumeArtLayer(look, false), JSON.stringify(look)).not.toBeNull();
      expect(brumeArtUrls(look, false), JSON.stringify(look)).toHaveLength(4);
    }
    expect(LOOKS.map(look => brumeArtId(look))).toEqual(['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's6pale', 's6phenix', 's7soleil']);
    expect(brumeArtId({ stage: 3 }, true)).toBe('pret');
    expect(brumeArtUrls({ stage: 3 }, true)).toHaveLength(4);
  });

  it('ses images tournent à 220 ms ; le prologue la montre au stade 0', () => {
    expect(brumeArtLayer({ stage: 2 }, false, 0).key).toBe('brume-s2-0');
    expect(brumeArtLayer({ stage: 2 }, false, BRUME_MS / 1000 + 0.01).key).toBe('brume-s2-1');
    expect(brumeArtId(brumeLook({ acts: [] }))).toBe('s0');
    expect(brumeArtId(brumeLook({ acts: ['T'] }))).toBe('s1');
  });

  it('une expression remplace les yeux de chaque corps : les pupilles et leurs reflets partent, le calque s’ajoute', () => {
    const dir = 'design/bibliotheque/svg/vivants/brume/';
    const face = readFileSync(`${dir}brume_expr_rire_1.svg`, 'utf8');
    const bodies = readdirSync(dir).filter(f => /^brume_s\w+_1\.svg$/.test(f));
    expect(bodies.length).toBeGreaterThanOrEqual(11);
    for (const f of bodies) {
      const body = readFileSync(dir + f, 'utf8');
      const out = composeExpression(body, face);
      expect(out, f).not.toContain('#1D3557"/>');
      expect(out, f).toContain('stroke="#1D3557"');
      expect(out.match(/<svg/g), f).toHaveLength(1);
      expect(out.endsWith('</svg>'), f).toBe(true);
      // (le reste du corps est gardé : seules ses deux pupilles partent, les traits du calque s'ajoutent)
      const paths = svg => (svg.match(/<path/g) || []).length;
      expect(paths(out), f).toBe(paths(body) - 2 + paths(face));
    }
  });
  it('chaque expression a son calque composé ; la récompense prête garde son dessin entier', () => {
    for (const expr of EXPRESSIONS) expect(brumeArtLayer({ stage: 0 }, false, 0, expr).key, expr).toBe(`brume-s0-0-${expr}-0`);
    expect(brumeArtLayer({ stage: 0 }, false, 0, 'neutre').key).toBe('brume-s0-0');
    expect(brumeArtLayer({ stage: 0 }, true, 0, 'rire').key).toBe('brume-pret-0');
    expect(brumeArtLayer({ stage: 2 }, false, 0.7, 'content').key).toBe('brume-s2-3-content-1');
  });
});
