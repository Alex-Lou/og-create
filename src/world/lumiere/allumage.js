// Les lumières du soir qui s'allument une à une : au crépuscule, fenêtres et lanternes s'allument en vague depuis le
// Foyer (les plus proches d'abord), chacune d'un coup, son halo qui s'ouvre en dépassant un peu, une étincelle ; à
// l'aube, elles s'éteignent de même, en fondu, un filet de fumée au-dessus. Chaque lumière a son seuil sur la lumière
// du ciel (phase.lit), avec une marge pour ne pas clignoter quand le ciel hésite. À l'ouverture de l'île, tout est posé
// sans animation ; en mouvement réduit, tout se fait d'un coup.
import { hash } from '../scene';
import { lueur, etoile } from '@/utils/vfx';

const clamp = v => Math.min(1, Math.max(0, v));
const smooth = v => { const k = clamp(v); return k * k * (3 - 2 * k); };

const MARGE = 0.02; // de part et d'autre du seuil
const PORTEE = 14 * 64; // la vague parcourt cette distance du Foyer (unités du monde)
export const ALLUME_MS = 520;
export const ETEINT_MS = 900;
const TRACE_MS = 1600; // une étincelle ou une fumée vit ce temps

// Le seuil d'une lumière (sur phase.lit) : plus loin du Foyer, plus tard ; un peu de hasard pour ne pas aller en rang
const codeOf = key => [...key].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7);
export const seuilOf = (key, dist) => 0.08 + 0.3 * clamp(dist / PORTEE) + 0.08 * hash(codeOf(key), 17);

// Sa force selon le ciel, une fois allumée : moins vive au crépuscule qu'au cœur de la nuit
export const nuitOf = lit => 0.55 + 0.45 * clamp(lit / 0.7);

// La force d'une lumière, ms après sa bascule : à l'allumage, elle monte d'un coup en dépassant un peu (1,2) puis se pose
// à 1 ; à l'extinction, elle retombe en fondu
export function forceOf(on, ms) {
  if (on) {
    if (ms >= ALLUME_MS) return 1;
    const k = ms / ALLUME_MS;
    return k < 0.35 ? 1.2 * smooth(k / 0.35) : 1.2 - 0.2 * smooth((k - 0.35) / 0.65);
  }
  return ms >= ETEINT_MS ? 0 : 1 - smooth(ms / ETEINT_MS);
}

// Où en est une lumière (memo : ses états, Map clé → { on, at }) : allumée ou non selon le ciel (lit) et son seuil,
// sa force maintenant ; à chaque bascule (hors première image), une trace pour l'étincelle ou la fumée (traces)
export function allumage(memo, traces, key, x, y, seuil, lit, now, reduced = false) {
  const prev = memo.get(key);
  const on = prev ? (prev.on ? lit > seuil - MARGE : lit > seuil + MARGE) : lit > seuil;
  if (!prev || reduced) {
    memo.set(key, { on, at: -Infinity });
    return on ? 1 : 0;
  }
  if (on !== prev.on) {
    memo.set(key, { on, at: now });
    traces.push({ x, y, at: now, on });
  }
  const etat = memo.get(key);
  return forceOf(etat.on, now - etat.at);
}

// Les étincelles des lumières qui s'allument et les fumées de celles qui s'éteignent (dans le monde, après la carte
// de lumière) ; ôte celles qui ont fini
export function drawAllumages(ctx, traces, now) {
  for (let i = traces.length - 1; i >= 0; i--) if (now - traces[i].at > TRACE_MS) traces.splice(i, 1);
  if (!traces.length) return;
  ctx.save();
  for (const tr of traces) {
    const ms = now - tr.at;
    if (tr.on) etincelle(ctx, tr, ms);
    else fumee(ctx, tr, ms);
  }
  ctx.restore();
}

// Une étincelle : un éclat qui s'ouvre et se referme, et cinq grains qui s'écartent en retombant
function etincelle(ctx, tr, ms) {
  const k = ms / 450;
  if (k >= 1) return;
  ctx.globalCompositeOperation = 'lighter';
  const s = 16 * Math.sin(Math.PI * k);
  ctx.globalAlpha = 1 - k * 0.5;
  ctx.drawImage(etoile('255,236,180'), tr.x - s / 2, tr.y - s / 2, s, s);
  const grain = lueur('255,214,140');
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + hash(tr.x, i) * 0.8;
    const d = 4 + 9 * smooth(k);
    const g = 4 * (1 - k);
    ctx.globalAlpha = 0.9 * (1 - k);
    ctx.drawImage(grain, tr.x + Math.cos(a) * d - g / 2, tr.y + Math.sin(a) * d * 0.7 + 3 * k * k - g / 2, g, g);
  }
}

// Un filet de fumée : trois volutes grises et douces qui montent en s'élargissant et s'effacent
function fumee(ctx, tr, ms) {
  const k = ms / TRACE_MS;
  ctx.globalCompositeOperation = 'source-over';
  const volute = lueur('168,166,178');
  for (let i = 0; i < 3; i++) {
    const u = clamp(k * 1.3 - i * 0.15);
    if (u <= 0 || u >= 1) continue;
    const r = 5 + 9 * u;
    ctx.globalAlpha = 0.4 * Math.sin(Math.PI * u);
    ctx.drawImage(volute, tr.x + Math.sin(u * 5 + i) * 3 - r, tr.y - 4 - 20 * u - r, r * 2, r * 2);
  }
}
