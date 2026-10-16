// La vue aux jumelles du vol du conseil (BinocularView ; choix de l'auteur, 16 oct.) : la foudre s'allume dans le verre
// à l'heure des deux coups sur la tour (phare.js : STRIKES), et le cache ne s'anime que par le compositeur (rien ne se
// repeint d'une image à l'autre pendant le vol, qui ramait)
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = file => readFileSync(fileURLToPath(new URL(`../src/${file}`, import.meta.url)), 'utf8');
const CSS = read('components/World/BinocularView/BinocularView.css');
const PHARE = read('components/World/WorldView/phare.js');
// Les règles d'une animation : [{ at (%), body }]
const keyframes = name => {
  const block = CSS.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))[1];
  return [...block.matchAll(/([\d.%, ]+|from|to) \{([^}]*)\}/g)].flatMap(([, at, body]) => at.split(',').map(a => ({ at: a.trim() === 'from' ? 0 : a.trim() === 'to' ? 100 : parseFloat(a), body })));
};

describe('la vue aux jumelles', () => {
  it('la foudre s’allume dans le verre à l’heure des deux coups sur la tour', () => {
    const strikes = [...PHARE.match(/const STRIKES = \[(.*)\];/)[1].matchAll(/at: (\d+)/g)].map(m => Number(m[1]));
    expect(strikes).toHaveLength(2);
    const ms = Number(CSS.match(/\.jm--net \.jm__flash \{ animation: jm-foudre (\d+)ms/)[1]);
    // (le premier pic de chaque éclair)
    const peaks = keyframes('jm-foudre').filter((k, i, all) => /opacity: \.3/.test(k.body) && !/opacity: \.3/.test((all[i - 1] || {}).body || ''));
    expect(peaks.map(k => Math.abs((k.at * ms) / 100 - strikes[peaks.indexOf(k)]) < 60)).toEqual([true, true]);
  });
  it('rien ne s’y anime que la position et l’opacité', () => {
    const names = [...CSS.matchAll(/@keyframes ([\w-]+)/g)].map(m => m[1]);
    expect(names.length).toBeGreaterThan(5);
    for (const name of names) {
      for (const { body } of keyframes(name)) {
        const props = body.split(';').map(d => d.split(':')[0].trim()).filter(Boolean);
        expect(props.every(prop => prop === 'transform' || prop === 'opacity')).toBe(true);
      }
    }
    expect(CSS).not.toMatch(/blur\(|filter:/);
  });
});
