// Profil du calcul de la vue de l'île (world.view) pour un compte de banc local
process.env.DATABASE_URL = 'postgres://origins:origins@localhost:5432/origins_test';
const world = require('/home/user/og-create-backend/src/services/world');
const db = require('/home/user/og-create-backend/src/config/db');
(async () => {
  const { rows } = await db.query(`SELECT id FROM users WHERE email LIKE 'perf-%' ORDER BY id DESC LIMIT 1`);
  const id = rows[0].id;
  const book = { describe: () => ({}), openChapters: new Set(['I', 'II']), stars: 10, finished: new Set(), ariane: null };
  let queries = 0;
  const orig = db.pool.query.bind(db.pool);
  const seen = new Map(); db.pool.query = async (...a) => { queries++; if (process.env.DELAY) await new Promise(r => setTimeout(r, Number(process.env.DELAY))); const k = String(a[0]).replace(/\s+/g, ' ').slice(0, 90); seen.set(k, (seen.get(k) || 0) + 1); return orig(...a); }; global.__seen = seen;
  await world.view(id, ['Eau', 'Feu', 'Terre', 'Air'], book);
  queries = 0;
  const t = process.hrtime.bigint();
  const N = 20;
  for (let i = 0; i < N; i++) await (process.env.CACHED ? db.cached(() => world.view(id, ['Eau', 'Feu', 'Terre', 'Air'], book)) : world.view(id, ['Eau', 'Feu', 'Terre', 'Air'], book));
  console.log('vue :', (Number(process.hrtime.bigint() - t) / 1e6 / N).toFixed(1), 'ms en moyenne,', queries / N, 'requêtes (pool direct)');
  [...global.__seen.entries()].sort((a, b) => b[1] - a[1]).filter(([k]) => process.env.WRITES ? !k.startsWith("SELECT") : true).slice(0, 40).forEach(([k, n]) => console.log(String(n / 21).padStart(4), k));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
