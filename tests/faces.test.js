// Les portraits de la troupe hors de l'île (bulles du guide, scènes) : le dessin de la bibliothèque, en naufragé tant que
// son bâtiment n'est pas fondé ; le générateur pour qui n'a pas de dessin.
import { describe, it, expect } from 'vitest';
import { faceHref, builtOf, lineFace } from '@/world/faces';

describe('les portraits de la troupe', () => {
  it('un maître : son dessin de la bibliothèque, en naufragé ou en maître', () => {
    expect(faceHref('ponton', { castaway: true })).toMatch(/aster-naufrage_face_repos_1\.svg$/);
    expect(faceHref('ponton')).toMatch(/aster_face_repos_1\.svg$/);
    expect(faceHref('atelier', { view: 'se', pose: 'work', castaway: true })).toMatch(/rivet-naufrage_avant_travail_1\.svg$/);
  });

  it('sans portrait de la bibliothèque dans cette vue (de dos), celui du générateur', () => {
    expect(faceHref('ponton', { view: 'ne' })).toMatch(/^data:image\/svg\+xml/);
  });

  it('les maîtres dont le bâtiment est fondé, d\'après le serveur (les visiteurs installés à part)', () => {
    expect(builtOf([{ id: 'ponton', built: false }, { id: 'foyer', built: true }, { id: 'puits' }, { id: 'v3', built: true, seed: 7 }])).toEqual(['foyer', 'puits']);
    expect(builtOf(undefined)).toEqual([]);
  });

  it('le portrait d’une réplique de scène : la troupe par son prénom, en naufragé avant sa fondation, avec son expression', () => {
    expect(lineFace({ who: 'Lorena', mood: 'surpris' }, []).face).toMatch(/aster-portrait_surpris\.svg$/);
    expect(lineFace({ who: 'Lorena' }, ['ponton'])).toMatchObject({ bust: true });
    // Pas de portrait : une pensée, Brume (sa flamme), le haut-parleur, une image sans parole
    expect(lineFace({ who: 'Lorena', thought: true })).toBe(null);
    expect(lineFace({ who: 'Brume' })).toBe(null);
    expect(lineFace({ who: 'Le haut-parleur' })).toBe(null);
    expect(lineFace({})).toBe(null);
    // Un portrait donné par la réplique (le Grimoire)
    expect(lineFace({ who: 'Le Grimoire', face: 'data:x' })).toEqual({ face: 'data:x' });
  });
});
