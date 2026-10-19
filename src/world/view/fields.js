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
    // L'élan de la caméra au lâcher, et ce que le doigt a tiré au-delà du bord de l'île (unités du monde : view/elan.js)
    elanRaf: 0,
    debordRaw: { x: 0, y: 0 },
    gesture: null,
    raf: 0,
    lastFrame: 0,
    pops: new Map(),
    // Les portes qui battent (« x,y » → { a : ouverture de 0 à 1, v : sa vitesse, side : de quel côté }) et l'instant de
    // la dernière image qui les a fait bouger (WorldView, walls.js : swingDoors)
    doorSwing: new Map(),
    doorClock: null,
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
    // Le liseré vivant des personnages de l'image en cours (lumiere/lisere.js ; draw/loop.js) : null hors du dessin
    liseres: null,
    // La qualité des particules selon l'appareil (perf.js : qualiteSuivante ; draw/loop.js : drawTimed). L'averse
    // (lumiere/averse.js) : le mouillé du sol ({ minute, value }), les flaques et les ronds de l'île ({ fresh, puddles,
    // spots })
    fxQ: 1,
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
    // L'averse de la Pluie écrite : son début (performance.now()), ou 0 ; quand ses répliques ont été lues (s depuis son
    // début), ou null (WorldView sky.js : showerNow)
    shower: 0,
    showerLeave: null,
    // L'arc-en-ciel (world/lumiere/arcEnCiel.js) : la fin de l'averse écrite qu'il suit, et sa naissance à l'écran
    // (performance.now()), ou 0
    arcAfter: 0,
    arcBorn: 0,
    // Les étoiles filantes (world/lumiere/filantes.js) : les têtes de celle qui file et de son reflet (à l'écran, pour
    // le toucher), celle qu'on a touchée (son cycle), ses paillettes
    filanteHit: null,
    filanteCaught: null,
    paillettes: null,
    // Les lumières du soir (world/lumiere/allumage.js) : l'état de chacune, et les étincelles et fumées en cours
    allumes: new Map(),
    allumages: [],
    // La partie réveillée de l'île que l'arc enjambe, et ce dont elle dépend (WorldView terrain.js : awakeBox)
    awake: null,
    passages: {},
    scared: new Map(),
    seaHits: [],
    // Brume dans la dernière image (pour le toucher) ; appui long en cours sur l'île ; barque du passeur
    brumeHit: null,
    // Le vol du Phénix en cours (draw/brume.js : phenixOf), et où le toucher
    phenix: null,
    // Les sources de la carte de lumière de la dernière image (le Voile recule devant elles : world/voile.js)
    lightSpots: null,
    // La crête des plus hauts sommets, qui porte l'aurore ({ M, crete } : draw/loop.js, creteAurore)
    aurore: null,
    // La place du phare des Anciens sur son îlot (draw/sites.js : phareSpot), refaite quand les îlots changent
    phareAt: null,
    // La part de nuit du vol du conseil ({ k, at } : lumiere/nuitDuConseil.js)
    nuitVol: null,
    // Les fanaux de la Route des feux, relus quand l'état change (draw/feux.js : feuxShown)
    feux: null,
    // Ceux qu'on voit à cette image, et leurs flammes (draw/feux.js : feuxSeen, flammeDe) : une fois par image
    feuxVus: null,
    flammes: null,
    // Le Kraken (draw/life.js) : il passe à cette image (le Géant s'écarte), la nuit tirée pour le cycle de l'horloge, et
    // l'heure d'un passage imposé (essais : ?kraken)
    krakenOn: false,
    krakenNear: false,
    krakenNight: null,
    krakenForced: 0,
    // Le tremblement de l'écran quand il surgit (0 à 1, de l'image d'avant)
    krakenShake: 0,
    phenixHit: null,
    // Le moment où Brume a fêté sa dernière quête réclamée (draw/brume.js : sa joie)
    brumeJoy: 0,
    // Brume : l'instant de la quête nouvelle (s, le temps des images : son sursaut), et sa place à la dernière image (elle
    // y glisse vers la nouvelle) { at, t }
    brumeQuestAt: 0,
    brumeGlide: null,
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
