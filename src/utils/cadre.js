// Une pop-up toujours entière à l'écran, jamais sur le HUD (choix de l'auteur, 13 oct.) : posée près de ce qui la fait
// naître (Brume, un bâtiment…), elle glisse vers l'intérieur de l'écran, puis hors de ce qu'elle couvrirait (sous le
// HUD du haut, au-dessus de celui du bas), débords compris (un sceau, une ombre portée par un enfant). La règle se
// calcule à part (placer, testée) ; garderDansLEcran la branche à la page. À appeler pour toute pop-up du système des
// quêtes (et d'ailleurs), une fois posée dans la page.

// Le HUD de l'île : ce qu'une pop-up ne couvre jamais (et que les noms des lieux évitent : view/draw/sites.js)
export const HUD_ILE = '.world__head > *, .world__stock > *, .world__left > *, .tracker__card, .tracker__line, .world__zoom > *, .world__play--fab';
// L'écart gardé avec le bord de l'écran et le HUD (px) ; il couvre aussi ce qui dépasse sans se mesurer (les
// pseudo-éléments, au plus 10 px : les baguettes d'un parchemin)
export const MARGE = 12;

// De combien déplacer une boîte ({ x0, y0, x1, y1 }, px de l'écran) pour la garder entière dans l'écran ({ w, h }) et
// hors des obstacles ([{ x0, y0, x1, y1 }]) : { dx, dy }. Un obstacle en face d'elle (qui partage sa largeur) la
// repousse : vers le bas s'il est dans la moitié haute de l'écran, vers le haut sinon. Sans assez de place entre les
// deux, elle se tient en haut de la place libre (son titre se lit)
export function placer(boite, obstacles, ecran, marge = MARGE) {
  let dx = 0;
  if (boite.x0 < marge) dx = marge - boite.x0;
  else if (boite.x1 > ecran.w - marge) dx = Math.max(marge - boite.x0, ecran.w - marge - boite.x1);
  const x0 = boite.x0 + dx, x1 = boite.x1 + dx;
  let haut = marge, bas = ecran.h - marge;
  for (const o of obstacles) {
    if (o.x1 <= x0 || o.x0 >= x1) continue;
    if ((o.y0 + o.y1) / 2 < ecran.h / 2) haut = Math.max(haut, o.y1 + marge);
    else bas = Math.min(bas, o.y0 - marge);
  }
  let dy = 0;
  if (boite.y1 - boite.y0 > bas - haut || boite.y0 < haut) dy = haut - boite.y0;
  else if (boite.y1 > bas) dy = bas - boite.y1;
  return { dx, dy };
}

// La boîte d'un élément et de tout ce qui en dépasse (ses descendants), à leur place de repos : leurs animations et
// transitions sont suspendues le temps de la mesure (une animation qui commence repart de son début, sans que ça se
// voie : la pop-up vient d'être posée)
function boiteDe(el) {
  el.classList.add('oc-cadre-mesure');
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const node of [el, ...el.querySelectorAll('*')]) {
    const r = node.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    x0 = Math.min(x0, r.left);
    y0 = Math.min(y0, r.top);
    x1 = Math.max(x1, r.right);
    y1 = Math.max(y1, r.bottom);
  }
  el.classList.remove('oc-cadre-mesure');
  return { x0, y0, x1, y1 };
}

// Garde une pop-up de la page (position fixed, placée par left et top en px) entière à l'écran et hors de eviter (un
// sélecteur : le HUD de l'île par défaut)
export function garderDansLEcran(el, eviter = HUD_ILE) {
  const boite = boiteDe(el);
  if (!Number.isFinite(boite.x0)) return;
  const obstacles = eviter ? [...document.querySelectorAll(eviter)].map(o => o.getBoundingClientRect()).filter(r => r.width > 0 && r.height > 0)
    .map(r => ({ x0: r.left, y0: r.top, x1: r.right, y1: r.bottom })) : [];
  const { dx, dy } = placer(boite, obstacles, { w: window.innerWidth, h: window.innerHeight });
  if (dx) el.style.left = `${Math.round(parseFloat(el.style.left || 0) + dx)}px`;
  if (dy) el.style.top = `${Math.round(parseFloat(el.style.top || 0) + dy)}px`;
}
