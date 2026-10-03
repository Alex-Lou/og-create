import { describe, expect, it } from 'vitest';
import { distance, search, suggest } from '@/utils/search';

const names = ['Eau', 'Eau salée', 'Bateau', 'Château', 'Mammouth', 'Écaille', 'Étoile de mer', 'Cheval', 'Chevalier', 'Arbre'];

describe('recherche du registre', () => {
  it('ignore accents et majuscules', () => {
    expect(search(names, 'ecaille')).toEqual(['Écaille']);
    expect(search(names, 'CHÂTEAU')).toEqual(['Château']);
  });
  it('classe le nom exact, puis les débuts de nom, de mot, puis le reste', () => {
    expect(search(names, 'eau')).toEqual(['Eau', 'Eau salée', 'Bateau', 'Château']);
    expect(search(names, 'mer')).toEqual(['Étoile de mer']);
    expect(search(names, 'cheval')).toEqual(['Cheval', 'Chevalier']);
  });
  it('tolère une faute de frappe à partir de 4 lettres', () => {
    expect(search(names, 'mamouth')).toEqual(['Mammouth']);
    expect(search(names, 'chevl')).toEqual(['Cheval', 'Chevalier']);
    expect(search(names, 'arbe')).toEqual(['Arbre']);
    // Deux lettres inversées : une seule faute
    expect(search(names, 'chaetau')).toEqual(['Château']);
  });
  it('reste strict sur les requêtes courtes', () => {
    expect(search(names, 'arx')).toEqual([]);
  });
  it('une requête vide ne renvoie rien', () => {
    expect(search(names, '   ')).toEqual([]);
  });
  it('propose le nom le plus proche quand rien ne répond', () => {
    expect(suggest(names, 'chaveau')).toBe('Château');
    expect(suggest(names, 'zzzzzz')).toBeNull();
  });
  it('distance d’édition', () => {
    expect(distance('chat', 'chat')).toBe(0);
    expect(distance('chat', 'chats')).toBe(1);
    expect(distance('chat', 'chien', 1)).toBe(2);
    expect(distance('vapuer', 'vapeur')).toBe(1);
  });
});
