// Créations d'île (lot 8) : 18 objets fabriqués à l'établi et posés sur une case (clôture, lanterne, fontaine,
// kiosque…), et 12 créations de climat (lot 9d : igloo, enclos à moutons, totem…). Repère et calques : ceux des
// annexes (annexSprites.js) — case u, v ∈ [-0,5 ; 0,5], ancrage au centre ; un cadre serré par calque, un dessin
// fixe ou n images jouées à fps images/s.
import { sprite } from './iso';
import { tools } from './spriteKit';
import { creationLayer, ART_LIGHTS, defenseLight } from './creations';
import { cloture, porte, porteVerrou, massif } from './craftItems/premiers';
import { muret, lanterne, banc, epouvantail, nichoir, girouette } from './craftItems/palier1';
import { fontaine, brasero, pergola, statue, arche, etal, kiosque } from './craftItems/palier2';
import { cadran, bassin, longuevue } from './craftItems/palier3';
import { igloo, sculpture, parc, cairn, passerelle, heron, tente, cadransel, hamac, totem, obelisque, bassinchaud } from './craftItems/climats';

export const CRAFT_SPRITES = {
  cloture, porte, 'porte-verrou': porteVerrou, massif, muret, lanterne, banc, epouvantail, nichoir, girouette,
  fontaine, brasero, pergola, statue, arche, etal, kiosque, cadran, bassin, longuevue,
  igloo, sculpture, parc, cairn, passerelle, heron, tente, cadransel, hamac, totem, obelisque, bassinchaud
};

// Calques d'une création prêts à peindre à l'instant t (secondes) : clé d'image et dessin. Le dessin de la
// bibliothèque d'abord (creations.js), sinon celui-ci
export function craftLayers(id, t = 0) {
  const art = creationLayer(id, t);
  if (art) return [art];
  const craft = CRAFT_SPRITES[id];
  if (!craft) return [];
  return craft.layers.map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [x, y, w, h] = layer.frame;
    return {
      key: `craft-${id}-${k}-${f}`,
      make: () => sprite(layer.draw(tools(0, 0, `craft-${id}-${k}`), f, layer.n || 1), { x, y, w, h })
    };
  });
}

// Lumière de nuit d'une création : [u, v, z, rayon, couleur « r,g,b », feu qui brûle même de jour], ou null
export function craftLight(id) {
  const craft = CRAFT_SPRITES[id];
  // (une défense de la bibliothèque, sans dessin par code : la torche ; sa lumière est dans son manifeste)
  if (!craft) return defenseLight(id);
  const light = craft.light ? craft.light() : null;
  // Dessinée par la bibliothèque : sa lumière tombe sur sa flamme (ou sa porte)
  return light && ART_LIGHTS[id] && creationLayer(id) ? [...ART_LIGHTS[id], ...light.slice(3)] : light;
}

// Vignette d'une création (établi) : ses calques à la première image, cadrés au plus juste
export function craftThumb(id) {
  const craft = CRAFT_SPRITES[id];
  if (!craft) return null;
  const frames = craft.layers.map(l => l.frame);
  const x = Math.min(...frames.map(fr => fr[0]));
  const y = Math.min(...frames.map(fr => fr[1]));
  const w = Math.max(...frames.map(fr => fr[0] + fr[2])) - x;
  const h = Math.max(...frames.map(fr => fr[1] + fr[3])) - y;
  const body = craft.layers.map((layer, k) => layer.draw(tools(0, 0, `craft-${id}-${k}-t`), 0, layer.n || 1)).join('');
  return sprite(body, { x, y, w, h });
}
