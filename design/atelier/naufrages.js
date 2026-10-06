// Réglages de chaque naufragé (voir naufrage.js) : couleurs délavées, lambeaux, trous, voile, algues, suie.
const { castaway, weed, smudge, cord, fade, CANVAS } = require('./naufrage');
const { OUT, P, E, L, clip, limb, r2 } = require('./troupe');

// y de l'ourlet en x pour une courbe symétrique (x0, y0) → (x1, y0), point de contrôle au milieu à la hauteur yc
const hem = (x0, x1, y0, yc) => x => { const t = (x - x0) / (x1 - x0); return r2(y0 + 2 * (yc - y0) * t * (1 - t)); };
// Mèche folle : cordon de la couleur des cheveux
const lock = (d, color) => cord(d, 1.2, color);
const walkSway = k => ctx => (ctx.walk ? ctx.ph * k : 0);

const SPECS = {
  // Aster : ciré délavé et déchiré, pantalon retroussé, pieds nus, une voile nouée, une algue dans les cheveux
  Aster: (() => {
    const y = hem(13, 35, 47.5, 51), coatS = '#CC9A2F';
    return {
      fade: ['#F2C04B', '#CC9A2F', '#FFE49A', '#C8463A', '#9A2F28', '#2F5684', '#22416A'], k: 0.6,
      skinS: '#DDA982', leg: 'roll', sleeves: 'torn',
      // sa voile à elle : la toile d'une voile de bateau, bande de renfort rouge, un œillet de laiton
      cape: CANVAS,
      capeExtra: view => `<rect x="0" y="${view === 'ne' ? 39.2 : 38.6}" width="48" height="1.15" fill="#C8463A" opacity="0.9"/>`
        + `<circle cx="${view === 'ne' ? 30.4 : view === 'se' ? 15.2 : 16.4}" cy="${view === 'ne' ? 36.6 : 36.4}" r="0.75" fill="none" stroke="#B08A3A" stroke-width="0.55"/>`,
      tatters: { front: [[17, y(17), coatS], [30, y(30), coatS, 1.8]], se: [[16.4, y(16.4), coatS], [29.4, y(29.4), coatS, 1.8]], ne: [[18.6, y(18.6), coatS], [30.4, y(30.4), coatS, 1.8]] },
      holes: { front: [[17.6, 45.2, 1.1, '#9C7424']], se: [[16.8, 45.2, 1.1, '#9C7424']], ne: [[27.6, 45.4, 1.1, '#9C7424']] },
      rips: { front: [[29.6, 44.6]], se: [[28, 44.8]], ne: [[19.4, 44.6]] },
      head: ({ view }) => view === 'ne'
        ? weed('M27.6,6.6 Q34.6,7.4 36.2,12.6 Q37.4,16.8 35.6,20.6', [[36.6, 13.8, -20]])
        : view === 'se'
          ? weed('M18.8,7.6 Q13.6,8.4 12.6,13.2 Q11.8,17.4 13.2,20.2', [[12.4, 13.4, 30]]) + smudge(29.4, 28.6)
          : weed('M18.4,7.4 Q12.8,8.2 11.8,13.2 Q11,17.4 12.4,20.4', [[11.6, 13.4, 30]]) + smudge(31.4, 28.8)
    };
  })(),

  // Cannelle : robe et tablier délavés et effrangés, jambes et pieds nus, le chignon à moitié défait (mèches grises) ;
  // une couverture rayée jetée sur les épaules, les deux pans croisés sur la poitrine et noués devant
  Cannelle: (() => {
    const y = hem(10.4, 37.6, 53.6, 57.2), ya = hem(15, 33, 53.4, 55.6), dS = '#84402B';
    const B = { cloth: '#93A9C2', shade: '#738AA6', stripe: '#E9EEF3', knot: '#7D94B0' };
    // la couverture : un châle épais sur les épaules et le haut des bras ; devant, le bord droit passe sur le gauche et
    // les deux coins sont noués ; rayures claires, franges au bas
    const fringe = (x0, y0, x1, y1, n) => Array.from({ length: n }, (_, i) => { const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, yy = y0 + (y1 - y0) * t; return L([x, yy + 0.3], [x - 0.2, yy + 1.7], B.shade, 0.55); }).join('');
    const stripes = ys => ys.map(yy => `<path d="M0,${yy} Q24,${r2(yy + 1.6)} 48,${yy}" stroke="${B.stripe}" stroke-width="0.85" fill="none"/>`).join('');
    const blanket = (cc, { view }) => {
      if (view === 'ne') {
        const d = 'M11.8,36 Q13,32 18.4,31.2 Q24,32.6 29.6,31.2 Q35,32 36.2,36 L36.6,43.6 Q30.4,46.2 24,46.4 Q17.6,46.2 11.4,43.6 Z';
        return fringe(11.8, 43.8, 36.2, 43.8, 9) + P(d, B.cloth) + clip(`${cc.uid}cv`, d, stripes([38.2, 41.2]) + `<rect x="27" y="28" width="14" height="22" fill="${B.shade}" opacity="0.75"/>`) + P(d, 'none');
      }
      const k = view === 'se' ? -2 : 0, far = view === 'se' ? 0.82 : 1;
      const X = x => r2(24 + k + (x - 24) * (x > 24 ? far : 1));
      const left = `M${X(18.6)},31.4 Q${X(13)},32.4 ${X(11.8)},37.6 L${X(12.2)},44.2 Q${X(17.2)},45.6 ${X(23.4)},44.6 L${X(25.4)},41 Q${X(22.4)},36.2 ${X(21)},32.4 Z`;
      const right = `M${X(29.4)},31.4 Q${X(35)},32.4 ${X(36.2)},37.6 L${X(35.8)},44.2 Q${X(30.8)},45.6 ${X(24.6)},44.6 L${X(22.6)},41 Q${X(25.6)},36.2 ${X(27)},32.4 Z`;
      let o = fringe(X(12.4), 44.4, X(23.2), 44.8, 5) + fringe(X(24.8), 44.8, X(35.6), 44.4, 5);
      o += P(left, B.cloth) + clip(`${cc.uid}cl`, left, stripes([38.6, 41.6])) + P(left, 'none');
      o += P(right, B.cloth) + clip(`${cc.uid}cr`, right, stripes([38.6, 41.6]) + `<rect x="${X(24)}" y="28" width="16" height="20" fill="${B.shade}" opacity="0.7"/>`) + P(right, 'none');
      // les deux coins noués au milieu, deux petits bouts qui pendent
      const kx = X(24);
      o += P(`M${r2(kx - 0.6)},42 L${r2(kx - 1.8)},45.6 L${r2(kx - 0.4)},45.2 Z`, B.knot, 0.7) + P(`M${r2(kx + 0.6)},42 L${r2(kx + 1.6)},45.4 L${r2(kx + 0.2)},45.2 Z`, B.knot, 0.7);
      o += E(kx, 41.6, 1.9, 1.5, B.knot) + P(`M${r2(kx - 1)},41.2 Q${kx},42 ${r2(kx + 1)},41.2`, 'none', 0.5);
      return o;
    };
    return {
      fade: ['#A8553A', '#84402B', '#C46E4E', '#F4E9D8', '#DCCDB5'],
      skinS: '#CF9C72', leg: 'skin', capeFn: blanket, sway: walkSway(0.7),
      tatters: { front: [[12.8, y(12.8), dS, 1.8], [35.2, y(35.2), dS, 1.8], [26.4, ya(26.4), '#F4E9D8', 1.5, 0.8]], se: [[12.6, y(12.6), dS, 1.8], [35.4, y(35.4), dS, 1.8], [24.2, ya(26.2), '#F4E9D8', 1.5, 0.8]], ne: [[13.4, y(13.4), dS, 1.8], [22, y(22), dS], [34.6, y(34.6), dS, 1.8]] },
      holes: { front: [[33.6, 50.4, 0.9, '#6A3322']], se: [[33.8, 50.6, 0.9, '#6A3322']], ne: [[30.2, 50.8, 1, '#6A3322']] },
      rips: { front: [[20.6, 50.8, 2.2]], se: [[18.8, 50.8, 2.2]], ne: [[16.6, 50.4, 2.4]] },
      head: ({ view }) => {
        const hair = '#D9D4CC';
        if (view === 'ne') return lock('M14.2,22 Q11.4,26.4 12.8,30.4', hair) + lock('M33.8,22 Q36.4,26 35,29.6', hair) + lock('M26.6,11.6 Q30.6,12.4 31,16.4', hair);
        const k = view === 'se' ? -0.6 : 0;
        return lock(`M${12.8 + k},18.4 Q${10.6 + k},22.2 ${12 + k},26`, hair) + (view === 'se' ? '' : lock('M35.2,18.4 Q37.4,22.2 36,26', hair))
          + lock(`M${27.4 + k},9.4 Q${31.4 + k},9.8 ${32.4 + k},13.2`, hair) + smudge(view === 'se' ? 27.8 : 31, 29.4);
      }
    };
  })(),

  // Rivet : chemise délavée aux manches retroussées, un bandage de chiffon sur l'avant-bras gauche, tablier de cuir
  // éraflé dont la poche à outils est à moitié arrachée, une loupe fêlée, pantalon retroussé, pieds nus, suie sur la joue
  Rivet: (() => {
    const ya = hem(15.8, 32.2, 52, 53.8), yt = hem(14.8, 33.2, 46.6, 48.8);
    const crack = (x, y, r) => `<path d="M${r2(x - r * 0.55)},${r2(y - r * 0.5)} L${r2(x - r * 0.1)},${r2(y - r * 0.05)} L${r2(x - r * 0.3)},${r2(y + r * 0.45)} M${r2(x - r * 0.1)},${r2(y - r * 0.05)} L${r2(x + r * 0.5)},${r2(y + r * 0.1)}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    // la poche à outils : sa moitié droite décousue pend, on voit l'intérieur sombre
    const pocket = ({ view }) => {
      if (view === 'ne') return '';
      const k = view === 'se' ? -1.8 : 0;
      return `<rect x="${r2(24.2 + k)}" y="43.4" width="4.4" height="1.5" rx="0.3" fill="#3E2A1C"/>`
        + P(`M${r2(24.2 + k)},44.8 L${r2(28.8 + k)},44.8 Q${r2(28.4 + k)},47.6 ${r2(26.9 + k)},49.2 Q${r2(25.2 + k)},47.4 ${r2(24.2 + k)},44.8 Z`, '#73533C', 0.8)
        + L([25.2 + k, 45.6], [27.8 + k, 45.6], '#B08A68', 0.45);
    };
    return {
      fade: ['#3F8A86', '#2E6B68', '#EFE6D6', '#4A4E5C', '#383B47'],
      map: { '#8A5A36': '#93694A', '#6B4328': '#73533C', '#A87650': '#B08A68' }, // cuir un peu passé
      skinS: '#C08A62', leg: 'roll', sleeves: 'roll', sleeveCut: 6.4, bandage: 'left', over: pocket,
      tatters: { front: [[15.4, yt(15.4), '#2E6B68', 1.1, 0.8], [32.6, yt(32.6), '#2E6B68', 1.1, 0.8], [21, ya(21), '#6B4328', 1.5, 0.8]], se: [[15.2, yt(15.2), '#2E6B68', 1.1, 0.8], [32.8, yt(32.8), '#2E6B68', 1.1, 0.8], [19.2, ya(21), '#6B4328', 1.5, 0.8]], ne: [[17.4, yt(17.4), '#3F8A86', 1.6], [24.4, yt(24.4), '#3F8A86', 1.4], [30.6, yt(30.6), '#2E6B68', 1.6]] },
      holes: { ne: [[20.6, 37.8, 1, '#24504E']] },
      rips: { front: [[28.4, 50.6, 2]], se: [[26.6, 50.6, 2]], ne: [[28.4, 44.6, 2.2]] },
      head: ({ view, pose }) => {
        if (view === 'ne') return '';
        const lens = pose === 'action' ? [28.6, 22.8, 2.9] : view === 'se' ? [26.6, 10.4, 2.5 * 0.68] : [28.6, 10.8, 2.9 * 0.68];
        return crack(...lens) + smudge(view === 'se' ? 27.6 : 30.8, 28.6, '#6E5E54');
      }
    };
  })(),

  // Ondin : ciré délavé et effrangé, le bout du bonnet arraché (le pompon pend au bout d'un fil), une petite étoile de
  // mer accrochée au ciré, une algue prise dans le bonnet ; bocal vide, baguette sauvée
  Ondin: (() => {
    const y = hem(13, 35, 52.4, 55), cS = '#2E5F9E', HY = 4.4;
    const POM = E(41.6, 24.4, 2.2, 2.2, '#F4EEDF') + E(42.2, 25.2, 0.8, 0.7, '#DCCDB5', 0);
    // le pompon qui pend : un fil depuis la pointe du bonnet (repère de la tête ; m = -1 de dos, le bonnet est en miroir)
    const hanging = (k, m, n) => {
      const tip = [24 + (41.8 + k - 24) * m, 23.4], swing = n % 2 ? 0.5 : -0.3;
      const end = [24 + (42.6 + k - 24) * m + swing, 28];
      return `<path d="M${r2(tip[0])},${tip[1]} Q${r2((tip[0] + end[0]) / 2 + 0.6 * m)},${r2(25.8)} ${r2(end[0])},${end[1]}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>`
        + E(end[0], end[1] + 1.8, 2, 2, '#F4EEDF') + E(end[0] + 0.5 * m, end[1] + 2.5, 0.75, 0.65, '#DCCDB5', 0)
        + L([tip[0] - 0.8, tip[1] + 0.2], [tip[0] + 0.7, tip[1] + 0.5], OUT, 0.5); // l'accroc au bout du bonnet
    };
    const star = (x, yy, r, rot) => {
      const p = Array.from({ length: 10 }, (_, i) => { const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.46 : r; return `${r2(x + Math.cos(a) * rr)},${r2(yy + Math.sin(a) * rr)}`; }).join(' L');
      return `<g transform="rotate(${rot} ${x} ${yy})"><path d="M${p} Z" fill="#F2995A" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
        + [[0, -0.55], [0.5, 0.1], [-0.5, 0.1], [0, 0.5]].map(([dx, dy]) => E(x + dx * r, yy + dy * r, 0.28, 0.28, '#FFD9B3', 0)).join('') + '</g>';
    };
    return {
      fade: ['#3D7CC9', '#2E5F9E', '#7DB0E8', '#A9CBEF', '#BFD3F2', '#93AEDB'],
      over: ({ view }) => (view === 'ne' ? star(28.2, 43, 2.7, -12) : star(view === 'se' ? 21.2 : 21, 42.2, 2.7, 16)),
      tatters: { front: [[16, y(16), cS], [31, y(31), cS, 1.8]], se: [[15.6, y(15.6), cS], [30.2, y(30.2), cS, 1.8]], ne: [[17.4, y(17.4), cS], [30.6, y(30.6), cS, 1.8]] },
      holes: { front: [[17.2, 50.8, 0.9, '#264E82']], se: [[16.4, 51, 0.9, '#264E82']], ne: [[28.8, 50.6, 1, '#264E82']] },
      rips: { front: [[30.4, 50.2, 2]], se: [[28.8, 50.4, 2]], ne: [[18.6, 50.6, 2]] },
      headFix: (h, { view, n }) => {
        const k = view === 'se' ? -1.4 : 0, m = view === 'ne' ? -1 : 1;
        return h.split(POM).join('').replace(/<\/g>$/, hanging(k, m, n) + '</g>');
      },
      head: ({ view }) => {
        if (view === 'ne') return weed(`M31,${6.4 + HY} Q34.6,${7.6 + HY} 35.2,${11.2 + HY} Q35.6,${13.8 + HY} 34.6,${16 + HY}`, [[35.6, 12 + HY, -24]]);
        const k = view === 'se' ? -1.4 : 0;
        return weed(`M${18 + k},${5.8 + HY} Q${14.2 + k},${7.2 + HY} ${13.4 + k},${10.8 + HY} Q${13 + k},${13.4 + HY} ${14 + k},${15.8 + HY}`, [[12.8 + k, 11.6 + HY, 30]])
          + smudge(view === 'se' ? 27.6 : 30.8, 28.4 + HY);
      }
    };
  })(),

  // Sylve : sa cape de feuilles est perdue (il ne reste que la liane et quelques feuilles flétries), tunique délavée et
  // trouée, une bande de voile nouée en ceinture, de la boue sur la joue
  Sylve: (() => {
    const W1 = { leaf: '#8C9A4E', leafS: '#6E7A3A', vine: '#6E7440' };
    const leafAt = (x, y, len, w, rot) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">`
      + P(`M0,0 Q${w},${r2(len / 2)} 0,${len} Q${-w},${r2(len / 2)} 0,0 Z`, W1.leaf, 0.7) + L([0, 0.6], [0, len - 0.8], W1.leafS, 0.4) + '</g>';
    const vine = d => cord(d, 1, W1.vine);
    // de face : un bout de liane qui pend derrière, sur le côté, avec deux feuilles
    const remnant = ({ view }) => (view === 'ne' ? ''
      : vine('M15.6,33.4 Q12.2,38 12.6,45.6') + leafAt(12.4, 40.4, 3.2, 1.3, 40) + leafAt(12.8, 45, 3.4, 1.3, 14));
    // la ceinture : une bande de toile de voile nouée sur le côté, deux bouts qui pendent
    const belt = ({ view }) => {
      const k = view === 'se' ? -1.6 : 0;
      const band = 'M15,41.3 Q24,43.1 33,41.3 L33.1,43.5 Q24,45.3 14.9,43.5 Z';
      let o = P(band, '#E6DCC3') + clip(`sybelt${view}`, band, '<rect x="26" y="40" width="10" height="6" fill="#C9BB98"/>') + P(band, 'none');
      if (view === 'ne') {
        // de dos : les dernières feuilles de la cape, glissées dans la ceinture
        return [[19.2, 43.2, 16], [22.6, 44, 4], [27.6, 43.8, -10]].map(([x, y, r]) => leafAt(x, y, 3.6, 1.4, r)).join('') + o;
      }
      const kx = 19.6 + k;
      o += P(`M${r2(kx - 0.4)},43.6 L${r2(kx - 1.8)},47.8 L${r2(kx - 0.2)},47.6 Z`, '#E6DCC3', 0.7) + P(`M${r2(kx + 0.6)},43.6 L${r2(kx + 1.4)},47.2 L${r2(kx)},47.4 Z`, '#C9BB98', 0.7);
      return o + E(kx, 42.9, 1.5, 1.2, '#D6CBAE', 0.8);
    };
    return {
      flags: { noCape: true },
      fade: ['#A88655', '#86683E'],
      map: { '#5E9E4A': W1.leaf, '#467A37': W1.leafS, '#86C06A': '#B1B86C', '#4E7A34': W1.vine },
      overKeep: ['#5E9E4A', '#467A37', '#86C06A', '#4E7A34'], // la pousse qui jaillit reste verte
      backItems: (cc, ctx) => remnant(ctx),
      over: belt,
      holes: { front: [[29.4, 38.2, 0.9, '#6E5530']], se: [[28, 38.4, 0.9, '#6E5530']], ne: [[20.4, 40.2, 1, '#6E5530']] },
      rips: { front: [[18.4, 37.4, 2]], se: [[17, 37.6, 2]], ne: [[28.4, 38.6, 2]] },
      head: ({ view }) => (view === 'ne' ? '' : smudge(view === 'se' ? 15.4 : 17.4, 29.6, '#7A5E44'))
    };
  })(),

  // Galet : un sac de jute du caboteur porté en poncho (trou pour la tête, bas effiloché, corde à la taille), blouse et
  // pantalon délavés ; il a perdu un sabot : pied droit nu, pantalon retroussé de ce côté
  Galet: (() => {
    const HY = 4.4;
    const J = { cloth: '#C2A574', shade: '#9E8456', dot: '#A88C5C', rope: '#7A5A3A' };
    const weave = (x0, x1, y0, y1) => { let o = ''; for (let yy = y0; yy < y1; yy += 2.2) for (let x = x0 + (Math.round(yy * 10) % 2 ? 1 : 0); x < x1; x += 2.6) o += `<rect x="${r2(x)}" y="${r2(yy)}" width="0.9" height="0.5" fill="${J.dot}" opacity="0.8"/>`; return o; };
    const poncho = (cc, { view }) => {
      const k = view === 'se' ? -1.6 : 0, far = view === 'se' ? 0.84 : 1;
      const X = x => r2(24 + k + (x - 24) * (x > 24 ? far : 1));
      const zig = [[12.8, 48.4], [15.2, 47.4], [17.4, 49.2], [20, 47.8], [22.6, 49.4], [25.4, 47.8], [28, 49.2], [30.6, 47.6], [33, 49], [35.2, 48.2]];
      const bottom = zig.map(([x, y]) => `${X(x)},${y}`).join(' L');
      const d = view === 'ne'
        ? `M${X(17.4)},36.6 Q${X(13.4)},37.4 ${X(12.4)},41.6 L${bottom} L${X(35.6)},41.6 Q${X(34.6)},37.4 ${X(30.6)},36.6 Q24,37.8 ${X(17.4)},36.6 Z`
        : `M${X(17.6)},37 Q${X(13.6)},37.6 ${X(12.4)},41.6 L${bottom} L${X(35.6)},41.6 Q${X(34.4)},37.6 ${X(30.4)},37 Q${24 + k},39.4 ${X(17.6)},37 Z`;
      let o = P(d, J.cloth) + clip(`${cc.uid}pj`, d, weave(10, 38, 38, 50) + `<rect x="${X(28)}" y="34" width="12" height="18" fill="${J.shade}" opacity="0.8"/>`
        + `<path d="M${X(12)},43.2 Q${24 + k},44.6 ${X(36)},43.2" fill="none" stroke="#8A6E44" stroke-width="0.6" stroke-dasharray="1 0.8"/>`) + P(d, 'none');
      // fils qui pendent au bas, corde nouée à la taille
      o += [[14.2, 47.8], [21.4, 48.6], [29.4, 48.4]].map(([x, y]) => L([X(x), y], [X(x) - 0.2, y + 1.6], J.shade, 0.5)).join('');
      o += cord(`M${X(12.9)},45.4 Q${24 + k},47.4 ${X(35.3)},45.4`, 0.8, J.rope);
      if (view !== 'ne') o += E(X(31.4), 46.1, 1.2, 0.9, J.rope, 0.7) + cord(`M${X(31.2)},46.8 L${X(30.6)},49.6`, 0.6, J.rope) + cord(`M${X(31.8)},46.8 L${X(32.6)},49.2`, 0.6, J.rope);
      return o;
    };
    return {
      fade: ['#6E6458', '#564E44', '#55504A', '#403C37', '#B5562E', '#8E3F20', '#D07448'],
      skinS: '#9C968B', leg: 'roll', bareSide: 'right', capeFn: poncho,
      tatters: { front: [[16, 51.4, '#6E6458', 1.6], [31.6, 51.5, '#564E44', 1.6]], se: [[15.6, 51.4, '#6E6458', 1.6], [30.6, 51.5, '#564E44', 1.6]], ne: [[17, 51.4, '#6E6458', 1.6], [31.4, 51.5, '#564E44', 1.6]] },
      head: () => ''
    };
  })(),

  // Mélisse : robe délavée et déchirée, le châle couleur nuit noué à la taille (la pointe pend dans le dos), le chapeau
  // de paille déchiré au bord, cabossé et effiloché, une algue accrochée au bord ; jambes nues et un sabot perdu
  Melisse: (() => {
    const y = hem(13.4, 34.6, 53.6, 56), dS = '#728560';
    const SH = fade('#2E3A6B'), SHS = fade('#232C52'), MOON = '#F4EEDF';
    const straw = (x, yy, dx, dy) => L([x, yy], [x + dx, yy + dy], OUT, 1.5) + L([x, yy], [x + dx, yy + dy], '#E3C27A', 0.7);
    const crescent = (x, yy, r) => `<path d="M${r2(x)},${r2(yy - r)} A${r} ${r} 0 1 0 ${r2(x)},${r2(yy + r)} A${r2(r * 0.72)} ${r} 0 1 1 ${r2(x)},${r2(yy - r)} Z" fill="${MOON}"/>`;
    // le châle noué autour de la taille : une bande, le nœud sur la hanche, la pointe qui pend dans le dos
    const shawl = ({ view }) => {
      const band = 'M14.6,43 Q24,45.2 33.4,43 L33.8,46.2 Q24,48.4 14.2,46.2 Z';
      let o = '';
      if (view === 'ne') {
        const tri = 'M15.2,45.6 Q24,47.6 32.8,45.6 L24.4,55 L23.6,55 Z';
        o += P(tri, SH) + clip(`meltri`, tri, `<rect x="24" y="40" width="12" height="18" fill="${SHS}"/>` + crescent(21.6, 48.6, 0.9) + crescent(25.6, 49.6, 0.9) + crescent(23.8, 52.4, 0.8)) + P(tri, 'none')
          + [23.2, 24.8].map(x => L([x, 54.8], [x, 56.4], SHS, 0.55)).join('');
      }
      o += P(band, SH) + clip(`melband${view}`, band, `<rect x="27.6" y="40" width="10" height="10" fill="${SHS}"/>` + crescent(18.6, 44.8, 0.8) + crescent(23.4, 45.8, 0.8)) + P(band, 'none');
      if (view !== 'ne') {
        const k = view === 'se' ? -1.4 : 0, kx = 31.4 + k * 0.4;
        o += P(`M${r2(kx - 0.6)},46.4 L${r2(kx - 1.8)},51.4 L${r2(kx - 0.2)},51 Z`, SH, 0.7) + P(`M${r2(kx + 0.6)},46.4 L${r2(kx + 1.6)},50.6 L${r2(kx + 0.2)},50.8 Z`, SHS, 0.7)
          + E(kx, 45.6, 1.6, 1.3, SHS, 0.8) + [kx - 1.8, kx + 1.6].map(x => L([x, 51], [x, 52.2], SHS, 0.5)).join('');
      }
      return o;
    };
    // la déchirure du bord du chapeau (un rabat de paille soulevé) et la calotte cabossée ; m = -1 de dos (en miroir)
    const hatDamage = (k, m) => {
      const X = x => r2(24 + (x - 24) * m + k);
      return `<path d="M${X(11.4)},15.4 L${X(13)},13.4 L${X(14.2)},14.6 L${X(15.6)},12.9" fill="none" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round"/>`
        + P(`M${X(11.4)},15.4 L${X(13)},13.4 L${X(10.6)},12.6 Z`, '#D9C08E', 0.6)
        // la calotte enfoncée d'un côté : un pli en V, l'ombre du creux
        + P(`M${X(18.4)},6.4 L${X(20.4)},8.8 L${X(22.2)},7.2 L${X(20.6)},6.6 Z`, '#A88E5E', 0)
        + `<path d="M${X(18.4)},6.4 L${X(20.4)},8.8 L${X(22.2)},7.2" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    };
    return {
      flags: { noShawl: true },
      fade: ['#8FA27A', '#728560', '#2E3A6B', '#232C52', '#E3C27A', '#BF9A52', '#F2DCA0', '#7A4A6A', '#A8743F', '#7E5530', '#C9965E'],
      skinS: '#A9704C', leg: 'skin', bareSide: 'left', over: shawl,
      tatters: { front: [[16, y(16), dS], [31.6, y(31.6), dS, 1.8]], se: [[15.6, y(15.6), dS], [30.8, y(30.8), dS, 1.8]], ne: [[17, y(17), dS], [31, y(31), dS, 1.8]] },
      holes: { front: [[29.6, 38.6, 0.9, '#5C6E4C']], se: [[28.2, 38.6, 0.9, '#5C6E4C']], ne: [[19.4, 38.6, 1, '#5C6E4C']] },
      rips: { front: [[19.6, 50.4, 2.2]], se: [[18.2, 50.4, 2.2]], ne: [[28.6, 50.6, 2.2]] },
      head: ({ view }) => {
        if (view === 'ne') return hatDamage(0, -1) + straw(40.6, 13.6, 2.6, 1.2) + straw(41.2, 12.2, 2.8, -0.4) + weed('M13.6,15.4 Q10.8,18.4 12,22.6', [[11.4, 19.2, 26]]);
        const k = view === 'se' ? -1.4 : 0;
        return hatDamage(k, 1) + straw(7.2 + k, 13.4, -2.6, 1) + straw(6.8 + k, 12, -2.8, -0.6) + straw(8.4 + k, 14.8, -1.8, 1.8)
          + weed(`M${34.4 + k},15.4 Q${37 + k},18.4 ${35.8 + k},22.6`, [[36.6 + k, 19.4, -24]]) + smudge(view === 'se' ? 15.6 : 17.6, 29);
      }
    };
  })()
};

const BASE = { Aster: require('./aster2'), Cannelle: require('./cannelle'), Rivet: require('./rivet'), Ondin: require('./ondin'), Sylve: require('./sylve'), Galet: require('./galet'), Melisse: require('./melisse') };
const CAST = Object.entries(BASE).map(([k, c]) => ({ base: c, nau: castaway(c, SPECS[k]) }));
// Sylve naufragée, endormie : roulée dans sa tunique délavée (sa cape est perdue), quelques feuilles flétries
CAST.find(x => x.base.name === 'Sylve').nau.nauMound = { fill: fade('#A88655'), shade: fade('#86683E'), hi: fade('#C2A274'), leaf: '#8C9A4E' };
module.exports = { CAST, SPECS };
