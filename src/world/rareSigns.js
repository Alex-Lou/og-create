// Le petit signe des raretés (choix de l'auteur, 18 oct.) : une créature rare ou légendaire qui sort près de ce qu'on
// regarde se signale, une fois par sortie, et au plus une toutes les SIGN_CALM ms. Ni le Kraken (il a déjà son signe :
// view/draw/life.js, sayKraken), ni les égarés (on les repousse). Ce module ne fait que choisir ; l'île scintille et
// Brume parle (WorldView, bestiary.js).
import { creatureOf, creatureOfHit } from './creatures';

export const SIGN_CALM = 60 * 1000;
const SIGNED = new Set(['rare', 'légendaire']);

// La créature rare ou légendaire d'une cible de l'île (view : landHits, seaHits), ou null : une bête sauvage, le Géant
export function rareOfHit(hit) {
  const wild = hit.who && hit.who.id && hit.who.id.startsWith('wild:');
  const creature = creatureOf(hit.kind === 'geant' ? 'geant' : wild ? creatureOfHit(hit) : null);
  return creature && SIGNED.has(creature.rarity) ? creature : null;
}

// Le suivi des sorties, pour une île : à chaque image, see(view, now, ...lists) prend ce qu'on regarde (dans le monde),
// l'instant (ms) et les listes de cibles ({ key, x, y, … }) ; il rend les signes à faire maintenant ([{ hit, creature }])
export function rareSigns() {
  // (les créatures rares sorties : clé de la cible → { frame, signed } ; une cible absente d'une image est rentrée)
  const out = new Map();
  // (la créature de chaque bête sauvage, gardée : leur liste est fixe)
  const wild = new Map();
  let frame = 0;
  let last = -Infinity;
  const creatureOfTarget = hit => {
    if (!hit.who) return rareOfHit(hit);
    if (!wild.has(hit.key)) wild.set(hit.key, rareOfHit(hit));
    return wild.get(hit.key);
  };
  const seen = (hit, view) => hit.x >= view.x && hit.x <= view.x + view.w && hit.y >= view.y && hit.y <= view.y + view.h;
  return {
    see(view, now, ...lists) {
      frame++;
      const signs = [];
      for (const hits of lists) {
        for (const hit of hits) {
          const creature = creatureOfTarget(hit);
          if (!creature) continue;
          let o = out.get(hit.key);
          if (!o) out.set(hit.key, (o = { frame, signed: false }));
          o.frame = frame;
          if (o.signed || !seen(hit, view) || now - last < SIGN_CALM) continue;
          o.signed = true;
          last = now;
          signs.push({ hit, creature });
        }
      }
      for (const [key, o] of out) if (o.frame !== frame) out.delete(key);
      return signs;
    }
  };
}
