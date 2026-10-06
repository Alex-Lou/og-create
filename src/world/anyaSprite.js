// Anya sur l'île (HISTOIRE.md, § 8 et § 14), hors du générateur des naufragés : deux fois leur taille, lumineuse et lente.
// Une couronne en bois de cerf fleurie, une chevelure de feuilles, des veines de lumière, un manteau vivant, pieds nus.
// De face (elle regarde le joueur) ; images 0 et 1 : elle respire, son manteau ondule. Ancrage aux pieds.
import { sprite } from './iso';

const f2 = n => Math.round(n * 100) / 100;
const OUT = ' stroke="rgba(40,60,30,.45)" stroke-width="0.6"';
const dot = (x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`;

export function anyaSprite(frame) {
  const b = frame === 1 ? 0.8 : 0;
  const sway = frame === 1 ? 1.2 : -0.6;
  const flowers = [[-12, -80, '#F6C8D8'], [-14, -71, '#FFFFFF'], [-7, -87, '#F6A8C8'], [12, -80, '#FFFFFF'], [14, -71, '#F6C8D8'], [7, -87, '#FFF2A8']];
  return sprite(
    `<ellipse cx="0" cy="0" rx="14" ry="3.6" fill="rgba(60,90,40,.25)"/>`
    + `<defs><radialGradient id="an-glow"><stop offset="0" stop-color="rgba(250,236,170,.6)"/><stop offset="1" stop-color="rgba(170,225,130,0)"/></radialGradient></defs>`
    + `<circle cx="0" cy="-44" r="40" fill="url(#an-glow)"/>`
    // Manteau vivant (plumes, papillons) et robe claire
    + `<path d="M-17,0 Q${f2(-20 + sway)},-26 -12,-50 Q-5,-56 0,-55 Q5,-56 12,-50 Q${f2(20 + sway)},-26 17,0 Z" fill="#4E7A3E"${OUT}/>`
    + `<path d="M-12,-14 q2.5,-3 5,0 M7,-22 q2.5,-3 5,0 M-8,-34 q2,-3 4,0" stroke="#A8D07A" stroke-width="1" fill="none"/>`
    + dot(-10, -24, 1.3, '#F2C04B') + dot(10, -10, 1.1, '#F6A8C8')
    + `<path d="M-6,0 Q-8,-26 -5,-51 H5 Q8,-26 6,0 Z" fill="#F4E8CC" stroke="#C9B48A" stroke-width="0.5"/>`
    + `<path d="M0,-50 V-10 M0,-38 l-3,4 M0,-28 l3,4" stroke="rgba(236,196,96,.9)" stroke-width="0.6" fill="none"/>`
    // Chevelure de feuilles, visage, yeux d'or vert
    + `<path d="M-6,${f2(-66 + b)} Q-14,-52 -12,-30 Q-8,-44 -5,-56 Z M6,${f2(-66 + b)} Q14,-52 12,-30 Q8,-44 5,-56 Z" fill="#79B464"${OUT}/>`
    + `<ellipse cx="0" cy="${f2(-63 + b)}" rx="5.4" ry="6.2" fill="#F2DCC0" stroke="#C9A27A" stroke-width="0.5"/>`
    + `<ellipse cx="-2" cy="${f2(-63.4 + b)}" rx="1" ry=".8" fill="#A8CC52"/><ellipse cx="2" cy="${f2(-63.4 + b)}" rx="1" ry=".8" fill="#A8CC52"/>`
    + dot(-2, -63.4 + b, 0.4, '#2A3A1A') + dot(2, -63.4 + b, 0.4, '#2A3A1A')
    + `<path d="M-1.3,${f2(-60 + b)} q1.3,.9 2.6,0" stroke="#A0705A" stroke-width=".5" fill="none" stroke-linecap="round"/>`
    // Couronne en bois de cerf, en fleurs
    + `<path d="M-2.6,${f2(-68 + b)} Q-6,-76 -12,-80 M-6,-75 Q-11,-75 -14,-71 M-8.6,-78 Q-9.4,-83 -7,-87 M2.6,${f2(-68 + b)} Q6,-76 12,-80 M6,-75 Q11,-75 14,-71 M8.6,-78 Q9.4,-83 7,-87" stroke="#8B6A4A" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
    + flowers.map(([x, y, c]) => dot(x, y, 1.3, c)).join('')
    // Pieds nus : des fleurs s'ouvrent
    + dot(-4.6, 0.6, 1.4, '#F6A8C8') + dot(5, 1, 1.4, '#FFF2A8'),
    { x: -24, y: -92, w: 48, h: 96 }
  );
}
