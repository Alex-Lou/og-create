// Lieux remarquables des terres nouvelles (lot 9c) : treize dessins uniques et animés, un par lieu, chacun sur sa case
// (grotte de glace, lac gelé, col du vent, cercle de menhirs, arche, saule, cabane sur pilotis, source de l'oasis,
// pyramide, arbre-géant, grande cascade, geyser, lac de lave). Repère et calques : ceux des créations d'île
// (craftSprites.js) — case u, v ∈ [-0,5 ; 0,5], ancrage au centre ; un lieu déborde de sa case, comme un monument.
import { boulder, pyramid, sprite, mixHex, EDGE } from './iso';
import { HS } from './terrain';
import { WOOD, WOOD_DARK, THATCH, GLASS } from './palette';
import { tools, ln, poly, ell, dot, wave, star, OUT, f2 } from './shopSprites';
import { landmarkArtLayer } from './decorArt';

const TAU = Math.PI * 2;
const SNOW = { top: '#F7FAFD', left: '#DCE8F2', right: '#B9CCDD' };
const ICE = { top: '#E9F8FF', left: '#BFE7F7', right: '#8CCBE8' };
const GRANITE = { top: '#C9C3B6', left: '#A49D90', right: '#7F786C' };
const SANDSTONE = { top: '#E6CFA0', left: '#CDB07A', right: '#A88A58' };
const BASALT = { top: '#5E5753', left: '#47413E', right: '#34302D' };
const WATER = '#5BAFD8';
const WATER_LIGHT = '#9AD6F0';
const FOAM = 'rgba(255,255,255,.85)';
const JUNGLE = { dark: '#2F7A3A', mid: '#3E8A48', light: '#6DB85E', glow: '#9AD87A' };
const WILLOW = { dark: '#5E8F3C', mid: '#7FB04F', light: '#A9D27A' };
const FLAGS = ['#E2574C', '#F2C04B', '#5FA04A', '#6FA3D9', '#FFFFFF'];

