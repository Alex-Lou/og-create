// Habitants de l'île (vie ambiante) : petits personnages à grosse tête, dessinés de face ou de dos, avec la tenue
// et l'outil de leur métier. Poses : marche (2 images), repos (2 images, clignement), travail (2 images, l'outil va
// et vient). Le soir une lanterne, sous la pluie un parapluie. Ancrage aux pieds, cadre serré (images gardées à 4×).
import { sprite } from './iso';

const f2 = n => Math.round(n * 100) / 100;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const ln = (a, b, color, w = 1, extra = '') => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
const OUT = ' stroke="rgba(60,40,25,.35)" stroke-width="0.5"';
export const VILLAGER_BOX = { x: -16, y: -46, w: 32, h: 48 };

// Couleurs possibles : peau, cheveux ; une tenue par métier (haut, bas, chapeau, outil)
export const SKINS = ['#F6D3B3', '#E9B98F', '#C98B5E', '#8D5A3B'];
export const HAIRS = ['#3A2A1E', '#7A4E2C', '#C9873E', '#E8C46A', '#B94E3A', '#2E2E3A'];
export const ROLES = {
  potager: { label: 'Jardinière', top: '#7EC45B', bottom: '#6B4A2E', hat: 'straw', tool: 'can', style: 'long' },
  carriere: { label: 'Mineur', top: '#8E99A4', bottom: '#4F5660', hat: 'helmet', tool: 'pick', style: 'short' },
  bosquet: { label: 'Bûcheronne', top: '#C9473A', bottom: '#4F5A72', hat: 'beanie', tool: 'axe', style: 'bun' },
  puits: { label: 'Porteur d’eau', top: '#6FA3D9', bottom: '#5E616B', hat: 'scarf', tool: 'bucket', style: 'curly' },
  ponton: { label: 'Pêcheuse', top: '#F2C04B', bottom: '#2F5684', hat: 'bucket', tool: 'rod', style: 'long' },
  atelier: { label: 'Forgeron', top: '#9C6A44', bottom: '#3D3A36', hat: null, tool: 'hammer', style: 'short', apron: '#5E3A22' },
  foyer: { label: 'Cuisinière', top: '#FFFFFF', bottom: '#B9503B', hat: 'toque', tool: 'ladle', style: 'bun', apron: '#F4EEDC' }
};
const shade = (hex, k) => `#${[1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('')}`;

