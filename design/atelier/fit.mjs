// Cadre qui contient vraiment le dessin : on rend chaque image dans un cadre agrandi, on mesure les pixels opaques, et
// on élargit le cadre d'origine juste ce qu'il faut (l'ancre ne bouge pas). Une seule fenêtre de navigateur pour tout.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');

let browser, page;
async function ready() {
  if (page) return page;
  browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');
  return page;
}
export async function closeFit() { if (browser) await browser.close(); browser = page = null; }

// frame : [x, y, w, h] ; bodies : contenus SVG (sans la balise <svg>) ; renvoie le cadre élargi, arrondi au demi-pixel
export async function fitFrame(frame, bodies) {
  const p = await ready();
  const ext = await p.evaluate(async ([frame, bodies]) => {
    const [x, y, w, h] = frame, m = Math.max(w, h) * 0.6, S = 3;
    const W = Math.ceil((w + 2 * m) * S), H = Math.ceil((h + 2 * m) * S);
    const c = document.getElementById('c'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const body of bodies) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${x - m} ${y - m} ${w + 2 * m} ${h + 2 * m}">${body}</svg>`;
      const img = new Image();
      await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
      g.clearRect(0, 0, W, H); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, W, H).data;
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (d[(j * W + i) * 4 + 3] > 24) {
        if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j;
      }
    }
    if (x0 === Infinity) return null;
    const u = (v, o) => v / S - m + o;
    return [u(x0, x), u(y0, y), u(x1 + 1, x), u(y1 + 1, y)];
  }, [frame, bodies]);
  if (!ext) return frame;
  const [fx, fy, fw, fh] = frame;
  const nx = Math.min(fx, Math.floor((ext[0] - 0.5) * 2) / 2), ny = Math.min(fy, Math.floor((ext[1] - 0.5) * 2) / 2);
  const nx1 = Math.max(fx + fw, Math.ceil((ext[2] + 0.5) * 2) / 2), ny1 = Math.max(fy + fh, Math.ceil((ext[3] + 0.5) * 2) / 2);
  return [nx, ny, +(nx1 - nx).toFixed(2), +(ny1 - ny).toFixed(2)];
}
