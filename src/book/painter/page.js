// Une page du Livre, quelle qu'elle soit : son papier, puis le peintre de son type.
import { paperBase } from './paper';
import { paintFound, paintReach, paintFar } from './elementPages';
import { paintIndex, paintChapter, paintToc } from './chapterPages';

// model : { type: 'toc' | 'chapter' | 'found' | 'reach' | 'far', … } ; assets : { emojiOf, onReady, inkPrice, stars, familiesOf }
// side : 'right' (page seule, ou de droite) ou 'left' (double page : la reliure à droite, le contenu décalé vers
// l'extérieur, zones comprises)
export function paintPage(model, index, ctx, w, h, assets, side = 'right') {
  const u = w / 100;
  const shift = side === 'left' ? -4 : 0;
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  paperBase(ctx, w, h, u, side, index);
  ctx.translate(shift * u, 0);
  const painters = { toc: paintToc, chapter: paintChapter, index: paintIndex, found: paintFound, reach: paintReach, far: paintFar };
  const result = painters[model.type](ctx, u, model, index, assets);
  ctx.restore();
  return shift ? { ...result, hotspots: result.hotspots.map(spot => ({ ...spot, x: spot.x + shift })) } : result;
}