/* ---------- Petits outils (en pixels) ---------- */
// Étincelle qui scintille une fois par boucle (k : décalage)
function twinkle(x, y, r, fr, n, k) {
  const o = Math.max(0, Math.sin((fr / n) * TAU + k));
  return o > 0.08 ? star(x, y, r * (0.55 + 0.45 * o), '#FFFFFF', o) : '';
}
// Bouffée de vapeur, de fumée ou de brume
const puff = (x, y, r, o, rgb = '240,244,248') => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="rgba(${rgb},${f2(o)})"/>`;
// Palmier : tronc courbe annelé, palmes arquées qui plient de sway ; s : échelle
function palm(x, y, s, sway = 0, lean = 1) {
  const tx = x + 8 * s * lean, ty = y - 46 * s;
  const curve = `M${f2(x)},${f2(y)} C${f2(x - 3 * s * lean)},${f2(y - 18 * s)} ${f2(x + 2 * s * lean)},${f2(y - 33 * s)} ${f2(tx)},${f2(ty)}`;
  const frond = (dx, dy, c) => {
    const ex = tx + (dx + sway * (dy < 0 ? 0.6 : 1)) * s, ey = ty + dy * s;
    const mx = (tx + ex) / 2, my = (ty + ey) / 2 - 8 * s;
    const len = Math.hypot(ex - tx, ey - ty) || 1;
    const nx = (-(ey - ty) / len) * 4.6 * s, ny = ((ex - tx) / len) * 4.6 * s;
    return `<path d="M${f2(tx)},${f2(ty)} Q${f2(mx + nx)},${f2(my + ny)} ${f2(ex)},${f2(ey)} Q${f2(mx - nx)},${f2(my - ny)} ${f2(tx)},${f2(ty)} Z" fill="${c}"/>`
      + `<path d="M${f2(tx)},${f2(ty)} Q${f2(mx)},${f2(my)} ${f2(ex)},${f2(ey)}" stroke="rgba(30,70,30,.35)" stroke-width="${f2(0.7 * s)}" fill="none"/>`;
  };
  return ell(x + 4 * s, y + 1, 12 * s, 4 * s, 'rgba(40,55,20,.2)')
    + `<path d="${curve}" stroke="${WOOD.left}" stroke-width="${f2(5 * s)}" fill="none" stroke-linecap="round"/>`
    + `<path d="${curve}" stroke="${WOOD.right}" stroke-width="${f2(5 * s)}" fill="none" stroke-dasharray="${f2(1.5 * s)} ${f2(3.2 * s)}"/>`
    + frond(-21, 5, '#2F6E3A') + frond(21, 7, '#2F6E3A') + frond(-14, 14, '#4F9A4C') + frond(15, 15, '#4F9A4C')
    + frond(-8, -11, '#7EC45B') + frond(10, -10, '#B3E386')
    + dot(tx - 2 * s, ty + 3 * s, 2.4 * s, '#8A5A2B') + dot(tx + 3 * s, ty + 4 * s, 2.4 * s, '#6E4520');
}
// Boule de feuillage : base sombre, masse, éclat
const leafBall = (x, y, r, c) => dot(x + r * 0.1, y + r * 0.12, r, c.dark) + dot(x, y, r * 0.92, c.mid) + dot(x - r * 0.32, y - r * 0.34, r * 0.42, c.light);
// Fleur de lotus posée sur l'eau
const lotus = (x, y, c = '#F4A6C8') => ell(x, y + 1, 4.6, 1.8, '#4F9A4C') + `<path d="M${f2(x - 3)},${f2(y)} Q${f2(x - 2.4)},${f2(y - 4)} ${f2(x)},${f2(y - 5)} Q${f2(x + 2.4)},${f2(y - 4)} ${f2(x + 3)},${f2(y)} Z" fill="${c}"/>` + dot(x, y - 1.6, 1, '#F7E27A');
// Mouette posée, ailes repliées ou levées (flap)
function gull(x, y, flap) {
  const wing = flap ? `<path d="M${f2(x - 1)},${f2(y - 5)} q-6,-7 -11,-5 q5,1 8,6 Z M${f2(x + 1)},${f2(y - 5)} q6,-7 11,-5 q-5,1 -8,6 Z" fill="#E8ECEF" stroke="${OUT}" stroke-width="0.4"/>`
    : `<path d="M${f2(x - 4)},${f2(y - 5)} q5,-2 8,1 q-4,2 -8,-1 Z" fill="#C9D1D8"/>`;
  return ell(x, y - 4, 4.6, 2.8, '#FFFFFF', ` stroke="${OUT}" stroke-width="0.4"`) + dot(x + 4, y - 7, 2.2, '#FFFFFF')
    + `<path d="M${f2(x + 6)},${f2(y - 7)} l3,0.8 l-3,0.8 Z" fill="#F2B544"/>` + dot(x + 4.6, y - 7.6, 0.5, '#2A2420')
    + ln([x - 1, y - 1.5], [x - 1.4, y + 0.5], '#F2B544', 0.7) + ln([x + 1.2, y - 1.5], [x + 1.4, y + 0.5], '#F2B544', 0.7) + wing;
}

/* ---------- Les Cimes ---------- */
// Grotte de glace : un tertre de neige, une bouche bleue bordée de stalactites, des cristaux ; le froid s'en échappe
const grotte = {
  layers: [{
    frame: [-56, -82, 112, 98],
    n: 8,
    fps: 4,
    draw: (T, fr, n) => {
      let out = T.shadow(0, 0, 0.62, 0.16) + boulder(0, -0.06, 0.6, 0.5, 48, SNOW, 3, 0.18, 0.5);
      // Cristaux de glace sur le tertre
      const crystal = (du, dv, z, h, w) => {
        const [x, y] = T.p(du, dv, z);
        return poly([[x - w, y], [x, y + w * 0.5], [x, y - h]], ICE.left, EDGE) + poly([[x, y + w * 0.5], [x + w, y], [x, y - h]], ICE.right, EDGE)
          + ln([x - w * 0.3, y - h * 0.2], [x - w * 0.1, y - h * 0.8], 'rgba(255,255,255,.8)', 0.8);
      };
      out += crystal(-0.28, -0.22, 26, 26, 5) + crystal(-0.16, -0.3, 32, 18, 4) + crystal(0.3, -0.12, 20, 22, 4.5);
      // Bouche de la grotte : arche sombre, reflets bleus, stalactites
      const [mx, my] = T.p(0.08, 0.44, 0);
      out += `<path d="M${f2(mx - 15)},${f2(my)} Q${f2(mx - 16)},${f2(my - 30)} ${f2(mx)},${f2(my - 31)} Q${f2(mx + 16)},${f2(my - 30)} ${f2(mx + 15)},${f2(my)} Z" fill="#2C5677" stroke="${ICE.right}" stroke-width="1.4"/>`
        + `<path d="M${f2(mx - 9)},${f2(my)} Q${f2(mx - 9)},${f2(my - 20)} ${f2(mx)},${f2(my - 21)} Q${f2(mx + 9)},${f2(my - 20)} ${f2(mx + 9)},${f2(my)} Z" fill="#183A55"/>`
        + ell(mx, my - 6, 5, 3, `rgba(130,200,255,${f2(0.35 + 0.15 * Math.sin((fr / n) * TAU))})`);
      for (let k = 0; k < 6; k++) {
        const x = mx - 11 + k * 4.4, y = my - 27 + Math.abs(k - 2.5) * 2.2;
        out += poly([[x - 1.6, y], [x + 1.6, y], [x, y + 5 + (k % 2) * 3]], '#E8F6FF');
      }
      // Le froid qui s'échappe : deux volutes qui glissent hors de la bouche
      for (let k = 0; k < 2; k++) {
        const p = ((fr / n) + k * 0.5) % 1;
        out += puff(mx - 4 - p * 20, my - 6 - p * 8, 4 + p * 6, 0.32 * (1 - p), '225,240,255');
      }
      return out + twinkle(...T.p(-0.28, -0.22, 50), 3, fr, n, 0) + twinkle(...T.p(0.3, -0.12, 40), 2.6, fr, n, 2.1) + twinkle(...T.p(-0.1, 0.1, 44), 2.2, fr, n, 4.2);
    }
  }],
  light: () => [0.08, 0.44, 8, 26, '150,210,255', false]
};

// Lac gelé : un trou de pêche dans la glace, une canne et son bouchon qui danse, des blocs taillés, une cabane de
// pêcheur et des aiguilles de glace ; sous la glace, un poisson d'argent tourne
const lac = {
  layers: [{
    frame: [-54, -84, 108, 100],
    n: 8,
    fps: 3,
    draw: (T, fr, n) => {
      const k = (fr / n) * TAU;
      // Poisson sous la glace (sous tout le reste)
      const [fx, fy] = T.p(-0.22 + 0.16 * Math.cos(k), 0.18 + 0.12 * Math.sin(k), 0);
      const dir = Math.sin(k) > 0 ? -1 : 1;
      let out = ell(fx, fy, 6, 2.2, 'rgba(40,90,120,.32)') + poly([[fx + dir * 5, fy], [fx + dir * 9, fy - 2.4], [fx + dir * 9, fy + 2.4]], 'rgba(40,90,120,.32)');
      // Fissures dans la glace
      out += `<path d="M${f2(fx + 18)},${f2(fy - 10)} l6,3 l4,-2 l5,4" stroke="rgba(255,255,255,.75)" stroke-width="0.8" fill="none"/>`;
      // Trou de pêche : rebord de neige, eau sombre, ronds
      const [hx, hy] = T.p(0.12, 0.06, 0);
      out += ell(hx, hy, 12, 6, SNOW.left, ` stroke="${SNOW.right}" stroke-width="0.8"`) + ell(hx, hy + 0.4, 8.5, 4.2, '#2E6E93')
        + ell(hx, hy + 0.4, 4 + ((fr % 4) / 4) * 4, 2 + ((fr % 4) / 4) * 2, 'none', ` stroke="rgba(190,230,250,${f2(0.7 - (fr % 4) * 0.16)})" stroke-width="0.7"`);
      // Canne sur son trépied, fil, bouchon qui danse
      const [sx, sy] = T.p(0.36, -0.12, 0);
      const tip = [sx - 16, sy - 26];
      const bob = hy - 1 + Math.sin(k * 2) * 1.2;
      out += ln([sx - 4, sy], [sx, sy - 14], WOOD_DARK.right, 1.4) + ln([sx + 4, sy], [sx, sy - 14], WOOD_DARK.right, 1.4)
        + ln([sx + 6, sy - 4], tip, '#7A5A3A', 1.3) + `<path d="M${f2(tip[0])},${f2(tip[1])} Q${f2(hx - 2)},${f2(hy - 18)} ${f2(hx + 1)},${f2(bob)}" stroke="rgba(60,60,60,.6)" stroke-width="0.5" fill="none"/>`
        + dot(hx + 1, bob, 1.8, '#E2574C') + dot(hx + 1, bob - 1, 1, '#FFFFFF');
      // Aiguilles de glace au fond, cabane de pêcheur rouge, blocs taillés
      const spire = (du, dv, h, w) => {
        const [x, y] = T.p(du, dv, 0);
        return poly([[x - w, y], [x, y + w * 0.45], [x - w * 0.15, y - h]], ICE.left, EDGE) + poly([[x, y + w * 0.45], [x + w, y], [x - w * 0.15, y - h]], ICE.right, EDGE)
          + ln([x - w * 0.45, y - h * 0.15], [x - w * 0.2, y - h * 0.75], 'rgba(255,255,255,.85)', 0.9);
      };
      out = spire(-0.5, -0.5, 38, 7) + spire(-0.34, -0.56, 52, 8) + spire(-0.18, -0.6, 30, 6) + out;
      out += T.shadow(-0.26, 0.24, 0.2, 0.16) + T.box(-0.38, 0.12, -0.14, 0.34, 0, 18, { top: '#E8EEF4', left: '#C9473A', right: '#9E3229' })
        + T.gable(-0.38, 0.12, -0.14, 0.34, 18, 10, { front: '#F7FAFD', back: '#DCE8F2', gable: '#B83B30' }, 0.04)
        + T.face([[-0.3, 0.34, 0], [-0.22, 0.34, 0], [-0.22, 0.34, 12], [-0.3, 0.34, 12]], '#5A2A22');
      const [cx, cy] = T.p(-0.18, 0.18, 30);
      for (let j = 0; j < 2; j++) {
        const p = ((fr / n) + j * 0.5) % 1;
        out += puff(cx + p * 4, cy - p * 18, 2.5 + p * 4, 0.45 * (1 - p), '235,238,242');
      }
      out += T.box(0.3, -0.4, 0.48, -0.24, 0, 8, ICE) + T.box(0.34, -0.36, 0.46, -0.26, 8, 14, ICE);
      return out + twinkle(...T.p(-0.34, -0.56, 50), 2.8, fr, n, 1) + twinkle(...T.p(0.3, 0.3, 2), 2, fr, n, 3.6) + twinkle(...T.p(-0.5, -0.5, 34), 2.2, fr, n, 4.4);
    }
  }]
};

// Col du Vent : deux cairns et, entre eux, une corde de fanions qui claquent ; une manche à air au bout de sa perche
const col = {
  layers: [{
    frame: [-58, -88, 116, 104],
    n: 8,
    fps: 6,
    draw: (T, fr, n) => {
      const cairn = (du, dv, h) => {
        let out = T.shadow(du, dv, 0.16, 0.18);
        let z = 0;
        [[12, 5.8], [10.2, 5], [8.4, 4.3], [6.4, 3.6], [4.4, 2.9], [3, 2.2]].slice(0, h).forEach(([rx, ry], i) => {
          const [x, y] = T.p(du, dv, z + ry);
          out += ell(x, y, rx, ry, mixHex(GRANITE.left, GRANITE.right, (i % 2) * 0.5), ` stroke="${OUT}" stroke-width="0.5"`) + ell(x - rx * 0.25, y - ry * 0.35, rx * 0.4, ry * 0.3, 'rgba(255,255,255,.25)');
          z += ry * 1.7;
        });
        return { out, top: T.p(du, dv, z + 1) };
      };
      const a = cairn(-0.34, 0.18, 6);
      const b = cairn(0.36, -0.16, 5);
      // Perche et manche à air, derrière
      const [px, py] = T.p(0.02, -0.34, 0);
      const flutter = wave(fr, n, 3);
      let out = ln([px, py], [px, py - 64], WOOD_DARK.right, 1.6)
        + `<path d="M${f2(px)},${f2(py - 63)} L${f2(px + 20)},${f2(py - 60 + flutter)} L${f2(px + 19)},${f2(py - 55 + flutter)} L${f2(px)},${f2(py - 56)} Z" fill="#F08A3A" stroke="${OUT}" stroke-width="0.5"/>`
        + `<path d="M${f2(px + 7)},${f2(py - 62 + flutter * 0.3)} L${f2(px + 13)},${f2(py - 61 + flutter * 0.6)} L${f2(px + 13)},${f2(py - 56 + flutter * 0.6)} L${f2(px + 7)},${f2(py - 57 + flutter * 0.3)} Z" fill="#FFFFFF"/>`;
      out += b.out + a.out;
      // Corde de fanions : elle pend entre les sommets, chaque fanion claque à son rythme
      const [ax, ay] = a.top, [bx, by] = b.top;
      const sag = 9;
      const at = s => [ax + (bx - ax) * s, ay + (by - ay) * s + Math.sin(s * Math.PI) * sag];
      out += `<path d="M${f2(ax)},${f2(ay)} Q${f2((ax + bx) / 2)},${f2((ay + by) / 2 + sag * 2)} ${f2(bx)},${f2(by)}" stroke="#7A5A3A" stroke-width="0.8" fill="none"/>`;
      for (let k = 1; k <= 7; k++) {
        const [x, y] = at(k / 8);
        const w = wave(fr, n, 2.2, k * 0.9);
        out += poly([[x - 4, y], [x + 4, y], [x + 4 + w, y + 9], [x - 4 + w, y + 9.6]], FLAGS[k % FLAGS.length], ` stroke="${OUT}" stroke-width="0.4"`);
      }
      // Rafales qui passent
      const g = (fr / n) * 120 - 60;
      return out + `<path d="M${f2(g)},-70 q10,-4 20,0 q8,3 14,-1" stroke="rgba(255,255,255,.7)" stroke-width="1.1" fill="none"/>`
        + `<path d="M${f2(g - 30)},-44 q8,-3 16,0" stroke="rgba(255,255,255,.55)" stroke-width="1" fill="none"/>`;
    }
  }]
};

/* ---------- Les Landes ---------- */
// Pierre levée (en pixels) : une dalle épaisse qui s'affine, au sommet arrondi, piquée de lichen ; w : demi-largeur
function menhir(x, y, h, w) {
  const d = w * 0.45;
  return `<path d="M${f2(x - w)},${f2(y)} L${f2(x)},${f2(y + d)} L${f2(x)},${f2(y + d - h)} Q${f2(x - w * 0.45)},${f2(y - h - 3)} ${f2(x - w * 0.85)},${f2(y - h * 0.86)} Z" fill="${GRANITE.left}" stroke="${OUT}" stroke-width="0.5"/>`
    + `<path d="M${f2(x)},${f2(y + d)} L${f2(x + w * 0.75)},${f2(y - d * 0.2)} L${f2(x + w * 0.62)},${f2(y - h * 0.88)} Q${f2(x + w * 0.32)},${f2(y - h - 1)} ${f2(x)},${f2(y + d - h)} Z" fill="${GRANITE.right}" stroke="${OUT}" stroke-width="0.5"/>`
    + dot(x - w * 0.5, y - h * 0.3, 1.2, 'rgba(160,190,110,.8)') + dot(x + w * 0.3, y - h * 0.55, 1, 'rgba(200,210,150,.8)');
}
// Cercle de menhirs : sept pierres levées autour d'une table de pierre ; leurs gravures s'allument l'une après l'autre
const menhirs = {
  layers: [{
    frame: [-60, -74, 120, 96],
    n: 8,
    fps: 3,
    draw: (T, fr, n) => {
      let out = T.shadow(0, 0, 0.6, 0.12) + T.disc(0, 0, 0, 0.5, 'rgba(120,150,90,.35)');
      const stones = Array.from({ length: 7 }, (_, k) => {
        const a = (k / 7) * TAU + 0.3;
        return { k, du: Math.cos(a) * 0.46, dv: Math.sin(a) * 0.46, h: 26 + (k * 7) % 11 };
      }).sort((p, q) => p.du + p.dv - (q.du + q.dv));
      const glyph = (x, y, o) => `<path d="M${f2(x)},${f2(y)} m-1.6,0 a1.6,1.6 0 1 1 1.6,1.6 a2.6,2.6 0 1 1 -2.6,-2.6" stroke="rgba(120,235,215,${f2(o)})" stroke-width="1" fill="none" stroke-linecap="round"/>`;
      const back = stones.filter(s => s.du + s.dv < 0), front = stones.filter(s => s.du + s.dv >= 0);
      const stone = s => {
        const lit = Math.max(0, Math.cos(((fr / n) * 7 - s.k) * (TAU / 7)));
        const [x, y] = T.p(s.du, s.dv, s.h * 0.55);
        return T.shadow(s.du, s.dv, 0.12, 0.18) + menhir(...T.p(s.du, s.dv, 0), s.h, 6 + (s.k % 3)) + glyph(x - 2, y, 0.25 + 0.75 * lit);
      };
      back.forEach(s => { out += stone(s); });
      // Table de pierre au centre
      out += T.box(-0.13, -0.09, 0.13, 0.09, 0, 5, GRANITE) + T.box(-0.16, -0.12, 0.16, 0.12, 5, 8, { top: '#D8D2C6', left: '#B4AD9F', right: '#8F887B' });
      front.forEach(s => { out += stone(s); });
      return out;
    }
  }],
  light: () => [0, 0, 16, 34, '120,235,215', false]
};

// Arche des falaises : la mer a percé la roche ; de l'herbe sur le dessus, une mouette posée qui s'ébroue
const arche = {
  layers: [{
    frame: [-62, -100, 124, 116],
    n: 8,
    fps: 4,
    draw: (T, fr) => {
      let out = T.shadow(0, 0, 0.62, 0.16) + boulder(-0.3, 0.16, 0.2, 0.17, 54, GRANITE, 5, 0.18, 0.7) + boulder(0.3, -0.16, 0.2, 0.17, 54, GRANITE, 8, 0.18, 0.7);
      // Le linteau : une bande de roche arquée entre les deux piliers
      const [ax, ay] = T.p(-0.3, 0.16, 50), [bx, by] = T.p(0.3, -0.16, 50);
      const cx = (ax + bx) / 2, cy = (ay + by) / 2 - 22;
      out += `<path d="M${f2(ax - 10)},${f2(ay + 6)} Q${f2(cx)},${f2(cy - 14)} ${f2(bx + 10)},${f2(by + 6)} L${f2(bx + 6)},${f2(by + 16)} Q${f2(cx)},${f2(cy + 2)} ${f2(ax - 6)},${f2(ay + 16)} Z" fill="${GRANITE.left}" stroke="${OUT}" stroke-width="0.7"/>`
        + `<path d="M${f2(bx + 6)},${f2(by + 16)} Q${f2(cx)},${f2(cy + 2)} ${f2(ax - 6)},${f2(ay + 16)}" stroke="${GRANITE.right}" stroke-width="3" fill="none"/>`
        + `<path d="M${f2(ax - 10)},${f2(ay + 6)} Q${f2(cx)},${f2(cy - 14)} ${f2(bx + 10)},${f2(by + 6)}" stroke="#8FBF6A" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
      // Touffes d'herbe et bruyère au pied
      for (const [du, dv] of [[-0.42, 0.36], [0.06, 0.4], [0.42, 0.14]]) {
        const [x, y] = T.p(du, dv, 0);
        out += [-2, 0, 2].map(d => ln([x + d, y], [x + d * 1.5, y - 5], '#7FA45A', 1)).join('') + dot(x - 1, y - 5, 1.3, '#C77FB0') + dot(x + 2, y - 4, 1.2, '#E0A0CC');
      }
      // (sommet de la courbe du dessus : (A + 2C + B) / 4)
      return out + gull(cx + 2, (ay + 6 + 2 * (cy - 14) + by + 6) / 4 - 0.5, fr === 5 || fr === 6);
    }
  }]
};

