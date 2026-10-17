// La cinématique en plans d'une scène du tutoriel (choix de l'auteur, 16 oct. : le niveau de la porte du phare, partout,
// sans perdre la fluidité sur téléphone) : la scène est une pile de plans de papier peints une fois chacun (ciel, mer,
// décor, personnages, premier plan…), que le jeu bouge sans les repeindre (ScenePlans : transformations et opacité,
// faites par la carte graphique). Sa partition (scenes.json : partition) :
//   - temps : un par bulle de la scène (le premier à son ouverture, le suivant quand la bulle suivante paraît ; au-delà
//     du dernier, rien ne se rejoue) : { duree (ms), camera : [[t, cle], …], pistes : { plan : [[t, cle], …] } } ;
//   - repos : quand le temps est joué, la caméra dérive lentement, en aller-retour : { duree, camera : cle } (ajoutée à
//     la dernière clé du temps).
// Une clé de caméra : { x, y (où elle regarde, en unités de la scène, 400 de large), z (son zoom), r (son inclinaison,
// en degrés) } ; chaque plan la suit selon sa profondeur (0 : à l'infini, il ne bouge pas ; 1 : le plan de la scène ;
// plus : devant). Une clé de piste : { x, y (le déplacement du plan, en unités de la scène), s (son échelle), r (degrés),
// o (son opacité) }, autour du pivot du plan. Chaque clé peut porter e : la courbe du segment qui part d'elle (une
// courbe CSS ; « ease-in-out » sinon).
export const SCENE_W = 400;
const EASE = 'ease-in-out';
const CAMERA0 = { x: 0, y: 0, z: 1, r: 0 };
const PISTE0 = { x: 0, y: 0, s: 1, r: 0, o: 1 };
const n4 = v => Math.round(v * 10000) / 10000;

// La caméra vue d'un plan de profondeur d : il glisse à l'opposé de son regard, grandit avec son zoom, s'incline avec elle
export function cameraTransform(cle, d) {
  const c = { ...CAMERA0, ...cle };
  return `translate(${n4((-c.x * d * 100) / SCENE_W)}%, ${n4((-c.y * d * 100) / SCENE_W)}%) scale(${n4(1 + (c.z - 1) * d)}) rotate(${n4(c.r * d)}deg)`;
}
// Le mouvement propre d'un plan (ses déplacements en pour cent de la scène : le cadre qui le porte a sa taille)
export function pisteTransform(cle) {
  const p = { ...PISTE0, ...cle };
  return `translate(${n4((p.x * 100) / SCENE_W)}%, ${n4((p.y * 100) / SCENE_W)}%) rotate(${n4(p.r)}deg) scale(${n4(p.s)})`;
}
const opacite = cle => ({ ...PISTE0, ...cle }).o;

// Des clés [[t, cle], …] sur une durée : les images clés d'une animation du navigateur (element.animate)
export function imagesCles(cles, duree, versStyle) {
  const fin = Math.max(1, duree);
  return cles.map(([t, cle]) => ({ offset: n4(Math.min(1, Math.max(0, t / fin))), ...versStyle(cle), easing: cle.e || EASE }));
}
export const styleCamera = d => cle => ({ transform: cameraTransform(cle, d) });
export const stylePiste = cle => ({ transform: pisteTransform(cle), opacity: opacite(cle) });

// Le temps n d'une partition (null s'il n'y en a pas : la scène reste où elle en est)
export function tempsDe(partition, n) {
  const temps = (partition && partition.temps) || [];
  return n >= 0 && n < temps.length ? temps[n] : null;
}
// Le rang de la bulle k d'une suite de bulles dans sa scène : les bulles d'avant sur la même image, même quand une autre
// s'intercale (« Quel jour ? », le ciel, puis la plage reprend où elle en était) ; la scène y joue ce temps
export const rangBulle = (bulles, k) => bulles.slice(0, k).filter(b => b.scene === bulles[k].scene).length;
// La dernière clé d'une suite (l'état où un temps laisse la caméra ou un plan), ou celle par défaut
export const derniere = (cles, defaut = {}) => (cles && cles.length ? cles[cles.length - 1][1] : defaut);
// La première clé d'une suite (l'état d'où part un temps)
export const premiere = (cles, defaut = {}) => (cles && cles.length ? cles[0][1] : defaut);
// La dérive au repos : de la dernière clé de la caméra à cette clé plus le décalage du repos
export function cleRepos(cle, repos) {
  const c = { ...CAMERA0, ...cle }, dr = { x: 0, y: 0, z: 0, r: 0, ...(repos && repos.camera) };
  return { x: c.x + dr.x, y: c.y + dr.y, z: c.z + dr.z, r: c.r + dr.r };
}
