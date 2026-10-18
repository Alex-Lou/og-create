// Le journal de l'île (world/journal.js ; choix de l'auteur, 16 oct.) : Brume écrit ce que la troupe a vécu, les sept
// derniers jours, au ciel de chaque heure ; rien n'est gardé, un jour passé se réécrit à l'identique
import { describe, it, expect } from 'vitest';
import { journalOf, dayLines, JOURNAL_DAYS } from '@/world/journal';
import { JOURNAL } from '@/texts/world/journal';
import { MEETINGS } from '@/texts/village';

const troupe = ['ponton', 'foyer', 'atelier', 'puits', 'bosquet', 'carriere', 'potager'];
const NAMES = { ponton: 'Lorena', foyer: 'Agathe', atelier: 'Nathan', puits: 'Léo', bosquet: 'Maerys', carriere: 'Robby', potager: 'Maggy' };
const masters = troupe.map((role, k) => ({ role, k, master: true, name: NAMES[role] }));
const clear = { rain: 0, storm: 0, mist: 0, cover: 0 };
const sky = weather => () => ({ rise: 6.6, set: 19.3, weather });

describe('le journal de l’île', () => {
  it('sept jours, du plus récent au plus ancien, quatre lignes au plus ; personne, rien d’écrit', () => {
    const pages = journalOf({ masters, today: 300, hour: 24, skyOf: sky(clear) });
    expect(pages).toHaveLength(JOURNAL_DAYS);
    expect(pages.map(p => p.day)).toEqual([300, 299, 298, 297, 296, 295, 294]);
    expect(pages.slice(0, 4).map(p => p.title)).toEqual(['Aujourd’hui', 'Hier', 'Avant-hier', 'Il y a 3 jours']);
    for (const page of pages) {
      expect(page.lines.length).toBeGreaterThan(0);
      expect(page.lines.length).toBeLessThanOrEqual(4);
    }
    expect(journalOf({ masters: [], today: 300, hour: 12, skyOf: sky(clear) })).toEqual([]);
  });
  it('le temps de l’heure choisit la ligne : l’îlot net ou sous la pluie, le repas sous l’orage', () => {
    expect(dayLines(masters, 300, 24, sky(clear))[0]).toBe(JOURNAL.aube.clair);
    expect(dayLines(masters, 300, 24, sky({ ...clear, rain: 1 }))[0]).toBe(JOURNAL.aube.pluie);
    expect(dayLines(masters, 300, 24, sky({ ...clear, cover: 1, rain: 1, storm: 1 }))).toContain(JOURNAL.repas.orage);
  });
  it('une visite rapporte la première bulle de la rencontre ; l’accord suit le visiteur', () => {
    const visits = Array.from({ length: 40 }, (_, d) => dayLines(masters, d, 24, sky(clear))).flat().filter(line => line.includes(' voir '));
    expect(visits.length).toBeGreaterThan(5);
    const firsts = Object.values(MEETINGS).map(lines => lines[0]);
    for (const line of visits) expect(firsts.some(first => line.endsWith(`«\u00a0${first}\u00a0»`))).toBe(true);
    expect(visits.some(line => /^(Lorena|Agathe|Maerys|Maggy) est passée voir/.test(line) || /^(Nathan|Léo|Robby) est passé voir/.test(line))).toBe(true);
    expect(visits.some(line => /^(Lorena|Agathe|Maerys|Maggy) est passé voir|^(Nathan|Léo|Robby) est passée voir/.test(line))).toBe(false);
  });
  it('aujourd’hui s’écrit au fil des heures ; un jour passé se réécrit à l’identique', () => {
    expect(journalOf({ masters, today: 300, hour: 5, skyOf: sky(clear) })[0].lines).toEqual([JOURNAL.debut]);
    const morning = journalOf({ masters, today: 300, hour: 7.5, skyOf: sky(clear) })[0].lines;
    // (dans l'ordre des heures : Robby à la carrière avant le jour, puis l'aube de Lorena)
    expect(morning).toEqual([JOURNAL.carriere, JOURNAL.aube.clair]);
    const a = journalOf({ masters, today: 300, hour: 12, skyOf: sky(clear) });
    const b = journalOf({ masters, today: 301, hour: 3, skyOf: sky(clear) });
    expect(b[1].lines).toEqual(dayLines(masters, 300, 24, sky(clear)));
    expect(a[1].lines).toEqual(b[2].lines);
  });
  // (le journal n'écrit d'un camarade qu'à partir de son arrivée ; serveur : villagers[].since)
  it('un camarade n’y paraît qu’à partir de son arrivée ; un jour d’avant le premier ne s’écrit pas', () => {
    const late = masters.map(m => (m.role === 'ponton' ? { ...m, since: { day: 299, hour: 12 } } : { ...m, since: { day: 296, hour: 3 } }));
    const pages = journalOf({ masters: late, today: 300, hour: 24, skyOf: sky(clear) });
    expect(pages.map(p => p.day)).toEqual([300, 299, 298, 297, 296]);
    const day = d => pages.find(p => p.day === d).lines.join(' ');
    // (Lorena, arrivée à midi la veille : ni son aube ce jour-là, ni ses visites d'avant ; son aube le lendemain)
    expect(day(299)).not.toContain('Lorena a guetté');
    expect(day(298)).not.toMatch(/Lorena/);
    expect(day(300)).toContain('Lorena a guetté');
  });
  it('un camarade qui arrive ne réécrit pas les jours d’avant lui', () => {
    const before = masters.filter(m => m.role !== 'atelier');
    const after = [...before, { ...masters.find(m => m.role === 'atelier'), since: { day: 500, hour: 8 } }];
    for (let d = 200; d < 260; d++) expect(dayLines(after, d, 24, sky(clear)), String(d)).toEqual(dayLines(before, d, 24, sky(clear)));
  });
  it('un jour de marché, le journal le raconte, selon le temps', () => {
    expect(dayLines(masters, 300, 24, sky(clear), true)).toContain(JOURNAL.marche.clair);
    expect(dayLines(masters, 300, 24, sky({ ...clear, rain: 1 }), true)).toContain(JOURNAL.marche.pluie);
    expect(dayLines(masters, 300, 24, sky(clear))).not.toContain(JOURNAL.marche.clair);
    expect(journalOf({ masters, today: 300, hour: 24, skyOf: sky(clear), marketOn: d => d === 299 })[1].lines).toContain(JOURNAL.marche.clair);
  });
});