/* ---------- Le Marais ---------- */
// Saule millénaire : un tronc noueux, une couronne, un rideau de branches qui ondule jusqu'à l'eau
const saule = {
  layers: [{
    frame: [-64, -110, 128, 126],
    n: 8,
    fps: 3,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      let out = T.shadow(0, 0, 0.6, 0.18);
      // Racines et tronc noueux
      out += `<path d="M${x - 16},${y + 2} Q${x - 8},${y - 4} ${x - 6},${y - 20} Q${x - 9},${y - 40} ${x - 3},${y - 56} L${x + 5},${y - 56} Q${x + 8},${y - 38} ${x + 6},${y - 20} Q${x + 9},${y - 4} ${x + 18},${y + 3} Q${x},${y - 2} ${x - 16},${y + 2} Z" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${x + 1},${y - 54} Q${x + 5},${y - 36} ${x + 4},${y - 18} Q${x + 7},${y - 4} ${x + 18},${y + 3}" stroke="${WOOD_DARK.right}" stroke-width="3" fill="none"/>`
        + `<path d="M${x - 3},${y - 30} q3,-3 2,-8 M${x + 1},${y - 14} q-2,-4 0,-7" stroke="rgba(60,40,25,.45)" stroke-width="0.8" fill="none"/>`;
      // Couronne
      out += leafBall(x - 18, y - 66, 16, WILLOW) + leafBall(x + 18, y - 64, 16, WILLOW) + leafBall(x, y - 78, 19, WILLOW) + leafBall(x - 4, y - 62, 15, WILLOW);
      // Rideau de branches : de longues mèches qui ondulent
      for (let k = 0; k < 15; k++) {
        const sx = x - 33 + k * 4.7;
        const sy = y - 62 - Math.sin((k / 14) * Math.PI) * 14;
        const len = 34 + ((k * 13) % 9) + Math.sin((k / 14) * Math.PI) * 10;
        const sw = wave(fr, n, 2.6, k * 0.55);
        out += `<path d="M${f2(sx)},${f2(sy)} q${f2(sw * 0.5 - (k < 7 ? 3 : -3))},${f2(len * 0.5)} ${f2(sw - (k < 7 ? 4 : -4))},${f2(len)}" stroke="${k % 3 ? WILLOW.mid : WILLOW.light}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      }
      // Une feuille qui tombe
      const p = (fr / n);
      return out + ell(x + 22 - p * 8, y - 50 + p * 46, 2, 1, WILLOW.light, ` transform="rotate(${f2(p * 260)} ${f2(x + 22 - p * 8)} ${f2(y - 50 + p * 46)})"`);
    }
  }]
};

// Cabane sur pilotis : une cabane de pêcheur perchée sur l'eau, sa lanterne, sa barque ; les lucioles tournent autour
const pilotis = {
  layers: [{
    frame: [-52, -100, 104, 118],
    n: 8,
    fps: 4,
    draw: (T, fr, n) => {
      const k = (fr / n) * TAU;
      let out = '';
      // Ronds dans l'eau autour des pieux
      const posts = [[-0.24, -0.2], [0.24, -0.2], [0.24, 0.2], [-0.24, 0.2]];
      for (const [du, dv] of posts) {
        const [x, y] = T.p(du, dv, 0);
        const r = 3 + ((fr + du * 10) % 4);
        out += ell(x, y, r * 1.6, r * 0.7, 'none', ` stroke="rgba(220,240,250,${f2(0.6 - r * 0.07)})" stroke-width="0.7"`);
      }
      // Barque amarrée
      const [bx, by] = T.p(0.1, 0.46, 0);
      out += `<path d="M${f2(bx - 14)},${f2(by - 3)} Q${f2(bx)},${f2(by + 5 + Math.sin(k) * 0.6)} ${f2(bx + 14)},${f2(by - 3)} Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="0.6"/>`
        + ln([bx - 13, by - 3], [bx + 13, by - 3], WOOD.top, 1.2);
      // Pieux, plancher, échelle
      for (const [du, dv] of posts) out += T.box(du - 0.025, dv - 0.025, du + 0.025, dv + 0.025, -4, 16, WOOD_DARK);
      out += T.box(-0.3, -0.26, 0.3, 0.26, 16, 19, WOOD);
      const [lx, ly] = T.p(0.04, 0.27, 0);
      out += ln([lx - 3, ly], [lx - 3, ly - 17], WOOD_DARK.right, 1) + ln([lx + 3, ly], [lx + 3, ly - 17], WOOD_DARK.right, 1)
        + [4, 9, 14].map(z => ln([lx - 3, ly - z], [lx + 3, ly - z], WOOD_DARK.right, 0.8)).join('');
      // Murs de planches, porte, fenêtre allumée, toit de chaume
      out += T.box(-0.2, -0.16, 0.2, 0.16, 19, 40, WOOD_DARK);
      for (let z = 23; z < 40; z += 4) out += ln(T.p(-0.2, 0.16, z), T.p(0.2, 0.16, z), 'rgba(60,40,25,.25)', 0.6);
      out += T.face([[-0.12, 0.16, 19], [-0.02, 0.16, 19], [-0.02, 0.16, 33], [-0.12, 0.16, 33]], '#3D2A1E')
        + T.face([[0.2, -0.08, 27], [0.2, 0.04, 27], [0.2, 0.04, 35], [0.2, -0.08, 35]], GLASS, EDGE);
      out += T.gable(-0.2, -0.16, 0.2, 0.16, 40, 18, { front: THATCH.front, back: THATCH.back, gable: WOOD_DARK.left }, 0.07);
      // Filet qui sèche, lanterne qui vacille
      const [nx, ny] = T.p(-0.3, 0.1, 18);
      out += `<path d="M${f2(nx)},${f2(ny)} q-5,8 -2,15 M${f2(nx - 4)},${f2(ny + 4)} l5,3 M${f2(nx - 5)},${f2(ny + 9)} l5,2" stroke="rgba(230,220,190,.8)" stroke-width="0.6" fill="none"/>`;
      const [qx, qy] = T.p(0.26, 0.22, 36);
      const flick = 0.75 + 0.25 * Math.sin(k * 3);
      out += ln([qx, qy - 6], [qx, qy - 2], '#3D3A36', 0.7) + `<rect x="${f2(qx - 2.2)}" y="${f2(qy - 2)}" width="4.4" height="5.6" rx="1" fill="rgba(255,214,120,${f2(flick)})" stroke="#3D3A36" stroke-width="0.6"/>`;
      // Lucioles
      for (let j = 0; j < 5; j++) {
        const a = k + j * 1.3;
        const [fx, fy] = T.p(Math.cos(a) * 0.42, Math.sin(a) * 0.36, 26 + 10 * Math.sin(a * 2 + j));
        const on = 0.5 + 0.5 * Math.sin(k * 2 + j * 2);
        out += dot(fx, fy, 2.6, `rgba(255,236,140,${f2(0.25 * on)})`) + dot(fx, fy, 1, `rgba(255,250,200,${f2(0.9 * on)})`);
      }
      return out;
    }
  }],
  light: () => [0.26, 0.22, 34, 24, '255,200,110', false]
};

