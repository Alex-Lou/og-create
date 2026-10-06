// Lot H7 (HISTOIRE.md, § 4.3, § 6.13, § 10, § 13 et § 16) : le Grand Œuvre (la lumière suit les actes), les huit stades
// de Brume, l'acte VI (la rune, le Phénix), la finale au Phare, les mots d'Héliane, Feu follet écrit tôt.
import { describe, it, expect } from 'vitest';
import { actNow, opusOf, brumeLook, secretDue, SECRET, secretOf, earlyWisp, EARLY_WISP } from '@/game/opus';
import { ACTS, vigilFrames } from '@/game/vigils';
import { HELIANE, noteOf } from '@/world/chest';
import { skyAt } from '@/world/sky';
import { STAGES } from '@/world/brume';

const upTo = act => ['T', ...ACTS.slice(0, ACTS.indexOf(act) + 1)];

describe('le Grand Œuvre', () => {
  it('l’acte en cours et l’étape alchimique', () => {
    expect(actNow([])).toBe('T');
    expect(actNow(['T'])).toBe('I');
    expect(actNow(upTo('VI'))).toBe('VII');
    expect(actNow(upTo('VII'))).toBe(null);
    expect([[], ['T'], upTo('I'), upTo('II'), upTo('III'), upTo('IV'), upTo('V'), upTo('VI'), upTo('VII')].map(opusOf))
      .toEqual(['noir', 'noir', 'noir', 'blanc', 'blanc', 'jaune', 'jaune', 'rouge', 'rouge']);
  });
  it('la lumière de l’île prend la couleur de l’étape, l’heure restant la même', () => {
    const at = h => new Date(2026, 5, 21, Math.floor(h), Math.round((h % 1) * 60));
    // Sans étape : rien ne change
    expect(skyAt(at(13), {}).tint).toBe(skyAt(at(13), { opus: null }).tint);
    // Nuits bleues (noir), couchants rouge et or (rouge), fenêtres allumées plus tôt (jaune), aube argentée (blanc)
    expect(skyAt(at(1), { opus: 'noir' }).tint).not.toBe(skyAt(at(1), {}).tint);
    expect(skyAt(at(21.6), { opus: 'rouge' }).warm).toBeGreaterThan(skyAt(at(21.6), {}).warm);
    expect(skyAt(at(21.5), { opus: 'jaune' }).lit).toBeGreaterThanOrEqual(skyAt(at(21.5), {}).lit);
    expect(skyAt(at(6.2), { opus: 'blanc' }).tint).not.toBe(skyAt(at(6.2), {}).tint);
    // Brume épaisse le matin, à l'œuvre au noir
    expect(skyAt(at(7), { opus: 'noir', weather: 'clair' }).weather.mist).toBeGreaterThan(skyAt(at(7), { weather: 'clair' }).weather.mist);
  });
});

describe('Brume, ses huit stades', () => {
  it('un stade par acte : 0 à la rencontre, 7 à l’acte VII, puis le soleil du phare', () => {
    expect(brumeLook({ acts: [] }).stage).toBe(0);
    ACTS.forEach((act, k) => expect(brumeLook({ acts: ['T', ...ACTS.slice(0, k)] }).stage).toBe(k + 1));
    expect(brumeLook({ acts: upTo('VII') })).toEqual({ stage: 7, sun: true });
    expect(STAGES).toHaveLength(8);
  });
  it('acte VI : elle pâlit après la rune (l’Écriture), puis l’éclat du Phénix ; les quêtes continuent', () => {
    const six = upTo('V');
    expect(brumeLook({ acts: six, quest: { id: 'ecriture' } })).toEqual({ stage: 6, pale: false, burst: false });
    expect(brumeLook({ acts: six, quest: { id: 'tour' } })).toEqual({ stage: 6, pale: true, burst: false });
    expect(brumeLook({ acts: six, quest: { id: 'phenix', done: true }, elements: ['Phénix'] })).toEqual({ stage: 6, pale: false, burst: true });
    expect(secretDue(six, { id: 'cle' })).toBe(true);
    expect(secretDue(six, { id: 'ecriture' })).toBe(false);
    expect(secretDue(upTo('VI'), { id: 'feu-follet' })).toBe(false);
    // La dernière réplique de Brume finit par les mots de la bible
    expect(SECRET[1].text).toMatch(/parce que l’île est seule\. Parce qu’Elle dort\.$/);
    for (const line of SECRET) expect(line.text.length).toBeLessThanOrEqual(140);
    // Anya déjà éveillée (v6 : dès l'acte V) : Brume ne dit plus qu'Elle dort
    expect(secretOf(false)).toBe(SECRET);
    const awake = secretOf(true);
    expect(awake.map(line => line.id)).toEqual(SECRET.map(line => line.id));
    expect(awake[1].text).toMatch(/parce que l’île a dormi si longtemps\. Et moi, j’ai pleuré pour deux\.$/);
    for (const line of awake) expect(line.text.length).toBeLessThanOrEqual(140);
  });
  it('Feu follet écrit avant l’acte VII : une réplique, une seule (le guide ne redit jamais)', () => {
    expect(earlyWisp(upTo('II'), ['Feu follet'])).toBe(true);
    expect(earlyWisp(upTo('II'), ['Feu'])).toBe(false);
    expect(earlyWisp(upTo('VI'), ['Feu follet'])).toBe(false);
    expect(earlyWisp(upTo('VII'), ['Feu follet'])).toBe(false);
    expect(EARLY_WISP.text).toBe('C’est… moi ? Comme c’est étrange.');
  });
});

describe('la finale et les mots d’Héliane', () => {
  it('la veillée VII commence au Phare : la lentille, le reflet, le soleil, « Je reste avec toi. »', () => {
    const frames = vigilFrames('VII', { people: 'Les Lucioles' });
    expect(frames.slice(0, 5).map(f => f.art)).toEqual(['phare', 'reflet', 'soleil', 'flammeche', 'flammeche']);
    expect(frames[4]).toMatchObject({ who: 'Brume', text: 'Je reste avec toi.' });
    // Puis la veillée et l'épilogue : le navire accueilli, la réplique de fin, La Légende
    expect(frames.some(f => /navire perdu/.test(f.text))).toBe(true);
    expect(frames.some(f => f.text === 'La brume s’est levée. Le peuple de « Les Lucioles » veille sur la mer.')).toBe(true);
    expect(frames[frames.length - 1]).toMatchObject({ art: 'horizon', text: 'La Légende' });
    expect(vigilFrames('VI')[0].art).toBe('veillee');
  });
  it('un mot d’histoire par acte, signé H., puis Héliane à partir de l’acte V', () => {
    expect(Object.keys(HELIANE)).toEqual(ACTS);
    ['I', 'II', 'III', 'IV'].forEach(act => expect(HELIANE[act]).toMatch(/— H\.$/));
    ['V', 'VI', 'VII'].forEach(act => expect(HELIANE[act]).toMatch(/— Héliane\.$/));
    expect(noteOf('bouteille:2026-10-05-1', 'III')).toBe(HELIANE.III);
    // Sans mot d'histoire, les mots drôles de toujours
    expect(noteOf('bouteille:2026-10-05-1')).toBe(noteOf('bouteille:2026-10-05-1', null));
    expect(noteOf('bouteille:2026-10-05-1')).toMatch(/— H\.$/);
  });
});
