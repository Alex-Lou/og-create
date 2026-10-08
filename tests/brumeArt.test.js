// Brume dessinée dans la bibliothèque (design/bibliotheque/svg/vivants/brume) : chaque regard que le jeu lui donne
// (game/opus.js : brumeLook, ses huit stades, pâlie, le Phénix, le soleil du phare ; la récompense prête) a ses quatre
// images, sur l'île comme dans les fiches ; le stade 0 pendant le prologue
import { describe, it, expect } from 'vitest';
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

  it('une expression remplace les yeux du corps : les pupilles et leurs reflets partent, le calque des yeux s’ajoute', () => {
    const body = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48"><circle cx="20" cy="28" r="9" fill="#BFF0FF"/>'
      + '<ellipse cx="16.8" cy="31.55" rx="1.35" ry="1.9" fill="#1D3557" stroke="none"/><ellipse cx="17.35" cy="30.55" rx="0.62" ry="0.62" fill="#FFFFFF" stroke="none"/>'
      + '<ellipse cx="23.2" cy="31.55" rx="1.35" ry="1.9" fill="#1D3557" stroke="none"/><ellipse cx="22.7" cy="32.55" rx="0.3" ry="0.3" fill="#FFFFFF" stroke="none"/>'
      + '<ellipse cx="20" cy="20.3" rx="0.9" ry="0.9" fill="#FFFFFF" stroke="none"/></svg>';
    const face = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48"><path d="M15,32 Q17,30 19,32" fill="none" stroke="#1D3557"/></svg>';
    const out = composeExpression(body, face);
    expect(out).not.toContain('#1D3557" stroke="none"');
    expect(out).toContain('cx="20" cy="20.3"');
    expect(out).toContain('<path d="M15,32 Q17,30 19,32"');
    expect(out.endsWith('</svg>')).toBe(true);
    expect(out.match(/<svg/g)).toHaveLength(1);
  });
  it('chaque expression a son calque composé ; la récompense prête garde son dessin entier', () => {
    for (const expr of EXPRESSIONS) expect(brumeArtLayer({ stage: 0 }, false, 0, expr).key, expr).toBe(`brume-s0-0-${expr}-0`);
    expect(brumeArtLayer({ stage: 0 }, false, 0, 'neutre').key).toBe('brume-s0-0');
    expect(brumeArtLayer({ stage: 0 }, true, 0, 'rire').key).toBe('brume-pret-0');
    expect(brumeArtLayer({ stage: 2 }, false, 0.7, 'content').key).toBe('brume-s2-3-content-1');
  });
});