/* ---------- Les Dunes ---------- */
// Source de l'oasis : l'eau jaillit d'un rocher au milieu du bassin, trois palmiers, des lotus
const oasis = {
  layers: [{
    frame: [-66, -104, 132, 124],
    n: 8,
    fps: 6,
    draw: (T, fr, n) => {
      const k = (fr / n) * TAU;
      let out = '';
      // Lotus et ronds sur le bassin
      out += lotus(...T.p(-0.3, 0.3, 0)) + lotus(...T.p(0.34, 0.12, 0), '#FFFFFF') + lotus(...T.p(-0.1, 0.44, 0));
      const [rx, ry] = T.p(0, 0, 0);
      for (let j = 0; j < 2; j++) {
        const p = ((fr / n) + j * 0.5) % 1;
        out += ell(rx, ry + 1, 10 + p * 18, 5 + p * 9, 'none', ` stroke="rgba(230,248,255,${f2(0.7 * (1 - p))})" stroke-width="0.8"`);
      }
      // Palmiers du fond, chacun sur son îlot de sable
      const islet = (du, dv) => T.disc(du, dv, 0, 0.16, '#EBD49B', ` stroke="#D2B47A" stroke-width="0.8"`);
      out += islet(-0.5, -0.5) + islet(-0.46, 0.36) + islet(0.4, -0.46);
      out += palm(...T.p(-0.5, -0.5, 0), 1, wave(fr, n, 2.4)) + palm(...T.p(-0.46, 0.36, 0), 0.92, wave(fr, n, 2.4, 1.4), -1);
      // Rocher et jet d'eau
      out += boulder(0, 0, 0.17, 0.13, 14, SANDSTONE, 2, 0.2, 0.55);
      const [jx, jy] = T.p(0, 0, 16);
      const top = jy - 18 - Math.sin(k * 2) * 2;
      out += `<path d="M${f2(jx - 2)},${f2(jy)} Q${f2(jx - 1)},${f2(top)} ${f2(jx)},${f2(top - 2)} Q${f2(jx + 1)},${f2(top)} ${f2(jx + 2)},${f2(jy)} Z" fill="${WATER_LIGHT}" opacity=".9"/>`;
      for (let j = 0; j < 6; j++) {
        const side = j % 2 ? 1 : -1;
        const p = ((fr / n) + j / 6) % 1;
        const dx = side * (4 + (j % 3) * 4) * p;
        const dy = -16 * p + 26 * p * p;
        out += dot(jx + dx, top + 2 + dy, 1.3 - p * 0.5, j % 3 ? WATER_LIGHT : '#FFFFFF');
      }
      out += `<path d="M${f2(jx)},${f2(top)} q-8,2 -12,12 M${f2(jx)},${f2(top)} q8,2 12,12" stroke="${FOAM}" stroke-width="1" fill="none" opacity=".75"/>`;
      // Palmier de droite
      return out + palm(...T.p(0.4, -0.46, 0), 0.86, wave(fr, n, 2.4, 2.6));
    }
  }]
};

