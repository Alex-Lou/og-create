// La chronologie de l'orage de l'écran de démarrage : ses keyframes dans public/splash.css (« 5. L'orage »), écrits ici
// plutôt qu'à la main (preview_splash.js les y remplace) : tout se règle sur quelques instants, et les animations restent
// en phase. Choix de l'auteur, 17 oct. : 7 s d'orage, puis le retour au calme ; trois grands coups espacés, chacun en
// trois temps ; les maîtres prêts et armés toute la pluie ; l'île assiégée et Brume en démon dans la foudre seulement.
// Le cycle dure --sp-orage (60 s) : 1 % du cycle = 0,6 s.
const P = 0.6;
// (instant du coup en s, son éclair, la force de son flash, le grand coup)
const COUPS = [[5.4, 'b', 0.45, false], [7.6, 'c', 0.7, true], [9.9, 'a', 0.5, false]];
// le présage (0 – 4 s), la pluie et la foudre (4 – 11,7 s), l'éclaircie (11,7 – 14,4 s), le calme jusqu'à 60 s
const PLUIE = 4, FIN = 11.7, CALME = 14.4;
const EO = 'animation-timing-function: cubic-bezier(.2, .7, .3, 1);'; // part vite, se pose
const EI = 'animation-timing-function: cubic-bezier(.5, 0, .7, .4);'; // part doucement, s'accélère
const EIO = 'animation-timing-function: ease-in-out;';

const n = x => x.toFixed(2).replace(/0+$/, '').replace(/\.$/, '') || '0';
const pc = t => `${n(t / P)}%`;
const kf = (t, props, tf = '') => `${pc(t)} { ${props}${tf ? ` ${tf}` : ''} }`;
const op = v => `opacity: ${n(v)};`;
const sc = v => `transform: scale(${n(v)});`;
// Un bloc @keyframes, ses étapes à la suite, en lignes de 118 caractères au plus
function bloc(nom, k) {
  const lignes = [];
  let cur = '  ';
  for (const x of k) {
    if (cur.length + x.length > 118) { lignes.push(cur.trimEnd()); cur = '  '; }
    cur += `${x} `;
  }
  lignes.push(cur.trimEnd());
  return `@keyframes ${nom} {\n${lignes.join('\n')}\n}\n`;
}
const tenue = (t, g) => t + (g ? 1.2 : 0.9);

