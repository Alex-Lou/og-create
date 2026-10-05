// Compteur d'images de l'île, pour mesurer la fluidité sur un vrai téléphone : activé par « ?perf » dans l'adresse.
// Sur la dernière seconde : images par seconde (la boucle de l'île est plafonnée vers 30), temps de dessin moyen et
// pire image (le budget d'une image est de 33 ms). Le texte ne change que deux fois par seconde au plus, pour que
// le compteur ne pèse pas lui-même sur la mesure.

export const perfWanted = () => new URLSearchParams(window.location.search).has('perf');

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