// Pyramide ensablée : la pointe dépasse des dunes, coiffée d'or qui accroche le soleil ; le sable file au vent
const pyramide = {
  layers: [{
    frame: [-72, -100, 144, 116],
    n: 8,
    fps: 4,
    draw: (T, fr, n) => {
      const STONES = { back: '#D9B878', right: '#B8934F', left: '#E8C989' };
      let out = T.shadow(0, 0, 0.7, 0.14) + pyramid(-0.56, -0.56, 0.56, 0.56, 0, 66, STONES, 0, EDGE);
      // Assises de pierre
      for (let z = 10; z < 60; z += 9) {
        const s = 0.56 * (1 - z / 66);
        out += ln(T.p(-s, s, z), T.p(s, s, z), 'rgba(120,90,40,.3)', 0.8) + ln(T.p(s, s, z), T.p(s, -s, z), 'rgba(80,60,30,.3)', 0.8);
      }
      // Signes oubliés sur la face gauche
      const [gx, gy] = T.p(-0.08, 0.36, 18);
      out += `<path d="M${f2(gx - 8)},${f2(gy)} m0,-6 a2.4,2.4 0 1 1 0.1,0 M${f2(gx)},${f2(gy - 2)} l0,-7 l3,2 M${f2(gx + 7)},${f2(gy - 4)} l3,-5 l3,5 Z" stroke="rgba(110,70,30,.55)" stroke-width="0.9" fill="none"/>`;
      // Pointe d'or et son éclat qui passe
      out += pyramid(-0.1, -0.1, 0.1, 0.1, 54, 14, { back: '#F0C650', right: '#D9A93A', left: '#F7D774' }, 0, EDGE);
      const [tx, ty] = T.p(0, 0, 68);
      const shine = Math.max(0, Math.sin((fr / n) * TAU));
      out += star(tx, ty, 4 + 5 * shine, '#FFF6D0', 0.25 + 0.75 * shine);
      // Dunes qui recouvrent la base
      out += ell(...T.p(-0.3, 0.42, 0), 30, 9, '#EBD49B') + ell(...T.p(0.42, 0.24, 0), 26, 8, '#F0DBA6') + ell(...T.p(0.1, 0.56, 0), 22, 6, '#F0DBA6')
        + ell(...T.p(-0.5, 0.05, 0), 18, 6, '#EBD49B');
      // Sable qui file
      for (let j = 0; j < 7; j++) {
        const p = ((fr / n) + j / 7) % 1;
        out += dot(-60 + p * 120, -10 - j * 5 + Math.sin(p * 6 + j) * 2, 0.9, 'rgba(240,220,170,.8)');
      }
      return out;
    }
  }]
};

