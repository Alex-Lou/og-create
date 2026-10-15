// Où mène un objectif du suivi des quêtes (world/questPoint.js ; choix de l'auteur, 15 oct.) : la caméra va exactement
// sur ce qu'il faut toucher, la main du coach le montre
import { describe, it, expect } from 'vitest';
import { questPointOf } from '@/world/questPoint';

describe('où mène un objectif', () => {
  it('sa cible sur l’île, ou ce qui l’ouvre', () => {
    const point = (kind, target = null, extra = {}) => questPointOf({ id: 'q', kind, target, done: false, ...extra });
    expect(point('level', { site: 'carriere' })).toEqual(['île:site:carriere']);
    expect(point('zone', { zone: 'lisiere' })).toEqual(['île:quartier:lisiere']);
    expect(point('wake', { villager: 'bosquet' })).toEqual(['île:habitant:bosquet']);
    // (un besoin : l'habitant, puis la bulle de son besoin quand elle est à l'écran)
    expect(point('need', { villager: 'foyer' })).toEqual(['île:habitant:foyer', 'île:besoin:foyer']);
    expect(point('element')).toEqual(['.tabbar__item[data-tab="infinite"]']);
    expect(point('runs')).toEqual(['.world__play--fab']);
    expect(point('sleep')).toEqual(['île:brume']);
    expect(point('craft')).toEqual(['île:site:atelier']);
    expect(point('link', { site: 'puits' })).toEqual(['île:site:puits']);
  });
  it('ce que l’île trouve : l’habitant aux plus de cœurs, la case d’un lieu, d’un gisement, d’une terre à explorer', () => {
    expect(questPointOf({ kind: 'heart' }, { villager: 'ponton' })).toEqual(['île:habitant:ponton']);
    expect(questPointOf({ kind: 'gather' }, { cell: { x: 40, y: 12 } })).toEqual(['île:case:40:12']);
    expect(questPointOf({ kind: 'landmark', target: { landmark: 'ruine' } }, { cell: { x: 7, y: 9 } })).toEqual(['île:case:7:9']);
    expect(questPointOf({ kind: 'expedition' }, {})).toEqual([]);
  });
  it('une quête faite mène à Brume ; rien, rien', () => {
    expect(questPointOf({ kind: 'zone', target: { zone: 'lisiere' }, done: true })).toEqual(['île:brume']);
    expect(questPointOf(null)).toEqual([]);
  });
});
