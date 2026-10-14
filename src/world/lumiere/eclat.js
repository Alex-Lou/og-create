// L'éclat des gros coups de foudre, à la façon des vieux jeux de poche : l'écran de l'île saute d'un coup au blanc,
// revient une image, reblanchit, puis redescend par marches nettes, sans fondu. Un coup de foudre sur quatre ou cinq
// (eclairs.js : coupOf(...).gros). Deux éclats par coup, au plus : sous les trois par seconde des règles
// d'accessibilité sur les flashs (et rien en mouvement réduit : view/draw/loop.js).
import { coupOf, cycleOf, LEADER } from './eclairs';

const HAUT = 0.85; // presque blanc : les silhouettes se devinent encore
// [fin (secondes après le coup de retour), niveau] : blanc, retour à la scène, reblanc, trois marches
const MARCHES = [[0.05, HAUT], [0.1, 0], [0.16, HAUT], [0.24, 0.64], [0.32, 0.43], [0.4, 0.21]];
const FIN = MARCHES[MARCHES.length - 1][0];

// Le niveau de blanc (0 à HAUT, par paliers) à l'instant t
export function eclatAt(t, storm) {
  if (storm < 0.5) return 0;
  const cycle = cycleOf(t);
  const coup = coupOf(cycle);
  if (coup.lointain || !coup.gros) return 0;
  const u = t - coup.start - LEADER;
  if (u < 0 || u >= FIN) return 0;
  return MARCHES.find(([fin]) => u < fin)[1];
}

// Le blanc à plat sur l'écran de l'île (le tracé de l'éclair se dessine par-dessus)
export function drawEclat(ctx, w, h, k) {
  if (k <= 0) return;
  ctx.save();
  ctx.fillStyle = `rgba(244,247,255,${k})`;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