// Cheveux vus de face (le visage dégagé) ou de dos (toute la tête)
function hair(style, color, back) {
  const top = back
    ? `<path d="M-6.9,-21.5 Q-7.4,-30 0,-29.6 Q7.4,-30 6.9,-21.5 Q6.4,-17.4 0,-16.6 Q-6.4,-17.4 -6.9,-21.5 Z" fill="${color}"${OUT}/>`
    : `<path d="M-6.9,-21 Q-7.3,-29.4 0,-29.2 Q7.3,-29.4 6.9,-21 Q5.6,-25.6 1.2,-25.4 Q-2.4,-26.6 -6.9,-21 Z" fill="${color}"${OUT}/>`;
  if (style === 'bun') return top + `<circle cx="0" cy="-30.4" r="2.7" fill="${color}"${OUT}/>`;
  if (style === 'long') return top + `<path d="M-6.9,-22 Q-8,-15 -6,-12.6 L-4.6,-14 Q-5.8,-18 -5.4,-22 Z M6.9,-22 Q8,-15 6,-12.6 L4.6,-14 Q5.8,-18 5.4,-22 Z" fill="${color}"/>`;
  if (style === 'curly') return top + [[-6, -25], [-3, -28.6], [1, -29.4], [4.6, -27.6], [6.4, -24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${color}"/>`).join('');
  return top;
}
// Couvre-chefs des métiers
function hat(kind, back) {
  switch (kind) {
    case 'straw': return ell(0, -26.2, 10, 2.6, '#E8C46A', OUT) + `<path d="M-5.6,-26.4 Q-5.4,-31.6 0,-31.8 Q5.4,-31.6 5.6,-26.4 Z" fill="#F2D27E"${OUT}/>` + `<rect x="-5.6" y="-27.6" width="11.2" height="1.4" fill="#C9473A"/>`;
    case 'helmet': return `<path d="M-7.2,-24 Q-7,-31.4 0,-31.6 Q7,-31.4 7.2,-24 Z" fill="#F2C04B"${OUT}/>` + ell(0, -24, 8, 1.4, '#D9A52E') + (back ? '' : `<circle cx="0" cy="-28" r="1.6" fill="#FFF4C0" stroke="#8E6A2A" stroke-width=".5"/>`);
    case 'beanie': return `<path d="M-7,-23.6 Q-7,-31.2 0,-31.4 Q7,-31.2 7,-23.6 Z" fill="#4F5A72"${OUT}/>` + `<rect x="-7.2" y="-25" width="14.4" height="2.2" rx="1" fill="#3E4760"/>` + `<circle cx="0" cy="-31.8" r="1.8" fill="#E8DCC4"/>`;
    case 'scarf': return `<path d="M-7.2,-22 Q-7.6,-30.6 0,-30.8 Q7.6,-30.6 7.2,-22 Q4,-25 0,-25 Q-4,-25 -7.2,-22 Z" fill="#E2574C"${OUT}/>` + (back ? `<path d="M-1,-18 L-3,-13 L1,-15 Z" fill="#E2574C"/>` : '') + `<circle cx="-3" cy="-27.4" r=".7" fill="#FFF4E0"/><circle cx="2.4" cy="-28.6" r=".7" fill="#FFF4E0"/>`;
    case 'bucket': return `<path d="M-6.4,-25 L-5.4,-30.4 Q0,-31.6 5.4,-30.4 L6.4,-25 Z" fill="#6E7F3E"${OUT}/>` + ell(0, -25, 8.6, 1.8, '#5A6A32');
    case 'toque': return `<rect x="-5" y="-29.6" width="10" height="4.6" fill="#FFFFFF"${OUT}/>` + [-3.4, 0, 3.4].map(x => `<circle cx="${x}" cy="-31" r="2.8" fill="#FFFFFF"${OUT}/>`).join('');
    default: return '';
  }
}
// Outil tenu dans la main droite (à droite de l'image) ; up : en l'air (travail)
function tool(kind, up) {
  const a = up ? -1 : 0;
  switch (kind) {
    case 'can': return `<g transform="rotate(${up ? -30 : 0} 7 -9)">` + `<path d="M5,-11 L10,-11 L10,-6 L5,-6 Z" fill="#7FA6B8"${OUT}/>` + ln([10, -10], [13.5, -12.6], '#7FA6B8', 1.2) + `<path d="M6,-12 Q7.5,-14.4 9,-12" fill="none" stroke="#5E7F90" stroke-width=".9"/></g>` + (up ? [0, 1, 2].map(k => `<circle cx="${14 + k * 0.6}" cy="${-11 + k * 2}" r=".6" fill="#86C6E6"/>`).join('') : '');
    case 'pick': return `<g transform="rotate(${up ? -55 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -21], '#8B5631', 1.3) + `<path d="M1.4,-20.4 Q6.5,-24 11.6,-20.4 Q6.5,-22 1.4,-20.4 Z" fill="#8E99A4" stroke="#5A636C" stroke-width=".6"/></g>`;
    case 'axe': return `<g transform="rotate(${up ? -60 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -20], '#A9703F', 1.3) + `<path d="M6.5,-20 L10.6,-21.4 Q11.6,-18 10.6,-15.6 L6.5,-17 Z" fill="#B4BEC8" stroke="#68737E" stroke-width=".6"/></g>`;
    case 'bucket': return `<path d="M3.8,${-6 + a} L9.4,${-6 + a} L8.6,${-0.8 + a} L4.6,${-0.8 + a} Z" fill="#B98552"${OUT}/>` + `<path d="M4,${-6 + a} Q6.6,${-10.6 + a} 9.2,${-6 + a}" fill="none" stroke="#5E3A22" stroke-width=".7"/>` + ell(6.6, -5.9 + a, 2.6, 0.7, '#86C6E6');
    case 'rod': return up
      ? ln([6.5, -9], [15, -34], '#8B5631', 0.9) + `<path d="M15,-34 Q18,-24 16,-12" fill="none" stroke="rgba(255,255,255,.8)" stroke-width=".4"/>`
      : ln([6.5, -9], [12, -30], '#8B5631', 0.9) + `<path d="M12,-30 Q14,-20 13,-14" fill="none" stroke="rgba(255,255,255,.8)" stroke-width=".4"/>`;
    case 'hammer': return `<g transform="rotate(${up ? -70 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [6.5, -17], '#8B5631', 1.3) + `<rect x="3.4" y="-19.6" width="6.2" height="3" rx=".6" fill="#68737E"/></g>`;
    case 'ladle': return `<g transform="rotate(${up ? -35 : 0} 6.5 -8.5)">` + ln([6.5, -8.5], [8.5, -17], '#B4BEC8', 1) + ell(9, -17.6, 1.8, 1.2, '#B4BEC8') + `</g>`;
    default: return '';
  }
}

// Image d'un habitant. look : { skin, hair, style, top, bottom, hat, tool, apron } ;
// pose : walk | idle | work ; back : vu de dos ; frame : 0 ou 1 ; lantern, umbrella : accessoires
export function villagerSprite(look, { pose = 'idle', back = false, frame = 0, lantern = false, umbrella = false } = {}) {
  const stride = pose === 'walk' ? (frame === 0 ? 1.6 : -1.6) : 0;
  const bob = pose === 'walk' ? -0.5 : 0;
  const swing = pose === 'walk' ? (frame === 0 ? 14 : -14) : 0;
  const dark = shade(look.bottom, 0.8);
  let body = ell(0, 0, 6.5, 2.2, 'rgba(40,55,20,.22)');
  // Jambes et chaussures (une jambe en avant à la marche)
  body += `<rect x="${f2(-3.2 + stride * 0.4)}" y="${f2(-7.4 + (stride > 0 ? -0.6 : 0))}" width="2.5" height="6.6" rx="1.2" fill="${look.bottom}"/>`
    + `<rect x="${f2(0.7 - stride * 0.4)}" y="${f2(-7.4 + (stride < 0 ? -0.6 : 0))}" width="2.5" height="6.6" rx="1.2" fill="${dark}"/>`
    + ell(-2 + stride * 0.4, -0.8 + (stride > 0 ? -0.6 : 0), 1.8, 1, '#4A3426') + ell(2 - stride * 0.4, -0.8 + (stride < 0 ? -0.6 : 0), 1.8, 1, '#4A3426');
  let top = '';
  // Bras (balancés à la marche), torse, tablier
  const arm = (side, angle) => `<g transform="rotate(${angle} ${side * 4.6} -14.6)">${ell(side * 5.4, -11.4, 1.7, 3.6, shade(look.top, 0.88), OUT)}<circle cx="${side * 5.6}" cy="-8" r="1.4" fill="${look.skin}"/></g>`;
  top += arm(-1, back ? -swing : swing);
  top += `<path d="M-5,-6.6 Q-5.8,-15.4 0,-16 Q5.8,-15.4 5,-6.6 Q0,-5.4 -5,-6.6 Z" fill="${look.top}"${OUT}/>`;
  if (look.apron && !back) top += `<path d="M-3.4,-13 L3.4,-13 L3.8,-6.2 Q0,-5.4 -3.8,-6.2 Z" fill="${look.apron}" stroke="rgba(60,40,25,.25)" stroke-width=".4"/>`;
  top += arm(1, back ? swing : -swing);
  // Tête : visage de face, cheveux de dos
  let head = `<circle cx="0" cy="-21.6" r="6.6" fill="${look.skin}"${OUT}/>`;
  if (!back) {
    const blink = pose === 'idle' && frame === 1;
    head += blink
      ? ln([-3, -21], [-1.6, -21], '#2A2420', 0.7) + ln([1.6, -21], [3, -21], '#2A2420', 0.7)
      : ell(-2.3, -21, 0.8, 1.1, '#2A2420') + ell(2.3, -21, 0.8, 1.1, '#2A2420') + `<circle cx="-2" cy="-21.4" r=".3" fill="#FFFFFF"/><circle cx="2.6" cy="-21.4" r=".3" fill="#FFFFFF"/>`;
    head += `<circle cx="-3.8" cy="-19.2" r="1.1" fill="rgba(240,120,120,.35)"/><circle cx="3.8" cy="-19.2" r="1.1" fill="rgba(240,120,120,.35)"/>`
      + `<path d="M-1,-18.6 Q0,-17.8 1,-18.6" fill="none" stroke="#7A4030" stroke-width=".5" stroke-linecap="round"/>`;
  }
  head += hair(look.style, look.hair, back) + hat(look.hat, back);
  // Outil (pas avec le parapluie : la main le tient)
  const held = umbrella ? '' : tool(look.tool, pose === 'work' && frame === 1);
  const lamp = lantern
    ? ln([-5.6, -8], [-6.4, -4.6], '#3D3A36', 0.5) + `<path d="M-8.4,-4.6 L-4.4,-4.6 L-4.8,-0.6 L-8,-0.6 Z" fill="#FFE08A" stroke="#3D3A36" stroke-width=".6"/>` + `<circle cx="-6.4" cy="-2.6" r="2.6" fill="rgba(255,224,138,.35)"/>`
    : '';
  const brolly = umbrella
    ? ln([5.6, -8], [8, -12], '#4A3426', 0.8) + ln([8, -10], [8, -34], '#4A3426', 0.8)
      + `<path d="M-10.6,-33 Q2,-46 14.6,-33 Q11.4,-35 8.2,-33 Q5,-35 1.8,-33 Q-1.4,-35 -4.6,-33 Q-7.6,-35 -10.6,-33 Z" fill="#E2574C" stroke="rgba(60,30,20,.4)" stroke-width=".6"/>`
    : '';
  return sprite(`<g transform="translate(0 ${bob})">${body}${top}${head}${held}${lamp}</g>${brolly}`, VILLAGER_BOX);
}
