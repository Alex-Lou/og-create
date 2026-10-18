// Le fond figé et le calque « anime » d'une scène lourde (demande de l'auteur, 16 oct.) : le jeu peint chaque scène une
// fois, figée et nette (SceneArt), et joue en direct, entre le fond et l'avatar, un calque léger qui ne garde que
// l'essentiel vivant (la flamme, la lueur de Brume, quelques lucioles ou étincelles).
//   separer(corps, t) : { fond, anime }. Le fond : le dessin sans aucune animation (SMIL) ni les groupes marqués
//   vivants (data-vif, voir vif), tel qu'il est posé à l'instant t (en secondes) : chaque boucle à sa première valeur
//   (son repos : ni un œil mi-clos, ni une luciole à mi-course), chaque mouvement joué une fois là où il en est à t
//   (t = Infinity : son état final, s'il reste ; t = 0 : son départ ; un mouvement encore en cours à t est une erreur :
//   on choisit un instant où tout est posé). Le calque anime : les groupes vivants, avec leurs seules boucles (le reste
//   figé à t, ce qui reste invisible retiré), sous les transformations figées de leurs parents et avec les définitions
//   qu'ils citent ; au plus MAX_ANIME animations, sans filtre (sinon : erreur).
//   sansVif(corps) : le dessin tel qu'avant les marques (les scènes qui ne sont pas séparées ne changent pas d'un octet).
// Le corps est le contenu du SVG (sans la balise <svg>), tel que le rendent les scènes de scenes6.js.
const MAX_ANIME = 30;
const ANIM = new Set(['animate', 'animateTransform', 'animateMotion', 'set']);
const MARQUE = ' data-vif=""';
// Un groupe vivant : les dessins qui iront au calque anime d'une scène séparée
const vif = corps => `<g${MARQUE}>${corps}</g>`;

