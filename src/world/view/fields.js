// Les champs non réactifs de la vue de l'île (WorldView.vue : created) : géométrie, caméra, pointeurs, horloge, sol,
// décor, vie, ce qu'on peut toucher dans la dernière image. Ils ne passent pas par la réactivité de Vue : le dessin
// les lit à chaque image.

import { forcedPhase } from '@/world/scene';
import { perfWanted, perfMeter } from '@/world/perf';
import { orchestra } from '@/world/fetes';

export function viewFields() {
  return {
    // Non réactifs : géométrie, caméra, pointeurs, horloge, animations de pose
    geo: null,
    cam: null,
    pointers: new Map(),
    gesture: null,
    raf: 0,
    lastFrame: 0,
    pops: new Map(),
    // Bâtiments en train de s'élever : id → { at, from } ; décor naturel des cases libres
    raises: new Map(),
    props: [],
    // Quartiers qui viennent d'être achetés (brume qui se dissipe), bulles de production et panneaux dessinés (pour le toucher)
    unveils: new Map(),
    bubbles: [],
    // Bulles de besoin au-dessus des habitants (pour le toucher)
    needBubbles: [],
    // Bulles et « ! » vus à l'écran (clé → première apparition, pour leur rebond) ; décalage des noms des lieux qui
    // s'écartent d'un habitant (id → { dy, at, keep })
    bubbleSeen: new Map(),
    // Les fêtes de l'île (world/fetes.js : l'orchestre, { playing, waiting }) ; quand un toucher a apaisé un Grand
    // moment (son projecteur s'efface)
    fetes: orchestra(),
    feteCalm: null,
    // Les petits gestes en cours (Pétille, Éclat : world/fetes.js, addSmall)
    sparks: [],
    // Le liseré doré de l'image en cours ({ side, alpha } à l'heure dorée, sinon null : lumiere/heureDoree.js)
    rim: null,
    // L'averse (lumiere/averse.js) : la qualité de la pluie selon l'appareil, le mouillé du sol ({ minute, value }), les
    // flaques et les ronds de l'île ({ fresh, puddles, spots })
    rainQ: 1,
    wet: null,
    rainSpots: null,
    labelShifts: new Map(),
    // Ce que le HUD couvre à l'écran (draw/sites.js : hudObstacles), et quand il a été mesuré
    hudRects: null,
    hudRectsAt: 0,
    // Bateau du visiteur : case de mer où il s'amarre, arrivée en cours ({ id, at })
    visitorDock: null,
    boatArrival: null,
    signs: [],
    shore: [],
    // Sol en relief : calques lus (M), carrés d'images (terrain), eau animée (live), cases de chaque quartier
    M: null,
    terrain: null,
    live: null,
    zoneTiles: new Map(),
    // Clé de la carte d'où viennent M, live, zoneTiles, shore… (apply ne les refait que si elle change)
    geoKey: null,
    mistKey: null,
    // Les cases du cœur encore sous la brume (world/reveal.js), pour la vue en cours
    veiled: null,
    // Climat(s) visé(s) par la caméra et leur poids (fondu d'un climat à l'autre), instant du dernier dessin
    climateMix: {},
    climateT: 0,
    // Mer vivante : eaux de l'île (sea), mouettes posées (perches), passages en cours des dauphins et de la baleine,
    // animaux qui ont réagi à un toucher (clé → { at, … }), et ce qu'on peut toucher dans la dernière image
    sea: null,
    perches: [],
    // Plage où la bouteille à la mer s'est échouée (case), si elle attend
    bottleSpot: null,
    // La première bouteille, pas encore ouverte : un « ! » la marque (WorldView chests.js : bottleAshore)
    bottleFirst: false,
    // L'averse de la Pluie écrite : son début (performance.now()), ou 0 (WorldView sky.js : showerK)
    shower: 0,
    passages: {},
    scared: new Map(),
    seaHits: [],
    // Brume dans la dernière image (pour le toucher) ; appui long en cours sur l'île ; barque du passeur
    brumeHit: null,
    // Le moment où Brume a fêté sa dernière quête réclamée (draw/brume.js : sa joie)
    brumeJoy: 0,
    ferry: null,
    holdTimer: 0,
    moreRaf: 0,
    // Heure ou temps imposés (essais), journée jouée en accéléré, ciel de la dernière image
    forced: forcedPhase(),
    // Compteur d'images (« ?perf » dans l'adresse) : mesure du temps de dessin, pour les essais sur téléphone
    perf: perfWanted() ? perfMeter() : null,
    warp: null,
    phase: null,
    clockAt: 0,
    // Ce qu'on peut toucher dans la dernière image : bêtes sur l'île, articles posés, enseignes ; ronds dans l'eau ;
    // bulle d'info
    landHits: [],
    itemHits: [],
    nameSignHits: [],
    // Variante de chaque annexe posée (« x,y » → n° d'exemplaire : ce qui pousse dans un champ…)
    annexVariants: new Map(),
    // Vie ambiante (village.js) et lanternes des habitants dans la dernière image
    village: null,
    villageLights: [],
    ripples: [],
    tipTimer: 0,
    // Chose choisie par un premier toucher : { key, run, ring } (voir pick)
    picked: null,
    ac: null,
    observer: null,
    loadedAt: Date.now(),
    // Dans combien de temps l'île change d'elle-même depuis loadedAt (world/due.js) ; rechargement en cours
    dueIn: null,
    reloading: false,
    tick: 0,
    // L'île peut quitter l'écran pendant un chargement (changement d'onglet) : la réponse est alors ignorée
    gone: false
  };
}
