// Les figurants des scènes en plans (Lorena, Brume… ; choix de l'auteur, 17 oct. : chaque personnage joue la scène) :
// une pièce à plusieurs images, une par animation, direction, expression et rang, que le jeu montre selon ce que chaque
// temps lui fait jouer (temps.jeux : ses clips [t, { anim, dir, expr }], comme la piste « acteur » de l'avatar ;
// src/game/acteur.js, ScenePlans). Chaque image est une pièce dessinée comme les autres (son fichier, vérifié par
// verif_generateurs.mjs) ; l'index les range sous leur figurant (preview_scenes6.mjs : images, anims).
const ENCRE = '#1A1410';

// La clé d'une image (la même que src/game/acteur.js : cleImage)
const cleImage = ({ anim, dir, expr }, n) => `${anim}|${dir}|${expr || ''}|${n}`;

// Les clips d'une partition pour un figurant : toutes ses poses jouées, sans doublon
const posesDe = (temps, id) => {
  const vues = new Map();
  for (const t of temps) for (const [, clip] of (t.jeux && t.jeux[id]) || []) vues.set(cleImage(clip, 0), clip);
  return [...vues.values()];
};

// Un personnage gravé comme la scène, dans son cadre 48 × 64 (le même dessin que src/game/acteur.js : gravee, pour
// l'avatar) : une silhouette d'encre épaisse derrière lui, puis lui, puis, découpées à sa forme, la teinte de la
// lumière de la scène et des hachures du côté de l'ombre
function gravee(corps, uid, { teinte = '#2A2448', force = 0.2, cote = 1 } = {}) {
  const hach = Array.from({ length: 34 }, (_, k) => `M${-16 + k * 2},68 l36,-76`).join(' ');
  const [x1, x2] = cote > 0 ? [0, 1] : [1, 0];
  return `<style>.c${uid} *{fill:${ENCRE}!important;stroke:${ENCRE}!important;stroke-width:2.4px!important}.m${uid} *{fill:#fff!important;stroke:#fff!important}</style>`
    + `<defs><mask id="k${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="64"><g class="m${uid}">${corps}</g></mask>`
    + `<linearGradient id="g${uid}" x1="${x1}" y1="0" x2="${x2}" y2="0.3"><stop offset="0.38" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>`
    + `<mask id="h${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="64"><rect width="48" height="64" fill="url(#g${uid})"/></mask></defs>`
    + `<g class="c${uid}">${corps}</g>${corps}`
    + `<g mask="url(#k${uid})"><rect width="48" height="64" fill="${teinte}" opacity="${force}"/><g mask="url(#h${uid})"><path d="${hach}" fill="none" stroke="${ENCRE}" stroke-width="0.45" opacity="0.8"/></g></g>`;
}
// (posé à sa place : ses pieds en (x, y), son cadre agrandi s fois)
const pose = (corps, [x, y], s) => `<g transform="translate(${x - 24 * s} ${y - 62 * s}) scale(${s})">${corps}</g>`;

// Un figurant : sa pièce (plan : id, profondeur, cadre…), ses animations (anims : { anim : { images, dt } }), les poses
// que la partition lui fait jouer, et dessiner(anim, dir, n, expr) qui rend une image ; rend la pièce et ses images.
// (au repos, deux images suffisent à respirer : chaque image pèse sur la mémoire d'un téléphone)
const LIMITES = { repos: 2 };
function figurant(plan, anims, poses, dessiner) {
  const images = [], vues = new Set(), nb = a => Math.min(anims[a].images, LIMITES[a] || Infinity);
  for (const p of poses) {
    for (let n = 0; n < nb(p.anim); n++) {
      const cle = cleImage(p, n);
      if (vues.has(cle)) continue;
      vues.add(cle);
      images.push({ id: `${plan.id}--${images.length}`, imageDe: plan.id, cle, cadre: plan.cadre, marge: plan.marge, dessin: () => dessiner(p.anim, p.dir, n, p.expr) });
    }
  }
  const utiles = Object.fromEntries([...new Set(poses.map(p => p.anim))].map(a => [a, { images: nb(a), dt: anims[a].dt * anims[a].images / nb(a) }]));
  return [{ ...plan, figurant: { anims: utiles }, dessin: images[0].dessin }, ...images];
}

module.exports = { cleImage, posesDe, gravee, pose, figurant };