// Les éléments du corps, dans l'ordre : nom, balise ouvrante [de, a[, fin (après la balise fermante), parent, attributs
function lire(corps) {
  const els = [];
  const pile = [];
  const re = /<(\/?)([A-Za-z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  let m;
  while ((m = re.exec(corps))) {
    const [tout, ferme, nom, attrs, seul] = m;
    if (ferme) {
      const el = pile.pop();
      if (!el || el.nom !== nom) throw new Error(`figer : </${nom}> inattendu`);
      el.fin = m.index + tout.length;
      continue;
    }
    const el = { nom, de: m.index, a: m.index + tout.length, fin: m.index + tout.length, parent: pile[pile.length - 1] || null, attrs, n: els.length };
    els.push(el);
    if (!seul) pile.push(el);
  }
  if (pile.length) throw new Error(`figer : <${pile[pile.length - 1].nom}> jamais fermé`);
  return els;
}
const attr = (attrs, nom) => { const m = attrs.match(new RegExp(`\\s${nom}="([^"]*)"`)); return m ? m[1] : undefined; };
const poser = (balise, nom, val) => {
  const re = new RegExp(`\\s${nom}="[^"]*"`);
  if (val === undefined) return balise.replace(re, '');
  if (re.test(balise)) return balise.replace(re, ` ${nom}="${val}"`);
  return balise.replace(/\s*(\/?)>$/, ` ${nom}="${val}"$1>`);
};
const secondes = s => { s = s.trim(); return s.endsWith('ms') ? parseFloat(s) / 1000 : parseFloat(s); };
const debuts = b => (b === undefined ? '0s' : b).split(';').map(x => x.split('+').reduce((s, p) => s + secondes(p), 0));
const nombres = s => s.trim().split(/[\s,]+/).map(Number);
// une transformation qui ne fait rien (translate 0 0, scale 1, rotate 0, skew 0)
const neutre = (type, v) => { const n = nombres(v); return type === 'scale' ? n.every(x => x === 1) : type === 'rotate' ? n[0] === 0 : n.every(x => x === 0); };

// La valeur d'une animation à t : { v } (v undefined : la valeur de dessous), ou null si elle ne joue pas à t
function valeur(el, t) {
  const A = el.attrs;
  const nom = `<${el.nom}${A.length > 60 ? A.slice(0, 60) + '…' : A}>`;
  if (attr(A, 'by') !== undefined) throw new Error(`figer : « by » n'est pas pris en charge (${nom})`);
  const vals = attr(A, 'values') !== undefined ? attr(A, 'values').split(';').map(s => s.trim()) : [attr(A, 'from'), attr(A, 'to')];
  const premiere = { v: vals[0] }, derniere = { v: vals[vals.length - 1] };
  const bs = debuts(attr(A, 'begin'));
  const rep = attr(A, 'repeatCount');
  // une boucle : son repos
  if (rep === 'indefinite') return { ...premiere, b: bs[0] };
  const b = Math.max(...bs.filter(x => x <= t));
  if (b === -Infinity) return null;
  // un « set » sans durée tient dès qu'il commence
  if (el.nom === 'set' && attr(A, 'dur') === undefined) return { v: attr(A, 'to'), b };
  const fin = b + secondes(attr(A, 'dur')) * (rep === undefined ? 1 : Number(rep));
  if (t >= fin) {
    if (attr(A, 'fill') !== 'freeze') return null;
    if (rep !== undefined && !Number.isInteger(Number(rep))) throw new Error(`figer : répétition partielle (${nom})`);
    if (el.nom === 'animateMotion') throw new Error(`figer : chemin joué une fois (${nom})`);
    return { ...derniere, b };
  }
  if (t === b) return { ...premiere, b };
  throw new Error(`figer : ${nom} est en cours à ${t} s ; choisir un instant où tout est posé`);
}

// La balise ouvrante figée de chaque élément animé : élément → balise (ses animations à t, dans l'ordre où le
// navigateur les empile : la plus tardive l'emporte, à égalité celle qui vient après) ; garder(animation) : celles qui
// restent vivantes (le calque anime garde ses boucles), qu'on ne fige pas
function balisesFigees(corps, els, t, garder = () => false) {
  const parAttr = new Map();
  for (const el of els) {
    if (!ANIM.has(el.nom) || garder(el)) continue;
    if (!el.parent) throw new Error('figer : animation sans parent');
    const r = valeur(el, t);
    if (!r) continue;
    const cle = el.nom === 'animateMotion' ? 'motion' : attr(el.attrs, 'attributeName');
    if (!parAttr.has(el.parent)) parAttr.set(el.parent, new Map());
    const m = parAttr.get(el.parent);
    if (!m.has(cle)) m.set(cle, []);
    m.get(cle).push({ el, ...r });
  }
  const out = new Map();
  for (const [p, m] of parAttr) {
    let balise = corps.slice(p.de, p.a);
    let mouvement = '';
    for (const [cle, liste] of m) {
      liste.sort((x, y) => x.b - y.b || x.el.n - y.el.n);
      let dessous = attr(balise, cle === 'motion' ? 'transform' : cle);
      for (const { el, v } of liste) {
        const A = el.attrs;
        if (cle === 'motion') {
          const d = attr(A, 'path').match(/^\s*M\s*([-\d.e]+)[\s,]+([-\d.e]+)/i);
          if (!d) throw new Error('figer : chemin sans départ');
          mouvement = Number(d[1]) || Number(d[2]) ? `translate(${d[1]} ${d[2]})` : '';
          continue;
        }
        if (v === undefined) continue;
        if (el.nom === 'animateTransform') {
          const type = attr(A, 'type') || 'translate';
          const tr = neutre(type, v) ? '' : `${type}(${v.trim().replace(/[\s,]+/g, ' ')})`;
          if (attr(A, 'additive') === 'sum') dessous = [dessous, tr].filter(Boolean).join(' ') || undefined;
          else dessous = tr || undefined;
        } else {
          if (attr(A, 'additive') === 'sum') throw new Error(`figer : addition sur ${cle} non prise en charge`);
          dessous = v;
        }
      }
      if (cle !== 'motion') balise = poser(balise, cle, dessous);
    }
    if (mouvement) balise = poser(balise, 'transform', [mouvement, attr(balise, 'transform')].filter(Boolean).join(' '));
    out.set(p, balise);
  }
  return out;
}

// Recompose un morceau [de, a[ du corps : balises remplacées, éléments retirés (ses animations, des groupes entiers)
function recomposer(corps, de, a, remplace) {
  let s = '', i = de;
  for (const [el, txt] of [...remplace].filter(([el]) => el.de >= de && el.de < a).sort((x, y) => x[0].de - y[0].de)) {
    if (el.de < i) continue;
    s += corps.slice(i, el.de) + txt;
    i = txt === '' ? el.fin : el.a;
  }
  return s + corps.slice(i, a);
}
const estVif = el => el.attrs.includes(MARQUE);
const boucle = el => attr(el.attrs, 'repeatCount') === 'indefinite';
const dedans = (el, anc) => { for (let p = el.parent; p; p = p.parent) if (p === anc) return true; return false; };

// Les marques retirées : un groupe ajouté pour marquer (<g data-vif="">) disparaît, une marque posée sur un groupe
// existant s'efface (une à une : chaque retrait décale la suite)
function sansVif(corps) {
  while (corps.includes(MARQUE)) {
    const el = lire(corps).find(estVif);
    const balise = corps.slice(el.de, el.a);
    corps = balise === `<g${MARQUE}>` ? corps.slice(0, el.de) + corps.slice(el.a, el.fin - 4) + corps.slice(el.fin) : corps.slice(0, el.de) + balise.replace(MARQUE, '') + corps.slice(el.a);
  }
  return corps;
}

function separer(corps, t = Infinity) {
  const els = lire(corps);
  const vifs = els.filter(el => estVif(el) && !els.some(a => a !== el && estVif(a) && dedans(el, a)));
  if (!vifs.length) throw new Error('figer : aucun groupe vivant à séparer');
  const vivant = el => vifs.some(v => v === el || dedans(el, v));
  // tout figé (le fond, les parents des groupes vivants, les définitions) ; dans les groupes vivants, seules les boucles
  // restent (un mouvement joué une fois s'y rejouerait à chaque chargement : il est figé là où il en est à t)
  const fige = new Map(balisesFigees(corps, els, t));
  for (const el of els) if (ANIM.has(el.nom)) fige.set(el, '');
  const garde = el => boucle(el) && vivant(el);
  const enVie = new Map(balisesFigees(corps, els, t, garde));
  for (const el of els) if (ANIM.has(el.nom) && !garde(el)) enVie.set(el, '');
  // (une boucle qui attendait la fin d'une entrée commence tout de suite : l'entrée n'est plus jouée)
  for (const el of els) if (garde(el) && debuts(attr(el.attrs, 'begin'))[0] > 0) enVie.set(el, poser(corps.slice(el.de, el.a), 'begin', undefined));
  // (ce qui reste invisible, sans boucle sur son opacité, n'a rien à faire dans le calque)
  const cache = el => attr(enVie.get(el) ?? corps.slice(el.de, el.a), 'opacity') === '0'
    && !els.some(a => a.parent === el && garde(a) && attr(a.attrs, 'attributeName') === 'opacity');
  for (const el of els) if (!ANIM.has(el.nom) && vivant(el) && cache(el)) enVie.set(el, '');
  // le fond : figé, sans les groupes vivants
  const rf = new Map(fige);
  for (const el of vifs) rf.set(el, '');
  const fond = recomposer(corps, 0, corps.length, rf);
  // le calque anime : chaque groupe vivant visible, sous ses parents figés (leurs autres enfants n'y sont pas)
  let corpsAnime = '';
  for (const el of vifs) {
    const parents = [];
    for (let p = el.parent; p; p = p.parent) {
      if (/^(defs|clipPath|mask|pattern|symbol|marker)$/.test(p.nom)) throw new Error(`figer : un groupe vivant dans <${p.nom}>`);
      parents.unshift(p);
    }
    const ouvre = parents.map(p => fige.get(p) ?? corps.slice(p.de, p.a));
    if (enVie.get(el) === '' || ouvre.some(b => attr(b, 'opacity') === '0')) continue;
    corpsAnime += ouvre.join('') + recomposer(corps, el.de, el.fin, enVie) + parents.reverse().map(p => `</${p.nom}>`).join('');
  }
  corpsAnime = sansVif(corpsAnime);
  // les définitions citées (dégradés, découpes…), figées, et celles qu'elles citent
  const parId = new Map(els.filter(el => attr(el.attrs, 'id') !== undefined).map(el => [attr(el.attrs, 'id'), el]));
  const cites = s => [...s.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map(m => m[1] || m[2]);
  const pris = new Set(lire(corpsAnime).map(el => attr(el.attrs, 'id')).filter(Boolean));
  const defs = [];
  const aVoir = cites(corpsAnime);
  while (aVoir.length) {
    const id = aVoir.shift();
    if (pris.has(id)) continue;
    pris.add(id);
    const el = parId.get(id);
    if (!el) throw new Error(`figer : #${id} introuvable`);
    const txt = recomposer(corps, el.de, el.fin, fige);
    defs.push(txt);
    aVoir.push(...cites(txt));
  }
  const anime = (defs.length ? `<defs>${defs.join('')}</defs>` : '') + corpsAnime;
  const n = lire(anime).filter(el => ANIM.has(el.nom)).length;
  if (n > MAX_ANIME) throw new Error(`figer : ${n} animations dans le calque anime (au plus ${MAX_ANIME})`);
  if (/<filter[\s>]|\sfilter="/.test(anime)) throw new Error('figer : un filtre dans le calque anime');
  return { fond, anime };
}

// Un dessin tout figé à l'instant t, sans calque anime (un figurant des scènes en plans : chacune de ses images est
// immobile, le jeu les enchaîne ; figurants.js)
function fige(corps, t = Infinity) {
  const els = lire(corps);
  const f = new Map(balisesFigees(corps, els, t));
  for (const el of els) if (ANIM.has(el.nom)) f.set(el, '');
  return recomposer(corps, 0, corps.length, f);
}

module.exports = { vif, separer, sansVif, fige };
