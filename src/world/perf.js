// Compteur d'images de l'île, pour mesurer la fluidité sur un vrai téléphone : activé par « ?perf » dans l'adresse.
// Sur la dernière seconde : images par seconde (la boucle de l'île est plafonnée vers 30), temps de dessin moyen et
// pire image (le budget d'une image est de 33 ms). Le texte ne change que deux fois par seconde au plus, pour que
// le compteur ne pèse pas lui-même sur la mesure.

export const perfWanted = () => new URLSearchParams(window.location.search).has('perf');
// La grille des cases (« ?grid ») : numérote chaque case révélée, pour nommer précisément une case en retour. Un outil de
// l'auteur (choix du 10 oct.) : jamais montrée à un joueur qui ne l'a pas demandée ; retenue sur l'appareil qui l'a
// demandée une fois (« ?grid=0 » l'oublie), hors des mémoires du jeu (« Recommencer » ne l'efface pas). Lue une fois.
const GRID_KEY = 'auteur_grille';
let grid = null;
export function gridWanted() {
  if (grid !== null) return grid;
  const asked = new URLSearchParams(window.location.search).get('grid');
  try {
    if (asked === '0') localStorage.removeItem(GRID_KEY);
    else if (asked !== null) localStorage.setItem(GRID_KEY, '1');
    grid = localStorage.getItem(GRID_KEY) === '1';
  } catch {
    grid = asked !== null && asked !== '0';
  }
  return grid;
}

const WINDOW_MS = 1000;
const TEXT_MS = 500;
const num = n => n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Mesure : frame(now, drawMs) à chaque image dessinée ; stats(now) ; text(now, zoom) renvoie le texte à afficher,
// ou null s'il n'a pas à changer
export function perfMeter() {
  let frames = [];
  let shownAt = -Infinity;
  const stats = now => {
    frames = frames.filter(f => now - f.at <= WINDOW_MS);
    if (!frames.length) return { fps: 0, avg: 0, worst: 0 };
    const total = frames.reduce((s, f) => s + f.ms, 0);
    return { fps: frames.length, avg: total / frames.length, worst: Math.max(...frames.map(f => f.ms)) };
  };
  return {
    frame(now, drawMs) {
      frames.push({ at: now, ms: drawMs });
    },
    stats,
    text(now, zoom) {
      if (now - shownAt < TEXT_MS) return null;
      shownAt = now;
      const { fps, avg, worst } = stats(now);
      return `${fps} i/s · ${num(avg)} ms · pire ${num(worst)} · ×${num(zoom)}`;
    }
  };
}
