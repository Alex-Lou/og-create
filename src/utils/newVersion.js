// Une nouvelle version du jeu est en ligne : version.json (écrit au build, vite.config.mjs) ne dit plus l'empreinte de
// ce code. Relu au retour sur l'onglet et toutes les 10 minutes, sans cache (le service worker ne le garde pas) ; dit
// une seule fois. Rend de quoi arrêter la veille
const EVERY_MS = 10 * 60000;

export function watchVersion(onNew, { current = import.meta.env.VITE_APP_VERSION, fetcher = (...args) => fetch(...args), every = EVERY_MS } = {}) {
  if (!current) return () => {};
  let told = false;
  const check = async () => {
    if (told || document.hidden) return;
    try {
      const response = await fetcher(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const { version } = await response.json();
      if (version && version !== current && !told) {
        told = true;
        onNew(version);
      }
    } catch (error) {
      // Hors ligne ou serveur absent : on relira plus tard
    }
  };
  const timer = setInterval(check, every);
  document.addEventListener('visibilitychange', check);
  return () => {
    clearInterval(timer);
    document.removeEventListener('visibilitychange', check);
  };
}