/* ---------- La Jungle ---------- */
// Arbre-géant : un tronc large comme dix maisons, des racines-contreforts, une canopée, des lianes ; un perroquet
const arbre = {
  layers: [{
    frame: [-74, -140, 148, 156],
    n: 8,
    fps: 4,
    draw: (T, fr, n) => {
      const [x, y] = T.p(0, 0, 0);
      const BARK = { light: '#8A623F', mid: '#6E4B30', dark: '#4F3420' };
      let out = T.shadow(0, 0, 0.7, 0.2);
      // Racines-contreforts
      for (const [dx, w] of [[-26, 8], [-12, 6], [14, 6], [28, 8]]) {
        out += `<path d="M${x + dx},${y + 4} Q${x + dx * 0.4},${y - 6} ${x + dx * 0.2},${y - 26} L${x + dx * 0.2 + (dx < 0 ? w : -w)},${y - 26} Q${x + dx * 0.5},${y - 4} ${x + dx + (dx < 0 ? w : -w)},${y + 4} Z" fill="${dx < 0 ? BARK.mid : BARK.dark}" stroke="${OUT}" stroke-width="0.5"/>`;
      }
      // Tronc
      out += `<path d="M${x - 13},${y - 4} Q${x - 10},${y - 50} ${x - 15},${y - 96} L${x + 15},${y - 96} Q${x + 10},${y - 50} ${x + 13},${y - 4} Z" fill="${BARK.mid}" stroke="${OUT}" stroke-width="0.6"/>`
        + `<path d="M${x + 4},${y - 4} Q${x + 6},${y - 50} ${x + 4},${y - 96} L${x + 15},${y - 96} Q${x + 10},${y - 50} ${x + 13},${y - 4} Z" fill="${BARK.dark}"/>`
        + `<path d="M${x - 7},${y - 20} q2,-12 -1,-24 M${x - 2},${y - 50} q2,-10 0,-20" stroke="${BARK.light}" stroke-width="1.2" fill="none"/>`;
      // Grosses branches
      out += `<path d="M${x - 10},${y - 84} Q${x - 30},${y - 92} ${x - 44},${y - 90}" stroke="${BARK.mid}" stroke-width="6" fill="none" stroke-linecap="round"/>`
        + `<path d="M${x + 10},${y - 86} Q${x + 30},${y - 96} ${x + 46},${y - 92}" stroke="${BARK.dark}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      // Canopée
      const sway = wave(fr, n, 1.2);
      for (const [dx, dy, r] of [[-44, -96, 18], [44, -98, 18], [-26, -112, 22], [24, -114, 22], [0, -122, 24], [-8, -100, 18], [12, -102, 17]]) {
        out += leafBall(x + dx + sway * (dy < -110 ? 1 : 0.5), y + dy, r, JUNGLE);
      }
      // Lianes qui pendent et se balancent
      for (const [dx, len, ph] of [[-40, 40, 0], [-20, 30, 1], [30, 44, 2], [44, 28, 3]]) {
        const sw = wave(fr, n, 2.2, ph);
        out += `<path d="M${x + dx},${y - 92} q${f2(sw)},${len / 2} ${f2(sw * 1.6)},${len}" stroke="#3E7A34" stroke-width="1.2" fill="none"/>` + dot(x + dx + sw * 1.6, y - 92 + len, 1.8, JUNGLE.light);
      }
      // Perroquet sur la branche : il ouvre les ailes un instant
      const [px, py] = [x + 34, y - 95];
      const open = fr === 2 || fr === 3;
      out += (open ? `<path d="M${px - 1},${py - 6} q-8,-8 -12,-4 q4,2 9,6 Z M${px + 1},${py - 6} q8,-8 12,-4 q-4,2 -9,6 Z" fill="#3D7FD0"/>` : '')
        + ell(px, py - 5, 3.2, 5, '#E2402F', ` stroke="${OUT}" stroke-width="0.4"`) + dot(px + 1, py - 10.5, 2.6, '#E2402F')
        + `<path d="M${px + 3},${py - 11} q3,1 1,4 Z" fill="#F2C04B"/>` + dot(px + 1.6, py - 11.2, 0.6, '#2A2420')
        + `<path d="M${px - 1},${py} l-1,7 l3,-6 Z" fill="#3D7FD0"/>`;
      return out;
    }
  }]
};

// Grande cascade : l'eau du plateau tombe de la falaise (côté +u) en un rideau blanc jusqu'en bas, dans les embruns et
// un arc-en-ciel. La case est au bord d'une falaise de trois paliers
const DROP = 3 * HS;
const cascade = {
  fixed: true,
  layers: [{
    frame: [-46, -40, 116, 136],
    n: 8,
    fps: 8,
    draw: (T, fr, n) => {
      // Bassin du plateau qui file vers le bord
      let out = T.face([[-0.34, -0.3, 0.5], [0.5, -0.36, 0.5], [0.5, 0.36, 0.5], [-0.3, 0.3, 0.5]], WATER, ` stroke="${WATER_LIGHT}" stroke-width="1"`)
        + boulder(-0.36, -0.36, 0.12, 0.1, 10, GRANITE, 4, 0.2, 0.6) + boulder(-0.38, 0.32, 0.1, 0.08, 8, GRANITE, 6, 0.2, 0.6);
      for (let j = 0; j < 3; j++) {
        const p = ((fr / n) + j / 3) % 1;
        out += ln(T.p(-0.2 + p * 0.66, -0.2 + j * 0.2, 0.6), T.p(-0.12 + p * 0.66, -0.2 + j * 0.2, 0.6), 'rgba(255,255,255,.7)', 0.9);
      }
      // Le rideau d'eau, sur la face de la falaise
      out += T.face([[0.5, -0.34, 0], [0.5, 0.34, 0], [0.5, 0.34, -DROP], [0.5, -0.34, -DROP]], '#86C6E8');
      for (let j = 0; j < 9; j++) {
        const dv = -0.3 + j * 0.075;
        const off = ((fr / n) * 2 + j * 0.37) % 1;
        const z0 = -off * DROP;
        out += ln(T.p(0.5, dv, Math.min(0, z0 + 8)), T.p(0.5, dv, Math.max(-DROP, z0 - 14)), j % 2 ? '#FFFFFF' : '#CFEAF7', 1.6);
      }
      out += ln(T.p(0.5, -0.36, 0), T.p(0.5, 0.36, 0), FOAM, 2.2);
      // Embruns et écume au pied
      const [bx, by] = T.p(0.62, 0, -DROP);
      for (let j = 0; j < 5; j++) {
        const p = ((fr / n) + j / 5) % 1;
        out += puff(bx - 14 + j * 7, by - p * 16, 5 + p * 5, 0.5 * (1 - p), '245,250,255');
      }
      out += ell(bx, by + 2, 22, 7, 'rgba(255,255,255,.6)');
      // Arc-en-ciel dans les embruns
      const bands = ['rgba(240,90,80,.28)', 'rgba(245,200,80,.28)', 'rgba(110,200,120,.28)', 'rgba(100,150,230,.28)'];
      bands.forEach((c, i) => {
        const r = 30 - i * 3;
        out += `<path d="M${f2(bx - r)},${f2(by - 6)} A${f2(r)},${f2(r * 0.8)} 0 0 1 ${f2(bx + r)},${f2(by - 6)}" stroke="${c}" stroke-width="2.6" fill="none"/>`;
      });
      return out;
    }
  }]
};

/* ---------- Le Volcan ---------- */
// Geyser : des terrasses de sel autour d'un œil d'eau bleue ; de la vapeur, puis la colonne jaillit et retombe
const geyser = {
  layers: [{
    frame: [-52, -156, 104, 172],
    n: 16,
    fps: 4,
    draw: (T, fr) => {
      let out = T.shadow(0, 0, 0.5, 0.14);
      [[0.5, '#C9B38A'], [0.4, '#D9893A'], [0.36, '#D8C9A8'], [0.24, '#E8E0CF']].forEach(([r, c], i) => { out += T.disc(0, 0, i * 1.6, r, c, i === 1 ? '' : EDGE); });
      out += T.disc(0, 0, 6.6, 0.12, '#7FC9D8', ` stroke="#E8F6FA" stroke-width="1"`) + T.disc(0, 0, 6.8, 0.06, '#4FA8BE');
      const [x, y] = T.p(0, 0, 7);
      // Le cycle : vapeur (0-7), jaillissement (8-12), retombée (13-15)
      const jet = fr >= 8 && fr <= 12 ? [0.5, 1, 0.95, 0.8, 0.5][fr - 8] : 0;
      if (jet) {
        const h = 130 * jet;
        out += `<path d="M${f2(x - 3)},${f2(y)} Q${f2(x - 6)},${f2(y - h * 0.6)} ${f2(x - 2)},${f2(y - h)} Q${f2(x)},${f2(y - h - 8)} ${f2(x + 2)},${f2(y - h)} Q${f2(x + 6)},${f2(y - h * 0.6)} ${f2(x + 3)},${f2(y)} Z" fill="rgba(240,248,255,.9)"/>`
          + `<path d="M${f2(x - 1)},${f2(y)} Q${f2(x - 2)},${f2(y - h * 0.6)} ${f2(x)},${f2(y - h * 0.95)}" stroke="rgba(160,215,240,.8)" stroke-width="1.4" fill="none"/>`;
        for (let j = 0; j < 8; j++) {
          const a = (j / 8) * Math.PI - Math.PI;
          out += dot(x + Math.cos(a) * 12 * jet, y - h + 10 + Math.sin(a) * -6 + (j % 3) * 6, 1.4, 'rgba(220,240,255,.85)');
        }
        out += puff(x - 8, y - h, 10 * jet, 0.5) + puff(x + 9, y - h + 4, 9 * jet, 0.45);
      }
      // Vapeur qui monte (plus épaisse après le jaillissement)
      const thick = fr >= 13 ? 1.6 : 1;
      for (let j = 0; j < 3; j++) {
        const p = ((fr / 16) * 2 + j / 3) % 1;
        out += puff(x + Math.sin(p * 5 + j) * 5, y - 6 - p * 34 * thick, (4 + p * 8) * thick, 0.4 * (1 - p));
      }
      return out;
    }
  }]
};

// Lac de lave : un anneau de basalte autour d'un bassin qui bouillonne ; des bulles crèvent, une fumée monte
const cratere = {
  layers: [{
    frame: [-58, -114, 116, 130],
    n: 8,
    fps: 4,
    draw: (T, fr, n, id) => {
      const k = (fr / n) * TAU;
      const [x, y] = T.p(0, 0, 3);
      const rocks = Array.from({ length: 9 }, (_, j) => {
        const a = (j / 9) * TAU + 0.2;
        return { j, du: Math.cos(a) * 0.44, dv: Math.sin(a) * 0.4 };
      }).sort((p, q) => p.du + p.dv - (q.du + q.dv));
      let out = T.shadow(0, 0, 0.62, 0.2);
      rocks.filter(r => r.du + r.dv < 0).forEach(r => { out += boulder(r.du, r.dv, 0.13, 0.11, 12 + (r.j % 3) * 4, BASALT, r.j + 2, 0.25, 0.5); });
      // Bassin de lave : dégradé, croûtes qui dérivent, bulles qui crèvent
      out += `<defs><radialGradient id="${id}-lava"><stop offset="0" stop-color="#FFE38A"/><stop offset=".45" stop-color="#F59A3C"/><stop offset="1" stop-color="#C2401F"/></radialGradient></defs>`
        + ell(x, y, 26, 13, `url(#${id}-lava)`, ` stroke="#7A2A16" stroke-width="1.2"`);
      for (let j = 0; j < 4; j++) {
        const a = k * 0.25 + j * 1.6;
        out += `<path d="M${f2(x + Math.cos(a) * 14 - 4)},${f2(y + Math.sin(a) * 6)} l4,-1.6 l4,1.2 l-3,2 Z" fill="rgba(90,30,20,.55)"/>`;
      }
      for (let j = 0; j < 3; j++) {
        const p = ((fr / n) + j / 3) % 1;
        const bx = x - 10 + j * 10, by = y - 1 + (j % 2) * 3;
        out += p < 0.75 ? dot(bx, by - p * 2, 1 + p * 3.4, `rgba(255,230,140,${f2(0.9 - p * 0.6)})`) : ell(bx, by - 2, 5, 2, 'none', ' stroke="rgba(255,220,130,.8)" stroke-width="0.8"');
      }
      rocks.filter(r => r.du + r.dv >= 0).forEach(r => { out += boulder(r.du, r.dv, 0.13, 0.11, 10 + (r.j % 3) * 4, BASALT, r.j + 2, 0.25, 0.5); });
      // Fumée et braises qui montent
      for (let j = 0; j < 4; j++) {
        const p = ((fr / n) + j / 4) % 1;
        out += puff(x + Math.sin(p * 4 + j) * 6, y - 14 - p * 70, 5 + p * 10, 0.42 * (1 - p), '90,84,80');
        out += dot(x - 6 + j * 4 + Math.sin(p * 9) * 3, y - 10 - p * 50, 1, `rgba(255,170,80,${f2(1 - p)})`);
      }
      return out;
    }
  }],
  light: () => [0, 0, 6, 50, '255,120,50', true]
};

export const LANDMARK_SPRITES = { grotte, lac, col, menhirs, arche, saule, pilotis, oasis, pyramide, arbre, cascade, geyser, cratere };

// Le Cercle fleuri (HISTOIRE.md, § 6.14) : Anya révélée, des fleurs s'ouvrent autour de la table de pierre, une lueur
// dorée et verte respire au centre
const BLOOM = {
  frame: [-60, -74, 120, 96],
  n: 4,
  fps: 1.5,
  draw: (T, fr) => {
    const colors = ['#F6A8C8', '#FFFFFF', '#FFF2A8', '#F6C8D8', '#BFE3F7'];
    let out = `<defs><radialGradient id="mh-bloom"><stop offset="0" stop-color="rgba(250,236,170,${f2(0.5 + 0.12 * Math.sin((fr / 4) * TAU))})"/><stop offset="1" stop-color="rgba(170,225,130,0)"/></radialGradient></defs>`
      + ell(0, -8, 34, 20, 'url(#mh-bloom)');
    for (let k = 0; k < 16; k++) {
      const a = k * 2.4, r = 0.16 + (k % 4) * 0.055;
      const [x, y] = T.p(Math.cos(a) * r, Math.sin(a) * r, 0);
      out += dot(x, y, 1.7, colors[k % colors.length]) + dot(x, y, 0.6, '#F2C04B');
    }
    return out;
  }
};

// Calques d'un lieu prêts à peindre à l'instant t (secondes) : clé d'image et dessin ; bloom : le Cercle fleuri
export function landmarkLayers(id, t = 0, bloom = false) {
  const place = LANDMARK_SPRITES[id];
  if (!place) return [];
  // Le dessin de la bibliothèque d'abord (decorArt.js), sinon ces calques
  const art = landmarkArtLayer(id, t, bloom);
  if (art) return [art];
  return [...place.layers, ...(bloom && id === 'menhirs' ? [BLOOM] : [])].map((layer, k) => {
    const f = layer.n ? Math.floor(t * layer.fps) % layer.n : 0;
    const [x, y, w, h] = layer.frame;
    const name = `landmark-${id}-${k}`;
    return { key: `${name}-${f}`, make: () => sprite(layer.draw(tools(0, 0, name), f, layer.n || 1, name), { x, y, w, h }) };
  });
}

// Échelle d'un lieu sur l'île : un monument, un peu plus grand que sa case (la cascade suit sa falaise, à l'échelle 1)
export const landmarkScale = id => (LANDMARK_SPRITES[id] && LANDMARK_SPRITES[id].fixed ? 1 : 1.35);

// Haut du dessin d'un lieu au-dessus de son ancrage (pixels, négatif) : où poser ce qui flotte au-dessus de lui
export function landmarkTop(id) {
  const place = LANDMARK_SPRITES[id];
  return place ? Math.min(...place.layers.map(l => l.frame[1])) : -60;
}

// Lumière de nuit d'un lieu : [u, v, z, rayon, couleur « r,g,b », feu qui brûle même de jour], ou null
export function landmarkLight(id) {
  const place = LANDMARK_SPRITES[id];
  return place && place.light ? place.light() : null;
}

// Vignette d'un lieu (Carnet d'explorateur) : sa première image, cadrée au plus juste
export function landmarkThumb(id) {
  const place = LANDMARK_SPRITES[id];
  if (!place) return null;
  const frames = place.layers.map(l => l.frame);
  const x = Math.min(...frames.map(fr => fr[0]));
  const y = Math.min(...frames.map(fr => fr[1]));
  const w = Math.max(...frames.map(fr => fr[0] + fr[2])) - x;
  const h = Math.max(...frames.map(fr => fr[1] + fr[3])) - y;
  const body = place.layers.map((layer, k) => {
    const name = `landmark-${id}-${k}-t`;
    return layer.draw(tools(0, 0, name), 0, layer.n || 1, name);
  }).join('');
  return sprite(body, { x, y, w, h });
}