const TEMPS = {
  // le voile d'orage : la nuit retient son souffle, puis la foudre éclate
  'splash-orage-voile': () => {
    const k = ['0% { opacity: 0; }', `${pc(PLUIE)} { opacity: .5; }`];
    for (const [t, , , g] of COUPS) {
      k.push(kf(t - 0.5, op(0.8), EI), kf(t - 0.04, op(0.93)), kf(t + 0.05, op(g ? 0.12 : 0.22), EO));
      if (g) k.push(kf(t + 1.1, op(0.2), EIO), kf(t + 1.65, op(0.8)));
      else k.push(kf(t + 1.5, op(0.8)));
    }
    k.push(kf(FIN, op(0.8), EIO), kf(FIN + 2, op(0.25)), `${pc(CALME)}, 100% { opacity: 0; }`);
    return k;
  },
  // le flash, en trois temps : la pré-lueur (le ciel s'allume dans les nuages), le coup (deux battements), la rémanence
  'splash-orage-flash': () => {
    const k = ['0% { opacity: 0; }'];
    for (const [t, , f] of COUPS) {
      k.push(kf(t - 0.45, op(0), EI), kf(t - 0.08, op(0.1)), kf(t, op(0.08)), kf(t + 0.05, op(f)), kf(t + 0.15, op(f * 0.35)),
        kf(t + 0.25, op(f * 0.8), EO), kf(t + 1.6, op(0)));
    }
    k.push('100% { opacity: 0; }');
    return k;
  },
  // Brume en démon, par à-coups : deux sursauts à demi transparents avec le coup, puis elle se tient, et s'efface
  'splash-orage-demon': () => {
    const k = ['0% { opacity: 0; }'];
    for (const [t, , , g] of COUPS) {
      const h = tenue(t, g);
      k.push(kf(t, op(0)), kf(t + 0.05, op(0.45)), kf(t + 0.12, op(0.2)), kf(t + 0.25, op(0.7)), kf(t + 0.34, op(0.45)),
        kf(t + 0.45, op(0.88), EO), kf(h, op(0.88), EIO), kf(h + 0.7, op(0)));
    }
    k.push('100% { opacity: 0; }');
    return k;
  },
  // son aura : elle naît au second sursaut, petite et vive, s'élargit, se diffuse, s'efface avec elle
  'splash-orage-aura': () => {
    const k = ['0% { opacity: 0; transform: scale(.5); }'];
    for (const [t, , , g] of COUPS) {
      const h = tenue(t, g);
      k.push(kf(t + 0.2, `${op(0)} ${sc(0.5)}`, EO), kf(t + 0.45, `${op(0.9)} ${sc(0.8)}`, EO), kf(h, `${op(0.65)} ${sc(0.98)}`, EI),
        kf(h + 0.8, `${op(0)} ${sc(1.14)}`));
    }
    k.push('100% { opacity: 0; transform: scale(.5); }');
    return k;
  },
  // le ciel : le banc de nuages, ses deux moitiés, les lueurs au loin pendant le présage, la pluie
  'splash-orage-nuages': () => ['0% { opacity: 0; }', '1.5% { opacity: 1; }', `${pc(FIN + 0.9)} { opacity: 1; }`, `${pc(CALME)}, 100% { opacity: 0; }`],
  'splash-orage-nuage': () => nuage(''),
  'splash-orage-nuage-d': () => nuage('scaleX(-1) '),
  'splash-orage-lueur': () => {
    const k = ['0% { opacity: 0; }'];
    for (const [t, v] of [[1.4, 0.55], [2.6, 0.7], [3.4, 0.45]]) k.push(kf(t, op(0)), kf(t + 0.12, op(v)), kf(t + 0.6, op(0)));
    return [...k, '100% { opacity: 0; }'];
  },
  'splash-orage-pluie': () => [`0%, ${pc(PLUIE)} { opacity: 0; }`, kf(PLUIE + 1.2, op(0.9)), kf(FIN, op(0.9)), `${pc(FIN + 1.8)}, 100% { opacity: 0; }`],
  // le sous-titre change de voix
  'splash-orage-calme': () => [`0%, ${pc(PLUIE)} { opacity: 1; }`, kf(PLUIE + 1, op(0)), kf(FIN, op(0)), `${pc(FIN + 1.5)}, 100% { opacity: 1; }`],
  'splash-orage-sous': () => [`0%, ${pc(PLUIE)} { opacity: 0; }`, kf(PLUIE + 1, op(1)), kf(FIN, op(1)), `${pc(FIN + 1.5)}, 100% { opacity: 0; }`],
  // l'onde de feu : une par coup, deux au grand
  'splash-orage-souffle': () => {
    const ondes = COUPS.flatMap(([t, , , g]) => (g ? [[t + 0.03, 0.5], [t + 0.56, 1]] : [[t + 0.03, 0.9]]));
    const k = ['0% { opacity: 0; transform: scale(.25); }'];
    for (const [s, d] of ondes) k.push(kf(s, `${op(0)} ${sc(0.25)}`, EO), kf(s + 0.05, `${op(0.9)} ${sc(0.38)}`, EO), kf(s + d, `${op(0)} ${sc(1.5)}`));
    k.push('100% { opacity: 0; transform: scale(.25); }');
    return k;
  },
  'splash-orage-eclair-a': () => eclair('a'),
  'splash-orage-eclair-b': () => eclair('b'),
  'splash-orage-eclair-c': () => eclair('c'),
  // l'île assiégée : seulement dans la foudre, et dans sa rémanence
  'splash-orage-ile': () => {
    const k = ['0% { opacity: 0; }'];
    for (const [t, , , g] of COUPS) k.push(kf(t + 0.03, op(0)), kf(t + 0.06, op(1)), kf(t + (g ? 1 : 0.4), op(1), EIO), kf(t + (g ? 1.9 : 1.7), op(0)));
    k.push('100% { opacity: 0; }');
    return k;
  },
  // les maîtres, prêts et armés : ils le deviennent quand la pluie arrive, et le restent jusqu'à l'éclaircie
  'splash-orage-guerriers': () => [`0%, ${pc(PLUIE)} { opacity: 0; ${EIO} }`, kf(PLUIE + 1.1, op(1)), kf(FIN, op(1), EIO), `${pc(FIN + 1.9)}, 100% { opacity: 0; }`]
};
function nuage(d) {
  const tr = x => `transform: ${d}translateX(${x});`;
  return [`0% { ${tr('-80%')} }`, `${pc(PLUIE)} { ${tr('-16%')} }`, `${pc(FIN)} { ${tr('-16%')} }`, `${pc(CALME)}, 100% { ${tr('-80%')} }`];
}
// un éclair : il s'allume avec son coup, en deux battements
function eclair(nom) {
  const k = ['0% { opacity: 0; }'];
  for (const [t, e, , g] of COUPS) {
    if (e === nom) k.push(kf(t, op(0)), kf(t + 0.03, op(1)), kf(t + 0.15, op(0.3)), kf(t + 0.25, op(0.95)), kf(t + (g ? 0.9 : 0.7), op(0)));
  }
  k.push('100% { opacity: 0; }');
  return k;
}

// La feuille de style, ses keyframes d'orage remplacés (chacun doit y être déjà : fail fast sinon)
function chronologieOrage(css) {
  for (const [nom, k] of Object.entries(TEMPS)) {
    const a = css.indexOf(`@keyframes ${nom} {`);
    if (a < 0) throw new Error(`splash.css : @keyframes ${nom} introuvable`);
    const ligne = css.slice(a, css.indexOf('\n', a));
    const b = (ligne.match(/\{/g) || []).length === 1 ? css.indexOf('\n}\n', a) + 3 : css.indexOf('\n', a) + 1;
    css = css.slice(0, a) + bloc(nom, k()) + css.slice(b);
  }
  return css;
}

module.exports = { chronologieOrage, COUPS };
