// Peinture des pages du Livre en Canvas 2D : une seule source pour la page au repos et la page qui tourne.
// Coordonnées en unités u = largeur / 100 ; la page fait 100 × 133,3 u.
// Chaque peinture renvoie { hotspots, label } : zones interactives (en u) et texte pour les lecteurs d'écran.
// Ce fichier réunit les modules de painter/ (un sujet chacun) sous les noms qu'utilise le reste du jeu. La main du
// Livre (papier, cadre, filets, folio, polices, encres) sert aussi aux autres livres de l'île (bestiaryPainter.js).

export { familyHints, clueText } from './painter/clues';
export { clearDrawings, glyph } from './painter/glyphs';
export { PAPER, PAPER_BACK, IVORY, VELLUM, seeded, paperNoise, rr, paperBase } from './painter/paper';
export { FELL, CAPS, INK, TEXT_INK, NOTE, FAINT, bookFontsReady, setFont, fitText, wrap, alpha } from './painter/type';
export { frame, folio, rule } from './painter/ornaments';
export { paintEndpaper } from './painter/chapterPages';
export { paintPage } from './painter/page';
// Les pages des chapitres suivent leurs couleurs (book/chapters.js)
export { CHAPTER_STYLE } from './chapters';
// Familles dites en mots : ingrédients d'une page à portée, et type de l'élément dans le pendu (texts/book/painter.js)
export { FAMILY_WORDS } from '@/texts/book/painter';
