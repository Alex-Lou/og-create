<template>
  <section :class="['world', { 'world--immersive': immersive }]" aria-label="Le Monde">
    <!-- Invité : l'île demande un compte (ses ressources et écus sont gardés par le serveur) -->
    <div v-if="guest" class="world__guest">
      <p class="world__guest-title">Ton île t’attend.</p>
      <p class="world__guest-text">Crée un compte pour bâtir ton île : chantiers, récoltes et créations y sont gardés pour toi.</p>
      <button type="button" class="world__btn" @click="$emit('login')">Se connecter · créer un compte</button>
    </div>

    <template v-else>
      <!-- L'île de bord à bord : en haut, une barre qui flotte par-dessus (horloge, écus, réserves, Récolte) ;
           masquée en plein écran -->
      <div ref="top" class="world__top">
        <header class="world__head">
          <div class="world__head-left">
            <h2 class="oc-sr-only">Le Monde</h2>
            <IslandClock v-if="state && skyClock" v-bind="skyClock" :warping="warping" @warp="toggleWarp" />
            <span class="world__purse" :aria-label="`${coins} écus`"><span class="world__coin" aria-hidden="true"></span>{{ coinsText }}</span>
          </div>
          <!-- « Tout ramasser » : ce que tous les bâtiments ont produit (écus et ressources), d'un toucher ; le solde reste
               dans l'en-tête. (« Récolte » ne désigne que les mini-jeux, joués un par un.) -->
          <button
            v-if="harvestable.length"
            type="button"
            class="world__coins is-ready"
            :disabled="busy"
            :aria-label="`Tout ramasser : ${harvestable.map(g => `${g.n} ${g.label}`).join(', ')}`"
            @click="collect"
          >
            <span class="world__coins-icon" aria-hidden="true"><ElementGlyph glyph="ui:basket" /></span>
            <span class="world__coins-text" aria-hidden="true">
              <span class="world__coins-label">Tout ramasser</span>
              <span class="world__coins-gains">
                <span v-for="g in harvestable" :key="g.id">+{{ g.n }}<ElementGlyph :glyph="g.glyph" /></span>
              </span>
            </span>
          </button>
        </header>
        <!-- Réserves de l'île et Récolte -->
        <div v-if="state" class="world__hud">
          <ul class="world__stock" aria-label="Réserves">
            <li v-for="r in RESOURCES" :key="r.id" class="world__res" :title="r.label">
              <span aria-hidden="true"><ElementGlyph :glyph="r.glyph" /></span><strong>{{ state.stock[r.id] }}</strong><span class="oc-sr-only">{{ r.label }}</span>
            </li>
          </ul>
          <button type="button" class="world__play" :disabled="busy || !state.charges.count" @click="startHarvest">
            <span class="world__play-label">Récolte</span>
            <span class="world__play-sub">{{ chargesText }}</span>
          </button>
        </div>
      </div>
      <div ref="stage" class="world__stage">
        <!-- Les gestes passent par les pointeurs ; touchend annulé : pas de clic fantôme après un toucher au doigt (il
             tomberait sur le fond de la fiche qui vient de s'ouvrir et la refermerait aussitôt) -->
        <canvas
          ref="canvas"
          class="world__canvas"
          role="img"
          :aria-label="canvasLabel"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onCancel"
          @touchend.prevent
          @wheel.prevent="onWheel"
        ></canvas>
        <!-- Compteur d'images (« ?perf ») -->
        <p v-if="perfText" class="world__perf" aria-hidden="true">{{ perfText }}</p>
        <!-- Coffres : celui du jour et ceux qui attendent (pastille) -->
        <button
          v-if="state && state.chests"
          type="button"
          :class="['world__chest-btn', { 'is-ready': chestCount }]"
          :aria-label="chestCount ? `Coffres : ${chestCount} à ouvrir` : 'Coffres'"
          @click="chestsOpen = true"
        >
          <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
            <path d="M5,15 v-3 a11,5 0 0 1 22,0 v3 z" fill="#B57A44" stroke="#5A3A1E" stroke-width="1.4" />
            <rect x="5" y="15" width="22" height="11" rx="2" fill="#9A6A3E" stroke="#5A3A1E" stroke-width="1.4" />
            <rect x="5" y="17.5" width="22" height="2" fill="#E2B546" />
            <rect x="13.5" y="14" width="5" height="6" rx="1.2" fill="#F4D67A" stroke="#5A3A1E" stroke-width="1" />
          </svg>
          <span v-if="chestCount" class="world__chest-badge" aria-hidden="true">{{ chestCount }}</span>
        </button>
        <!-- Carnet d'explorateur : les lieux remarquables (pastille : ceux qui attendent d'être découverts) -->
        <button
          v-if="state && shownLandmarks.length"
          type="button"
          :class="['world__log-btn', { 'is-ready': waitingLandmarks }]"
          :aria-label="waitingLandmarks ? `Carnet d’explorateur : ${waitingLandmarks} lieu${waitingLandmarks > 1 ? 'x' : ''} à découvrir` : 'Carnet d’explorateur'"
          @click="openLog()"
        >
          <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
            <rect x="7" y="5" width="19" height="23" rx="2.5" fill="#7A4E2C" stroke="#3E2615" stroke-width="1.3" />
            <rect x="9.5" y="7" width="15" height="19" rx="1.5" fill="#F6EEDD" />
            <path d="M17,10 L19,16 L17,22 L15,16 Z" fill="#C9473A" />
            <circle cx="17" cy="16" r="5" fill="none" stroke="#5A3A1E" stroke-width="1" />
            <rect x="5" y="9" width="4" height="2" rx="1" fill="#E2B546" /><rect x="5" y="20" width="4" height="2" rx="1" fill="#E2B546" />
          </svg>
          <span v-if="waitingLandmarks" class="world__chest-badge" aria-hidden="true">{{ waitingLandmarks }}</span>
        </button>
        <!-- Trouvailles de climat : la réserve à part (pastille : gisements prêts dans les quartiers à soi) -->
        <button
          v-if="state && (shownDeposits.length || ownedFinds)"
          type="button"
          :class="['world__finds-btn', { 'is-ready': readyDeposits }]"
          :aria-label="readyDeposits ? `Trouvailles : ${readyDeposits} gisement${readyDeposits > 1 ? 's' : ''} prêt${readyDeposits > 1 ? 's' : ''}` : 'Trouvailles'"
          @click="findsOpen = true"
        >
          <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
            <path d="M10,11 Q16,7 22,11 L25,24 Q16,30 7,24 Z" fill="#B57A44" stroke="#5A3A1E" stroke-width="1.4" stroke-linejoin="round" />
            <path d="M10,11 Q16,14 22,11" fill="none" stroke="#5A3A1E" stroke-width="1.2" />
            <path d="M12,10 Q16,4 20,10" fill="none" stroke="#E2B546" stroke-width="1.6" />
            <path d="M13,18 l3,-3 l3,3 l-3,4 Z" fill="#BFE7F7" stroke="#2E6A9E" stroke-width="0.8" />
          </svg>
          <span v-if="readyDeposits" class="world__chest-badge" aria-hidden="true">{{ readyDeposits }}</span>
        </button>
        <!-- Expédition en route : une boussole et le temps avant son retour -->
        <button v-if="state && state.expedition" type="button" class="world__trip-btn" :aria-label="`Expédition en route : retour dans ${tripLeft}`" @click="showExpedition">
          <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
            <circle cx="16" cy="16" r="12" fill="#F6EEDD" stroke="#5A3A1E" stroke-width="1.6" />
            <path d="M16,6 L19,16 L16,26 L13,16 Z" fill="#C9473A" stroke="#5A3A1E" stroke-width="0.8" />
            <path d="M16,16 L19,16 L16,26 L13,16 Z" fill="#E9DCC4" />
            <circle cx="16" cy="16" r="1.6" fill="#5A3A1E" />
          </svg>
          <span class="world__trip-left">{{ tripLeft }}</span>
        </button>
        <div v-if="state" class="world__zoom">
          <button type="button" aria-label="Zoomer" @click="zoomBy(1.25)">+</button>
          <button type="button" aria-label="Dézoomer" @click="zoomBy(0.8)">−</button>
          <!-- Plein écran : l'île seule, sans barres (et l'écran entier quand l'appareil le permet) -->
          <button type="button" :aria-label="immersive ? 'Quitter le plein écran' : 'Plein écran'" :aria-pressed="immersive" @click="toggleImmersive">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path v-if="immersive" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
              <path v-else d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>
        </div>
        <p v-if="loadError" class="world__error" role="alert">
          L’île ne répond pas.
          <button type="button" class="world__btn world__btn--small" @click="load">Réessayer</button>
        </p>
        <p v-else-if="craftPlacing && placingCraft" class="world__banner" role="status">
          {{ craftBanner }}
          <button type="button" class="world__link" @click="cancelCraft">Annuler</button>
        </p>
        <p v-else-if="annexPlacing && placingAnnex" class="world__banner" role="status">
          {{ annexBanner }}
          <button type="button" class="world__link" @click="cancelAnnex">Annuler</button>
        </p>

        <!-- Appui long ailleurs : une bulle dit ce que c'est et ce que fait un toucher -->
        <transition name="world-tip">
          <div v-if="tip" :class="['world__tip', { 'is-below': tip.below }]" role="status" :style="{ left: `${tip.x}px`, top: `${tip.y}px` }">
            <strong class="world__tip-title">{{ tip.title }}</strong>
            <span v-if="tip.text" class="world__tip-text">{{ tip.text }}</span>
            <span v-if="tip.hint" class="world__tip-hint">{{ tip.hint }}</span>
            <button v-if="tip.action" type="button" class="world__tip-btn" @click="runPick">{{ tip.action }}</button>
          </div>
        </transition>

        <!-- Appui long sur une création d'île : la déplacer ou la ranger dans la réserve de l'établi -->
        <div v-if="craftMenu && !craftPlacing" class="world__menu" :style="menuStyle" role="dialog" :aria-label="craftName(craftMenu.craft)">
          <span class="world__menu-name">{{ craftName(craftMenu.craft) }}</span>
          <button type="button" class="world__menu-btn" @click="moveFromMenu">Déplacer</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" :disabled="busy" @click="storeFromMenu">Ranger</button>
        </div>

        <!-- Pose d'une création : la case dorée choisie ; poser ici ou choisir une autre case -->
        <div v-if="craftConfirm && placingCraft" class="world__menu" :style="craftConfirmStyle" role="dialog" :aria-label="`Poser ${placingCraft.name}`">
          <span class="world__menu-name">{{ placingCraft.name }}</span>
          <button type="button" class="world__menu-btn" :disabled="busy" @click="confirmCraft">Poser ici</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" @click="craftConfirm = null">Autre case</button>
        </div>

        <!-- Pose d'une annexe : la case dorée choisie, son prix ; poser ici ou choisir une autre case -->
        <div v-if="annexConfirm && placingAnnex && placingAnnex.next" class="world__menu" :style="annexConfirmStyle" role="dialog" :aria-label="`Poser ${placingAnnex.name}`">
          <span class="world__menu-name">{{ placingAnnex.name }} · {{ placingAnnex.next.coins }}<span class="world__coin world__coin--small" aria-hidden="true"></span></span>
          <button type="button" class="world__menu-btn" :disabled="busy" @click="confirmAnnex">Poser ici</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" @click="annexConfirm = null">Autre case</button>
        </div>
      </div>

      <p v-if="state" class="world__note">
        Tes bâtiments produisent ressources et écus, la Récolte aussi. À l’établi du Foyer, assemble des créations pour embellir l’île.
      </p>
    </template>

    <!-- Fiches de l'île : rendues dans le document (au-dessus de la barre d'onglets) -->
    <teleport to="body">
      <!-- Fiche d'un bâtiment : aperçu (production, récolte) et évolution (tous les paliers) -->
      <transition name="world-sheet">
        <div v-if="site" class="world__sheet-backdrop" @click.self="site = null">
          <div class="world__sheet world__sheet--site" role="dialog" :aria-label="site.name">
            <div class="world__site-head">
              <img class="world__site-art" :src="artOf(site)" alt="" />
              <div class="world__site-id">
                <!-- Le quartier se renomme dès qu'il est à soi, le bâtiment dès son palier III -->
                <span class="world__eyebrow world__named">{{ zoneName(site.zone) }}<button type="button" class="world__pen world__pen--small" :aria-label="`Renommer le quartier ${zoneName(site.zone)}`" @click="startRename('zone', site.zone)"><svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true"><path d="M3,14.6 L3,17 L5.4,17 L14.6,7.8 L12.2,5.4 Z M15.6,6.8 L17,5.4 C17.4,5 17.4,4.4 17,4 L16,3 C15.6,2.6 15,2.6 14.6,3 L13.2,4.4 Z" fill="currentColor"/></svg></button></span>
                <span class="world__sheet-title world__named">{{ site.level ? site.name : `${site.name} · à bâtir` }}<button
                  v-if="site.level"
                  type="button"
                  :class="['world__pen', { 'is-locked': site.level < site.renameLevel }]"
                  :aria-label="site.level < site.renameLevel ? `Renommer : au palier ${roman(site.renameLevel)}` : `Renommer ${site.name}`"
                  @click="startRename('site', site.id)"
                ><svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true"><path d="M3,14.6 L3,17 L5.4,17 L14.6,7.8 L12.2,5.4 Z M15.6,6.8 L17,5.4 C17.4,5 17.4,4.4 17,4 L16,3 C15.6,2.6 15,2.6 14.6,3 L13.2,4.4 Z" fill="currentColor"/></svg></button></span>
                <span class="world__pips" :aria-label="`Niveau ${site.level} sur ${site.maxLevel}`">
                  <span v-for="k in site.maxLevel" :key="k" :class="['world__pip', { 'is-on': k <= site.level }]"></span>
                </span>
              </div>
              <button type="button" class="world__link" @click="site = null">Fermer</button>
            </div>
            <div class="world__tabs" role="tablist">
              <button type="button" role="tab" :aria-selected="String(siteTab === 'overview')" :class="['world__tab', { 'is-on': siteTab === 'overview' }]" @click="siteTab = 'overview'">Aperçu</button>
              <button type="button" role="tab" :aria-selected="String(siteTab === 'evolution')" :class="['world__tab', { 'is-on': siteTab === 'evolution' }]" @click="siteTab = 'evolution'">
                Évolution<span v-if="canBuild(site)" class="world__tab-dot" aria-label="prête"></span>
              </button>
              <button v-if="site.shop && site.shop.length" type="button" role="tab" :aria-selected="String(siteTab === 'shop')" :class="['world__tab', { 'is-on': siteTab === 'shop' }]" @click="siteTab = 'shop'">Boutique</button>
              <button v-if="site.annexes && site.annexes.length" type="button" role="tab" :aria-selected="String(siteTab === 'annexes')" :class="['world__tab', { 'is-on': siteTab === 'annexes' }]" @click="siteTab = 'annexes'">
                Annexes<span v-if="annexReady(site, stockAll, coins)" class="world__tab-dot" aria-label="à poser"></span>
              </button>
            </div>

            <div v-if="siteTab === 'overview'" class="world__panel">
              <p v-if="site.effect" class="world__site-effect">{{ site.effect }}</p>
              <p v-else class="world__site-effect">{{ site.levels[0].effect }}</p>
              <div v-if="site.produce && site.level" class="world__prod">
                <div class="world__prod-row">
                  <span>Par heure</span>
                  <strong>+{{ num(perHourOf(site).amount) }} <ElementGlyph :glyph="GLYPH[site.produce]" /> · +{{ num(perHourOf(site).coins) }} écus</strong>
                </div>
                <div v-if="site.bonus" class="world__prod-row">
                  <span>Bonus de la boutique</span>
                  <strong>+{{ site.bonus }} % de production</strong>
                </div>
                <div v-if="site.moodBonus && friendAt(site.id)" :class="['world__prod-row', site.moodBonus > 0 ? 'is-happy' : 'is-sad']">
                  <span>Humeur de {{ friendAt(site.id).name }}</span>
                  <strong>{{ site.moodBonus > 0 ? '+' : '−' }}{{ Math.abs(site.moodBonus) }} % de production</strong>
                </div>
                <div v-if="site.landmarkBonus" class="world__prod-row">
                  <span>Lieux remarquables</span>
                  <strong>+{{ site.landmarkBonus }} % de production</strong>
                </div>
                <div v-if="annexYield(site).count" class="world__prod-row">
                  <span>Annexes · {{ annexYield(site).count }}</span>
                  <strong v-if="annexYield(site).rate">+{{ annexYield(site).rate }} <ElementGlyph :glyph="GLYPH[site.produce]" /> · +{{ annexYield(site).earn }} écus par heure</strong>
                  <strong v-else>Réserve agrandie</strong>
                </div>
                <div class="world__prod-row">
                  <span>Réserve</span>
                  <strong>{{ site.capHours || state.capHours }} h de production au plus</strong>
                </div>
                <div class="world__prod-row is-pending">
                  <span>À ramasser</span>
                  <strong>+{{ site.pending ? site.pending[site.produce] : 0 }} <ElementGlyph :glyph="GLYPH[site.produce]" /> · +{{ site.pending ? site.pending.coins : 0 }} écus</strong>
                </div>
                <button type="button" class="world__btn" :disabled="busy || !state.pending" @click="collect">Ramasser la production</button>
              </div>
              <!-- Foyer : les habitants de l'île, leurs cœurs, leur humeur ; le besoin qui manque, sinon un point quand l'un
                   attend une visite aujourd'hui ; « Tout combler » donne ce qu'il faut à tous, tant que le stock suffit -->
              <section v-if="site.id === 'foyer' && state.villagers && state.villagers.length" class="world__friends" aria-label="Habitants">
                <h3 class="world__friends-title">Habitants</h3>
                <ul class="world__friends-list">
                  <li v-for="v in state.villagers" :key="v.id">
                    <button type="button" class="world__friend" :aria-label="friendLabel(v)" @click="openVillager(v.id)">
                      <span class="world__friend-face">
                        <img :src="portraitOf(v.id)" alt="" />
                        <span v-if="v.mood" class="world__friend-mood" aria-hidden="true"><ElementGlyph :glyph="MOOD_GLYPH[v.mood]" /></span>
                      </span>
                      <span class="world__friend-name">{{ v.name }}</span>
                      <span class="world__friend-hearts" aria-hidden="true">{{ '♥'.repeat(v.hearts) }}<span>{{ '♥'.repeat(5 - v.hearts) }}</span></span>
                      <span v-if="missingOf(v).length" class="world__friend-need" aria-hidden="true"><ElementGlyph :glyph="NEED_GLYPH[missingOf(v)[0].id]" /></span>
                      <span v-else-if="awaits(v)" class="world__friend-dot" aria-hidden="true"></span>
                    </button>
                  </li>
                  <li v-if="state.visitor">
                    <button type="button" class="world__friend is-guest" :aria-label="`${state.visitor.name}, ${state.visitor.role}, de passage`" @click="openVisitor">
                      <span class="world__friend-face"><img :src="visitorPortrait(state.visitor)" alt="" /></span>
                      <span class="world__friend-name">{{ state.visitor.name }}</span>
                      <span class="world__friend-guest">de passage</span>
                      <span v-if="!state.visitor.satisfied" class="world__friend-need is-quest" aria-hidden="true"><ElementGlyph glyph="ui:spark" /></span>
                    </button>
                  </li>
                </ul>
                <button v-if="fillAll.count" type="button" class="world__btn world__fill-all" :disabled="busy" @click="fillAllNeeds">
                  Tout combler
                  <span v-for="(n, r) in fillAll.cost" :key="r" class="world__fill-cost"><ElementGlyph :glyph="GLYPH[r]" />{{ n }}</span>
                </button>
              </section>
              <!-- Foyer : l'établi des créations d'île -->
              <div v-if="site.id === 'foyer' && state.crafts" class="world__game">
                <span class="world__game-art" aria-hidden="true"><img :src="benchArt" alt="" /></span>
                <span class="world__game-body">
                  <span class="world__game-kind">Établi</span>
                  <span class="world__game-name">Créations d’île</span>
                  <span class="world__game-text">{{ benchText }}</span>
                </span>
                <button type="button" class="world__game-btn" aria-label="Ouvrir l’établi" :disabled="busy" @click="openBench">Ouvrir</button>
              </div>
              <!-- Mini-jeu du bâtiment (Ponton, Carrière, Bosquet), ouvert au palier III -->
              <div v-if="gameOf(site)" :class="['world__game', { 'is-locked': !gameOf(site).open }]">
                <span class="world__game-art" aria-hidden="true"><GameIcon :kind="GAME_ICONS[gameOf(site).id]" :size="40" /></span>
                <span class="world__game-body">
                  <span class="world__game-kind">Mini-jeu</span>
                  <span class="world__game-name">{{ gameOf(site).name }}</span>
                  <span class="world__game-text">{{ gameOf(site).open ? `${gameOf(site).plays} / ${gameOf(site).max} parties · jusqu’à ${gameOf(site).cap} écus` : `S’ouvre au palier ${roman(gameOf(site).level)}` }}</span>
                </span>
                <button type="button" class="world__game-btn" :disabled="busy || !gameOf(site).open" @click="openGame(gameOf(site).id)">{{ gameOf(site).open ? 'Jouer' : `Palier ${roman(gameOf(site).level)}` }}</button>
              </div>
              <div v-else-if="!site.level" class="world__sheet-actions">
                <button type="button" class="world__btn" @click="siteTab = 'evolution'">Voir ce qu’il faut pour bâtir</button>
              </div>
            </div>

            <!-- Boutique : outils et objets (effets), pièces rares, skins et teintes (apparence), rangés par palier ; un toucher
                 sur le prix achète (annulable 4 s), un toucher sur le dessin ou un appui long sur le prix ouvre la fiche -->
            <div v-else-if="siteTab === 'shop'" class="world__panel">
              <p v-if="!site.level" class="world__site-effect">Bâtis d’abord ce bâtiment pour ouvrir sa boutique.</p>
              <p v-else-if="site.produce" class="world__shop-note">
                Bonus de production : <strong>+{{ site.bonus || 0 }} %</strong> <span>(jusqu’à +100 %)</span>
              </p>
              <NameSignPanel
                v-if="site.level && state.signs"
                ref="nameSign"
                :site="site"
                :signs="state.signs"
                :coins="coins"
                :busy="busy"
                @choose="look => chooseSign(site, look)"
                @rename="renameSigns"
              />
              <section v-for="group in shopGroups(site)" :key="group.kind" class="world__shop-group" :aria-label="group.label">
                <h3 class="world__shop-title">{{ group.label }}</h3>
                <ul class="world__cards">
                  <li
                    v-for="item in group.items"
                    :key="item.id"
                    :class="['world__card', { 'is-owned': item.owned, 'is-worn': site.skin === item.id, 'is-locked': !item.owned && site.level < item.minLevel, 'is-rare': item.rare }]"
                  >
                    <button type="button" class="world__card-open" :aria-label="`Fiche : ${item.name}`" @click="describeItem(site, item)">
                      <span class="world__card-art">
                        <img :src="itemArt(site, item)" alt="" />
                        <span v-if="item.rare" class="world__card-palier world__card-palier--rare">Rare</span>
                        <span v-else class="world__card-palier" :aria-label="`Palier ${roman(item.minLevel)}`">{{ roman(item.minLevel) }}</span>
                        <span v-if="site.skin === item.id" class="world__card-badge">Porté</span>
                        <span v-else-if="item.owned && item.kind !== 'skin'" class="world__card-badge">✓</span>
                      </span>
                      <span class="world__card-name">{{ item.name }}</span>
                    </button>
                    <span class="world__card-effect">{{ itemNote(site, item) }}</span>
                    <button
                      v-if="!item.owned"
                      v-longpress="() => describeItem(site, item)"
                      type="button"
                      :class="['world__card-btn', { 'is-off': !canBuy(site, item) }]"
                      :disabled="busy"
                      :aria-label="buyLabel(site, item)"
                      @click="buyItem(site, item, $event)"
                    >
                      <template v-if="lockOf(site, item)">{{ lockOf(site, item) }}</template>
                      <template v-else>{{ item.price }}<span class="world__coin world__coin--small" aria-hidden="true"></span></template>
                    </button>
                    <button v-else-if="item.kind === 'skin' && site.skin !== item.id" type="button" class="world__card-btn world__card-btn--quiet" :disabled="busy" @click="wearSkin(site, item.id)">Porter</button>
                    <button v-else-if="item.kind === 'skin'" type="button" class="world__card-btn world__card-btn--quiet" :disabled="busy" @click="wearSkin(site, '')">Ôter</button>
                    <span v-else class="world__card-owned">Sur ton île</span>
                  </li>
                </ul>
              </section>
              <transition name="world-undo">
                <div v-if="undoable" class="world__undo" role="status">
                  <span>{{ undoable.name }} : acheté</span>
                  <button type="button" class="world__undo-btn" :disabled="busy" @click="undoItem">Annuler</button>
                </div>
              </transition>
            </div>

            <!-- Annexes : champs, filons, viviers… à poser autour du bâtiment (la case se choisit sur la carte) -->
            <AnnexPanel v-else-if="siteTab === 'annexes'" :site="site" :stock="stockAll" :coins="coins" :busy="busy" @place="annex => startAnnex(site, annex)" />

            <ol v-else class="world__steps">
              <li v-for="(step, i) in site.levels" :key="step.name" :class="['world__step', `is-${stepState(site, i)}`]">
                <span class="world__step-mark" aria-hidden="true">{{ stepState(site, i) === 'done' ? '✓' : i + 1 }}</span>
                <div class="world__step-body">
                  <span class="world__step-name">{{ step.name }}</span>
                  <span class="world__step-effect">{{ step.effect }}</span>
                  <ul v-if="stepState(site, i) !== 'done'" class="world__needs">
                    <li v-if="step.chapter" :class="['world__need', step.chapterOpen ? 'is-ok' : 'is-missing']">
                      <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:book" /></span>
                      <span>Chapitre <strong>{{ step.chapter }}</strong> du Grimoire</span>
                      <em>{{ step.chapterOpen ? 'ouvert' : 'encore scellé' }}</em>
                    </li>
                    <li v-if="step.plan" :class="['world__need', step.planOwned ? 'is-ok' : 'is-missing']">
                      <span class="world__need-glyph" aria-hidden="true"><ElementGlyph :glyph="step.planEmoji || 'ui:plan'" /></span>
                      <span>Plan : <strong>{{ step.plan }}</strong></span>
                      <em>{{ step.planOwned ? 'trouvé' : 'à découvrir dans le Grimoire' }}</em>
                    </li>
                    <li v-for="(n, r) in step.cost" :key="r" :class="['world__need', state.stock[r] >= n ? 'is-ok' : 'is-missing']">
                      <span class="world__need-glyph" aria-hidden="true"><ElementGlyph :glyph="GLYPH[r]" /></span>
                      <span><strong>{{ state.stock[r] }}</strong> / {{ n }} {{ LABEL[r] }}</span>
                    </li>
                    <li v-if="step.coins" :class="['world__need', coinsOk(step.coins) ? 'is-ok' : 'is-missing']">
                      <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:coin" /></span>
                      <span><strong>{{ step.coins }}</strong> écus</span>
                      <em v-if="!coinsOk(step.coins)">il en manque {{ step.coins - coins }}</em>
                    </li>
                  </ul>
                  <div v-if="stepState(site, i) === 'next'" class="world__sheet-actions">
                    <button type="button" class="world__btn" :disabled="!canBuild(site) || busy" @click="build(site)">
                      {{ site.level ? `Faire évoluer : ${step.name}` : `Bâtir : ${step.name}` }}
                    </button>
                    <button v-if="!affordable(site) && state.charges.count" type="button" class="world__btn world__btn--quiet" :disabled="busy" @click="startHarvest">
                      Jouer une Récolte
                    </button>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </transition>

      <!-- Quartier à acheter : prix en écus et chapitre du Livre -->
      <!-- Brume : sa réplique, la quête active, son avancée, sa récompense -->
      <transition name="world-sheet">
        <div v-if="questOpen && state && state.brume" class="world__sheet-backdrop" @click.self="questOpen = false">
          <div class="world__sheet" role="dialog" aria-label="Brume, le feu follet">
            <div class="world__sheet-head">
              <span class="world__sheet-title world__brume-title"><BrumeWisp :size="30" :ready="Boolean(quest && quest.done)" /> Brume</span>
              <button type="button" class="world__link" @click="questOpen = false">Fermer</button>
            </div>
            <template v-if="quest">
              <span class="world__eyebrow world__quest-eyebrow">Acte {{ quest.act }} · quête {{ quest.step }} sur {{ quest.total }}</span>
              <p class="world__brume-say">« {{ quest.say }} »</p>
              <div class="world__quest">
                <span class="world__quest-label">{{ quest.label }}</span>
                <span class="world__quest-count">{{ quest.have }}/{{ quest.need }}</span>
                <span class="world__quest-bar" role="progressbar" :aria-valuenow="quest.have" aria-valuemin="0" :aria-valuemax="quest.need">
                  <i :style="{ width: `${(100 * quest.have) / quest.need}%` }"></i>
                </span>
                <span class="world__quest-reward">Récompense : <strong>{{ quest.coins }} écus</strong></span>
              </div>
              <div class="world__sheet-actions">
                <button v-if="quest.done" type="button" class="world__btn" :disabled="busy" @click="claimQuest">Réclamer · {{ quest.coins }} écus{{ quest.chest ? ' + un coffre' : '' }}</button>
                <button v-else-if="quest.target" type="button" class="world__btn" @click="showQuestTarget">Montrer</button>
                <button v-else-if="quest.kind === 'runs'" type="button" class="world__btn" :disabled="busy || !state.charges.count" @click="questHarvest">
                  {{ state.charges.count ? 'Lancer une Récolte' : `Récolte : ${chargesText}` }}
                </button>
                <button v-else-if="quest.kind === 'crafts'" type="button" class="world__btn" @click="openBench">Ouvrir l’établi</button>
              </div>
            </template>
            <p v-else class="world__brume-say">« {{ state.brume.rested }} »</p>
          </div>
        </div>
      </transition>
      <transition name="world-sheet">
        <div v-if="zone" class="world__sheet-backdrop" @click.self="zone = null">
          <div v-if="zone.known === false" class="world__sheet" role="dialog" aria-label="Terre inconnue">
            <div class="world__sheet-head">
              <span class="world__sheet-title"><ElementGlyph glyph="ui:map" /> Terre inconnue</span>
              <button type="button" class="world__link" @click="zone = null">Fermer</button>
            </div>
            <p class="world__site-effect">Une brume épaisse couvre cette terre. Une expédition révélera son relief, son climat et ce qu’elle cache. Elle emporte :</p>
            <ul class="world__needs">
              <li class="world__need">
                <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:map" /></span>
                <span><strong>{{ zone.trip }} h</strong> de voyage</span>
              </li>
              <li v-for="(n, r) in zone.cost" :key="r" :class="['world__need', state.stock[r] >= n ? 'is-ok' : 'is-missing']">
                <span class="world__need-glyph" aria-hidden="true"><ElementGlyph :glyph="GLYPH[r]" /></span>
                <span><strong>{{ n }}</strong> {{ WORDS[r] }}</span>
              </li>
              <li :class="['world__need', state.charges.count ? 'is-ok' : 'is-missing']">
                <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:spark" /></span>
                <span>Une partie de Récolte</span>
                <em>{{ state.charges.count }} en réserve</em>
              </li>
            </ul>
            <p v-if="state.expedition && state.expedition.zone === zone.id" class="world__trip-note">Ton expédition est en route : retour dans {{ tripLeft }}.</p>
            <p v-else-if="state.expedition" class="world__trip-note">Une expédition est déjà en route ailleurs : attends son retour.</p>
            <p v-else-if="!zone.explorable" class="world__trip-note">Une expédition part d’un quartier à toi, vers un quartier voisin : achète d’abord un quartier qui touche celui-ci.</p>
            <div class="world__sheet-actions">
              <button type="button" class="world__btn" :disabled="!zone.explorable || busy" @click="explore(zone)">Envoyer une expédition</button>
            </div>
          </div>
          <div v-else class="world__sheet" role="dialog" :aria-label="zone.name">
            <div class="world__sheet-head">
              <span class="world__sheet-title"><ElementGlyph glyph="ui:map" /> {{ zone.name }}</span>
              <button type="button" class="world__link" @click="zone = null">Fermer</button>
            </div>
            <p class="world__site-effect">
              Agrandis ton île<template v-if="sitesIn(zone).length"> : ce quartier abrite {{ sitesIn(zone).join(', ') }}</template>, et de la place pour tes créations.
            </p>
            <p v-if="CLIMATE_TEXT[zone.climate]" class="world__climate"><strong>{{ CLIMATE_NAMES[zone.climate] }}</strong> · {{ CLIMATE_TEXT[zone.climate] }}</p>
            <ul class="world__needs">
              <li v-if="zone.chapter" :class="['world__need', zone.open ? 'is-ok' : 'is-missing']">
                <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:book" /></span>
                <span>Chapitre <strong>{{ zone.chapter }}</strong> du Grimoire</span>
                <em>{{ zone.open ? 'ouvert' : 'encore scellé' }}</em>
              </li>
              <li class="world__need">
                <span class="world__need-glyph" aria-hidden="true"><ElementGlyph glyph="ui:coin" /></span>
                <span><strong>{{ zone.price }}</strong> écus</span>
              </li>
            </ul>
            <div class="world__sheet-actions">
              <button type="button" class="world__btn" :disabled="!zone.open || busy" @click="buyZone(zone)">Acheter · {{ zone.price }} écus</button>
            </div>
          </div>
        </div>
      </transition>

    </teleport>

    <ShopItemSheet
      v-if="sheetItem"
      :site="sheetSite"
      :item="sheetItem"
      :art="itemArt(sheetSite, sheetItem)"
      :lock="lockOf(sheetSite, sheetItem)"
      :busy="busy"
      :max-moves="state.harvest.maxMoves"
      :max-charges="state.charges.max"
      @buy="buyFromSheet"
      @wear="skin => wearSkin(sheetSite, skin)"
      @close="sheet = null"
    />

    <!-- Établi (créations d'île) et assemblage d'une création -->
    <CraftBench
      v-if="benchOpen && state && state.crafts"
      :crafts="state.crafts"
      :stock="stockAll"
      :element-emojis="elementEmojis"
      :busy="busy || craftStarting"
      @assemble="assemble"
      @place="placeFromBench"
      @close="benchOpen = false"
    />
    <CraftPuzzle
      v-if="craftRun"
      :run="craftRun"
      :name="craftName(craftRun.craft)"
      :sending="craftSending || craftStarting"
      :error="craftError"
      :made="craftMade"
      @finish="finishCraft"
      @restart="assemble(craftRun.craft)"
      @place="placeFromPuzzle"
      @close="closePuzzle"
    />

    <!-- Fiche d'une annexe posée (appui long) : la déplacer, ou ouvrir son bâtiment -->
    <AnnexSheet v-if="sheetAnnex" v-bind="sheetAnnex" :busy="busy" @close="annexSheet = null" @move="moveFromSheet" @site="siteFromSheet" />

    <!-- Premier achat d'une sorte d'article : son mode d'emploi, et de quoi aller le voir sur l'île -->
    <GModal v-if="guideItem" eyebrow="Mode d’emploi" :title="guideItem.name" :width="400" @close="closeGuide">
      <dl class="world__guide">
        <div><dt>Où</dt><dd>{{ guideText.where }}</dd></div>
        <div><dt>Comment</dt><dd>{{ guideText.how }}</dd></div>
        <div><dt>Pourquoi</dt><dd>{{ guideText.why }}</dd></div>
      </dl>
      <template #actions>
        <button type="button" class="g-btn g-btn--ghost" @click="closeGuide">Compris</button>
        <button type="button" class="g-btn" @click="showGuideOnIsland">Voir sur l’île</button>
      </template>
    </GModal>

    <!-- Renommer un bâtiment ou un quartier -->
    <RenameSheet
      v-if="renameTarget"
      :key="`${renaming.kind}:${renaming.id}`"
      :eyebrow="renameTarget.eyebrow"
      :title="renameTarget.title"
      :current="renameTarget.current"
      :base="renameTarget.base"
      :busy="busy"
      @save="saveName"
      @close="renaming = null"
    />
    <!-- Habitant : sa fiche (bavarder, offrir) ; un coffre gagné s'ouvre par-dessus -->
    <VillagerSheet
      v-if="villagerView && state"
      :villager="villagerView"
      :rules="state.friendship"
      :need-rules="state.needs"
      :stock="state.stock"
      :site-name="villagerSiteName"
      :portrait="portraitOf(villagerView.id)"
      :said="villagerSaid"
      :popped="villagerPopped"
      :busy="busy"
      @talk="talkVillager"
      @gift="giftVillager"
      @fill="fillNeed"
      @close="villagerId = null"
    />
    <!-- Visiteur arrivé en bateau : sa fiche (demande, récompense) -->
    <VisitorSheet
      v-if="visitorOpen && state && state.visitor"
      :visitor="state.visitor"
      :stock="state.stock"
      :charges="state.charges.count"
      :houses="state.houses || undefined"
      :work-name="siteName(state.visitor.site)"
      :portrait="visitorPortrait(state.visitor)"
      :said="visitorSaid"
      :busy="busy"
      @satisfy="satisfyVisitor"
      @harvest="visitorHarvest"
      @settle="settleVisitor"
      @close="visitorOpen = false"
    />
    <!-- Coffres : la liste (jour, en attente), puis l'ouverture d'un coffre, ou de tous d'un coup -->
    <ChestList v-if="chestsOpen && state" :chests="state.chests" :busy="busy" @open="openChest" @open-all="openAllChests" @close="chestsOpen = false" />
    <FindsSheet v-if="findsOpen && state" :finds="state.finds || []" :deposits="state.deposits || []" :zones="state.map.zones" :elapsed="clock - loadedAt" @close="findsOpen = false" />
    <ExplorerLog v-if="logOpen && state" :landmarks="state.landmarks || []" :zones="state.map.zones" :focus="logFocus" @show="showLandmark" @close="logOpen = false" />
    <ChestReveal v-if="reveal" v-bind="reveal" :busy="busy" @wear="wearRevealed" @close="reveal = null" />
    <ChestHaul v-if="haul && state" :items="haulItems" :busy="busy" @wear="wearHauled" @close="haul = null" />

    <MiniGame
      v-if="gameId && gameView"
      :game="gameView"
      :site-name="gameSiteName"
      :run="gameRun"
      :starting="gameStarting"
      :sending="gameSending"
      :result="gameResult"
      :error="gameError"
      @start="startGame"
      @finish="finishGame"
      @close="closeGame"
    />
    <HarvestGame
      v-if="run"
      :run="run"
      :sending="sending"
      :result="runResult"
      :error="runError"
      :chest="runChest ? runChest.rarity : ''"
      @finish="finishHarvest"
      @close="closeHarvest"
    />
  </section>
</template>

<script>
import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import BrumeWisp from '@/components/ui/BrumeWisp.vue';
import HarvestGame from './HarvestGame.vue';
import ShopItemSheet from './ShopItemSheet.vue';
import IslandClock from './IslandClock.vue';
import ChestList from './ChestList.vue';
import ChestReveal from './ChestReveal.vue';
import ChestHaul from './ChestHaul.vue';
import AnnexPanel from './AnnexPanel.vue';
import AnnexSheet from './AnnexSheet.vue';
import NameSignPanel from './NameSignPanel.vue';
import MiniGame from './minigames/MiniGame.vue';
import GameIcon from './minigames/GameIcon.vue';
import VillagerSheet from './VillagerSheet.vue';
import VisitorSheet from './VisitorSheet.vue';
import RenameSheet from './RenameSheet.vue';
import CraftBench from './CraftBench.vue';
import CraftPuzzle from './CraftPuzzle.vue';
import ExplorerLog from './ExplorerLog.vue';
import FindsSheet from './FindsSheet.vue';
import { villagerSprite, ROLES } from '@/world/villagers';
import { talkLine, giftLine, awaits } from '@/world/friends';
import { NEED_GLYPH, MOOD_GLYPH, MOOD_LABEL, ASKS, THANKS, WORDS, missingOf, fillAllOf, askOr } from '@/world/needs';
import { visitorLook, visitorBoat, askLine, THANKS as VISITOR_THANKS } from '@/world/visitors';
import { nameSignLayers, nameSignLight, paintName } from '@/world/nameSigns';
import { annexLayers, annexLight } from '@/world/annexSprites';
import { craftLayers, craftLight, craftThumb } from '@/world/craftSprites';
import { landmarkLayers, landmarkLight, landmarkTop, landmarkScale } from '@/world/landmarkSprites';
import { landmarksShown, landmarksWaiting, landmarkTip } from '@/world/landmarks';
import { depositLayer } from '@/world/depositSprites';
import { DEPOSIT_NAMES, depositsShown, depositsReady, depositWait, waitText } from '@/world/finds';
import { CLIMATE_NAMES, CLIMATE_TEXT, climateAt, mixToward, drawClimate } from '@/world/climates';
import { annexReady, annexYield, variantsOf } from '@/world/annexes';
import { BOTTLE, noteOf, openableOf } from '@/world/chest';
import GModal from '@/components/ui/GModal.vue';
import { guideOf, guideKind } from '@/world/itemGuide';
import { villageOf } from '@/world/village';
import { glyph, clearDrawings } from '@/book/painter';
import { burst, ring, vibrate, center, reducedMotion } from '@/utils/fx';
import { GLYPH, LABEL, RESOURCES } from '@/game/resources';
import { BUILDINGS, NATURE } from '@/world/sprites';
import { lookAt, boatOffset, boatOf, artMake } from '@/world/looks';
import { itemLayers, itemLight, itemThumb } from '@/world/shopSprites';
import { rareLights } from '@/world/rareSprites';
import { tintOf } from '@/world/tints';
import { NATURE2, CRITTERS, SIGN } from '@/world/nature';
import { drawSprite, imageOf, spriteUrl, clearSprites, setSpriteDetail } from '@/world/spriteCache';
import { islandOf, liveOf, drawLive, drawCell, TerrainCache, HS, SEA_Z, worldOf, lampGlowOf } from '@/world/terrain';
import { FLOATING_ZONE, COLONY_ZONE, isletsOf, ferryPose, drawFloatBelow, drawSpring } from '@/world/islets';
import { ISLET_SPRITES, ISLET_NATURE } from '@/world/isletSprites';
import {
  seaOf, seaGuests, spread, nearestOpen, drawShallows, drawSparkles, drawWaves, drawPlankton, schoolFish, drawSchools, podAt, whaleAt, drawRings,
  drawSpout, jelliesAt, drawJellies, circling, crossing, drawGullShadow, drawFlyingGull, DOLPHIN_EVERY, DOLPHIN_FOR, WHALE_EVERY, WHALE_FOR
} from '@/world/sea';
import { SEA_SPRITES, FISH_SPECIES } from '@/world/seaSprites';
import { drawBrume, floatOf, BRUME_ALT, BRUME_REACH } from '@/world/brume';
import { guide } from '@/game/guide';
import longpress, { HOLD_MS } from '@/directives/longpress';
import { roman } from '@/utils/roman';
import { P } from '@/world/iso';
import { phaseAt, forcedPhase, drawSea, drawCloudShadows, drawClouds, drawTint, drawWeather, glow, fireflies, hash } from '@/world/scene';
import { perfWanted, perfMeter } from '@/world/perf';
import { clockText } from '@/world/sky';

const FRAME_MS = 33; // ~30 images/s : l'île respire, sans user la batterie
// Bulle d'info de l'appui long : durée d'affichage ; noms du décor naturel et des bêtes, pour elle
const TIP_MS = 3600;
// Toucher en deux temps : ce qui est choisi (contour doré, bulle et bouton) le reste ce temps, puis s'oublie
const PICK_MS = 7000;
const NATURE_NAMES = {
  tree: 'Arbre', pine: 'Pin', palm: 'Palmier', bush: 'Buisson', rock: 'Rocher', rocks: 'Rochers', crag: 'Rocher escarpé', flowers: 'Fleurs',
  tuft: 'Touffe d’herbe', birch: 'Bouleau', apple: 'Pommier', autumn: 'Arbre d’automne', stump: 'Souche', log: 'Rondin', mushrooms: 'Champignons',
  reeds: 'Roseaux', lily: 'Nénuphars', shells: 'Coquillages', driftwood: 'Bois flotté', mossy: 'Rochers moussus', lantern: 'Lanterne', bench: 'Banc',
  nest: 'Nid de mouettes', snowpine: 'Pin enneigé', cactus: 'Cactus', deadtree: 'Arbre mort', heather: 'Bruyère'
};
const ANIMALS = {
  chicken: ['Poule', 'Elle picore autour du Foyer et dort contre lui la nuit.'],
  butterfly: ['Papillon', 'Il butine les fleurs par beau temps.'],
  bee: ['Abeille', 'Elle butine les fleurs par beau temps.'],
  frog: ['Grenouille', 'Elle saute plus souvent quand il pleut.'],
  pod: ['Dauphins', 'Ils passent au large de temps en temps.'],
  whale: ['Baleine', 'Elle souffle quand on la touche.'],
  perch: ['Mouettes', 'Elles s’envolent puis reviennent sur la plage.']
};
// Sortes d'articles dont le mode d'emploi a déjà été montré (une fois par sorte, sur cet appareil)
const GUIDES_KEY = 'oc_item_guides';
function guidesSeen() {
  try {
    return JSON.parse(localStorage.getItem(GUIDES_KEY) || '[]');
  } catch (error) {
    return [];
  }
}
const guideSeen = kind => guidesSeen().includes(kind);
function markGuideSeen(kind) {
  try {
    localStorage.setItem(GUIDES_KEY, JSON.stringify([...new Set([...guidesSeen(), kind])]));
  } catch (error) {
    // Stockage indisponible : le mode d'emploi reviendra au prochain achat
  }
}
// Journée en accéléré (toucher sur l'horloge) : 24 h de l'île en 30 s
const WARP_MS = 30000;
const DAY_MS = 86400000;
const TW = 64; // largeur d'une case à l'échelle 1 (unités du monde)
const TH = TW / 2;
const DEPTH = 30;
const MAX_SCALE = 1.8;
// Vue de loin (zoom sous FAR_SCALE) : ni masquage par le relief devant ce qui se tient debout (invisible à cette
// taille), ni petits détails du décor ; la très grande île reste fluide
const FAR_SCALE = 0.45;
// De près seulement (zoom dès NEAR_SCALE), le décor fixe se dessine à chaque image et plie au vent ; plus loin, il est
// cuit dans les carrés du sol (sauf près de ce qui se tient debout : il doit pouvoir passer devant)
const NEAR_SCALE = 0.9;
// Gisements des trouvailles : un peu plus grands que leur case, pour se voir dans le décor
const DEPOSIT_SCALE = 1.25;
const SMALL_PROPS = new Set(['tuft', 'flowers', 'shells', 'mushrooms', 'reeds', 'lily', 'stump', 'log', 'driftwood', 'nest']);
// Ce qui vit à la surface de la mer (posé au niveau de l'eau, jamais caché par la terre : eau libre)
const SEA_KINDS = new Set(['fish', 'dolphin', 'whale', 'fluke', 'spout', 'vboat']);
// Arrivée du bateau d'un visiteur (secondes) et distance d'où il vient (cases)
const BOAT_SAIL = 6;
const BOAT_FAR = 7;
// Mouettes posées effrayées : envol (s), puis retour
const FLY_OFF = 2.6;
const GULL_BACK = 30;
// Construction ou amélioration : le chantier tremble dans la poussière, puis le bâtiment s'élève (ms)
const RAISE_MS = 2400;
// Achat d'un quartier : la brume se dissipe (ms)
const UNVEIL_MS = 1600;
// Un toucher reste un toucher tant que le doigt bouge de moins de 14 px (au-delà : on fait glisser la carte)
const TAP_SLOP = 14;
// Boutique d'un atelier : rubriques dans l'ordre de la fiche
const SHOP_GROUPS = [['outil', 'Outils'], ['objet', 'Objets'], ['rare', 'Pièces rares'], ['skin', 'Skins'], ['teinte', 'Teintes']];
// Rubrique d'un article : les skins se partagent entre pièces rares, skins dessinés et teintes
const groupOf = item => (item.rare ? 'rare' : item.kind === 'skin' && tintOf(item.id) ? 'teinte' : item.kind);
// Achat en un toucher : « Annuler » reste proposé 4 s (le serveur accepte l'annulation un peu plus longtemps)
const UNDO_MS = 4000;
// Mini-jeux : l'icône de chaque jeu dans la fiche de son bâtiment
const GAME_ICONS = { peche: 'dore', filon: 'diamant', cueillette: 'fraise' };
// Enseigne d'un bâtiment : pied sur le bord avant gauche de son emprise, à tant de cases du coin vers le joueur (le nom
// du bâtiment, sous ce coin, reste dégagé), un peu en retrait du bord ; dessinée un peu plus grande que nature
const NAME_SIGN_ALONG = 1.6;
const NAME_SIGN_INSET = 0.25;
const NAME_SIGN_SCALE = 1.2;
// Ce qui plie au vent, et de combien
const SWAY = { tree: 0.04, palm: 0.05, bush: 0.03, tuft: 0.09, flowers: 0.06, birch: 0.05, apple: 0.03, autumn: 0.035, reeds: 0.08, snowpine: 0.02, heather: 0.04 };
// Tous les décors naturels (planches 1 et 2), et ce qui pousse où, avec sa fréquence cumulée
const ALL_NATURE = { ...NATURE, ...NATURE2, ...ISLET_NATURE };
const BEACH_MIX = [['palm', 0.1], ['mossy', 0.15], ['shells', 0.2], ['driftwood', 0.23]];
const ROCK_MIX = [['rock', 0.3], ['rocks', 0.55], ['crag', 0.72], ['mossy', 1]];
const GRASS_MIX = [['tuft', 0.1], ['flowers', 0.16], ['bush', 0.185], ['mushrooms', 0.205], ['stump', 0.22], ['birch', 0.235], ['apple', 0.245], ['autumn', 0.255], ['log', 0.265]];
// Forêt : deux arbres par case (sapins en hauteur) ; au bord de l'eau douce, roseaux et nénuphars
const FOREST_LOW = ['tree', 'birch', 'pine', 'autumn'];
const FOREST_HIGH = ['pine', 'pine', 'tree'];
// Vue de l'île gardée d'une visite à l'autre de l'onglet (caméra, fiche ouverte) : la mémoire est libérée à la
// sortie, la progression reste
let lastView = null;

// Le Monde : l'île du joueur en isométrique (Canvas 2D), avec une caméra qu'on fait glisser et zoomer.
// L'état vient du serveur (chantiers, réserves, parties, créations d'île) ; le dessin, la caméra et la boucle
// d'animation sont non réactifs et s'arrêtent quand l'onglet est caché ou le composant démonté.
export default {
  name: 'WorldView',
  components: { ElementGlyph, HarvestGame, ShopItemSheet, BrumeWisp, IslandClock, GModal, ChestList, ChestReveal, ChestHaul, AnnexPanel, AnnexSheet, NameSignPanel, MiniGame, GameIcon, VillagerSheet, VisitorSheet, RenameSheet, CraftBench, CraftPuzzle, ExplorerLog, FindsSheet },
  directives: { longpress },
  props: {
    // Glyphes des éléments du Livre (savoir-faire demandé à l'établi)
    elementEmojis: { type: Object, required: true },
    isLoggedIn: { type: Boolean, default: false },
    // Solde d'écus (en-tête) : grise les articles hors de portée ; le serveur reste seul juge
    coins: { type: Number, default: null }
  },
  emits: ['coins-updated', 'show-alert', 'login'],
  data() {
    return {
      GLYPH, LABEL, RESOURCES, GAME_ICONS, NEED_GLYPH, MOOD_GLYPH, CLIMATE_NAMES, CLIMATE_TEXT, WORDS,
      state: null,
      guest: false,
      loadError: false,
      busy: false,
      site: null,
      // Onglet de la fiche d'un bâtiment : aperçu ou évolution
      siteTab: 'overview',
      // Quartier dont la fiche d'achat est ouverte
      zone: null,
      // Dernier achat de la boutique, encore annulable : { id, name }
      undoable: null,
      // Article de la boutique dont la fiche est ouverte (id, dans la boutique du bâtiment ouvert)
      // Fiche d'un article ouverte : { siteId, itemId } ; mode d'emploi après un premier achat (même forme)
      sheet: null,
      guide: null,
      // Bulle d'info de l'appui long : { x, y, below, title, text, hint }
      tip: null,
      menuPos: { x: 0, y: 0 },
      run: null,
      sending: false,
      runResult: null,
      runError: '',
      // Texte du compteur d'images (« ?perf »)
      perfText: '',
      // Plein écran : l'île seule, sans la barre du haut ni la barre d'onglets
      immersive: false,
      // Coffre tombé pendant la Récolte (ouvert au retour sur l'île) ; liste des coffres ouverte ; coffre en cours
      // d'ouverture : { chest, streak, note, art, wearable } ; coffres ouverts d'un coup (« Tout ouvrir »)
      runChest: null,
      chestsOpen: false,
      // Carnet d'explorateur ouvert, et la page qu'il montre d'emblée (identifiant d'un lieu)
      logOpen: false,
      logFocus: null,
      // Réserve des trouvailles de climat ouverte
      findsOpen: false,
      reveal: null,
      haul: null,
      // Mini-jeu ouvert (id), sa partie, son envoi, son résultat
      gameId: null,
      gameRun: null,
      gameStarting: false,
      gameSending: false,
      gameResult: null,
      gameError: '',
      // Bâtiment ou quartier en train d'être renommé : { kind: 'site' | 'zone', id }
      renaming: null,
      // Habitant dont la fiche est ouverte, sa dernière réplique, le cœur tout juste gagné
      villagerId: null,
      villagerSaid: '',
      villagerPopped: 0,
      visitorOpen: false,
      visitorSaid: '',
      clock: Date.now(),
      // Horloge de l'en-tête (heure, moment, temps, soleil) ; journée en accéléré
      skyClock: null,
      warping: false,
      // Fiche de Brume (quête active) ouverte
      questOpen: false,
      // Annexe en cours de pose ou de déplacement : { siteId, annexId, from: { x, y } | null } ; case dorée choisie, en
      // attente de confirmation : { x, y, px, py } ; fiche d'une annexe posée ouverte : { x, y }
      annexPlacing: null,
      annexConfirm: null,
      annexSheet: null,
      // Créations d'île : établi ouvert ; assemblage en cours ({ id, craft, shape, pieces, turned }), son envoi, son refus,
      // sa réussite ; pose ou déplacement en cours ({ craft, from: { x, y } | null }) et case dorée choisie ({ x, y, px,
      // py }) ; menu d'une création posée ({ x, y, craft })
      benchOpen: false,
      craftRun: null,
      craftStarting: false,
      craftSending: false,
      craftError: '',
      craftMade: false,
      craftPlacing: null,
      craftConfirm: null,
      craftMenu: null
    };
  },
  computed: {
    // Ce qu'on renomme : son nom actuel et celui d'origine
    renameTarget() {
      if (!this.renaming || !this.state) return null;
      const { kind, id } = this.renaming;
      const place = kind === 'site' ? this.state.sites.find(s => s.id === id) : this.state.map.zones.find(z => z.id === id);
      if (!place) return null;
      return { eyebrow: kind === 'site' ? 'Bâtiment' : 'Quartier', title: `Renommer ${place.name}`, current: place.name, base: place.baseName || place.name };
    },
    // Habitant dont la fiche est ouverte (vue du serveur, à jour) et le nom de son lieu de travail
    villagerView() {
      return this.villagerId && this.state ? (this.state.villagers || []).find(v => v.id === this.villagerId) || null : null;
    },
    // « Tout combler » : besoins renouvelables de tous les habitants et leur prix
    fillAll() {
      return fillAllOf(this.state ? this.state.villagers || [] : []);
    },
    villagerSiteName() {
      return this.villagerView ? this.siteName(this.villagerView.site || this.villagerView.id) : '';
    },
    // Mini-jeu ouvert : sa vue (réserve de parties à jour) et le nom de son bâtiment
    gameView() {
      return this.gameId && this.state ? (this.state.games || []).find(g => g.id === this.gameId) || null : null;
    },
    gameSiteName() {
      const site = this.gameView && this.state.sites.find(s => s.id === this.gameView.site);
      return site ? site.name : '';
    },
    // « Tout ramasser » : ce qui attend dans les bâtiments, écus puis ressources : [{ id, glyph, n, label }]
    harvestable() {
      if (!this.state) return [];
      const stock = this.state.pendingStock || {};
      return [{ id: 'coins', glyph: 'ui:coin', n: this.state.pending, label: 'écus' }, ...RESOURCES.map(r => ({ id: r.id, glyph: r.glyph, n: stock[r.id], label: r.label }))]
        .map(g => ({ ...g, n: Math.floor(g.n || 0) }))
        .filter(g => g.n > 0);
    },
    // Lots de « Tout ouvrir », avec l'aperçu et l'état de leur bâtiment (porté ou non) selon la vue du moment
    haulItems() {
      return (this.haul || []).map(chest => ({ chest, ...this.prizeLook(chest) }));
    },
    // Coffres à ouvrir (ceux que « Tout ouvrir » ouvre) : du jour, des chapitres et des quêtes, bouteille échouée
    chestCount() {
      const chests = this.state && this.state.chests;
      return chests ? openableOf(chests) : 0;
    },
    // Lieux remarquables des quartiers connus ; ceux d'un quartier à soi qui attendent d'être découverts
    shownLandmarks() {
      return landmarksShown(this.state);
    },
    waitingLandmarks() {
      return landmarksWaiting(this.state).length;
    },
    // Gisements des quartiers connus ; ceux d'un quartier à soi qui sont prêts ; des trouvailles en réserve
    shownDeposits() {
      return depositsShown(this.state);
    },
    readyDeposits() {
      return depositsReady(this.state, this.clock - this.loadedAt).length;
    },
    ownedFinds() {
      return Boolean(this.state && (this.state.finds || []).some(f => f.amount > 0));
    },
    // Ressources et trouvailles de climat ensemble (ce que coûtent créations et annexes de climat)
    stockAll() {
      return this.state ? { ...this.state.stock, ...Object.fromEntries((this.state.finds || []).map(f => [f.id, f.amount])) } : {};
    },
    sheetSite() {
      return this.sheet && this.state ? this.state.sites.find(s => s.id === this.sheet.siteId) || null : null;
    },
    sheetItem() {
      return this.sheetSite ? this.sheetSite.shop.find(item => item.id === this.sheet.itemId) || null : null;
    },
    guideSite() {
      return this.guide && this.state ? this.state.sites.find(s => s.id === this.guide.siteId) || null : null;
    },
    guideItem() {
      return this.guideSite ? this.guideSite.shop.find(item => item.id === this.guide.itemId) || null : null;
    },
    guideText() {
      return guideOf(this.guideItem, this.guideSite);
    },
    // Annexe en cours de pose : son bâtiment et sa carte du catalogue
    placingSite() {
      return this.annexPlacing && this.state ? this.state.sites.find(s => s.id === this.annexPlacing.siteId) || null : null;
    },
    placingAnnex() {
      return this.placingSite ? this.placingSite.annexes.find(a => a.id === this.annexPlacing.annexId) || null : null;
    },
    annexBanner() {
      const name = this.placingAnnex ? this.placingAnnex.name : '';
      return this.annexPlacing && this.annexPlacing.from ? `Touche une case dorée pour y déplacer : ${name}.` : `Touche une case dorée pour poser : ${name}.`;
    },
    annexConfirmStyle() {
      const c = this.annexConfirm;
      if (!c || !this.geo) return {};
      return { left: `${Math.max(110, Math.min(this.geo.width - 110, c.px))}px`, top: `${Math.max(56, c.py - 24)}px` };
    },
    // Fiche d'une annexe posée : sa carte du catalogue, son bâtiment, son n° d'exemplaire
    sheetAnnex() {
      if (!this.annexSheet || !this.state) return null;
      const { x, y } = this.annexSheet;
      const row = (this.state.annexes || []).find(a => a.x === x && a.y === y);
      const site = row && this.state.sites.find(s => s.id === row.site);
      const annex = site && site.annexes.find(a => a.id === row.annex);
      return annex ? { annex, site, variant: this.annexVariants.get(`${x},${y}`) || 0 } : null;
    },
    // Quête active de Brume (null : toutes faites)
    quest() {
      return this.state && this.state.brume ? this.state.brume.quest : null;
    },
    // Expédition en route : temps avant son retour, en clair (« 1 h 40 », « 12 min »)
    tripLeft() {
      const trip = this.state && this.state.expedition;
      if (!trip) return '';
      const ms = Math.max(0, trip.endsIn - (this.clock - this.loadedAt));
      const minutes = Math.max(1, Math.ceil(ms / 60000));
      return minutes >= 60 ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${String(minutes % 60).padStart(2, '0')}` : ''}` : `${minutes} min`;
    },
    // Créations d'île posées ([{ x, y, craft }])
    crafted() {
      return this.state && this.state.crafts ? this.state.crafts.placed : [];
    },
    // Création en cours de pose : sa carte du catalogue ; ses cases dorées (sans la sienne, si on la déplace)
    placingCraft() {
      return this.craftPlacing && this.state ? this.state.crafts.catalog.find(c => c.id === this.craftPlacing.craft) || null : null;
    },
    craftSpots() {
      const from = this.craftPlacing && this.craftPlacing.from;
      return this.placingCraft ? this.placingCraft.spots.filter(sp => !from || sp.x !== from.x || sp.y !== from.y) : [];
    },
    craftBanner() {
      const name = this.placingCraft ? this.placingCraft.name : '';
      return this.craftPlacing && this.craftPlacing.from ? `Touche une case dorée pour y déplacer : ${name}.` : `Touche une case dorée pour poser : ${name}.`;
    },
    craftConfirmStyle() {
      const c = this.craftConfirm;
      if (!c || !this.geo) return {};
      return { left: `${Math.max(110, Math.min(this.geo.width - 110, c.px))}px`, top: `${Math.max(56, c.py - 24)}px` };
    },
    // Établi (fiche du Foyer) : son dessin, ce qui attend
    benchArt() {
      return spriteUrl('craft-thumb-cloture', () => craftThumb('cloture'));
    },
    benchText() {
      const { catalog } = this.state.crafts;
      const ready = catalog.filter(c => !c.block).length;
      const reserve = catalog.reduce((n, c) => n + c.reserve, 0);
      return [`${this.crafted.length} sur l’île`, reserve ? `${reserve} en réserve` : '', ready ? `${ready} à assembler` : ''].filter(Boolean).join(' · ');
    },
    menuStyle() {
      return { left: `${this.menuPos.x}px`, top: `${this.menuPos.y}px` };
    },
    // Écus, dans la barre du haut (l'en-tête général est sous l'île)
    coinsText() {
      return new Intl.NumberFormat('fr-FR').format(this.coins || 0);
    },
    chargesText() {
      if (!this.state) return '';
      const { count, max, nextIn } = this.state.charges;
      if (count >= max || nextIn === null) return `${count}/${max} parties`;
      const minutes = Math.max(1, Math.ceil((nextIn - (this.clock - this.loadedAt)) / 60000));
      return `${count}/${max} · +1 dans ${minutes} min`;
    },
    canvasLabel() {
      if (!this.state) return 'Ton île';
      const built = this.state.sites.filter(s => s.level).map(s => s.name);
      const names = this.crafted.map(c => this.craftName(c.craft));
      const annexes = (this.state.annexes || []).length;
      return `Ton île : ${built.join(', ')} bâtis${annexes ? ` ; ${annexes} annexe${annexes > 1 ? 's' : ''}` : ''}${names.length ? ` ; créations : ${names.join(', ')}` : ''}.`;
    }
  },
  watch: {
    isLoggedIn() {
      this.load();
    },
    // Changer de fiche ou d'onglet retire le bandeau d'annulation
    'site.id'() {
      this.undoable = null;
    },
    siteTab() {
      this.undoable = null;
    }
  },
  created() {
    // Non réactifs : géométrie, caméra, pointeurs, horloge, animations de pose
    this.geo = null;
    this.cam = null;
    this.pointers = new Map();
    this.gesture = null;
    this.raf = 0;
    this.lastFrame = 0;
    this.pops = new Map();
    // Bâtiments en train de s'élever : id → { at, from } ; décor naturel des cases libres
    this.raises = new Map();
    this.props = [];
    // Quartiers qui viennent d'être achetés (brume qui se dissipe), bulles de production et panneaux dessinés (pour le toucher)
    this.unveils = new Map();
    this.bubbles = [];
    // Bulles de besoin au-dessus des habitants (pour le toucher)
    this.needBubbles = [];
    // Bateau du visiteur : case de mer où il s'amarre, arrivée en cours ({ id, at })
    this.visitorDock = null;
    this.boatArrival = null;
    this.signs = [];
    this.shore = [];
    // Sol en relief : calques lus (M), carrés d'images (terrain), eau animée (live), cases de chaque quartier
    this.M = null;
    this.terrain = null;
    this.live = null;
    this.zoneTiles = new Map();
    this.mistKey = null;
    // Climat(s) visé(s) par la caméra et leur poids (fondu d'un climat à l'autre), instant du dernier dessin
    this.climateMix = {};
    this.climateT = 0;
    // Mer vivante : eaux de l'île (sea), mouettes posées (perches), passages en cours des dauphins et de la baleine,
    // animaux qui ont réagi à un toucher (clé → { at, … }), et ce qu'on peut toucher dans la dernière image
    this.sea = null;
    this.perches = [];
    // Plage où la bouteille à la mer s'est échouée (case), si elle attend
    this.bottleSpot = null;
    this.passages = {};
    this.scared = new Map();
    this.seaHits = [];
    // Brume dans la dernière image (pour le toucher) ; appui long en cours sur l'île ; barque du passeur
    this.brumeHit = null;
    this.ferry = null;
    this.holdTimer = 0;
    this.moreRaf = 0;
    // Heure ou temps imposés (essais), journée jouée en accéléré, ciel de la dernière image
    this.forced = forcedPhase();
    // Compteur d'images (« ?perf » dans l'adresse) : mesure du temps de dessin, pour les essais sur téléphone
    this.perf = perfWanted() ? perfMeter() : null;
    this.warp = null;
    this.phase = null;
    this.clockAt = 0;
    // Ce qu'on peut toucher dans la dernière image : bêtes sur l'île, articles posés, enseignes ; ronds dans l'eau ;
    // bulle d'info
    this.landHits = [];
    this.itemHits = [];
    this.nameSignHits = [];
    // Variante de chaque annexe posée (« x,y » → n° d'exemplaire : ce qui pousse dans un champ…)
    this.annexVariants = new Map();
    // Vie ambiante (village.js) et lanternes des habitants dans la dernière image
    this.village = null;
    this.villageLights = [];
    this.ripples = [];
    this.tipTimer = 0;
    // Chose choisie par un premier toucher : { key, run, ring } (voir pick)
    this.picked = null;
    this.ac = null;
    this.observer = null;
    this.loadedAt = Date.now();
    this.tick = 0;
    // L'île peut quitter l'écran pendant un chargement (changement d'onglet) : la réponse est alors ignorée
    this.gone = false;
  },
  async mounted() {
    this.ac = new AbortController();
    document.addEventListener('visibilitychange', () => this.syncLoop(), { signal: this.ac.signal });
    // Écran qui change de hauteur (rotation, barre du navigateur) : l'île reprend toute la place
    window.addEventListener('resize', () => {
      this.setup();
      this.draw(performance.now());
    }, { signal: this.ac.signal });
    // Plein écran quitté par l'appareil (geste ou touche Échap) : l'île retrouve ses barres
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && this.immersive) this.setImmersive(false);
    }, { signal: this.ac.signal });
    this.syncPhase();
    this.tick = setInterval(() => {
      this.clock = Date.now();
      this.syncPhase();
      const charges = this.state && this.state.charges;
      const trip = this.state && this.state.expedition;
      const due = (charges && charges.nextIn !== null && this.clock - this.loadedAt > charges.nextIn + 2000) || (trip && this.clock - this.loadedAt > trip.endsIn + 2000);
      if (due && !this.busy && !this.run) this.load();
    }, 20000);
    await this.load();
  },
  beforeUnmount() {
    this.gone = true;
    if (this.immersive) this.setImmersive(false);
    clearTimeout(this.undoTimer);
    clearTimeout(this.holdTimer);
    clearTimeout(this.tipTimer);
    if (this.ac) this.ac.abort();
    if (this.observer) this.observer.disconnect();
    clearInterval(this.tick);
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.moreRaf);
    this.raf = this.moreRaf = 0;
    // Sortie de l'île : la vue est gardée pour le retour, la mémoire libérée (sol en carrés, images, décor)
    if (this.cam) lastView = { cam: { ...this.cam }, site: this.site ? this.site.id : null, siteTab: this.siteTab };
    if (this.terrain) this.terrain.clear();
    this.terrain = null;
    this.props = [];
    this.live = null;
    clearSprites();
    clearDrawings();
  },
  methods: {
    reduced() {
      return reducedMotion();
    },
    async load() {
      try {
        const state = await playService.world();
        if (this.gone) return;
        this.apply(state);
        this.guest = false;
        this.loadError = false;
        guide.tip('island');
        // Premier bâtiment au palier II : ses annexes s'ouvrent
        if (state.sites.some(s => s.level >= 2 && !s.locked)) guide.tip('annexes');
        // Deux habitants ou plus : ils ont un prénom, on peut s'en faire des amis
        if ((state.villagers || []).length >= 2) guide.tip('friends');
        // Un habitant à qui il manque quelque chose : ses besoins et son humeur
        if ((state.villagers || []).some(v => missingOf(v).length)) guide.tip('needs');
        // Un visiteur vient d'accoster
        if (state.visitor) guide.tip('visitor');
        // Premier mini-jeu ouvert (Ponton, Carrière ou Bosquet au palier III)
        if ((state.games || []).some(g => g.open)) guide.tip('games');
      } catch (error) {
        if (this.gone) return;
        if ([401, 402].includes(error.response?.status)) {
          this.guest = true;
          this.state = null;
          return;
        }
        console.error('Erreur lors du chargement de l’île:', error);
        this.loadError = true;
      }
    },
    apply(state) {
      // Les décorations de l'ancienne règle viennent d'être remboursées (une seule fois) : le solde suit, l'île le dit
      if (state.refund) {
        const { count, coins, balance } = state.refund;
        this.$emit('coins-updated', balance);
        this.$emit('show-alert', `Les décorations laissent place aux créations d’île : ${count} décoration${count > 1 ? 's' : ''} remboursée${count > 1 ? 's' : ''}, ${coins} écus. Assemble tes créations à l’établi du Foyer.`);
      }
      // Un niveau gagné depuis le dernier état : le bâtiment s'élève sous les yeux du joueur
      if (this.state && !this.reduced()) {
        const before = new Map(this.state.sites.map(site => [site.id, site.level]));
        state.sites.forEach(site => {
          const from = before.get(site.id);
          if (from !== undefined && site.level > from) this.raises.set(site.id, { at: performance.now(), from });
        });
      }
      // Calques du sol ; la brume est peinte dans les carrés du sol : un quartier acheté fait refaire les siens
      const M = islandOf(state.map, state.size, state.map.zones.findIndex(z => z.id === FLOATING_ZONE));
      if (!this.terrain) this.terrain = new TerrainCache(M, (x, y) => this.veilAt(x, y), (ctx, x, y) => this.standAt(ctx, x, y));
      this.M = M;
      this.live = liveOf(M);
      // Cases de lave : elles luisent la nuit
      this.lavaCells = [];
      for (let y = 0; y < state.size; y++) for (let x = 0; x < state.size; x++) if (M.ground(x, y) === 'o') this.lavaCells.push(this.ground(x, y));
      // Îlots des chapitres VI et VII : île flottante, colonie de mouettes, barque du passeur, lanternes du pont
      this.islets = isletsOf(M, (x, y) => (state.map.zones[M.zone(x, y)] || {}).id);
      if (!this.sea) this.sea = seaOf(M);
      this.zoneTiles = new Map();
      for (let y = 0; y < state.size; y++) {
        for (let x = 0; x < state.size; x++) {
          const zone = state.map.zones[M.zone(x, y)];
          if (zone) this.zoneTiles.set(zone.id, [...(this.zoneTiles.get(zone.id) || []), [x, y]]);
        }
      }
      // Retour sur l'île : la fiche qui était ouverte se rouvre
      if (!this.state && lastView && lastView.site) {
        this.site = state.sites.find(s => s.id === lastView.site) || null;
        this.siteTab = lastView.siteTab || 'overview';
      }
      this.annexVariants = variantsOf(state.annexes || []);
      this.props = this.natureOf(state);
      // Décor par case, cuit dans le sol sauf de près ; celui qui entoure ce qui se tient debout reste dessiné à part
      // (liveProps), pour passer devant dans l'ordre du relief. Si le décor cuit a changé, ses carrés seront refaits
      const live = this.liveCellsOf(state);
      this.liveProps = this.props.filter(prop => live.has(prop.y * state.size + prop.x));
      this.propsAt = new Map();
      for (const prop of this.props) {
        const key = prop.y * state.size + prop.x;
        if (live.has(key)) continue;
        this.propsAt.set(key, [...(this.propsAt.get(key) || []), prop]);
      }
      const propsKey = [...this.propsAt.values()].flat().map(p => `${p.kind}${p.x},${p.y}`).join(';');
      if (this.propsKey !== undefined && propsKey !== this.propsKey) this.terrain.restand();
      this.propsKey = propsKey;
      this.perches = this.perchesOf(state);
      this.bottleSpot = this.bottleSpotOf(state);
      this.shore = this.shoreOf(state);
      // Habitants et bêtes : ils vivent dans les quartiers à soi, autour des bâtiments bâtis
      this.village = villageOf({
        n: state.size, M, sites: state.sites, crafts: state.crafts ? state.crafts.placed : [], props: this.props, annexes: state.annexes || [],
        owned: new Set(state.map.zones.map((z, i) => (z.owned ? i : -1)).filter(i => i >= 0)), visitor: state.visitor || null,
        settlers: (state.villagers || []).filter(v => v.seed !== undefined),
        climates: state.map.zones.map(z => z.climate || null), avoid: [...landmarksShown(state), ...depositsShown(state)]
      });
      // Visiteur : son bateau s'amarre près du Ponton ; un visiteur jamais vu sur cet appareil arrive sous les yeux
      this.visitorDock = state.visitor ? this.dockOf(state, M) : null;
      if (state.visitor && this.visitorDock && !this.reduced()) {
        let seen = null;
        try { seen = localStorage.getItem('oc_visitor_seen'); } catch (e) { seen = null; }
        if (seen !== String(state.visitor.id)) {
          this.boatArrival = { id: state.visitor.id, at: performance.now() / 1000 };
          try { localStorage.setItem('oc_visitor_seen', String(state.visitor.id)); } catch (e) { /* stockage indisponible */ }
        }
      }
      // Expédition revenue : le quartier qu'elle a découvert se dévoile (nom, climat, relief)
      if (this.state) {
        const unknown = new Set(this.state.map.zones.filter(z => z.known === false).map(z => z.id));
        const found = state.map.zones.filter(z => unknown.has(z.id) && z.known !== false);
        if (found.length) {
          found.forEach(z => this.unveils.set(z.id, performance.now()));
          this.$emit('show-alert', found.map(z => `Expédition revenue : ${z.name} découvert (${CLIMATE_NAMES[z.climate] || 'climat inconnu'}) !`).join(' '));
        }
      }
      this.state = state;
      // Brume et sol d'un quartier : à soi (o), connu (k), inconnu (u) ; un changement refait ses carrés de sol
      const mistKey = state.map.zones.map(z => `${z.id}:${z.owned ? 'o' : z.known === false ? 'u' : 'k'}`).join();
      if (this.mistKey !== null && mistKey !== this.mistKey) {
        const before = new Set(this.mistKey.split(',')), after = new Set(mistKey.split(','));
        const changed = [...new Set([...before, ...after].map(k => k.split(':')[0]))].filter(id => [...before].find(k => k.startsWith(`${id}:`)) !== [...after].find(k => k.startsWith(`${id}:`)));
        this.terrain.invalidate(changed.flatMap(id => this.zoneTiles.get(id) || []));
      }
      this.mistKey = mistKey;
      this.loadedAt = Date.now();
      this.clock = this.loadedAt;
      if (this.site) this.site = state.sites.find(s => s.id === this.site.id) || null;
      // Pose d'annexe en cours : abandonnée si le bâtiment n'a plus de case libre ; de même pour une création
      if (this.annexPlacing && !(this.placingSite && this.placingSite.spots.length)) this.cancelAnnex();
      if (this.craftPlacing && !this.craftSpots.length) this.cancelCraft();
      if (this.craftMenu && !this.crafted.some(c => c.x === this.craftMenu.x && c.y === this.craftMenu.y)) this.craftMenu = null;
      this.$nextTick(() => {
        this.setup();
        this.draw(performance.now());
        this.syncLoop();
      });
    },
    // Date du ciel : imposée (essais), jouée en accéléré (horloge), ou l'heure réelle
    skyDate(now = performance.now()) {
      if (this.forced && this.forced.date) return this.forced.date;
      if (this.warp) {
        const elapsed = now - this.warp.start;
        if (elapsed < WARP_MS) return new Date(this.warp.from + elapsed * (DAY_MS / WARP_MS));
        this.warp = null;
        this.warping = false;
      }
      return new Date();
    },
    skyAt(date) {
      return phaseAt(date, { weather: this.forced ? this.forced.weather : null });
    },
    // Horloge de l'en-tête : remise à jour quand la minute, le moment ou le temps changent (10 fois par seconde au plus
    // pendant l'accéléré)
    syncClock(phase, date, now) {
      const time = clockText(date);
      const clock = this.skyClock;
      if (clock && clock.time === time && clock.label === phase.label && clock.weather === phase.weather.kind) return;
      if (this.warp && now - this.clockAt < 100) return;
      this.clockAt = now;
      const night = phase.sun.up <= 0;
      const progress = night ? ((phase.hour - phase.set + 24) % 24) / (24 - (phase.set - phase.rise)) : phase.sun.progress;
      this.skyClock = { time, label: phase.label, weather: phase.weather.kind, weatherLabel: phase.weather.label, progress, night };
    },
    syncPhase() {
      const now = performance.now();
      const date = this.skyDate(now);
      this.syncClock(this.skyAt(date), date, now);
    },
    // Toucher sur l'horloge : la journée entière défile en 30 s, puis l'île revient à l'heure ; un autre toucher l'arrête
    toggleWarp() {
      if (this.warp || this.reduced()) {
        this.warp = null;
        this.warping = false;
      } else {
        this.warp = { start: performance.now(), from: Date.now() };
        this.warping = true;
      }
      this.syncLoop();
      this.draw(performance.now());
    },
    // Cases autour de ce qui se tient debout (bâtiments, créations, annexes, lieux remarquables, gisements), jusqu'à deux cases
    // devant : le décor qui s'y trouve n'est jamais cuit dans le sol (il passe devant eux). Set des clés y * n + x
    liveCellsOf(state) {
      const n = state.size;
      const cells = new Set();
      const around = (x0, y0, w, h) => {
        for (let y = y0 - 1; y <= y0 + h + 1; y++) for (let x = x0 - 1; x <= x0 + w + 1; x++) cells.add(y * n + x);
      };
      state.sites.forEach(site => around(site.x, site.y, site.w, site.h));
      [...(state.crafts ? state.crafts.placed : []), ...(state.annexes || []), ...landmarksShown(state), ...depositsShown(state)].forEach(o => around(o.x, o.y, 1, 1));
      return cells;
    },
    // Décor naturel, fixe pour une île donnée, selon le sol : arbres des forêts, arbres isolés, rochers, touffes des
    // dunes ; roseaux et nénuphars au bord de l'eau douce ; palmiers et coquillages sur le sable, touffes et fleurs
    // dans l'herbe libre ; dans les climats, pins enneigés, bruyère, cactus et arbres morts. Une création posée le
    // remplace, et il ne gêne aucun toucher.
    natureOf(state) {
      const n = state.size;
      const M = this.M;
      const taken = new Set([...(state.crafts ? state.crafts.placed : []), ...(state.annexes || []), ...landmarksShown(state)].map(t => t.y * n + t.x));
      // Une clairière autour de chaque gisement : rien ne le cache, même au cœur de la jungle
      for (const d of depositsShown(state)) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) taken.add((d.y + dy) * n + d.x + dx);
      state.sites.forEach(site => {
        for (let dy = 0; dy < site.h; dy++) for (let dx = 0; dx < site.w; dx++) taken.add((site.y + dy) * n + site.x + dx);
      });
      const props = [];
      const add = (kind, x, y, dx = 0, dy = 0) => {
        const c = this.world(x + dx, y + dy);
        props.push({ kind, x, y, dx, dy, depth: x + y + (dx + dy) * 0.5, wx: c.x, wy: c.y - this.liftAt(x, y) });
      };
      const wet = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => M.ground(x + a, y + b) === 'w');
      // Sable des Dunes : des cactus plutôt que des coquillages
      const dunes = (x, y) => (state.map.zones[M.zone(x, y)] || {}).climate === 'dunes';
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (taken.has(y * n + x)) continue;
          const g = M.ground(x, y);
          const roll = hash(x, y);
          if (g === 'f') {
            const kinds = M.height(x, y) >= 2 ? FOREST_HIGH : FOREST_LOW;
            add(kinds[Math.floor(roll * kinds.length)], x, y, -0.2, -0.16);
            add(kinds[Math.floor(hash(y, x) * kinds.length)], x, y, 0.18, 0.22);
          } else if (g === 't') add(roll < 0.55 ? 'tree' : roll < 0.8 ? 'apple' : 'birch', x, y);
          else if (g === 'r') add(ROCK_MIX.find(([, upTo]) => roll < upTo)[0], x, y);
          else if (g === 'd') add('tuft', x, y);
          else if (g === 'j') {
            // Jungle : deux arbres par case, palmiers et feuillus
            add(roll < 0.5 ? 'palm' : 'tree', x, y, -0.2, -0.16);
            add(hash(y, x) < 0.4 ? 'palm' : 'tree', x, y, 0.18, 0.22);
          } else if (g === 'x') { if (roll < 0.6) add(roll < 0.35 ? 'reeds' : roll < 0.48 ? 'lily' : 'stump', x, y); }
          else if (g === 'l') { if (roll < 0.32) add(roll < 0.12 ? 'heather' : roll < 0.2 ? 'bush' : roll < 0.27 ? 'tuft' : 'rocks', x, y); }
          else if (g === 'n') { if (roll < 0.14) add(M.height(x, y) <= 5 && roll < 0.09 ? 'snowpine' : 'crag', x, y); }
          else if (g === 'a') { if (roll < 0.2) add(roll < 0.1 ? 'deadtree' : 'rocks', x, y); }
          else if (g === 's' && dunes(x, y)) { if (roll < 0.12) add(roll < 0.09 ? 'cactus' : 'rocks', x, y); }
          else if ((g === 'g' || g === 'm') && wet(x, y) && roll < 0.45) add(roll < 0.3 ? 'reeds' : 'lily', x, y);
          else if (g === 's' || g === 'g' || g === 'm') {
            const kind = ((g === 's' ? BEACH_MIX : GRASS_MIX).find(([, upTo]) => roll < upTo) || [null])[0];
            if (kind) add(kind, x, y);
          }
        }
      }
      // Îlot aux Mouettes acheté : les nids de la colonie, sur l'herbe libre
      if (this.owns(state, COLONY_ZONE)) {
        const free = this.islets.colony.filter(c => M.ground(c.x, c.y) === 'g' && !taken.has(c.y * n + c.x) && !props.some(p => p.x === c.x && p.y === c.y));
        spread(free, 2, 3).forEach(c => add('nest', c.x, c.y, 0.08, -0.06));
      }
      return props;
    },
    owns(state, zoneId) {
      return Boolean(state.map.zones.find(z => z.id === zoneId && z.owned));
    },
    /* ---------- Carte : terre, plage, quartiers ---------- */
    // Case de terre (calques du serveur : sol, relief, quartier)
    landAt(x, y) {
      return Boolean(this.M) && this.M.land(x, y);
    },
    zoneAt(x, y) {
      return this.M && this.state ? this.state.map.zones[this.M.zone(x, y)] || null : null;
    },
    // Voile de brume d'une case (quartier à acheter), peint dans les carrés du sol
    veilAt(x, y) {
      const zone = this.state && this.state.map.zones[this.M.zone(x, y)];
      return zone && !zone.owned ? (zone.known === false ? 0.35 : 0.62) : 0;
    },
    // Hauteur (unités du monde) du sol d'une case : ce qui s'y tient debout est remonté d'autant
    liftAt(x, y) {
      return this.M ? Math.max(0, this.M.surface(Math.round(x), Math.round(y))) * HS : 0;
    },
    // Point du monde au sol d'une case (ou d'un point fractionnaire), relief compris
    ground(x, y) {
      const c = this.world(x, y);
      c.y -= this.liftAt(x, y);
      return c;
    },
    lockedAt(x, y) {
      const zone = this.zoneAt(x, y);
      return Boolean(zone && !zone.owned);
    },
    // Opacité de la brume d'un quartier : pleine s'il est à acheter, qui s'efface juste après l'achat
    mistOf(zone, now) {
      if (!zone) return 0;
      if (!zone.owned) return 1;
      const start = this.unveils.get(zone.id);
      if (start === undefined) return 0;
      const k = (now - start) / UNVEIL_MS;
      if (k >= 1) {
        this.unveils.delete(zone.id);
        return 0;
      }
      return 1 - k;
    },
    // Cases de mer au bord de la terre (devant elle) : le poisson saute là
    shoreOf(state) {
      const out = [];
      for (let y = 0; y < state.size; y++) {
        for (let x = 0; x < state.size; x++) {
          if (this.M.ground(x, y) === '~' && [[1, 0], [0, 1]].some(([dx, dy]) => this.landAt(x - dx, y - dy))) out.push({ x, y });
        }
      }
      return out;
    },
    // Place du panneau d'un quartier : choisie par le serveur (sol libre, au bord d'un chemin, près du centre)
    signPlaceOf(zone) {
      return zone.anchor || null;
    },
    // Chantier : 0 = plan à trouver, 1 = plan trouvé, 2 = tout est prêt
    stageOf(site) {
      if (!site.next || !site.next.planOwned) return 0;
      return this.affordable(site) ? 2 : 1;
    },
    // Vent : rafales lentes et frémissement, différents d'un point à l'autre de l'île
    windAt(t, x) {
      const gust = 0.55 + 0.45 * Math.sin(t * 0.21);
      return (Math.sin(t * 1.1 + x * 0.35) * 0.65 + Math.sin(t * 2.6 + x) * 0.25) * gust;
    },
    // Dessine un sprite ancré en (x, y) du monde, plié par le vent (cisaillement depuis sa base)
    swayed(ctx, key, make, x, y, skew, repaint) {
      if (!skew) {
        drawSprite(ctx, key, make, x, y, repaint);
        return;
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.transform(1, 0, -skew, 1, 0, 0);
      drawSprite(ctx, key, make, 0, 0, repaint);
      ctx.restore();
    },
    // Bouffées de poussière autour d'une emprise de chantier, k de 0 à 1 ; span : demi-largeur de l'emprise en cases
    dust(ctx, x, y, k, count = 9, span = 1) {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + hash(i, 3);
        const d = TW * (0.45 + 0.5 * k) * span;
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d * 0.5 - k * 14;
        const r = 7 + k * 16 * (0.6 + hash(i, 9));
        ctx.fillStyle = `rgba(214,190,150,${(0.55 * (1 - k)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    // Ressources du palier suivant réunies
    affordable(site) {
      return Boolean(site.next) && Object.entries(site.next.cost).every(([r, n]) => this.state.stock[r] >= n);
    },
    // Écus suffisants (solde inconnu : le serveur tranchera)
    coinsOk(price) {
      return !price || this.coins === null || this.coins >= price;
    },
    canBuild(site) {
      const next = site.next;
      return Boolean(next) && next.planOwned && next.chapterOpen !== false && this.affordable(site) && this.coinsOk(next.coins);
    },

    /* ---------- Plein écran ---------- */
    toggleImmersive() {
      this.setImmersive(!this.immersive);
    },
    // L'île seule : la barre du haut et la barre d'onglets se cachent ; l'écran entier quand l'appareil le permet
    // (pas sur iPhone : l'île garde alors toute la fenêtre)
    setImmersive(on) {
      this.immersive = on;
      document.documentElement.classList.toggle('oc-immersive', on);
      try {
        if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        if (!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
      } catch (e) {
        // Plein écran refusé : la fenêtre suffit
      }
      this.dropPick();
      this.$nextTick(() => {
        this.setup();
        this.draw(performance.now());
      });
    },

    /* ---------- Géométrie et caméra ---------- */
    setup() {
      const stage = this.$refs.stage;
      const canvas = this.$refs.canvas;
      if (!stage || !canvas || !this.state) return;
      if (!this.observer) {
        this.observer = new ResizeObserver(() => {
          this.setup();
          this.draw(performance.now());
        });
        this.observer.observe(stage);
        if (this.$refs.top) this.observer.observe(this.$refs.top);
      }
      // Hauteur de la barre qui flotte en haut : les boutons du dessin se rangent dessous
      stage.style.setProperty('--world-top', `${this.immersive || !this.$refs.top ? 0 : this.$refs.top.offsetHeight}px`);
      const width = stage.clientWidth;
      // Hauteur : toute la scène (l'île couvre l'écran, de bord à bord, jusqu'à la barre d'onglets)
      const height = Math.max(240, Math.round(stage.clientHeight));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = `${height}px`;
      const n = this.state.size;
      const fit = Math.min(width / (n * TW + TW), height / (n * TH + DEPTH + 3 * HS + TW * 1.6));
      this.geo = { width, height, dpr, n, minScale: Math.min(fit, 1) };
      // Première vue : celle qu'on avait en quittant l'île, sinon le Foyer au centre, à taille confortable pour le pouce
      if (!this.cam && lastView) this.cam = { ...lastView.cam };
      if (!this.cam) {
        const foyer = this.state.sites.find(s => s.id === 'foyer');
        const c = foyer ? this.centerOf(foyer) : this.world(n / 2, n / 2);
        this.cam = { s: Math.max(this.geo.minScale, Math.min(1, width / (TW * 6.5))), x: c.x, y: c.y };
      }
      this.clampCam();
    },
    // Centre d'une case (ou d'un point fractionnaire) dans le monde
    world(x, y) {
      return { x: ((x - y) * TW) / 2, y: ((x + y) * TH) / 2 };
    },
    toScreen(wx, wy) {
      const { s, x, y } = this.cam;
      return { x: (wx - x) * s + this.geo.width / 2, y: (wy - y) * s + this.geo.height / 2 };
    },
    toWorld(px, py) {
      const { s, x, y } = this.cam;
      return { x: (px - this.geo.width / 2) / s + x, y: (py - this.geo.height / 2) / s + y };
    },
    // Case sous un point de l'écran : la plus en avant dont le dessus (relevé par le relief) contient le point ;
    // à défaut, la case à plat (la mer)
    tileAt(px, py) {
      const w = this.toWorld(px, py);
      const a = w.x / (TW / 2);
      const b = w.y / (TH / 2);
      const x0 = Math.round((a + b) / 2);
      const y0 = Math.round((b - a) / 2);
      const n = this.state.size;
      let best = null;
      for (let y = y0 - 1; y <= y0 + 5; y++) {
        for (let x = x0 - 1; x <= x0 + 5; x++) {
          if (!this.landAt(x, y)) continue;
          const c = this.ground(x, y);
          if (Math.abs(w.x - c.x) / (TW / 2) + Math.abs(w.y - c.y) / (TH / 2) > 1) continue;
          if (!best || x + y > best.x + best.y) best = { x, y };
        }
      }
      if (best) return best;
      return x0 >= 0 && y0 >= 0 && x0 < n && y0 < n ? { x: x0, y: y0 } : null;
    },
    clampCam() {
      const n = this.state.size;
      const cam = this.cam;
      cam.s = Math.max(this.geo.minScale, Math.min(MAX_SCALE, cam.s));
      cam.x = Math.max(-(n * TW) / 2, Math.min((n * TW) / 2, cam.x));
      cam.y = Math.max(0, Math.min(n * TH, cam.y));
    },
    // Zoom autour d'un point de l'écran (le point du monde sous le doigt ne bouge pas)
    zoomAt(px, py, factor) {
      this.dropPick();
      const before = this.toWorld(px, py);
      this.cam.s *= factor;
      this.clampCam();
      const after = this.toWorld(px, py);
      this.cam.x += before.x - after.x;
      this.cam.y += before.y - after.y;
      this.clampCam();
      this.draw(performance.now());
    },
    zoomBy(factor) {
      if (this.geo) this.zoomAt(this.geo.width / 2, this.geo.height / 2, factor);
    },

    /* ---------- Boucle et dessin ---------- */
    syncLoop() {
      const run = !document.hidden && !this.reduced() && this.state && !this.guest && !this.run && !this.gameId;
      if (run && !this.raf) this.raf = requestAnimationFrame(this.frame);
      if (!run && this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
    },
    frame(now) {
      this.raf = 0;
      if (now - this.lastFrame >= FRAME_MS) {
        this.lastFrame = now;
        const start = this.perf ? performance.now() : 0;
        this.draw(now);
        if (this.perf) {
          this.perf.frame(now, performance.now() - start);
          const text = this.perf.text(now, this.cam ? this.cam.s : 0);
          if (text) this.perfText = text;
        }
      }
      this.syncLoop();
    },
    diamond(ctx, cx, cy, w, h) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - h / 2);
      ctx.lineTo(cx + w / 2, cy);
      ctx.lineTo(cx, cy + h / 2);
      ctx.lineTo(cx - w / 2, cy);
      ctx.closePath();
    },
    draw(now) {
      const canvas = this.$refs.canvas;
      if (!canvas || !this.geo || !this.state || !this.cam) return;
      const ctx = canvas.getContext('2d');
      const { width, height, dpr, n } = this.geo;
      const { s } = this.cam;
      const t = this.reduced() ? 0 : now / 1000;
      const date = this.skyDate(now);
      const phase = this.skyAt(date);
      this.phase = phase;
      this.itemHits = [];
      this.nameSignHits = [];
      this.syncClock(phase, date, now);
      // Mer, selon l'heure
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSea(ctx, width, height, t, phase);
      // Monde : unités du monde, caméra appliquée
      const o = this.toScreen(0, 0);
      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * o.x, dpr * o.y);
      // Vue de loin, les dessins sont recopiés à moindre détail (images réduites une fois pour toutes)
      setSpriteDetail(dpr * s);
      // Monde visible : seuls les carrés de sol et ce qui s'y tient, à l'écran, sont dessinés
      const tl = this.toWorld(0, 0);
      const br = this.toWorld(width, height);
      const view = { x: tl.x, y: tl.y, w: br.x - tl.x, h: br.y - tl.y };
      // Sous le sol : reflets, vagues qui arrivent derrière l'île, bancs de poissons, puis les eaux peu profondes par-dessus
      // (la terre les recouvre)
      // Reflets du soleil sur l'eau : pas la nuit, ni sous un ciel couvert
      drawSparkles(ctx, view, t, Math.max(phase.night, phase.weather.cover * 0.85), s);
      drawWaves(ctx, this.live.back, view, t, false);
      drawSchools(ctx, schoolFish(this.sea.schools, t), view, phase.night);
      drawShallows(ctx, this.sea.shallow, view, phase.night);
      drawFloatBelow(ctx, this.islets.float, view, t, phase.night);
      // Sol en relief, en carrés gardés en images (les nouveaux dans un budget de 8 ms) ; puis l'eau douce qui bouge,
      // les vagues et l'écume devant l'île, les ronds dans l'eau des dauphins et de la baleine
      // (avec le décor fixe cuit dedans, sauf de près)
      const near = s >= NEAR_SCALE;
      const baked = !near;
      const missing = this.terrain.draw(ctx, view, s * dpr, 8, baked);
      drawLive(ctx, this.M, this.live, view, t);
      if (this.owns(this.state, FLOATING_ZONE)) drawSpring(ctx, this.islets.spring, view, t);
      drawWaves(ctx, this.live.shore, view, t, true);
      const life = this.seaLife(t, view, phase);
      drawRings(ctx, life.rings);
      // Sol des chantiers : terre battue (bâti) ou chantier ; cases libres pendant un déplacement ; case choisie
      const plots = new Map();
      for (const site of this.state.sites) {
        for (let dy = 0; dy < site.h; dy++) for (let dx = 0; dx < site.w; dx++) plots.set((site.y + dy) * n + site.x + dx, site);
      }
      for (const [k, plot] of plots) {
        const x = k % n, y = Math.floor(k / n);
        const c = this.ground(x, y);
        const shade = (x + y) % 2;
        this.diamond(ctx, c.x, c.y, TW, TH);
        ctx.fillStyle = plot.level ? (shade ? '#D9C49A' : '#E0CCA4') : (shade ? '#B89468' : '#C09C70');
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, .16)';
        ctx.lineWidth = 1 / s;
        ctx.stroke();
      }
      // Pose d'une annexe ou d'une création : les cases autorisées battent en doré, la case choisie est cerclée. Contour
      // net (un trait sombre sous un trait doré : lisible sur le sable, la neige et la lande) ; un losange clair part du
      // centre de chaque case et s'efface (sauf en mouvement réduit)
      const golden = this.annexPlacing && this.placingSite ? { spots: this.placingSite.spots, chosen: this.annexConfirm }
        : this.craftPlacing ? { spots: this.craftSpots, chosen: this.craftConfirm } : null;
      if (golden) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 4);
        const wave = (t * 1.1) % 1;
        const still = this.reduced();
        ctx.lineJoin = 'round';
        for (const spot of golden.spots) {
          const c = this.ground(spot.x, spot.y);
          if (c.x < view.x - TW || c.x > view.x + view.w + TW || c.y < view.y - TW || c.y > view.y + view.h + TW) continue;
          const chosen = golden.chosen && golden.chosen.x === spot.x && golden.chosen.y === spot.y;
          this.diamond(ctx, c.x, c.y, TW, TH);
          ctx.fillStyle = chosen ? 'rgba(242, 192, 75, .62)' : `rgba(242, 192, 75, ${(0.24 + 0.2 * pulse).toFixed(3)})`;
          ctx.fill();
          ctx.strokeStyle = 'rgba(92, 56, 12, .78)';
          ctx.lineWidth = (chosen ? 4.6 : 3.4) / s;
          ctx.stroke();
          ctx.strokeStyle = chosen ? '#FFF4C8' : '#FFD45E';
          ctx.lineWidth = (chosen ? 2.4 : 1.7) / s;
          ctx.stroke();
          if (chosen || still) continue;
          this.diamond(ctx, c.x, c.y, TW * (0.2 + 0.7 * wave), TH * (0.2 + 0.7 * wave));
          ctx.strokeStyle = `rgba(255, 246, 210, ${(0.95 * (1 - wave)).toFixed(3)})`;
          ctx.lineWidth = 1.5 / s;
          ctx.stroke();
        }
      }
      if (this.craftMenu) {
        const c = this.ground(this.craftMenu.x, this.craftMenu.y);
        this.diamond(ctx, c.x, c.y, TW, TH);
        ctx.strokeStyle = '#F2C04B';
        ctx.lineWidth = 2.5 / s;
        ctx.stroke();
      }
      // Contour des chantiers : pointillés à bâtir, doré quand tout est prêt
      for (const site of this.state.sites) {
        if (site.locked) continue;
        const c = this.centerOf(site);
        this.diamond(ctx, c.x, c.y, TW * site.w, TH * site.h);
        const ready = this.canBuild(site);
        if (ready || !site.level) {
          ctx.setLineDash(ready ? [] : [6, 5]);
          ctx.strokeStyle = ready ? `rgba(245, 195, 68, ${0.6 + 0.4 * Math.sin(t * 3)})` : 'rgba(90, 60, 30, .55)';
          ctx.lineWidth = ready ? 3 : 2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (this.site && this.site.id === site.id) {
          ctx.strokeStyle = '#F2C04B';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        }
      }
      // Brume qui se lève sur le quartier qu'on vient d'acheter (la brume des autres est peinte dans le sol)
      for (const id of [...this.unveils.keys()]) {
        const mist = this.mistOf(this.state.map.zones.find(z => z.id === id), now);
        if (!mist) continue;
        ctx.fillStyle = `rgba(236, 238, 242, ${(0.62 * mist).toFixed(3)})`;
        for (const [x, y] of this.zoneTiles.get(id) || []) {
          const c = this.ground(x, y);
          this.diamond(ctx, c.x, c.y, TW + 1, TH + 1);
          ctx.fill();
        }
      }
      // Carrés de sol encore à préparer : une image de plus, même sans boucle d'animation
      if (missing && !this.raf && !this.moreRaf) {
        this.moreRaf = requestAnimationFrame(() => {
          this.moreRaf = 0;
          this.draw(performance.now());
        });
      }
      const worldTransform = ctx.getTransform();
      // Ombres des nuages et des mouettes qui glissent sur la mer et le relief
      drawCloudShadows(ctx, this.terrain.bounds, t, phase);
      for (const g of life.gulls) drawGullShadow(ctx, g, s);
      // Ce qui se tient debout (bâtiments, créations, nature), du plus loin au plus proche
      // (seulement ce qui est à l'écran ; un grand sprite dépasse vers le haut de son pied)
      const far = s < FAR_SCALE;
      const seenAt = (wx, wy) => wx > view.x - TW * 2.5 && wx < view.x + view.w + TW * 2.5 && wy > view.y - TW * 0.6 && wy < view.y + view.h + TW * 3.2;
      const seen = (x, y) => { const c = this.ground(x, y); return seenAt(c.x, c.y); };
      const standing = [
        ...this.state.sites.map(site => ({ depth: site.x + site.y + site.w, site })),
        ...this.crafted.filter(craft => seen(craft.x, craft.y)).map(craft => ({ depth: craft.x + craft.y, craft })),
        ...(this.state.annexes || []).filter(annex => seen(annex.x, annex.y)).map(annex => ({ depth: annex.x + annex.y, annex })),
        ...this.shownLandmarks.filter(landmark => seen(landmark.x, landmark.y)).map(landmark => ({ depth: landmark.x + landmark.y, landmark })),
        ...this.shownDeposits.filter(deposit => seen(deposit.x, deposit.y)).map(deposit => ({ depth: deposit.x + deposit.y, deposit })),
        ...this.state.sites.filter(site => site.sign && !site.locked).map(site => ({ site, at: this.nameSignAt(site) }))
          .filter(({ at }) => seen(at.gx, at.gy)).map(({ site, at }) => ({ depth: at.gx + at.gy, nameSign: site })),
        ...(baked ? this.liveProps : this.props).filter(prop => seenAt(prop.wx, prop.wy) && !(far && SMALL_PROPS.has(prop.kind))).map(prop => ({ depth: prop.depth, prop })),
        ...[...this.critters(t), ...life.standing].filter(critter => seen(critter.x, critter.y))
          .map(critter => ({ depth: critter.depth ?? critter.x + critter.y, critter })),
        ...this.ferryItems(t),
        ...this.state.map.zones.filter(zone => !zone.owned).map(zone => ({ zone, at: this.signPlaceOf(zone) }))
          .filter(sign => sign.at && seen(sign.at.x, sign.at.y)).map(sign => ({ depth: sign.at.x + sign.at.y, sign }))
      ].sort((p, q) => p.depth - q.depth);
      this.signs = [];
      const repaint = () => this.draw(performance.now());
      for (const item of standing) {
        if (item.site) this.drawSite(ctx, item.site, t, now, repaint);
        else if (item.craft) {
          this.drawCraft(ctx, item.craft, t, now, repaint);
          if (!far) this.occlude(ctx, item.craft.x, item.craft.y, baked);
        } else if (item.annex) {
          this.drawAnnex(ctx, item.annex, t, now, repaint);
          if (!far) this.occlude(ctx, item.annex.x, item.annex.y, baked);
        } else if (item.landmark) {
          this.drawLandmark(ctx, item.landmark, t, now, repaint);
          if (!far) this.occlude(ctx, item.landmark.x, item.landmark.y, baked);
        } else if (item.deposit) {
          this.drawDeposit(ctx, item.deposit, t, now, repaint);
          if (!far) this.occlude(ctx, item.deposit.x, item.deposit.y, baked);
        } else if (item.prop) {
          this.drawProp(ctx, item.prop, t, repaint, now, !near);
          if (!far) this.occlude(ctx, item.prop.x, item.prop.y, baked);
        } else if (item.nameSign) this.drawNameSign(ctx, item.nameSign, t, repaint);
        else if (item.sign) this.drawSign(ctx, item.sign, t, repaint);
        else if (item.ferry) this.drawFerry(ctx, item.ferry, repaint);
        else {
          this.drawCritter(ctx, item.critter, repaint);
          if (!far && !SEA_KINDS.has(item.critter.kind)) this.occlude(ctx, Math.round(item.critter.x), Math.round(item.critter.y), baked);
        }
      }
      // Volutes de brume qui dérivent au-dessus des quartiers à acheter
      this.drawWisps(ctx, t, now);
      this.drawSmoke(ctx, t, phase);
      // Ciel : mouettes en vol, nuages haut au-dessus de l'île, puis la teinte de l'heure sur toute la scène
      for (const g of life.gulls) drawFlyingGull(ctx, g, t, s);
      drawClouds(ctx, this.terrain.bounds, t, phase, s);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawTint(ctx, width, height, phase);
      drawWeather(ctx, width, height, t, phase);
      const here = this.cellAt(this.cam.x, this.cam.y);
      this.climateMix = mixToward(this.climateMix, climateAt(this.M, this.state.map.zones, here.x, here.y), this.climateT ? Math.min(0.5, t - this.climateT) : 1);
      this.climateT = t;
      drawClimate(ctx, width, height, t, this.climateMix, this.reduced());
      ctx.setTransform(worldTransform);
      this.drawLights(ctx, t, phase);
      // La nuit, le plancton s'allume dans l'écume et les méduses luisent
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      drawPlankton(ctx, this.live.shore, view, t, phase.night);
      if (life.jellies) drawJellies(ctx, life.jellies, view, t, phase.night);
      ctx.restore();
      // Brume flotte au-dessus de tout (et luit la nuit)
      this.drawBrume(ctx, t, s);
      // Les noms des lieux passent par-dessus tout : aucune création ne les cache
      if (this.cam.s >= 0.55) this.state.sites.filter(site => !site.locked).forEach(site => this.drawLabel(ctx, site));
      // Étoiles des lieux à découvrir : par-dessus tout, de jour comme de nuit
      this.drawBeacons(ctx, t, seen);
      // Bulles de production à toucher, au-dessus de tout
      this.drawBubbles(ctx, t, repaint);
      // Ce qui est choisi (premier toucher) : un contour doré qui bat
      this.drawPick(ctx, t);
    },
    // Ce qui se tient derrière une case plus haute : cette case est repeinte par-dessus (le relief cache le pied)
    occlude(ctx, x, y, baked = false) {
      const M = this.M;
      const h = M.surface(x, y);
      for (const [dx, dy] of [[1, 0], [0, 1], [1, 1]]) {
        const nx = x + dx, ny = y + dy;
        if (!M.land(nx, ny) || M.surface(nx, ny) <= h + 0.01) continue;
        drawCell(ctx, M, nx, ny, this.veilAt(nx, ny));
        // (le décor cuit dans cette case est repeint avec elle)
        if (baked) this.standAt(ctx, nx, ny);
      }
    },
    drawSite(ctx, site, t, now, repaint) {
      // Sous la brume : à peine visible, comme une promesse
      const mist = this.mistOf(this.zoneAt(site.x, site.y), now);
      if (mist) {
        ctx.save();
        ctx.globalAlpha = 1 - 0.55 * mist;
        this.paintSite(ctx, site, t, now, repaint);
        ctx.restore();
        return;
      }
      this.paintSite(ctx, site, t, now, repaint);
    },
    paintSite(ctx, site, t, now, repaint) {
      const c = this.centerOf(site);
      const raise = this.raises.get(site.id);
      const k = raise ? Math.min(1, (now - raise.at) / RAISE_MS) : 1;
      if (raise && k >= 1) this.raises.delete(site.id);
      if (!site.level) {
        // Chantier, dans sa phase ; tout prêt, un peu de poussière de temps en temps
        const stage = this.stageOf(site);
        drawSprite(ctx, `chantier-${stage}`, BUILDINGS.chantier[stage], c.x, c.y, repaint);
        if (stage === 2 && !site.locked) {
          const puff = (t * 0.5) % 1;
          if (puff < 0.4) this.dust(ctx, c.x, c.y + 6, puff / 0.4, 3);
        }
        if (!site.locked && site.next && site.next.planEmoji) glyph(ctx, site.next.planEmoji, c.x, c.y - TW * 1.02 + Math.sin(t * 2) * 2, TW * 0.46, repaint, site.next.planOwned ? 0.95 : 0.4);
        return;
      }
      const look = lookAt(site.id, site.level);
      const skin = site.skin || '';
      const key = `${site.id}-${site.level}-${skin}`;
      const make = () => look.make(skin || undefined);
      const span = site.w / 2;
      if (k < 1) {
        // 1. L'ancien état tremble dans la poussière ; 2. le nouveau bâtiment s'élève depuis le sol ; 3. petit rebond.
        // (Au palier IV, l'emprise grandit : l'ancien bâtiment, plus petit, est dessiné au centre de la nouvelle.)
        const before = raise.from || 0;
        const beforeKey = before ? `${site.id}-${before}-${skin}` : 'chantier-2';
        const beforeMake = before ? () => lookAt(site.id, before).make(skin || undefined) : BUILDINGS.chantier[2];
        if (k < 0.35) {
          const shake = Math.sin(now / 28) * 1.6 * (1 - k / 0.35);
          drawSprite(ctx, beforeKey, beforeMake, c.x + shake, c.y, repaint);
        } else {
          const r = Math.min(1, (k - 0.35) / 0.5);
          const rise = 1 - Math.pow(1 - r, 3);
          const pop = k > 0.85 ? 1 + Math.sin(((k - 0.85) / 0.15) * Math.PI) * 0.05 : 1;
          ctx.save();
          // Le bâtiment sort de terre : découpé au ras du sol (bas de l'emprise), il monte de 96 px (plus s'il est grand)
          ctx.beginPath();
          ctx.rect(c.x - TW * (span + 0.4), c.y - TW * (2 * span + 1.2), TW * (2 * span + 0.8), TW * (2 * span + 1.2) + TH * (span + 0.05));
          ctx.clip();
          ctx.translate(c.x, c.y + (1 - rise) * 96 * span);
          ctx.scale(pop, pop);
          drawSprite(ctx, key, make, 0, 0, repaint);
          ctx.restore();
        }
        this.dust(ctx, c.x, c.y + 6, k, 9, span);
        return;
      }
      // Articles de la boutique : ceux de derrière avant le bâtiment, les autres après lui
      this.drawItems(ctx, site, c, t, repaint, true);
      this.swayed(ctx, key, make, c.x, c.y, look.sway * this.windAt(t, site.x + site.y), repaint);
      // Parties vivantes du palier (flamme, jets d'eau, ailes de moulin, roue…), puis le voilier bercé du Ponton
      look.anims.forEach((anim, i) => {
        if (anim.skip && anim.skip(skin)) return;
        const frame = Math.floor(t * anim.fps) % anim.n;
        drawSprite(ctx, `${site.id}-${site.level}-a${i}-${frame}-${anim.skinned ? skin : ''}`, () => anim.frame(frame, skin || undefined), c.x, c.y, repaint);
      });
      if (look.boat) {
        const [bx, by] = P(...look.boat, 0);
        const [ox, oy] = boatOffset(look.boat);
        ctx.save();
        ctx.translate(c.x + bx, c.y + by + Math.sin(t * 1.4) * 1.6);
        ctx.rotate(Math.sin(t * 1.1) * 0.035);
        drawSprite(ctx, `boat-${skin}`, () => boatOf(skin || undefined), ox - bx, oy - by, repaint);
        ctx.restore();
      }
      this.drawItems(ctx, site, c, t, repaint, false);
    },
    // Centre de l'emprise d'un bâtiment (2 × 2 ou 3 × 3 cases) dans le monde, à la hauteur de son sol (plat)
    centerOf(site) {
      const c = this.world(site.x + (site.w - 1) / 2, site.y + (site.h - 1) / 2);
      c.y -= this.liftAt(site.x, site.y);
      return c;
    },
    covers(site, x, y) {
      return x >= site.x && x < site.x + site.w && y >= site.y && y < site.y + site.h;
    },
    // Articles possédés d'un bâtiment (outils, objets, accessoire de la pièce rare portée), dessinés et animés autour de lui
    drawItems(ctx, site, c, t, repaint, back) {
      for (const item of site.shop || []) {
        if (!item.owned || (item.kind === 'skin' && site.skin !== item.id)) continue;
        // Toucher : l'article sautille (0,5 s)
        const tapped = this.scared.get(`item:${site.id}:${item.id}`);
        const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 6 : 0;
        for (const layer of itemLayers(item.id, site.level, t)) {
          if (layer.back !== back) continue;
          const [x, y] = [c.x + layer.offset[0], c.y + layer.offset[1] - hop];
          drawSprite(ctx, layer.key, layer.make, x, y, repaint);
          // Zone de toucher : le cadre de l'image (les pièces rares font partie du bâtiment)
          if (item.kind !== 'skin') {
            const { box } = imageOf(layer.key, layer.make, repaint);
            this.itemHits.push({ item, site, x: x + box.x + box.w / 2, y: y + box.y + box.h / 2, r: Math.max(10, Math.min(box.w, box.h) * 0.5) });
          }
        }
      }
    },
    // Décor fixe d'une case, cuit dans le sol sauf de près (sans le vent ; à demi effacé sous la brume, comme le sol) :
    // vrai si tous ses dessins étaient prêts
    standAt(ctx, x, y) {
      const props = this.propsAt && this.propsAt.get(y * this.state.size + x);
      if (!props) return true;
      const zone = this.zoneAt(x, y);
      ctx.globalAlpha = zone && !zone.owned ? 0.5 : 1;
      let ready = true;
      for (const prop of props) ready = drawSprite(ctx, `nature-${prop.kind}`, ALL_NATURE[prop.kind], prop.wx, prop.wy) && ready;
      ctx.globalAlpha = 1;
      return ready;
    },
    drawProp(ctx, prop, t, repaint, now, still = false) {
      const c = { x: prop.wx, y: prop.wy };
      const mist = this.mistOf(this.zoneAt(prop.x, prop.y), now);
      if (mist) {
        ctx.save();
        ctx.globalAlpha = 1 - 0.5 * mist;
      }
      this.swayed(ctx, `nature-${prop.kind}`, ALL_NATURE[prop.kind], c.x, c.y, still ? 0 : (SWAY[prop.kind] || 0) * this.windAt(t, prop.x * 0.7 + prop.y), repaint);
      if (mist) ctx.restore();
    },
    // Panneau d'un quartier à acheter : prix, ou chapitre du Livre encore fermé ; il se balance un peu
    drawSign(ctx, { zone, at }, t, repaint) {
      const c = this.ground(at.x, at.y);
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(Math.sin(t * 1.3 + at.x) * 0.02);
      drawSprite(ctx, 'sign', SIGN, 0, 0, repaint);
      ctx.font = '900 7.5px Nunito, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#4A3426';
      const going = this.state.expedition && this.state.expedition.zone === zone.id;
      ctx.fillText(zone.known === false ? (going ? 'En route' : zone.explorable ? 'Explorer' : '? ? ?') : zone.open ? `${zone.price} écus` : `Chap. ${zone.chapter}`, 0, -31.5);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
      this.signs.push({ zone, x: c.x, y: c.y - 30, r: 20 });
    },
    // Pied de l'enseigne d'un bâtiment (dès le palier V) : sur le bord avant gauche de son emprise
    nameSignAt(site) {
      const gx = site.x + site.w - 0.5 - NAME_SIGN_ALONG;
      const gy = site.y + site.h - 0.5 - NAME_SIGN_INSET;
      return { gx, gy, ...this.ground(gx, gy) };
    },
    // Enseigne d'un bâtiment : son style (dessin animé) et le nom écrit dessus ; un toucher la fait sautiller
    drawNameSign(ctx, site, t, repaint) {
      const at = this.nameSignAt(site);
      const tapped = this.scared.get(`name-sign:${site.id}`);
      const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 5 : 0;
      let ready = true;
      ctx.save();
      ctx.translate(at.x, at.y - hop);
      ctx.scale(NAME_SIGN_SCALE, NAME_SIGN_SCALE);
      for (const layer of nameSignLayers(site.sign, t)) ready = drawSprite(ctx, layer.key, layer.make, 0, 0, repaint) && ready;
      if (ready) paintName(ctx, site.sign, this.state.signs.name, t);
      ctx.restore();
      this.nameSignHits.push({ site, x: at.x, y: at.y - 24 * NAME_SIGN_SCALE, r: 22 * NAME_SIGN_SCALE });
    },
    // Volutes de brume (monde) : ellipses claires qui dérivent lentement sur les quartiers à acheter
    drawWisps(ctx, t, now) {
      for (const zone of this.state.map.zones) {
        const mist = this.mistOf(zone, now);
        if (!mist || !zone.anchor) continue;
        for (let k = 0; k < 4; k++) {
          const ax = zone.anchor.x + Math.sin(t * 0.13 + k * 1.9 + zone.anchor.y) * 1.6;
          const ay = zone.anchor.y + Math.cos(t * 0.11 + k * 2.3 + zone.anchor.x) * 1.6;
          const c = this.world(ax, ay);
          c.y -= this.liftAt(zone.anchor.x, zone.anchor.y);
          const g = ctx.createRadialGradient(c.x, c.y - 14, 0, c.x, c.y - 14, TW * 1.3);
          g.addColorStop(0, `rgba(248, 249, 252, ${(0.42 * mist).toFixed(3)})`);
          g.addColorStop(1, 'rgba(248, 249, 252, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(c.x, c.y - 14, TW * 1.3, TH * 1.1, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    // Bulles de production au-dessus des bâtiments : ressource et écus à ramasser, d'un toucher
    drawBubbles(ctx, t, repaint) {
      this.bubbles = [];
      for (const site of this.state.sites) {
        const made = site.pending;
        if (!made || site.locked || this.raises.has(site.id)) continue;
        const amount = made[site.produce] || 0;
        if (!amount && !made.coins) continue;
        const c = this.centerOf(site);
        const k = 1 / Math.min(1, this.cam.s);
        const bob = Math.sin(t * 2.2 + site.x) * 2.5;
        const x = c.x;
        const y = c.y - TW * (1.55 + (site.w - 2) * 0.8) + bob;
        const w = 46 * k;
        const h = 22 * k;
        ctx.save();
        ctx.shadowColor = 'rgba(60, 40, 25, .3)';
        ctx.shadowBlur = 6 * k;
        ctx.shadowOffsetY = 2 * k;
        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
        else ctx.rect(x - w / 2, y - h / 2, w, h);
        ctx.fill();
        ctx.restore();
        // Pointe vers le bâtiment
        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        ctx.moveTo(x - 5 * k, y + h / 2 - 1);
        ctx.lineTo(x, y + h / 2 + 6 * k);
        ctx.lineTo(x + 5 * k, y + h / 2 - 1);
        ctx.fill();
        glyph(ctx, GLYPH[site.produce] || 'ui:spark', x - 11 * k, y + 0.5, 14 * k, repaint);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${11 * k}px Nunito, system-ui, sans-serif`;
        ctx.fillStyle = '#4A3426';
        ctx.fillText(`+${amount}`, x + 9 * k, y + 0.5);
        ctx.textBaseline = 'alphabetic';
        this.bubbles.push({ site, x, y, w, h });
      }
      this.drawNeedBubbles(ctx, t, repaint);
    },
    // Au-dessus d'un habitant à qui il manque quelque chose : une bulle avec ce besoin (la toucher ouvre sa fiche)
    drawNeedBubbles(ctx, t, repaint) {
      this.needBubbles = [];
      if (this.cam.s < 0.55) return;
      for (const h of this.landHits) {
        // Le visiteur : une bulle dorée avec sa demande, tant qu'elle n'est pas comblée
        const guest = h.kind === 'villager' ? this.guestOf(h.who) : null;
        if (guest && !guest.satisfied) {
          const k = 1 / Math.min(1, this.cam.s);
          const r = 11 * k;
          const y = h.y - 16 - r + Math.sin(t * 2.6 + h.x) * 1.5;
          this.bubbleAt(ctx, h.x, y, r, k, '#FFF6D8', '#E2A72E');
          glyph(ctx, guest.request.kind === 'livrer' ? GLYPH[guest.request.resource] : 'ui:spark', h.x, y + 0.5, 14 * k, repaint);
          this.needBubbles.push({ id: guest.id, visitor: true, x: h.x, y, r });
          continue;
        }
        const friend = h.kind === 'villager' ? this.friendOf(h.who) : null;
        const [first] = friend ? missingOf(friend) : [];
        if (!first) continue;
        const k = 1 / Math.min(1, this.cam.s);
        const r = 11 * k;
        const x = h.x;
        // Juste au-dessus de la tête (le point touché est au milieu du corps)
        const y = h.y - 16 - r + Math.sin(t * 2.6 + h.x) * 1.5;
        this.bubbleAt(ctx, x, y, r, k, '#FFF4E5', '#F0A84A');
        glyph(ctx, NEED_GLYPH[first.id], x, y + 0.5, 14 * k, repaint);
        this.needBubbles.push({ id: friend.id, need: first.id, x, y, r });
      }
    },
    // Bulle ronde cernée, sa pointe vers le bas (au-dessus d'un habitant)
    bubbleAt(ctx, x, y, r, k, fill, ring) {
      ctx.save();
      ctx.shadowColor = 'rgba(60, 40, 25, .3)';
      ctx.shadowBlur = 5 * k;
      ctx.shadowOffsetY = 2 * k;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(x - 4 * k, y + r - 2);
      ctx.lineTo(x, y + r + 5 * k);
      ctx.lineTo(x + 4 * k, y + r - 2);
      ctx.fill();
      ctx.strokeStyle = ring;
      ctx.lineWidth = 1.6 * k;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    },
    // Petite vie de l'île, déterministe dans le temps : où est chaque animal, dans quelle image, de quel côté il regarde.
    // Poules autour du Foyer, papillons et abeilles sur les fleurs (le jour), grenouille aux nénuphars, poisson près de la côte.
    critters(t) {
      if (!this.state) return [];
      const phase = this.phase || this.skyAt(this.skyDate());
      const rain = phase.weather.rain;
      const out = [];
      const hits = [];
      // Réaction au toucher : k de 0 à 1 pendant span secondes, null sinon
      const fright = (key, span) => {
        const was = this.scared.get(key);
        return was && t - was.at < span ? (t - was.at) / span : null;
      };
      const touchable = (key, kind, x, y, z) => {
        const c = this.ground(x, y);
        hits.push({ key, kind, x: c.x, y: c.y - z - 6, r: 13 });
      };
      const foyer = this.state.sites.find(s => s.id === 'foyer');
      if (foyer) {
        // Poules : elles picorent autour du Foyer ; la nuit elles dorment serrées contre lui, sous la pluie elles s'abritent
        const asleep = phase.night > 0.6;
        const huddle = asleep || rain > 0.5;
        for (let k = 0; k < 2; k++) {
          const a = huddle ? k * 2.4 + 0.6 : t * 0.22 + k * 2.4;
          const r = foyer.w / 2;
          const reach = huddle ? r * 0.6 + 0.3 : r + 0.55;
          const x = foyer.x + r + Math.cos(a) * reach + (huddle ? 0 : Math.sin(t * 0.9 + k) * 0.08);
          const y = foyer.y + r + Math.sin(a * 1.3) * (huddle ? reach : r + 0.35);
          const pecking = !asleep && Math.sin(t * 0.7 + k * 3) > 0.55;
          const jump = fright(`hen:${k}`, 0.7);
          const z = jump === null ? 0 : Math.sin(jump * Math.PI) * 10;
          out.push({ kind: 'chicken', x, y, z, frame: jump !== null || (pecking && Math.sin(t * 9) > 0) ? 1 : 0, flip: Math.sin(a) > 0 });
          touchable(`hen:${k}`, 'chicken', x, y, z);
        }
      }
      // Papillons et abeilles : de jour, par temps sec
      if (phase.night < 0.5 && rain < 0.2) {
        const flowers = this.props.filter(p => p.kind === 'flowers' || p.kind === 'bush').slice(0, 4);
        flowers.forEach((p, k) => {
          const a = t * (0.6 + k * 0.1) + k;
          const kind = k % 2 ? 'bee' : 'butterfly';
          // Touché : il file vers le haut et revient au bout de 1,5 s
          const away = fright(`fly:${k}`, 1.5);
          const lift = away === null ? 0 : Math.sin(away * Math.PI);
          const x = p.x + Math.cos(a) * 0.35 + lift * 0.8;
          const y = p.y + Math.sin(a * 1.4) * 0.3 - lift * 0.4;
          const z = 6 + Math.sin(t * 2 + k) * 3 + lift * 30;
          out.push({ kind, x, y, z, frame: Math.floor(t * (kind === 'bee' ? 20 : 8) + k) % 2, flip: Math.cos(a) < 0 });
          touchable(`fly:${k}`, kind, x, y, z);
        });
      }
      const pond = this.props.find(p => p.kind === 'lily' || p.kind === 'reeds');
      // La grenouille saute plus souvent sous la pluie
      if (pond) {
        const leap = fright('frog', 0.6);
        const z = leap === null ? 0 : Math.sin(leap * Math.PI) * 8;
        out.push({ kind: 'frog', x: pond.x + 0.12, y: pond.y + 0.1, z, frame: leap !== null || (t % (rain > 0.5 ? 1.6 : 4)) < 0.35 ? 1 : 0, flip: false });
        touchable('frog', 'frog', pond.x + 0.12, pond.y + 0.1, z);
      }
      // Poisson : un saut toutes les 7 s, à un endroit différent du rivage (sardine, daurade) ; le poisson volant plane
      // vers le large
      const cycle = Math.floor(t / 7);
      const into = (t % 7) / 7;
      const species = FISH_SPECIES[Math.floor(hash(cycle, 5) * FISH_SPECIES.length)];
      const span = species === 'volant' ? 0.2 : 0.12;
      if (into < span && this.shore.length) {
        const spot = this.shore[Math.floor(hash(cycle, 2) * this.shore.length)];
        if (species === 'volant') {
          const k = into / span, alongX = hash(cycle, 3) < 0.5;
          out.push({ kind: 'fish', species, x: spot.x + 0.2 + (alongX ? k * 1.4 : 0), y: spot.y + 0.2 + (alongX ? 0 : k * 1.4), z: 0, frame: 0, flip: !alongX });
        } else out.push({ kind: 'fish', species, x: spot.x + 0.2, y: spot.y + 0.2, z: 0, frame: into < 0.06 ? 0 : 1, flip: hash(cycle, 3) < 0.5 });
      }
      // Mouettes posées sur les plages (envolées après un toucher, elles reviennent plus tard)
      for (const perch of this.perches) {
        const fled = this.scared.get(`perch:${perch.id}`);
        if (fled && t - fled.at < GULL_BACK) continue;
        for (let i = 0; i < perch.count; i++) {
          out.push({ kind: 'gull', x: perch.x + i * 0.32 - 0.1, y: perch.y + 0.1 - i * 0.18, z: 0, frame: Math.sin(t * 0.7 + i * 2 + perch.x) > 0.75 ? 1 : 0, flip: (i + Math.floor(t / 9 + perch.y)) % 2 === 1 });
        }
      }
      // Bouteille à la mer échouée : la vague la berce ; un toucher l'ouvre
      if (this.bottleSpot) {
        const { x, y } = this.bottleSpot;
        const frame = Math.sin(t * 1.6) > 0.6 ? 1 : 0;
        out.push({ kind: 'bottle', x: x + 0.5, y: y + 0.5, z: 0, frame, flip: false, sprite: [`bottle-${frame}`, BOTTLE[frame]] });
        const c = this.ground(x + 0.5, y + 0.5);
        hits.push({ key: 'bottle', kind: 'bottle', bottle: true, x: c.x, y: c.y - 6, r: 14 });
      }
      // Habitants et bêtes du village (on peut les toucher)
      const life = this.village ? this.village.at(t, phase, this.scared) : { list: [], lights: [] };
      for (const who of life.list) {
        out.push(who);
        const c = this.ground(who.x, who.y);
        const person = who.kind === 'villager';
        hits.push({ key: who.id, kind: person ? 'villager' : who.species, who, x: c.x, y: c.y - who.z - (person ? 16 : 6), r: person ? 15 : 12 });
      }
      this.villageLights = life.lights;
      this.landHits = hits;
      return out;
    },
    drawCritter(ctx, critter, repaint) {
      // À la surface de la mer : poissons, dauphins, baleine ; les autres vivent sur le sol de leur case
      if (critter.kind === 'spout') {
        drawSpout(ctx, critter);
        return;
      }
      const atSea = SEA_KINDS.has(critter.kind);
      const c = atSea ? this.world(critter.x, critter.y) : this.ground(critter.x, critter.y);
      if (atSea) c.y -= SEA_Z * HS;
      ctx.save();
      ctx.translate(c.x, c.y - critter.z);
      if (critter.flip) ctx.scale(-1, 1);
      // Ce qui sort de l'eau peu à peu (dos, queue de la baleine) : e de 0 à 1
      if (critter.e !== undefined) {
        ctx.globalAlpha = critter.e;
        ctx.translate(0, (1 - critter.e) * 8);
      }
      const [key, make] = this.critterSprite(critter);
      drawSprite(ctx, key, make, 0, 0, repaint);
      ctx.restore();
    },
    // Barque du passeur et son ponton (Îlot aux Mouettes à soi) : elle fait la navette une fois l'île flottante à soi
    ferryItems(t) {
      const route = this.islets.route;
      this.ferry = null;
      if (!route || !this.owns(this.state, COLONY_ZONE)) return [];
      const pose = ferryPose(route, t, this.owns(this.state, FLOATING_ZONE));
      this.ferry = pose;
      return [
        { depth: route.dock.x + route.dock.y - 0.05, ferry: { landing: true, ...route.dock } },
        { depth: pose.x + pose.y, ferry: { ...pose, frame: pose.moving ? Math.floor(t * 2) % 2 : 0 } }
      ];
    },
    drawFerry(ctx, item, repaint) {
      const c = worldOf(item.x, item.y, item.z);
      ctx.save();
      ctx.translate(c.x, c.y);
      if (item.landing) drawSprite(ctx, 'islet-landing', ISLET_SPRITES.landing, 0, 0, repaint);
      else {
        if (item.flip) ctx.scale(-1, 1);
        drawSprite(ctx, `islet-ferry-${item.frame}`, ISLET_SPRITES.ferry[item.frame], 0, 0, repaint);
      }
      ctx.restore();
    },
    critterSprite(c) {
      if (c.sprite) return c.sprite;
      if (c.kind === 'fish') return [`fish-${c.species}-${c.frame}`, SEA_SPRITES.fish[c.species][c.frame]];
      if (c.kind === 'dolphin') return [`dolphin-${c.frame}`, SEA_SPRITES.dolphin[c.frame]];
      if (c.kind === 'whale') return ['whale-back', SEA_SPRITES.whaleBack];
      if (c.kind === 'fluke') return ['whale-fluke', SEA_SPRITES.whaleFluke];
      if (c.kind === 'gull') return [`gull-${c.frame}`, SEA_SPRITES.gull[c.frame]];
      return [`${c.kind}-${c.frame}`, CRITTERS[c.kind][c.frame]];
    },
    // La mer à cet instant (lot 5b) : ce qui se montre à la surface (dauphins, baleine), les ronds dans l'eau, les
    // mouettes en vol, les méduses ; et ce qu'on peut toucher (seaHits). Les visiteurs arrivent avec les quartiers
    // achetés ; en mouvement réduit, seuls restent ceux qui ne passent pas
    seaLife(t, view, phase) {
      const out = { standing: [], rings: [], gulls: [], jellies: null };
      const hits = [];
      const still = this.reduced();
      const guests = seaGuests(new Set(this.state.map.zones.filter(z => z.owned).map(z => z.id)));
      const center = this.cellAt(view.x + view.w / 2, view.y + view.h / 2);
      const surface = (x, y) => { const c = this.world(x, y); return { x: c.x, y: c.y - SEA_Z * HS }; };
      if (!still && guests.dolphins) {
        const go = this.passageOf('pod', t, DOLPHIN_EVERY, DOLPHIN_FOR, 3, center);
        const fled = go && this.scared.get(go.key);
        if (go && !fled) {
          const pod = podAt(go.spot, go.dir, go.τ);
          out.rings.push(...pod.rings);
          for (const d of pod.dolphins) {
            out.standing.push({ kind: 'dolphin', ...d });
            const c = surface(d.x, d.y);
            hits.push({ key: go.key, kind: 'pod', x: c.x, y: c.y - d.z - 4, r: 26, where: pod.dolphins.map(p => ({ x: p.x, y: p.y })) });
          }
        } else if (fled && t - fled.at < 1.2) fled.where.forEach(p => out.rings.push({ x: p.x, y: p.y, k: (t - fled.at) / 1.2 }));
      }
      if (!still && guests.whale) {
        const go = this.passageOf('whale', t, WHALE_EVERY, WHALE_FOR, 5, center);
        if (go) {
          const w = whaleAt(go.spot, go.dir, go.τ);
          const tapped = this.scared.get(go.key);
          if (tapped && t - tapped.at < 1.8) w.spouts.push({ x: tapped.x, y: tapped.y, k: (t - tapped.at) / 1.8 });
          out.rings.push(...w.rings);
          if (w.back) {
            const depth = w.back.x + w.back.y;
            out.standing.push({ kind: 'whale', x: w.back.x, y: w.back.y, z: 0, e: w.back.e, flip: w.flip });
            w.spouts.forEach(sp => out.standing.push({ kind: 'spout', ...sp, depth: depth + 0.5 }));
            const c = surface(w.back.x, w.back.y);
            hits.push({ key: go.key, kind: 'whale', x: c.x, y: c.y - 6, r: 44, at: { x: w.back.x, y: w.back.y } });
          }
          if (w.fluke) out.standing.push({ kind: 'fluke', x: w.fluke.x, y: w.fluke.y, z: 0, e: w.fluke.e, flip: w.flip });
        }
      }
      if (guests.jellies && phase.night > 0.3) out.jellies = jelliesAt(this.sea.open, t);
      // Mouettes : un vol tourne au-dessus du ponton (ou de la Grève), un autre traverse l'île de temps en temps ; la nuit,
      // elles dorment
      if (!still && phase.night < 0.6) {
        const harbor = this.state.sites.find(site => site.id === 'ponton' && site.level);
        const greve = this.state.map.zones.find(z => z.id === 'coeur');
        const home = harbor ? this.centerOf(harbor) : greve && greve.anchor ? this.ground(greve.anchor.x, greve.anchor.y) : null;
        if (home) out.gulls.push(...circling(home.x, home.y, t, 1));
        out.gulls.push(...crossing(this.terrain.bounds, t));
        const colony = this.islets.colony;
        if (colony.length && this.owns(this.state, COLONY_ZONE)) {
          const c = this.ground(colony.reduce((sum, p) => sum + p.x, 0) / colony.length, colony.reduce((sum, p) => sum + p.y, 0) / colony.length);
          out.gulls.push(...circling(c.x, c.y, t, 3, 5));
        }
      }
      // Mouettes posées : on peut les toucher ; celles qu'on vient d'effrayer s'envolent vers le large
      for (const perch of this.perches) {
        const key = `perch:${perch.id}`;
        const fled = this.scared.get(key);
        const c = this.ground(perch.x, perch.y);
        if (!fled || t - fled.at >= GULL_BACK) hits.push({ key, kind: 'perch', x: c.x, y: c.y - 8, r: 16 });
        else if (t - fled.at < FLY_OFF) {
          const k = (t - fled.at) / FLY_OFF;
          for (let i = 0; i < perch.count; i++) out.gulls.push({ wx: c.x + (60 + i * 14) * k, wy: c.y + i * 4 - 20 * k, alt: 6 + 90 * k * k, flip: false, phase: i });
        }
      }
      // Bateau du visiteur : il arrive du large (BOAT_SAIL secondes), puis se balance à quai
      const dock = this.visitorDock;
      if (dock && this.state.visitor) {
        const arrival = this.boatArrival && this.boatArrival.id === this.state.visitor.id ? this.boatArrival : null;
        const k = arrival ? Math.min(1, (t - arrival.at) / BOAT_SAIL) : 1;
        const ease = 1 - (1 - k) ** 3;
        const x = dock.x + dock.dx * BOAT_FAR * (1 - ease);
        const y = dock.y + dock.dy * BOAT_FAR * (1 - ease);
        const frame = Math.floor(t * 2) % 2;
        out.standing.push({ kind: 'vboat', x, y, z: Math.sin(t * 1.4) * 1.2, flip: dock.flip, sprite: [`vboat-${frame}`, () => visitorBoat(frame)] });
        if (k < 1) out.rings.push({ x: x - dock.dx * 0.4, y: y - dock.dy * 0.4, k: (t * 1.5) % 1 });
        const c = surface(x, y);
        hits.push({ key: 'vboat', kind: 'vboat', x: c.x, y: c.y - 18, r: 26 });
      }
      // Ronds dans l'eau là où le doigt a touché la mer (1,2 s)
      this.ripples = this.ripples.filter(r => t - r.at < 1.2);
      this.ripples.forEach(r => out.rings.push({ x: r.x, y: r.y, k: (t - r.at) / 1.2 }));
      this.seaHits = hits;
      return out;
    },
    // Passage en cours des dauphins ou de la baleine : où (l'eau libre la plus proche de la caméra au début du
    // passage) et dans quelle direction ; null entre deux passages
    passageOf(name, t, every, length, far, center) {
      const cycle = Math.floor(t / every), τ = t - cycle * every;
      if (τ >= length) return null;
      let p = this.passages[name];
      if (!p || p.cycle !== cycle) {
        const spot = nearestOpen(this.sea.open, center.x, center.y, far);
        if (!spot) return null;
        p = { cycle, spot, dir: spot.dirs[Math.floor(hash(cycle, name.length) * spot.dirs.length)], key: `${name}:${cycle}` };
        this.passages[name] = p;
      }
      return { ...p, τ };
    },
    // Case (fractionnaire) sous un point du monde, au niveau de la mer
    cellAt(wx, wy) {
      const a = (2 * (wy + SEA_Z * HS)) / TH, b = (2 * wx) / TW;
      return { x: (a + b) / 2, y: (a - b) / 2 };
    },
    // Où flotte Brume (point au sol) : à côté du bâtiment ou du panneau du quartier que vise la quête active, sinon près
    // du Foyer
    brumeSpot() {
      const target = this.quest && this.quest.target;
      const zone = target && target.zone && this.state.map.zones.find(z => z.id === target.zone);
      if (zone && zone.anchor) {
        const g = this.ground(zone.anchor.x, zone.anchor.y);
        return { x: g.x + TW * 0.45, y: g.y - TH * 0.2 };
      }
      const site = this.state.sites.find(s => s.id === ((target && target.site) || 'foyer'));
      if (!site) return null;
      const c = this.centerOf(site);
      return { x: c.x - TW * 0.42 * site.w, y: c.y - TH * 0.15 };
    },
    drawBrume(ctx, t, s) {
      const spot = this.brumeSpot();
      if (!spot) {
        this.brumeHit = null;
        return;
      }
      const { dx, dy } = floatOf(t);
      const x = spot.x + dx, y = spot.y - BRUME_ALT + dy;
      drawBrume(ctx, x, y, spot, t, Boolean(this.quest && this.quest.done), s);
      this.brumeHit = { x, y, r: BRUME_REACH * Math.max(1, 0.6 / s) };
    },
    // La caméra va vers l'objectif de la quête
    showQuestTarget() {
      const spot = this.brumeSpot();
      this.questOpen = false;
      if (!spot) return;
      this.cam.x = spot.x;
      this.cam.y = spot.y;
      this.clampCam();
      this.draw(performance.now());
    },
    // Un toucher sur Brume : réclamer si la récompense attend, sinon mener vers l'objectif ou lancer la Récolte ; sans
    // action possible, sa fiche (l'appui long l'ouvre toujours)
    questAct() {
      const quest = this.quest;
      if (quest && quest.done) this.claimQuest();
      else if (quest && quest.target) {
        this.showQuestTarget();
        this.$emit('show-alert', `Brume : ${quest.label}.`);
      } else if (quest && quest.kind === 'runs' && this.state.charges.count) this.questHarvest();
      else this.questOpen = true;
    },
    // La quête demande une Récolte : la fiche se ferme, la Récolte commence
    questHarvest() {
      this.questOpen = false;
      this.startHarvest();
    },
    // Récompense de la quête active : versée par le serveur ; la fiche reste ouverte sur la quête suivante
    async claimQuest() {
      if (!this.quest || this.busy) return;
      // La dernière quête d'un acte donne aussi un coffre : il s'ouvre juste après les écus
      const chest = this.quest.chest ? `quete:${this.quest.id}` : null;
      let claimed = false;
      this.busy = true;
      try {
        const hit = this.brumeHit;
        const { gained, coins, world } = await playService.worldQuest(this.quest.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (hit) {
          const sp = this.toScreen(hit.x, hit.y);
          const at = this.canvasPoint(sp.x, sp.y);
          ring(at, 90);
          burst(at, 24, 80);
        }
        vibrate([12, 30, 16]);
        this.$emit('show-alert', `Brume : +${gained} écus\u00a0!`);
        claimed = true;
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La récompense n’a pas pu être reçue.'));
      } finally {
        this.busy = false;
      }
      if (claimed && chest) {
        this.questOpen = false;
        this.openChest(chest);
      }
    },
    // Un toucher sur un animal : les dauphins plongent, la baleine souffle, les mouettes posées s'envolent
    scare(animal) {
      if (this.reduced()) return;
      const t = performance.now() / 1000;
      for (const [key, was] of this.scared) if (t - was.at > 2 * GULL_BACK) this.scared.delete(key);
      if (animal.kind === 'pod') this.scared.set(animal.key, { at: t, where: animal.where });
      else if (animal.kind === 'whale') this.scared.set(animal.key, { at: t, ...animal.at });
      else this.scared.set(animal.key, { at: t });
      vibrate(6);
      this.draw(performance.now());
    },
    // Mouettes posées : quelques plages au bord de la mer (côté large), dans les quartiers à soi, libres (ni
    // chantier, ni création, ni arbre ou rocher)
    // Cases de sable libres au bord de la mer, dans les quartiers à soi (mouettes posées, bouteille à la mer)
    beachOf(state, owned, busy) {
      const M = this.M;
      const cells = [];
      for (let y = 0; y < state.size; y++) {
        for (let x = 0; x < state.size; x++) {
          if (M.ground(x, y) !== 's' || busy.has(`${x},${y}`)) continue;
          const zone = state.map.zones[M.zone(x, y)];
          if (!zone || !owned.has(zone.id) || state.sites.some(site => this.covers(site, x, y))) continue;
          if ([[1, 0], [0, 1]].some(([dx, dy]) => M.ground(x + dx, y + dy) === '~')) cells.push({ x, y });
        }
      }
      return cells;
    },
    // Bouteille à la mer qui attend : sur une plage libre (pas sous les mouettes), la même pour une même bouteille
    bottleSpotOf(state) {
      const bottle = state.chests && state.chests.bottle;
      if (!bottle || !bottle.available) return null;
      const owned = new Set(state.map.zones.filter(z => z.owned).map(z => z.id));
      const busy = new Set([...(state.crafts ? state.crafts.placed : []), ...this.props, ...this.perches].map(c => `${c.x},${c.y}`));
      const cells = this.beachOf(state, owned, busy);
      const h = [...bottle.key].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 0);
      return cells.length ? cells[h % cells.length] : null;
    },
    perchesOf(state) {
      const M = this.M;
      const owned = new Set(state.map.zones.filter(z => z.owned).map(z => z.id));
      const busy = new Set([...(state.crafts ? state.crafts.placed : []), ...this.props].map(c => `${c.x},${c.y}`));
      const cells = this.beachOf(state, owned, busy);
      // La colonie de l'Îlot aux Mouettes : trois groupes plus nombreux au bord de l'îlot
      const colony = owned.has(COLONY_ZONE)
        ? this.islets.colony.filter(c => !busy.has(`${c.x},${c.y}`) && [[1, 0], [0, 1], [-1, 0], [0, -1]].some(([dx, dy]) => !M.land(c.x + dx, c.y + dy)))
        : [];
      return [
        ...spread(cells, 5, 3).map((c, k) => ({ id: `${c.x},${c.y}`, x: c.x, y: c.y, count: 1 + (k % 2) })),
        ...spread(colony, 2, 3).map((c, k) => ({ id: `${c.x},${c.y}`, x: c.x, y: c.y, count: 2 + (k % 2) }))
      ];
    },
    // Fumée des cheminées : bouffées qui montent, grossissent, s'effacent et partent avec le vent ; plus dense aux heures
    // des repas (on cuisine), plus courte sous la pluie
    drawSmoke(ctx, t, phase) {
      const meal = Math.max(...[7.5, 12.5, 19.5].map(h => 1 - Math.abs(phase.hour - h) / 1.2), 0);
      const thick = 0.55 + 0.45 * meal;
      const rise = 46 * (1 - phase.weather.rain * 0.35);
      for (const site of this.state.sites) {
        if (!site.level || this.raises.has(site.id)) continue;
        const c = this.centerOf(site);
        lookAt(site.id, site.level).smoke.forEach((at, j) => {
          const [sx, sy] = P(...at);
          for (let i = 0; i < 4; i++) {
            const k = (t * 0.32 + i / 4 + j * 0.13) % 1;
            const x = c.x + sx + k * 16 + this.windAt(t, i + j) * 4 * k;
            const y = c.y + sy - k * rise;
            const tone = phase.night > 0.5 ? '170,175,200' : '236,232,224';
            ctx.fillStyle = `rgba(${tone},${(0.5 * thick * (1 - k)).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(x, y, 3.5 + k * 9, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    },
    // Lumières : fenêtres et feux s'allument une à une quand la scène s'assombrit (soir, nuit, gros temps) ; lucioles
    // la nuit, par temps sec
    drawLights(ctx, t, phase) {
      const lit = phase.lit;
      // Chaque fenêtre a son seuil : les lumières s'allument l'une après l'autre
      const litFor = key => Math.min(1, Math.max(0, (lit - hash(key, 17) * 0.4) / 0.3));
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const site of this.state.sites) {
        if (!site.level || this.raises.has(site.id)) continue;
        const look = lookAt(site.id, site.level);
        const lights = look.lights;
        const c = this.centerOf(site);
        const fire = look.fire;
        lights.forEach(([u, v, z, r], i) => {
          const [lx, ly] = P(u, v, z);
          const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + i) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + i);
          glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(site.x * 7 + site.y + i)) * flicker);
        });
        for (const item of site.shop || []) {
          const light = item.owned && itemLight(item.id, site.level);
          if (!light) continue;
          const [lx, ly] = P(light[0], light[1], light[2]);
          glow(ctx, c.x + lx, c.y + ly, light[3], lit * (0.9 + 0.1 * Math.sin(t * 3 + light[0])), light[4]);
        }
        // Pièce rare portée : lampions, lucioles, lave…
        for (const [x, y, r, color, strength] of rareLights(site.skin, site.level, t)) {
          glow(ctx, c.x + x, c.y + y, r, lit * strength * (0.9 + 0.1 * Math.sin(t * 3 + x)), color);
        }
      }
      // Annexes : lanternes, braises, four et haut fourneau (le feu brûle même de jour)
      for (const annex of this.state.annexes || []) {
        const light = annexLight(annex.annex);
        if (!light) continue;
        const [u, v, z, r, color, fire] = light;
        const c = this.ground(annex.x, annex.y);
        const [lx, ly] = P(u, v, z);
        const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + annex.x) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + annex.y);
        glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(annex.x * 13 + annex.y)) * flicker, color);
      }
      // Lave : elle luit dans la nuit, en palpitant
      for (const c of this.lavaCells || []) {
        glow(ctx, c.x, c.y, 30, (0.08 + 0.92 * lit) * (0.8 + 0.2 * Math.sin(t * 1.7 + c.x * 0.05) * Math.sin(t * 2.9 + c.y * 0.07)), '255,110,40');
      }
      // Lieux remarquables : bouche de la grotte, gravures des menhirs, lanterne des pilotis, lave (elle luit même de jour)
      for (const landmark of this.shownLandmarks) {
        const light = landmarkLight(landmark.id);
        if (!light) continue;
        const [u, v, z, r, color, fire] = light;
        const c = this.ground(landmark.x, landmark.y);
        const k = landmarkScale(landmark.id);
        const [lx, ly] = P(u, v, z);
        const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 9 + landmark.x) * Math.sin(t * 5.3) : 0.9 + 0.1 * Math.sin(t * 1.6 + landmark.y);
        glow(ctx, c.x + lx * k, c.y + ly * k, r * k, (fire ? Math.max(0.35, lit) : lit) * flicker, color);
      }
      // Créations d'île : lanterne, brasero (son feu brûle même de jour), fontaine, kiosque
      for (const craft of this.crafted) {
        const light = craftLight(craft.craft);
        if (!light) continue;
        const [u, v, z, r, color, fire] = light;
        const c = this.ground(craft.x, craft.y);
        const [lx, ly] = P(u, v, z);
        const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + craft.x) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + craft.y);
        glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(craft.x * 11 + craft.y)) * flicker, color);
      }
      // Enseignes à lanternes
      for (const site of this.state.sites) {
        if (!site.sign || site.locked) continue;
        const lights = nameSignLight(site.sign);
        if (!lights.length) continue;
        const at = this.nameSignAt(site);
        for (const [dx, dy, r] of lights) glow(ctx, at.x + dx * NAME_SIGN_SCALE, at.y + dy * NAME_SIGN_SCALE, r * NAME_SIGN_SCALE, Math.max(0.3, lit) * (0.85 + 0.15 * Math.sin(t * 11 + dx) * Math.sin(t * 6.1)));
      }
      // Lanternes des habitants qui rentrent le soir
      for (const l of this.villageLights) {
        const p = this.ground(l.x, l.y);
        glow(ctx, p.x + l.dx, p.y + l.dy, 14, lit * (0.9 + 0.1 * Math.sin(t * 5 + l.x)), '255,214,130');
      }
      // Lanternes du pont de l'Îlot aux Mouettes, lanterne de la barque du passeur
      for (const lamp of this.islets.lamps) {
        const p = lampGlowOf(lamp);
        glow(ctx, p.x, p.y, 16, lit * (0.92 + 0.08 * Math.sin(t * 2 + lamp.x)));
      }
      if (this.ferry) {
        const c = worldOf(this.ferry.x, this.ferry.y, this.ferry.z);
        glow(ctx, c.x + (this.ferry.flip ? 19 : -19), c.y - 18, 16, lit);
      }
      if (phase.night > 0.35 && phase.weather.rain < 0.3) {
        const strength = ((phase.night - 0.35) / 0.65) * (1 - phase.weather.rain / 0.3);
        for (const fly of fireflies(t, this.state.size)) {
          const p = this.ground(fly.x, fly.y);
          glow(ctx, p.x, p.y - fly.z, 9, strength * fly.a, '255,236,140');
          ctx.fillStyle = `rgba(255,250,200,${(strength * fly.a).toFixed(3)})`;
          ctx.fillRect(p.x - 1, p.y - fly.z - 1, 2, 2);
        }
      }
      ctx.restore();
    },
    // Nom du lieu, lisible dès qu'on est assez près
    drawLabel(ctx, site) {
      const c = this.centerOf(site);
      const k = 1 / Math.min(1, this.cam.s);
      ctx.font = `800 ${12 * k}px Nunito, system-ui, sans-serif`;
      const w = ctx.measureText(site.name).width + 14 * k;
      const h = 18 * k;
      const y = c.y + TH * (0.62 + (site.w - 2) * 0.5);
      ctx.fillStyle = site.level ? 'rgba(251, 246, 234, .92)' : 'rgba(74, 52, 38, .82)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(c.x - w / 2, y - h / 2, w, h, h / 2);
      else ctx.rect(c.x - w / 2, y - h / 2, w, h);
      ctx.fill();
      ctx.fillStyle = site.level ? '#4A3426' : '#FBF6EA';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(site.name, c.x, y + 0.5);
      ctx.textBaseline = 'alphabetic';
    },
    // Lieu remarquable, un peu plus grand que sa case (landmarkScale) : il surgit à sa découverte, sautille au toucher ;
    // sous la brume d'un quartier à acheter, à demi effacé
    drawLandmark(ctx, landmark, t, now, repaint) {
      const c = this.ground(landmark.x, landmark.y);
      const key = `landmark:${landmark.id}`;
      const started = this.pops.get(key);
      let scale = landmarkScale(landmark.id);
      if (started) {
        const k = Math.min(1, (now - started) / 600);
        const back = 1.7;
        scale *= 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
        if (k >= 1) this.pops.delete(key);
      }
      const tapped = this.scared.get(key);
      const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 4 : 0;
      const zone = this.zoneAt(landmark.x, landmark.y);
      const mist = this.mistOf(zone, now);
      ctx.save();
      ctx.translate(c.x, c.y - hop);
      ctx.scale(scale, scale);
      if (mist) ctx.globalAlpha = 1 - 0.5 * mist;
      for (const layer of landmarkLayers(landmark.id, this.reduced() ? 0 : t)) drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
      ctx.restore();
    },
    // Gisement de trouvailles, un peu plus grand que sa case : plein (animé) ou ramassé ; prêt dans un quartier à soi,
    // un anneau doré bat au sol sous lui. Il saute au ramassage, sautille au toucher ; sous la brume d'un quartier à
    // acheter, à demi effacé
    drawDeposit(ctx, deposit, t, now, repaint) {
      const ready = !depositWait(deposit, this.clock - this.loadedAt);
      const layer = depositLayer(deposit.find, ready, this.reduced() ? 0 : t);
      if (!layer) return;
      const c = this.ground(deposit.x, deposit.y);
      const zone = this.zoneAt(deposit.x, deposit.y);
      if (ready && zone && zone.owned) {
        const pulse = this.reduced() ? 1 : 0.5 + 0.5 * Math.sin(t * 3 + deposit.x);
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, TW * 0.36, TH * 0.36, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 214, 94, ${(0.16 + 0.14 * pulse).toFixed(3)})`;
        ctx.fill();
        // (un trait sombre sous le trait doré : lisible sur le sable et la neige)
        ctx.strokeStyle = 'rgba(92, 56, 12, .5)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.strokeStyle = `rgba(255, 214, 94, ${(0.6 + 0.35 * pulse).toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      const key = `deposit:${deposit.id}`;
      const started = this.pops.get(key);
      let scale = DEPOSIT_SCALE;
      if (started) {
        const k = Math.min(1, (now - started) / 450);
        const back = 1.7;
        scale *= 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
        if (k >= 1) this.pops.delete(key);
      }
      const tapped = this.scared.get(key);
      const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 4 : 0;
      const mist = this.mistOf(zone, now);
      ctx.save();
      ctx.translate(c.x, c.y - hop);
      ctx.scale(scale, scale);
      if (mist) ctx.globalAlpha = 1 - 0.5 * mist;
      drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
      ctx.restore();
    },
    // Étoile dorée qui bat au-dessus de chaque lieu d'un quartier à soi encore à découvrir (seen : case à l'écran)
    drawBeacons(ctx, t, seen) {
      const still = this.reduced();
      for (const landmark of landmarksWaiting(this.state)) {
        if (!seen(landmark.x, landmark.y)) continue;
        const c = this.ground(landmark.x, landmark.y);
        const y = c.y + landmarkTop(landmark.id) * landmarkScale(landmark.id) * 0.85 + (still ? 0 : Math.sin(t * 2.4) * 3);
        const pulse = still ? 1 : 0.5 + 0.5 * Math.sin(t * 4);
        glow(ctx, c.x, y, 22, 0.55 + 0.35 * pulse, '255,214,94');
        ctx.save();
        ctx.translate(c.x, y);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 ? 4 : 10 + pulse * 1.5;
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fillStyle = '#FFD45E';
        ctx.strokeStyle = 'rgba(92, 56, 12, .85)';
        ctx.lineWidth = 1.6;
        ctx.lineJoin = 'round';
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    },
    // Création d'île posée : elle surgit à la pose, sautille au toucher, s'efface à demi pendant qu'on la déplace
    drawCraft(ctx, craft, t, now, repaint) {
      const c = this.ground(craft.x, craft.y);
      const key = `craft:${craft.x},${craft.y}`;
      const started = this.pops.get(key);
      let scale = 1;
      if (started) {
        const k = Math.min(1, (now - started) / 450);
        const back = 1.7;
        scale = 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
        if (k >= 1) this.pops.delete(key);
      }
      const tapped = this.scared.get(key);
      const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 5 : 0;
      const from = this.craftPlacing && this.craftPlacing.from;
      ctx.save();
      ctx.translate(c.x, c.y - hop);
      if (scale !== 1) ctx.scale(scale, scale);
      if (from && from.x === craft.x && from.y === craft.y) ctx.globalAlpha = 0.45;
      for (const layer of craftLayers(craft.craft, t)) drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
      ctx.restore();
    },

    // Annexe posée sur sa case : elle surgit à la pose, sautille au toucher, s'efface à demi pendant qu'on la déplace
    drawAnnex(ctx, annex, t, now, repaint) {
      const c = this.ground(annex.x, annex.y);
      const key = `annex:${annex.x},${annex.y}`;
      const started = this.pops.get(key);
      let scale = 1;
      if (started) {
        const k = Math.min(1, (now - started) / 450);
        const back = 1.7;
        scale = 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
        if (k >= 1) this.pops.delete(key);
      }
      const tapped = this.scared.get(key);
      const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 5 : 0;
      const from = this.annexPlacing && this.annexPlacing.from;
      ctx.save();
      ctx.translate(c.x, c.y - hop);
      if (scale !== 1) ctx.scale(scale, scale);
      if (from && from.x === annex.x && from.y === annex.y) ctx.globalAlpha = 0.45;
      for (const layer of annexLayers(annex.annex, this.annexVariants.get(`${annex.x},${annex.y}`) || 0, t)) drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
      ctx.restore();
    },

    /* ---------- Gestes : glisser, pincer, toucher ---------- */
    point(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    },
    onDown(event) {
      if (!this.state) return;
      this.hideTip();
      this.$refs.canvas.setPointerCapture(event.pointerId);
      this.pointers.set(event.pointerId, this.point(event));
      clearTimeout(this.holdTimer);
      if (this.pointers.size === 1) {
        this.gesture = { start: this.point(event), moved: 0, at: performance.now() };
        this.holdTimer = setTimeout(() => this.onHold(), HOLD_MS);
      } else this.gesture = { pinch: this.pinchOf(), moved: Infinity };
    },
    // Appui long sans bouger : une autre réaction que le toucher. La fiche de Brume, le menu d'une création, la fiche
    // d'un article posé ; partout ailleurs, une bulle dit ce que c'est et ce que fait un toucher
    onHold() {
      const gesture = this.gesture;
      if (!gesture || !gesture.start || gesture.moved > TAP_SLOP || this.craftPlacing || this.annexPlacing || this.busy) return;
      const hit = this.hitAt(gesture.start.x, gesture.start.y);
      if (hit && hit.brume) this.questOpen = true;
      else if (hit && hit.craft) this.openCraftMenu(hit.craft);
      else if (hit && hit.item) this.describeItem(hit.site, hit.item);
      else if (hit && hit.annex) this.annexSheet = { x: hit.annex.x, y: hit.annex.y };
      else if (hit && hit.landmark) this.openLog(hit.landmark.id);
      else if (hit && hit.nameSign) this.openNameSign(hit.nameSign);
      else if (hit && hit.animal && this.friendOf(hit.animal.who)) this.openVillager(this.friendOf(hit.animal.who).id);
      else if (hit && hit.animal && (hit.animal.kind === 'vboat' || this.guestOf(hit.animal.who))) this.openVisitor();
      else this.showTip(gesture.start.x, gesture.start.y, this.tipOf(hit, gesture.start));
      gesture.held = true;
      vibrate(12);
      this.draw(performance.now());
    },
    pinchOf() {
      const [a, b] = [...this.pointers.values()];
      return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
    },
    onMove(event) {
      if (!this.pointers.has(event.pointerId) || !this.gesture) return;
      const prev = this.pointers.get(event.pointerId);
      const p = this.point(event);
      this.pointers.set(event.pointerId, p);
      if (this.pointers.size >= 2 && this.gesture.pinch) {
        const next = this.pinchOf();
        const last = this.gesture.pinch;
        if (last.d > 0) this.zoomAt(next.mx, next.my, next.d / last.d);
        this.cam.x -= (next.mx - last.mx) / this.cam.s;
        this.cam.y -= (next.my - last.my) / this.cam.s;
        this.clampCam();
        this.gesture.pinch = next;
        this.draw(performance.now());
        return;
      }
      this.gesture.moved = Math.max(this.gesture.moved, Math.hypot(p.x - this.gesture.start.x, p.y - this.gesture.start.y));
      if (this.gesture.moved > TAP_SLOP) {
        clearTimeout(this.holdTimer);
        this.dropPick();
        this.craftMenu = null;
        this.annexConfirm = null;
        this.cam.x -= (p.x - prev.x) / this.cam.s;
        this.cam.y -= (p.y - prev.y) / this.cam.s;
        this.clampCam();
        this.draw(performance.now());
      }
    },
    onCancel(event) {
      clearTimeout(this.holdTimer);
      this.pointers.delete(event.pointerId);
      if (!this.pointers.size) this.gesture = null;
    },
    onUp(event) {
      clearTimeout(this.holdTimer);
      const gesture = this.gesture;
      const p = this.point(event);
      this.pointers.delete(event.pointerId);
      if (this.pointers.size) {
        // Un doigt reste après un pincement : on reprend un glissement sans toucher
        const [rest] = [...this.pointers.values()];
        this.gesture = { start: rest, moved: Infinity };
        return;
      }
      this.gesture = null;
      if (!gesture || gesture.held || gesture.moved > TAP_SLOP || this.busy) return;
      this.tap(p.x, p.y);
    },
    onWheel(event) {
      if (!this.geo) return;
      const p = this.point(event);
      this.zoomAt(p.x, p.y, event.deltaY < 0 ? 1.12 : 0.89);
    },
    // Ce qui est sous le doigt : bulle de production, panneau de quartier, bâtiment, création, annexe, puis case
    hitAt(px, py) {
      const w = this.toWorld(px, py);
      if (this.brumeHit && Math.hypot(w.x - this.brumeHit.x, w.y - this.brumeHit.y) < this.brumeHit.r) return { brume: true };
      const asking = this.needBubbles.find(b => Math.hypot(w.x - b.x, w.y - b.y) < b.r + 2);
      if (asking) return { asking };
      const bubble = this.bubbles.find(b => Math.abs(w.x - b.x) < b.w / 2 + 6 && Math.abs(w.y - b.y) < b.h / 2 + 8);
      if (bubble) return { bubble };
      // Animaux de la mer et mouettes posées : un toucher les fait réagir
      const animal = [...this.seaHits, ...this.landHits].find(h => Math.hypot(w.x - h.x, w.y - h.y) < h.r);
      if (animal) return animal.bottle ? { bottle: true } : { animal };
      // Enseignes des bâtiments
      const nameSign = this.nameSignHits.find(h => Math.hypot(w.x - h.x, (w.y - h.y) * 0.9) < h.r);
      if (nameSign) return { nameSign: nameSign.site, at: nameSign };
      // Articles posés près des bâtiments (le plus proche du doigt)
      const items = this.itemHits.filter(h => Math.hypot(w.x - h.x, w.y - h.y) < h.r);
      if (items.length) {
        const near = items.reduce((a, b) => (Math.hypot(w.x - a.x, w.y - a.y) <= Math.hypot(w.x - b.x, w.y - b.y) ? a : b));
        return { item: near.item, site: near.site, at: near };
      }
      // Panneau d'un quartier : seulement le panneau lui-même, après ce qui vit et ce qui est posé
      const sign = this.signs.find(sg => Math.hypot(w.x - sg.x, (w.y - sg.y) * 1.2) < sg.r);
      if (sign) return { zone: sign.zone, at: sign };
      // Zones de toucher généreuses : tout le volume dessiné du bâtiment, pas seulement sa base
      const candidates = [
        ...this.state.sites.map(site => ({ site, depth: site.x + site.y + site.w, c: this.centerOf(site), r: TW * 0.49 * site.w, h: TW * 0.875 * site.w, below: TH * 0.525 * site.w })),
        ...this.crafted.map(craft => ({ craft, depth: craft.x + craft.y, c: this.ground(craft.x, craft.y), r: TW * 0.42, h: TW * 1.1 })),
        ...(this.state.annexes || []).map(annex => ({ annex, depth: annex.x + annex.y, c: this.ground(annex.x, annex.y), r: TW * 0.44, h: TW * 1.1 })),
        ...this.shownDeposits.map(deposit => ({ deposit, depth: deposit.x + deposit.y, c: this.ground(deposit.x, deposit.y), r: TW * 0.42 * DEPOSIT_SCALE, h: TW * 0.85 * DEPOSIT_SCALE })),
        ...this.shownLandmarks.map(landmark => ({
          landmark, depth: landmark.x + landmark.y, c: this.ground(landmark.x, landmark.y), r: TW * 0.56 * landmarkScale(landmark.id), h: -landmarkTop(landmark.id) * landmarkScale(landmark.id) + 14
        }))
      ].sort((p, q) => q.depth - p.depth);
      const hit = candidates.find(o => Math.abs(w.x - o.c.x) < o.r && w.y > o.c.y - o.h && w.y < o.c.y + (o.site ? o.below : TH * 0.3));
      if (hit) return hit;
      const tile = this.tileAt(px, py);
      if (!tile || !this.landAt(tile.x, tile.y)) return null;
      const site = this.state.sites.find(s => this.covers(s, tile.x, tile.y));
      if (site) return { site };
      return this.lockedAt(tile.x, tile.y) ? { zone: this.zoneAt(tile.x, tile.y) } : { cell: tile };
    },
    tap(px, py) {
      // Pose ou déplacement d'une annexe ou d'une création : seule compte la case, dorée ou non
      if (this.annexPlacing) {
        this.tapAnnexSpot(px, py);
        return;
      }
      if (this.craftPlacing) {
        this.tapCraftSpot(px, py);
        return;
      }
      const hit = this.hitAt(px, py);
      this.craftMenu = null;
      // Toucher en deux temps : ce qui ouvre une fiche ou agit sur le serveur se choisit d'abord (contour doré, bulle et
      // bouton) ; un second toucher dessus, ou le bouton, l'ouvre. Ce qui ne fait que réagir réagit tout de suite.
      const pick = hit ? this.pickOf(hit, px, py) : null;
      if (pick && this.picked && this.picked.key === pick.key) {
        this.runPick();
        return;
      }
      this.dropPick();
      if (!hit) {
        // La mer : des ronds dans l'eau là où le doigt touche (en mouvement réduit, la bulle d'info)
        if (this.reduced()) this.showTip(px, py, this.tipOf(null, { x: px, y: py }));
        else {
          const w = this.toWorld(px, py);
          this.ripples.push({ ...this.cellAt(w.x, w.y), at: performance.now() / 1000 });
          vibrate(4);
        }
        this.draw(performance.now());
        return;
      }
      if (pick) {
        // Le visiteur sursaute quand même : on l'a touché
        if (hit.animal && hit.animal.who) this.scare(hit.animal);
        this.choose(pick, px, py);
      } else if (hit.bubble) {
        const sp = this.toScreen(hit.bubble.x, hit.bubble.y);
        this.collect(this.canvasPoint(sp.x, sp.y));
        vibrate(8);
      } else if (hit.brume) {
        this.questAct();
        vibrate(6);
      } else if (hit.animal) {
        // Un habitant parle, une bête de la ferme répond ; les bêtes sauvages s'enfuient
        const said = this.named(this.village && hit.animal.who ? this.village.say(hit.animal.who, this.phase || this.skyAt(this.skyDate())) : null, hit.animal.who, true);
        if (said) this.showTip(px, py, said);
        if (this.reduced()) {
          if (!said) this.showTip(px, py, this.tipOf(hit, { x: px, y: py }));
        } else this.scare(hit.animal);
        return;
      } else if (hit.deposit) {
        // Un gisement qui n'est pas prêt sautille et dit quand il repousse
        this.scared.set(`deposit:${hit.deposit.id}`, { at: performance.now() / 1000 });
        this.showTip(px, py, this.tipOf(hit));
        vibrate(6);
      } else {
        // Une case libre : elle dit ce qu'on peut y faire
        this.showTip(px, py, this.tipOf(hit, { x: px, y: py }));
      }
      this.draw(performance.now());
    },
    // Ce que choisit un premier toucher : { key, action (texte du bouton), info (bulle), ring (contour), bounce, run } ;
    // null pour ce qui ne fait que réagir (bêtes, habitants, mer, Brume, bulles de production, case libre)
    pickOf(hit, px, py) {
      const ring = (x, y, r) => ({ x, y, rx: r, ry: r * 0.55 });
      if (hit.asking) {
        const { asking } = hit;
        return {
          key: `ask:${asking.visitor ? 'visitor' : asking.id}`, action: 'Sa fiche', info: this.tipOf(hit), ring: ring(asking.x, asking.y, asking.r + 3),
          run: () => (asking.visitor ? this.openVisitor() : this.openVillager(asking.id))
        };
      }
      if (hit.animal && (hit.animal.kind === 'vboat' || this.guestOf(hit.animal.who))) {
        const guest = this.state.visitor;
        return { key: 'visitor', action: 'Sa fiche', info: { title: `${guest.name} · ${guest.role}`, text: askLine(guest) }, ring: ring(hit.animal.x, hit.animal.y, hit.animal.r), run: () => this.openVisitor() };
      }
      if (hit.bottle) {
        const c = this.ground(this.bottleSpot.x + 0.5, this.bottleSpot.y + 0.5);
        return { key: 'bottle', action: 'L’ouvrir', info: this.tipOf(hit), ring: ring(c.x, c.y, 14), run: () => this.openChest('bouteille') };
      }
      if (hit.item) {
        const { item, site } = hit;
        return {
          key: `item:${site.id}:${item.id}`, action: 'Sa fiche', info: { title: item.name, text: item.effect }, ring: ring(hit.at.x, hit.at.y, hit.at.r),
          bounce: `item:${site.id}:${item.id}`, run: () => this.describeItem(site, item)
        };
      }
      if (hit.nameSign) {
        const site = hit.nameSign;
        return { key: `name-sign:${site.id}`, action: 'La changer', info: this.tipOf(hit), ring: ring(hit.at.x, hit.at.y, hit.at.r), bounce: `name-sign:${site.id}`, run: () => this.openNameSign(site) };
      }
      if (hit.annex) {
        const { annex } = hit;
        const c = this.ground(annex.x, annex.y);
        return { key: `annex:${annex.x},${annex.y}`, action: 'Sa fiche', info: this.annexTip(annex), ring: ring(c.x, c.y, TW * 0.4), bounce: `annex:${annex.x},${annex.y}`, run: () => { this.annexSheet = { x: annex.x, y: annex.y }; } };
      }
      if (hit.craft) {
        const { craft } = hit;
        const c = this.ground(craft.x, craft.y);
        return { key: `craft:${craft.x},${craft.y}`, action: 'La déplacer ou la ranger', info: this.tipOf(hit), ring: ring(c.x, c.y, TW * 0.4), bounce: `craft:${craft.x},${craft.y}`, run: () => this.openCraftMenu(craft) };
      }
      if (hit.landmark) {
        const { landmark } = hit;
        const zone = this.state.map.zones.find(z => z.id === landmark.zone);
        const c = this.ground(landmark.x, landmark.y);
        const toFind = !landmark.found && zone && zone.owned;
        return {
          key: `landmark:${landmark.id}`, action: toFind ? 'Le découvrir' : landmark.found ? 'Sa page du Carnet' : 'Le Carnet', info: this.tipOf(hit),
          ring: ring(c.x, c.y, TW * 0.5 * landmarkScale(landmark.id)), bounce: `landmark:${landmark.id}`,
          run: () => (toFind ? this.findLandmark(landmark, px, py) : this.openLog(landmark.id))
        };
      }
      if (hit.deposit) {
        const { deposit } = hit;
        const zone = this.state.map.zones.find(z => z.id === deposit.zone);
        if (!zone || !zone.owned || depositWait(deposit, this.clock - this.loadedAt)) return null;
        const c = this.ground(deposit.x, deposit.y);
        return { key: `deposit:${deposit.id}`, action: 'Ramasser', info: this.tipOf(hit), ring: ring(c.x, c.y, TW * 0.4 * DEPOSIT_SCALE), bounce: `deposit:${deposit.id}`, run: () => this.gatherDeposit(deposit, px, py) };
      }
      const zoneOf = zone => {
        const w = hit.at || this.toWorld(px, py);
        return { key: `zone:${zone.id}`, action: zone.known === false ? 'Préparer l’expédition' : 'Voir le quartier', info: this.tipOf({ zone }), ring: hit.at ? ring(w.x, w.y, w.r) : null, run: () => { this.zone = zone; } };
      };
      if (hit.zone) return zoneOf(hit.zone);
      if (hit.site) {
        const { site } = hit;
        if (site.locked) return zoneOf(this.zoneAt(site.x, site.y));
        const c = this.centerOf(site);
        return {
          key: `site:${site.id}`, action: site.level ? 'Sa fiche' : 'Bâtir', info: this.tipOf(hit), diamond: { x: c.x, y: c.y, w: TW * site.w, h: TH * site.h },
          run: () => { this.site = site; this.siteTab = site.level ? 'overview' : 'evolution'; }
        };
      }
      return null;
    },
    // Premier toucher : la chose est choisie (contour doré, bulle avec son bouton), elle sautille
    choose(pick, px, py) {
      if (pick.bounce) this.scared.set(pick.bounce, { at: performance.now() / 1000 });
      this.picked = pick;
      this.showTip(px, py, { ...pick.info, hint: null, action: pick.action }, PICK_MS);
      vibrate(6);
    },
    // Second toucher, ou le bouton de la bulle : ce qui est choisi s'ouvre
    runPick() {
      const pick = this.picked;
      this.dropPick();
      if (!pick || this.busy) return;
      vibrate(8);
      pick.run();
    },
    // Le choix s'oublie (toucher ailleurs, la vue bouge) ; sa bulle s'en va avec lui
    dropPick() {
      if (!this.picked) return;
      this.picked = null;
      if (this.tip && this.tip.action) this.hideTip();
    },
    // Contour doré de ce qui est choisi : un trait sombre sous un trait doré, qui bat
    drawPick(ctx, t) {
      const pick = this.picked;
      if (!pick || (!pick.ring && !pick.diamond)) return;
      const k = 1 / Math.min(1, this.cam.s);
      const beat = 0.65 + 0.35 * Math.sin(t * 6);
      ctx.save();
      const path = () => {
        if (pick.diamond) this.diamond(ctx, pick.diamond.x, pick.diamond.y, pick.diamond.w, pick.diamond.h);
        else {
          ctx.beginPath();
          ctx.ellipse(pick.ring.x, pick.ring.y, pick.ring.rx, pick.ring.ry, 0, 0, Math.PI * 2);
        }
      };
      path();
      ctx.lineWidth = 4.2 * k;
      ctx.strokeStyle = 'rgba(58, 42, 30, .55)';
      ctx.stroke();
      path();
      ctx.lineWidth = 2.2 * k;
      ctx.strokeStyle = `rgba(242, 192, 75, ${beat.toFixed(3)})`;
      ctx.stroke();
      ctx.restore();
    },
    // Bulle d'info au-dessus du doigt (en dessous près du haut), qui s'efface seule
    showTip(px, py, info, ms = TIP_MS) {
      if (!info || !this.geo) return;
      clearTimeout(this.tipTimer);
      const below = py < 110;
      this.tip = { ...info, x: Math.max(96, Math.min(this.geo.width - 96, px)), y: below ? py + 18 : py - 16, below };
      this.tipTimer = setTimeout(() => {
        this.tip = null;
        this.picked = null;
      }, ms);
    },
    hideTip() {
      if (!this.tip) return;
      clearTimeout(this.tipTimer);
      this.tip = null;
    },
    // Ce que dit la bulle pour ce qui est sous le doigt (null : la mer)
    tipOf(hit, point) {
      if (!hit) return { title: 'La mer', text: 'Dauphins, baleine et méduses passent au large.', hint: 'Toucher : des ronds dans l’eau' };
      if (hit.bottle) return { title: 'Bouteille à la mer', text: 'Un mot signé « H. », et un coffre.', hint: 'Toucher deux fois : l’ouvrir' };
      if (hit.nameSign) {
        const look = this.state.signs.styles.find(st => st.id === hit.nameSign.sign);
        return { title: this.state.signs.name, text: `${look ? look.name : 'Enseigne'} · ${hit.nameSign.name}`, hint: 'Appui long : la changer' };
      }
      if (hit.animal) {
        if (hit.animal.who && this.village) return this.named(this.village.describe(hit.animal.who), hit.animal.who);
        const [title, text] = ANIMALS[hit.animal.kind] || ['Une bête', ''];
        return { title, text, hint: 'Toucher : la faire réagir' };
      }
      if (hit.asking && hit.asking.visitor) return { title: this.state.visitor.name, text: askLine(this.state.visitor), hint: 'Toucher deux fois : sa fiche' };
      if (hit.asking) {
        const friend = this.friendAt(hit.asking.id);
        return { title: friend ? friend.name : 'Un habitant', text: ASKS[hit.asking.need], hint: 'Toucher deux fois : sa fiche' };
      }
      if (hit.bubble) {
        const made = Object.entries(hit.bubble.site ? hit.bubble.site.pending || {} : {}).filter(([, n]) => n > 0).map(([k, n]) => `${Math.floor(n)} ${k === 'coins' ? 'écus' : LABEL[k] || k}`);
        return { title: 'Production prête', text: made.join(', ') || 'Ressources et écus à encaisser.', hint: 'Toucher : tout ramasser' };
      }
      if (hit.zone) {
        const zone = hit.zone;
        if (zone.known === false) return { title: 'Terre inconnue', text: 'Une expédition révélera ce qu’elle cache.', hint: 'Toucher deux fois : préparer l’expédition' };
        return { title: zone.name, text: zone.owned ? 'Quartier à toi.' : zone.open ? `Quartier à acheter : ${zone.price} écus.` : `S’ouvre avec le chapitre ${zone.chapter} du Grimoire.`, hint: 'Toucher deux fois : voir le quartier' };
      }
      if (hit.site) {
        const site = hit.site;
        if (site.locked) return { title: site.name, text: 'Dans un quartier encore fermé.', hint: 'Toucher deux fois : voir le quartier' };
        if (!site.level) return { title: `${site.name} · à bâtir`, text: site.next && site.next.effect ? site.next.effect : '', hint: 'Toucher deux fois : ce qu’il faut pour bâtir' };
        const per = site.perHour;
        const text = per ? `Palier ${roman(site.level)} · ${per.amount} ${LABEL[site.produce] || ''} et ${per.coins} écus par heure` : `Palier ${roman(site.level)}${site.effect ? ` · ${site.effect}` : ''}`;
        return { title: site.name, text, hint: 'Toucher deux fois : sa fiche et sa boutique' };
      }
      if (hit.craft) return { title: this.craftName(hit.craft.craft), text: 'Une création d’île, assemblée à l’établi.', hint: 'Appui long : la déplacer ou la ranger' };
      if (hit.deposit) {
        const deposit = hit.deposit;
        const [name, verb] = DEPOSIT_NAMES[deposit.find];
        const zone = this.state.map.zones.find(z => z.id === deposit.zone);
        const wait = depositWait(deposit, this.clock - this.loadedAt);
        if (!zone || !zone.owned) return { title: name, text: `Achète ${zone ? zone.name : 'ce quartier'} pour ${verb}.`, hint: 'Le sac, en haut à gauche : tes trouvailles' };
        if (wait) return { title: name, text: `Repousse dans ${waitText(wait)}.`, hint: 'Le sac, en haut à gauche : tes trouvailles' };
        return { title: name, text: `Prêt : touche pour ${verb}${deposit.bonus ? ` (+${deposit.bonus} grâce aux créations de climat)` : ''}.`, hint: 'Toucher deux fois : ramasser' };
      }
      if (hit.landmark) {
        const landmark = hit.landmark;
        const zone = this.state.map.zones.find(z => z.id === landmark.zone);
        if (landmark.found) return { title: landmark.name, text: landmark.effect, hint: 'Appui long : sa page du Carnet' };
        if (zone && zone.owned) return { title: landmark.name, text: 'Un lieu remarquable à découvrir.', hint: 'Toucher deux fois : le découvrir' };
        return { title: landmark.name, text: `Achète ${zone ? zone.name : 'ce quartier'} pour découvrir ce lieu.`, hint: 'Appui long : le Carnet d’explorateur' };
      }
      // Case de l'île : son décor naturel, ou de l'herbe libre
      const cell = hit.cell || this.tileAt(point.x, point.y);
      const prop = cell && this.props.find(p => p.x === cell.x && p.y === cell.y);
      return prop
        ? { title: NATURE_NAMES[prop.kind] || 'Décor', text: 'Une création posée ici le remplace.', hint: 'Les créations s’assemblent à l’établi du Foyer' }
        : { title: 'Case libre', text: 'De la place pour une création d’île.', hint: 'Les créations s’assemblent à l’établi du Foyer' };
    },
    // Point de l'écran (page) d'un point du canvas
    canvasPoint(x, y) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      return { x: rect.left + x, y: rect.top + y };
    },
    // Vignette d'un bâtiment (son dessin actuel) pour sa fiche
    artOf(site) {
      if (!site.level) return spriteUrl(`chantier-${this.stageOf(site)}`, BUILDINGS.chantier[this.stageOf(site)]);
      return spriteUrl(`art-${site.id}-${site.level}-${site.skin || ''}`, artMake(site.id, site.level, site.skin));
    },
    /* ---------- Boutique d'un atelier ---------- */
    roman,
    // Rubriques de la boutique ; dans chacune, les articles du premier palier au dernier
    shopGroups(site) {
      const byPalier = (a, b) => a.minLevel - b.minLevel || a.price - b.price;
      return SHOP_GROUPS.map(([kind, label]) => ({ kind, label, items: site.shop.filter(item => groupOf(item) === kind).sort(byPalier) })).filter(group => group.items.length);
    },
    // Niveau auquel montrer un article ou un skin : celui du bâtiment, ou celui qu'il demande (le toit du Foyer se voit dès l’Abri)
    previewLevel(site, item) {
      const level = Math.max(site.level, item.minLevel, 1);
      return site.id === 'foyer' && groupOf(item) === 'skin' ? Math.max(level, 2) : level;
    },
    itemArt(site, item) {
      const level = this.previewLevel(site, item);
      if (item.kind === 'skin') return spriteUrl(`art-${site.id}-${level}-${item.id}`, artMake(site.id, level, item.id));
      return spriteUrl(`thumb-${item.id}-${level}`, () => itemThumb(item.id, level));
    },
    itemNote(site, item) {
      if (groupOf(item) === 'skin' && site.id === 'foyer' && site.level < 2) return 'Se voit dès l’Abri.';
      return item.effect;
    },
    // Raison pour laquelle un article ne s'achète pas encore (texte du bouton), ou ''
    lockOf(site, item) {
      if (item.rare) return 'Dans les butins';
      if (!site.level) return 'Bâtis d’abord';
      if (site.level < item.minLevel) return `Palier ${roman(item.minLevel)}`;
      if (this.coins !== null && this.coins < item.price) return `Il manque ${item.price - this.coins}`;
      return '';
    },
    canBuy(site, item) {
      return !item.owned && !this.lockOf(site, item);
    },
    buyLabel(site, item) {
      const lock = this.lockOf(site, item);
      if (lock) return `${item.name} : ${lock} (toucher : sa fiche)`;
      return `Acheter ${item.name} pour ${item.price} écus (appui long : sa fiche)`;
    },
    perHourOf(site) {
      return site.perHour || { amount: this.state.rates.produce * site.level, coins: this.state.rates.coins * site.level };
    },
    num(n) {
      return Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    },
    zoneName(id) {
      return this.state.map.zones.find(z => z.id === id)?.name || '';
    },
    sitesIn(zone) {
      return this.state.sites.filter(s => s.zone === zone.id).map(s => s.name);
    },
    // Palier i (0 = premier niveau) d'un bâtiment : atteint, prochain ou à venir
    stepState(site, i) {
      if (i < site.level) return 'done';
      return i === site.level ? 'next' : 'later';
    },
    screenRectOf(x, y) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const c = this.ground(x, y);
      const sp = this.toScreen(c.x, c.y);
      return { left: rect.left + sp.x - 30, top: rect.top + sp.y - 40, width: 60, height: 60 };
    },

    /* ---------- Actions ---------- */
    async build(site) {
      this.busy = true;
      try {
        const { built, coins, world } = await playService.worldBuild(site.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.site = null;
        this.$nextTick(() => {
          const at = center(this.screenRectOf(site.x + (site.w - 1) / 2, site.y + (site.h - 1) / 2));
          ring(at, 120);
          burst(at, 26, 90);
          vibrate([14, 40, 20]);
        });
        this.$emit('show-alert', `Nouveau sur ton île : ${built}\u00a0!`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le chantier n’a pas pu être bâti.'));
      } finally {
        this.busy = false;
      }
    },
    async startHarvest() {
      this.busy = true;
      try {
        this.site = null;
        this.runResult = null;
        this.runError = '';
        this.runChest = null;
        this.run = await playService.harvestStart();
        this.syncLoop();
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La Récolte n’a pas pu commencer.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    async finishHarvest(moves) {
      this.sending = true;
      try {
        const { gains, coins, chest, world } = await playService.harvestFinish(this.run.id, moves);
        this.runResult = gains;
        this.runChest = chest || null;
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate([12, 40, 18]);
      } catch (error) {
        this.runError = messageOf(error, 'Le serveur n’a pas pu peser ta récolte.');
        this.load();
      } finally {
        this.sending = false;
      }
    },
    // Habitants : celui qu'on touche (who : { kind: 'villager', id: 'vil:<bâtiment>' }) dans la vue du serveur
    friendOf(who) {
      if (!who || who.kind !== 'villager' || !this.state) return null;
      return (this.state.villagers || []).find(v => `vil:${v.id}` === who.id) || null;
    },
    awaits,
    missingOf,
    // Le visiteur qu'on touche (who : { kind: 'villager', id: 'vis:<id>' }), ou null
    guestOf(who) {
      const v = this.state && this.state.visitor;
      return v && who && who.id === `vis:${v.id}` ? v : null;
    },
    // Case de mer où s'amarre le bateau du visiteur : la plus proche du Ponton, et d'où il arrive (vers le large)
    dockOf(state, M) {
      const site = state.sites.find(s => s.id === 'ponton');
      if (!site) return null;
      const cx = site.x + site.w / 2;
      const cy = site.y + site.h / 2;
      let best = null;
      for (let y = site.y - 3; y < site.y + site.h + 3; y++) {
        for (let x = site.x - 3; x < site.x + site.w + 3; x++) {
          if (M.ground(x, y) !== '~') continue;
          const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) - (x + y) * 0.01;
          if (!best || d < best.d) best = { x: x + 0.5, y: y + 0.5, d };
        }
      }
      if (!best) return null;
      const len = Math.hypot(best.x - cx, best.y - cy) || 1;
      const dx = (best.x - cx) / len;
      const dy = (best.y - cy) / len;
      return { x: best.x, y: best.y, dx, dy, flip: dx - dy > 0 };
    },
    visitorPortrait(v) {
      return spriteUrl(`portrait-vis-${v.seed}`, () => villagerSprite(visitorLook(v.seed, v.role)));
    },
    openVisitor() {
      if (!this.state || !this.state.visitor) return;
      this.site = null;
      this.villagerId = null;
      this.visitorSaid = '';
      this.visitorOpen = true;
    },
    // Combler la demande du visiteur : le serveur vérifie, prend les ressources et verse les écus
    async satisfyVisitor() {
      const guest = this.state && this.state.visitor;
      if (this.busy || !guest) return;
      this.busy = true;
      try {
        const { reward, coins, world } = await playService.visitorSatisfy(guest.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.visitorSaid = VISITOR_THANKS;
        vibrate([12, 40, 18]);
        this.$emit('show-alert', `${guest.name} te remercie : +${reward} écus !`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le visiteur n’a pas pu être comblé.'));
      } finally {
        this.busy = false;
      }
    },
    // Un visiteur comblé reste dans une maison libre : il devient habitant
    async settleVisitor() {
      const guest = this.state && this.state.visitor;
      if (this.busy || !guest) return;
      this.busy = true;
      try {
        const { settled, world } = await playService.visitorSettle(guest.id);
        this.apply(world);
        this.visitorOpen = false;
        vibrate([12, 40, 18]);
        this.$emit('show-alert', `${settled} s’installe sur ton île : bienvenue !`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le visiteur n’a pas pu s’installer.'));
      } finally {
        this.busy = false;
      }
    },
    // Demande de Récoltes : on ferme sa fiche et on lance une partie
    visitorHarvest() {
      this.visitorOpen = false;
      this.startHarvest();
    },
    // Habitant d'un bâtiment (vue du serveur), ou null
    friendAt(siteId) {
      return (this.state.villagers || []).find(v => v.id === siteId) || null;
    },
    friendLabel(v) {
      const missing = missingOf(v).map(n => this.state.needs?.kinds?.[n.id]?.label || n.id);
      return `${v.name}, ${v.role} : ${v.hearts} cœur${v.hearts > 1 ? 's' : ''}, ${MOOD_LABEL[v.mood] || ''}${missing.length ? `, besoin : ${missing.join(', ')}` : ''}`;
    },
    // Bulle d'un habitant : son prénom et son métier ; l'appui long ouvre sa fiche. ask : quand on lui parle, il dit
    // d'abord ce qui lui manque
    named(info, who, ask = false) {
      const friend = this.friendOf(who);
      if (!info || !friend) return info;
      return { ...info, title: `${friend.name} · ${friend.role}`, text: ask ? askOr(friend, info.text) : info.text, hint: 'Appui long : sa fiche' };
    },
    // Nom d'un bâtiment de l'île (celui que le joueur lui a donné)
    siteName(id) {
      const site = this.state && this.state.sites.find(s => s.id === id);
      return site ? site.name : '';
    },
    // Portrait d'un habitant : son allure sur l'île (teint, cheveux), de face ; un visiteur installé, d'après sa graine
    portraitOf(id) {
      const settler = (this.state.villagers || []).find(v => v.id === id && v.seed !== undefined);
      if (settler) return this.visitorPortrait(settler);
      const resident = this.village && this.village.residents.find(r => r.role === id);
      const look = resident ? resident.look : { ...ROLES[id], skin: '#F6D3B3', hair: '#7A4E2C' };
      return spriteUrl(`portrait-${id}-${look.skin}-${look.hair}`, () => villagerSprite(look));
    },
    openVillager(id) {
      this.site = null;
      this.villagerId = id;
      this.villagerSaid = '';
      this.villagerPopped = 0;
    },
    async talkVillager() {
      await this.befriend(() => playService.villagerTalk(this.villagerId), (v, hearts) => talkLine(v.id, hearts));
    },
    async giftVillager(resource) {
      await this.befriend(() => playService.villagerGift(this.villagerId, resource), v => giftLine(v.id, v, resource));
    },
    // Bavarder ou offrir : le serveur compte les points ; la réplique s'affiche, un cœur gagné pulse et sa récompense
    // arrive (écus annoncés, coffre ouvert par-dessus la fiche)
    async befriend(call, lineOf) {
      if (this.busy) return;
      const friend = this.villagerView;
      this.busy = true;
      try {
        const { hearts, rewards, coins, world } = await call();
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.villagerSaid = lineOf(friend, hearts);
        this.villagerPopped = hearts > friend.hearts ? hearts : 0;
        vibrate(hearts > friend.hearts ? [12, 40, 18] : 8);
        const gained = rewards.filter(r => r.kind === 'coins').reduce((sum, r) => sum + r.amount, 0);
        if (gained) this.$emit('show-alert', `${friend.name} t’offre ${gained} écus pour votre amitié !`);
        const chests = rewards.filter(r => r.chest).map(r => r.chest);
        if (chests.length === 1) this.showChest(chests[0]);
        else if (chests.length > 1) this.haul = chests;
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’habitant n’a pas pu répondre.'));
      } finally {
        this.busy = false;
      }
    },
    // Combler un besoin depuis la fiche (le serveur prend les ressources du stock) : l'habitant remercie
    async fillNeed(need) {
      if (this.busy || !this.villagerView) return;
      this.busy = true;
      try {
        const { world } = await playService.villagerNeed(this.villagerView.id, need);
        this.apply(world);
        this.villagerSaid = THANKS[need] || '';
        vibrate(10);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Ce besoin n’a pas pu être comblé.'));
      } finally {
        this.busy = false;
      }
    },
    // « Tout combler » (fiche du Foyer) : tout ce qui peut l'être, tant que le stock suffit
    async fillAllNeeds() {
      if (this.busy) return;
      this.busy = true;
      try {
        const { filled, world } = await playService.villagersNeeds();
        this.apply(world);
        vibrate([10, 30, 10]);
        const n = filled.length;
        this.$emit('show-alert', `${n} besoin${n > 1 ? 's' : ''} comblé${n > 1 ? 's' : ''} : tes habitants te remercient !`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Les besoins n’ont pas pu être comblés.'));
      } finally {
        this.busy = false;
      }
    },
    // Renommer : un bâtiment dès son palier III (avant, on dit quand), un quartier à soi
    startRename(kind, id) {
      if (kind === 'site') {
        const site = this.state.sites.find(s => s.id === id);
        if (site.level < site.renameLevel) {
          this.$emit('show-alert', `${site.name} se renommera au palier ${roman(site.renameLevel)}.`);
          return;
        }
      }
      this.renaming = { kind, id };
    },
    // Nouveau nom (vide : celui d'origine), gardé par le serveur ; l'île et ses étiquettes suivent
    async saveName(name) {
      const { kind, id } = this.renaming;
      this.busy = true;
      try {
        this.apply(await playService.worldName(kind, id, name));
        this.renaming = null;
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le nom n’a pas pu changer.'));
      } finally {
        this.busy = false;
      }
    },
    // Mini-jeux : la fiche du bâtiment se ferme, la fenêtre du jeu s'ouvre sur sa règle
    gameOf(site) {
      return (this.state.games || []).find(g => g.site === site.id) || null;
    },
    openGame(id) {
      this.site = null;
      this.gameId = id;
      this.gameRun = null;
      this.gameResult = null;
      this.gameError = '';
      this.syncLoop();
    },
    // Une partie : prise sur la réserve par le serveur, qui donne la graine (Rejouer : une nouvelle)
    async startGame() {
      if (this.gameStarting) return;
      this.gameStarting = true;
      this.gameError = '';
      try {
        const { run, world } = await playService.gameStart(this.gameId);
        this.gameResult = null;
        this.apply(world);
        this.gameRun = run;
      } catch (error) {
        this.gameError = messageOf(error, 'La partie n’a pas pu commencer.');
        this.gameRun = null;
        this.load();
      } finally {
        this.gameStarting = false;
      }
    },
    async finishGame(input) {
      this.gameSending = true;
      try {
        const { earned, raw, detail, coins, world } = await playService.gameFinish(this.gameRun.id, input);
        this.gameResult = { earned, raw, detail };
        this.apply(world);
        this.$emit('coins-updated', coins);
        vibrate(earned ? [12, 40, 18] : 8);
      } catch (error) {
        this.gameError = messageOf(error, 'Le serveur n’a pas pu compter tes prises.');
        this.load();
      } finally {
        this.gameSending = false;
      }
    },
    closeGame() {
      this.gameId = null;
      this.gameRun = null;
      this.syncLoop();
    },
    closeHarvest() {
      this.run = null;
      this.syncLoop();
      // Un coffre est tombé pendant la partie : il s'ouvre au retour sur l'île
      if (this.runChest) this.showChest(this.runChest);
      this.runChest = null;
    },
    // Ouvre un coffre qui attend (jour, bouteille, chapitre, quête) : le serveur tire et donne le lot, l'île le montre
    async openChest(source) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { chest, coins, world } = await playService.worldChest(source);
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.chestsOpen = false;
        this.showChest(chest);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le coffre ne s’est pas ouvert.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // « Tout ouvrir » : le serveur ouvre tout ce qui attend (jour, chapitres, quêtes, bouteille), l'île montre la rafale
    async openAllChests() {
      if (this.busy) return;
      this.busy = true;
      try {
        const { chests, coins, world } = await playService.worldChestsAll();
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.chestsOpen = false;
        this.haul = chests;
        vibrate([10, 40, 14, 40, 18]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Les coffres ne se sont pas ouverts.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Ce qu'un lot montre de son bâtiment (teinte, pièce rare) : l'aperçu paré, s'il peut s'y porter, s'il y est porté
    prizeLook({ prize }) {
      const site = prize.site ? this.state.sites.find(s => s.id === prize.site) : null;
      const item = site ? site.shop.find(i => i.id === prize.item) : null;
      return {
        art: item ? this.itemArt(site, item) : '',
        wearable: Boolean(item && site.level && site.skin !== item.id),
        worn: Boolean(item && site.skin === item.id)
      };
    },
    // Montre un coffre ouvert : sa série (coffre du jour), le mot de la bouteille, l'aperçu du bâtiment paré
    showChest(chest) {
      const { source } = chest;
      const { art, wearable } = this.prizeLook(chest);
      this.reveal = {
        chest,
        streak: source.startsWith('jour:') ? this.state.chests.daily.streak : 0,
        note: source.startsWith('bouteille:') ? noteOf(source) : '',
        art,
        wearable
      };
      vibrate([10, 40, 14]);
    },
    // « Porter » à l'ouverture : la teinte ou la pièce rare va tout de suite sur son bâtiment
    async wearRevealed() {
      const { prize } = this.reveal.chest;
      await this.wearSkin(this.state.sites.find(s => s.id === prize.site), prize.item);
      this.reveal = null;
    },
    // Enseigne : un style porté (acheté au passage s'il ne l'est pas : le solde suit), ou le nom écrit dessus
    async chooseSign(site, look) {
      this.busy = true;
      try {
        const { coins, world } = await playService.worldSign(site.id, look.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate([8, 30, 12]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’enseigne n’a pas pu changer.'));
      } finally {
        this.busy = false;
      }
    },
    async renameSigns(name) {
      this.busy = true;
      try {
        this.apply(await playService.worldSignName(name));
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le nom n’a pas pu changer.'));
      } finally {
        this.busy = false;
      }
    },
    // Appui long sur une enseigne : la boutique de son bâtiment, à la section Enseigne
    openNameSign(site) {
      this.site = site;
      this.siteTab = 'shop';
      this.$nextTick(() => {
        const panel = this.$refs.nameSign;
        if (panel && panel.$el && panel.$el.scrollIntoView) panel.$el.scrollIntoView({ block: 'start', behavior: this.reduced() ? 'auto' : 'smooth' });
      });
    },
    // « Porter » dans la rafale : la fenêtre reste ouverte, le lot passe à « Porté »
    wearHauled(index) {
      const { prize } = this.haul[index];
      return this.wearSkin(this.state.sites.find(s => s.id === prize.site), prize.item);
    },
    /* ---------- Créations d'île : établi, assemblage, pose ---------- */
    craftName(id) {
      const c = this.state && this.state.crafts ? this.state.crafts.catalog.find(k => k.id === id) : null;
      return c ? c.name : id;
    },
    openBench() {
      this.site = null;
      this.questOpen = false;
      this.benchOpen = true;
    },
    // « Assembler » (ou Recommencer) : le serveur tire les pièces ; rien n'est payé avant la réussite
    async assemble(craftId) {
      if (this.craftStarting) return;
      this.craftStarting = true;
      try {
        const { run } = await playService.craftStart(craftId);
        this.craftRun = run;
        this.craftError = '';
        this.craftMade = false;
      } catch (error) {
        const message = messageOf(error, 'L’assemblage n’a pas pu commencer.');
        if (this.craftRun) this.craftError = message;
        else this.$emit('show-alert', message);
      } finally {
        this.craftStarting = false;
      }
    },
    // Gabarit rempli : le serveur vérifie la disposition, prend les ressources, met la création en réserve
    async finishCraft(layout) {
      if (!this.craftRun || this.craftSending) return;
      this.craftSending = true;
      try {
        const { world } = await playService.craftFinish(this.craftRun.id, layout);
        this.apply(world);
        this.craftMade = true;
        vibrate([10, 30, 10]);
      } catch (error) {
        // Refusé : cet assemblage est rendu ; « Recommencer » en tire un autre
        this.craftError = messageOf(error, 'L’assemblage n’a pas pu être vérifié.');
      } finally {
        this.craftSending = false;
      }
    },
    closePuzzle() {
      this.craftRun = null;
      this.craftError = '';
      this.craftMade = false;
    },
    // « Poser » (établi, ou juste après l'assemblage) : les cases permises s'allument sur l'île
    startCraftPlace(craftId, from = null) {
      this.benchOpen = false;
      this.closePuzzle();
      this.craftMenu = null;
      this.craftConfirm = null;
      this.craftPlacing = { craft: craftId, from };
      if (!this.craftSpots.length) {
        this.craftPlacing = null;
        this.$emit('show-alert', 'Aucune case libre ne convient pour l’instant : sa règle de pose est dans l’établi.');
        return;
      }
      vibrate(8);
      this.focusOnSpots();
      this.draw(performance.now());
    },
    placeFromBench(craftId) {
      this.startCraftPlace(craftId);
    },
    placeFromPuzzle() {
      this.startCraftPlace(this.craftRun.craft);
    },
    // La caméra va vers la case dorée la plus proche du centre de la vue
    focusOnSpots() {
      if (!this.craftSpots.length) return;
      const near = this.craftSpots.map(sp => ({ sp, c: this.ground(sp.x, sp.y) }))
        .reduce((a, b) => (Math.hypot(b.c.x - this.cam.x, b.c.y - this.cam.y) < Math.hypot(a.c.x - this.cam.x, a.c.y - this.cam.y) ? b : a));
      this.cam.x = near.c.x;
      this.cam.y = near.c.y - 10;
      this.cam.s = Math.max(this.cam.s, 1.15);
      this.clampCam();
    },
    cancelCraft() {
      this.craftPlacing = null;
      this.craftConfirm = null;
      this.draw(performance.now());
    },
    // Toucher pendant la pose : une case dorée demande confirmation (déplacement : elle s'y pose aussitôt)
    tapCraftSpot(px, py) {
      const cell = this.tileAt(px, py);
      if (!cell || !this.craftSpots.some(sp => sp.x === cell.x && sp.y === cell.y)) {
        this.craftConfirm = null;
        this.$emit('show-alert', this.placingCraft ? `Choisis une case dorée : ${this.placingCraft.place.toLowerCase()}` : 'Choisis une case dorée.');
        this.draw(performance.now());
        return;
      }
      vibrate(6);
      if (this.craftPlacing.from) this.moveCraftTo(cell);
      else this.craftConfirm = { x: cell.x, y: cell.y, px, py };
      this.draw(performance.now());
    },
    // Pose confirmée : le serveur vérifie la règle ; la création surgit dans un nuage d'éclats
    async confirmCraft() {
      const target = this.craftConfirm;
      const craft = this.placingCraft;
      if (!target || !craft || this.busy) return;
      this.busy = true;
      const key = `craft:${target.x},${target.y}`;
      try {
        this.pops.set(key, performance.now());
        const { world } = await playService.craftPlace(craft.id, target.x, target.y);
        this.craftPlacing = null;
        this.craftConfirm = null;
        this.apply(world);
        this.$nextTick(() => {
          const at = center(this.screenRectOf(target.x, target.y));
          ring(at, 80);
          burst(at, 18, 60);
          vibrate([12, 40, 18]);
        });
      } catch (error) {
        this.pops.delete(key);
        this.craftConfirm = null;
        this.$emit('show-alert', messageOf(error, 'La création n’a pas pu être posée.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Déplacement gratuit vers la case dorée touchée
    async moveCraftTo(cell) {
      const { from } = this.craftPlacing;
      const key = `craft:${cell.x},${cell.y}`;
      this.craftPlacing = null;
      this.busy = true;
      try {
        this.pops.set(key, performance.now());
        const { world } = await playService.craftMove(from.x, from.y, cell.x, cell.y);
        this.apply(world);
        this.$nextTick(() => {
          burst(center(this.screenRectOf(cell.x, cell.y)), 14, 50);
          vibrate([10, 30, 10]);
        });
      } catch (error) {
        this.pops.delete(key);
        this.$emit('show-alert', messageOf(error, 'La création n’a pas pu être déplacée.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Menu d'une création posée (appui long) : déplacer, ranger
    openCraftMenu(craft) {
      const c = this.ground(craft.x, craft.y);
      const sp = this.toScreen(c.x, c.y);
      // Le menu tient au-dessus de la création, sans sortir de la vue par le haut
      this.menuPos = { x: Math.max(80, Math.min(this.geo.width - 80, sp.x)), y: Math.max(56, sp.y - TW * this.cam.s * 1.15) };
      this.craftMenu = { x: craft.x, y: craft.y, craft: craft.craft };
    },
    moveFromMenu() {
      const { x, y, craft } = this.craftMenu;
      this.startCraftPlace(craft, { x, y });
    },
    // Rangée dans la réserve de l'établi : elle se repose plus tard, sans rien payer
    async storeFromMenu() {
      const { x, y, craft } = this.craftMenu;
      this.craftMenu = null;
      this.busy = true;
      try {
        const { world } = await playService.craftStore(x, y);
        this.apply(world);
        this.$emit('show-alert', `${this.craftName(craft)} rangée dans la réserve de l’établi.`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La création n’a pas pu être rangée.'));
      } finally {
        this.busy = false;
      }
    },
    // Ramassage de la production des bâtiments ; at = point de l'écran d'où partent les éclats
    async collect(at = null) {
      if (this.busy) return;
      const from = at && at.currentTarget ? center(at.currentTarget.getBoundingClientRect()) : at;
      this.busy = true;
      try {
        const { gained, stock, coins, world } = await playService.worldCollect();
        this.apply(world);
        this.$emit('coins-updated', coins);
        const goods = Object.entries(stock || {}).filter(([, n]) => n > 0).map(([r, n]) => `+${n} ${LABEL[r]}`);
        if (gained > 0 || goods.length) {
          if (from) {
            ring(from, 90);
            burst(from, 20, 70);
          }
          vibrate([12, 40, 18]);
          this.$emit('show-alert', `Production ramassée : ${[...goods, ...(gained ? [`+${gained} écu${gained > 1 ? 's' : ''}`] : [])].join(' · ')}`);
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La production n’a pas pu être ramassée.'));
      } finally {
        this.busy = false;
      }
    },
    // Achat d'un quartier : la brume se dissipe, le panneau éclate
    async buyZone(zone) {
      this.busy = true;
      try {
        const sign = this.signs.find(sg => sg.zone.id === zone.id);
        const { bought, coins, world } = await playService.worldZone(zone.id);
        this.unveils.set(zone.id, performance.now());
        this.zone = null;
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (sign) {
          const sp = this.toScreen(sign.x, sign.y);
          const at = this.canvasPoint(sp.x, sp.y);
          ring(at, 140);
          burst(at, 30, 110);
        }
        vibrate([14, 40, 20]);
        this.$emit('show-alert', `Nouveau quartier : ${bought}\u00a0!`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le quartier n’a pas pu être acheté.'));
      } finally {
        this.busy = false;
      }
    },
    // Expédition vers un quartier inconnu : le serveur prend vivres, bois et une partie de Récolte ; elle revient après
    // zone.trip heures (l'île se recharge alors, le quartier se dévoile)
    async explore(zone) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { world } = await playService.worldExpedition(zone.id);
        this.apply(world);
        this.zone = null;
        vibrate([10, 30, 10]);
        this.$emit('show-alert', `L’expédition est partie ! Retour dans ${zone.trip} h.`);
        guide.tip('expedition');
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’expédition n’a pas pu partir.'));
      } finally {
        this.busy = false;
      }
    },
    // La pastille de l'expédition : la caméra va vers le quartier qu'elle explore, sa fiche s'ouvre
    showExpedition() {
      const zone = this.state.map.zones.find(z => z.id === this.state.expedition.zone);
      if (!zone) return;
      if (zone.anchor) {
        const c = this.ground(zone.anchor.x, zone.anchor.y);
        this.cam.x = c.x;
        this.cam.y = c.y;
        this.clampCam();
        this.draw(performance.now());
      }
      this.zone = zone;
    },
    // Lieu remarquable touché : à découvrir dans un quartier à soi, le serveur l'inscrit ; sinon il sautille et dit ce
    // qu'il fait, ou comment l'atteindre
    tapLandmark(landmark, px, py) {
      const zone = this.state.map.zones.find(z => z.id === landmark.zone);
      this.scared.set(`landmark:${landmark.id}`, { at: performance.now() / 1000 });
      if (!landmark.found && zone && zone.owned) {
        this.findLandmark(landmark, px, py);
        return;
      }
      this.showTip(px, py, this.tipOf({ landmark }));
      vibrate(6);
    },
    // Découverte d'un lieu : le serveur l'inscrit (effet durable, coffre qui attend) ; l'île le fête, Brume en parle,
    // puis son coffre s'ouvre
    async findLandmark(landmark, px, py) {
      if (this.busy) return;
      this.busy = true;
      let fresh = false;
      try {
        const { fresh: first, world } = await playService.worldLandmark(landmark.id);
        fresh = first;
        this.apply(world);
        const found = (world.landmarks || []).find(l => l.id === landmark.id) || landmark;
        if (fresh) {
          const at = this.canvasPoint(px, py);
          ring(at, 110);
          burst(at, 32, 120);
          vibrate([14, 40, 20, 40, 26]);
          this.pops.set(`landmark:${landmark.id}`, performance.now());
          this.$emit('show-alert', `Lieu découvert : ${found.name}\u00a0! ${found.effect}.`);
          guide.say(landmarkTip(found));
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Ce lieu n’a pas pu être découvert.'));
      } finally {
        this.busy = false;
      }
      if (fresh) this.openChest(`lieu:${landmark.id}`);
    },
    // Gisement touché : prêt dans un quartier à soi, il se ramasse ; sinon il sautille et dit quand il repousse, ou
    // comment l'atteindre
    tapDeposit(deposit, px, py) {
      const zone = this.state.map.zones.find(z => z.id === deposit.zone);
      this.scared.set(`deposit:${deposit.id}`, { at: performance.now() / 1000 });
      if (zone && zone.owned && !depositWait(deposit, this.clock - this.loadedAt)) {
        this.gatherDeposit(deposit, px, py);
        return;
      }
      this.showTip(px, py, this.tipOf({ deposit }));
      vibrate(6);
    },
    // Ramassage : le serveur donne quelques trouvailles (une seule fois) ; le gisement repousse
    async gatherDeposit(deposit, px, py) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { find, amount, world } = await playService.worldDeposit(deposit.id);
        this.apply(world);
        burst(this.canvasPoint(px, py), 16, 60);
        vibrate([8, 30, 10]);
        this.pops.set(`deposit:${deposit.id}`, performance.now());
        const stock = (world.finds || []).find(f => f.id === find);
        this.$emit('show-alert', `Trouvaille : +${amount} ${stock ? stock.name.toLowerCase() : find}${stock ? ` (${stock.amount} en réserve)` : ''}`);
        guide.tip('finds');
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Ce gisement n’a pas pu être ramassé.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Carnet d'explorateur, ouvert à la page d'un lieu (ou au début)
    openLog(id = null) {
      this.logFocus = id;
      this.logOpen = true;
    },
    // « Voir sur l'île » : la caméra va vers le lieu, le carnet se ferme
    showLandmark(id) {
      const landmark = this.shownLandmarks.find(l => l.id === id);
      this.logOpen = false;
      if (!landmark) return;
      const c = this.ground(landmark.x, landmark.y);
      this.cam.x = c.x;
      this.cam.y = c.y + (landmarkTop(landmark.id) * landmarkScale(landmark.id)) / 2;
      this.clampCam();
      this.draw(performance.now());
    },
    // Achat d'un article en un toucher ; « Annuler » reste proposé UNDO_MS
    async buyItem(site, item, event) {
      // Pas encore achetable : sa fiche dit pourquoi (palier, écus, butins)
      if (!this.canBuy(site, item)) {
        this.describeItem(site, item);
        return;
      }
      const from = event && event.currentTarget ? center(event.currentTarget.getBoundingClientRect()) : null;
      this.busy = true;
      try {
        const { bought, coins, world } = await playService.worldItem(item.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (from) {
          ring(from, 80);
          burst(from, 18, 60);
        }
        vibrate([12, 40, 18]);
        this.$emit('show-alert', item.kind === 'skin' ? `Skin porté : ${bought}\u00a0!` : `Nouveau sur ton île : ${bought}\u00a0!`);
        clearTimeout(this.undoTimer);
        this.undoable = { id: item.id, name: bought };
        // Premier achat de cette sorte : son mode d'emploi, une fois l'achat devenu définitif
        const firstOfKind = !guideSeen(guideKind(item)) ? { siteId: site.id, itemId: item.id } : null;
        this.undoTimer = setTimeout(() => {
          this.undoable = null;
          if (firstOfKind && !this.gone) this.guide = firstOfKind;
        }, UNDO_MS);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’achat n’a pas pu se faire.'));
      } finally {
        this.busy = false;
      }
    },
    // « Annuler » juste après un achat : l'article est rendu, ses écus remboursés par le serveur
    async undoItem() {
      const item = this.undoable;
      if (!item || this.busy) return;
      clearTimeout(this.undoTimer);
      this.undoable = null;
      this.busy = true;
      try {
        const { undone, coins, world } = await playService.worldItemUndo(item.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.$emit('show-alert', `Achat annulé : ${undone}.`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’achat n’a pas pu être annulé.'));
      } finally {
        this.busy = false;
      }
    },
    // Fiche d'un article (toucher sur son dessin, appui long sur son prix)
    describeItem(site, item) {
      vibrate(10);
      this.sheet = { siteId: site.id, itemId: item.id };
    },
    // Achat depuis la fiche : elle se ferme, l'achat reste annulable depuis la boutique
    buyFromSheet(event) {
      const [site, item] = [this.sheetSite, this.sheetItem];
      this.sheet = null;
      if (item) this.buyItem(site, item, event);
    },
    // Mode d'emploi du premier achat d'une sorte : « Voir sur l'île » ferme les fiches et montre l'article, qui sautille
    closeGuide() {
      if (this.guideItem) markGuideSeen(guideKind(this.guideItem));
      this.guide = null;
    },
    showGuideOnIsland() {
      const [site, item] = [this.guideSite, this.guideItem];
      this.closeGuide();
      if (!site) return;
      this.site = null;
      const c = this.centerOf(site);
      this.cam.x = c.x;
      this.cam.y = c.y - 20;
      this.cam.s = Math.max(this.cam.s, 1.3);
      this.clampCam();
      if (item && item.kind !== 'skin') this.scared.set(`item:${site.id}:${item.id}`, { at: performance.now() / 1000 });
      this.draw(performance.now());
    },
    /* ---------- Annexes ---------- */
    annexReady,
    annexYield,
    // Ce que dit la bulle d'une annexe touchée
    annexTip(annex) {
      const site = this.state.sites.find(s => s.id === annex.site);
      const entry = site && site.annexes.find(a => a.id === annex.annex);
      return entry ? { title: entry.name, text: `${entry.effect} · ${site.name}`, hint: 'Appui long : sa fiche' } : null;
    },
    // La carte se recentre sur un bâtiment, assez près pour voir ses cases autour
    focusOn(site) {
      const c = this.centerOf(site);
      this.cam.x = c.x;
      this.cam.y = c.y - 10;
      this.cam.s = Math.max(this.cam.s, 1.15);
      this.clampCam();
      this.draw(performance.now());
    },
    // « Poser » dans l'onglet Annexes : la fiche se ferme, les cases autorisées s'allument autour du bâtiment
    startAnnex(site, annex) {
      this.site = null;
      this.annexSheet = null;
      this.annexConfirm = null;
      this.annexPlacing = { siteId: site.id, annexId: annex.id, from: null };
      vibrate(8);
      this.$nextTick(() => this.focusOn(site));
    },
    cancelAnnex() {
      this.annexPlacing = null;
      this.annexConfirm = null;
      this.draw(performance.now());
    },
    // Toucher pendant la pose : une case dorée demande confirmation (déplacement : elle s'y pose aussitôt)
    tapAnnexSpot(px, py) {
      const cell = this.tileAt(px, py);
      const site = this.placingSite;
      if (!site || !cell || !site.spots.some(spot => spot.x === cell.x && spot.y === cell.y)) {
        this.annexConfirm = null;
        this.$emit('show-alert', `Choisis une case dorée autour de ${site ? site.name : 'son bâtiment'}.`);
        this.draw(performance.now());
        return;
      }
      vibrate(6);
      if (this.annexPlacing.from) this.moveAnnex(cell);
      else this.annexConfirm = { x: cell.x, y: cell.y, px, py };
      this.draw(performance.now());
    },
    // Pose confirmée : le serveur vérifie et débite ; l'annexe surgit dans un nuage d'éclats
    async confirmAnnex() {
      const target = this.annexConfirm;
      const annex = this.placingAnnex;
      if (!target || !annex || this.busy) return;
      this.busy = true;
      try {
        const { built, coins, world } = await playService.worldAnnex(annex.id, target.x, target.y);
        this.annexPlacing = null;
        this.annexConfirm = null;
        this.pops.set(`annex:${target.x},${target.y}`, performance.now());
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.$nextTick(() => {
          const at = center(this.screenRectOf(target.x, target.y));
          ring(at, 90);
          burst(at, 20, 70);
          vibrate([12, 40, 18]);
        });
        this.$emit('show-alert', `Nouvelle annexe : ${built}\u00a0!`);
      } catch (error) {
        this.annexConfirm = null;
        this.$emit('show-alert', messageOf(error, 'L’annexe n’a pas pu être posée.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Déplacement gratuit vers la case dorée touchée
    async moveAnnex(cell) {
      const { from } = this.annexPlacing;
      const key = `annex:${cell.x},${cell.y}`;
      this.annexPlacing = null;
      this.busy = true;
      try {
        this.pops.set(key, performance.now());
        this.apply(await playService.worldAnnexMove(from.x, from.y, cell.x, cell.y));
        this.$nextTick(() => {
          burst(center(this.screenRectOf(cell.x, cell.y)), 14, 50);
          vibrate([10, 30, 10]);
        });
      } catch (error) {
        this.pops.delete(key);
        this.$emit('show-alert', messageOf(error, 'L’annexe n’a pas pu être déplacée.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Fiche d'une annexe : « Déplacer » allume les cases libres autour de son bâtiment ; « Bâtiment » ouvre sa fiche
    moveFromSheet() {
      const info = this.sheetAnnex;
      if (!info) return;
      const { x, y } = this.annexSheet;
      this.annexSheet = null;
      this.annexPlacing = { siteId: info.site.id, annexId: info.annex.id, from: { x, y } };
      this.focusOn(info.site);
    },
    siteFromSheet() {
      const info = this.sheetAnnex;
      this.annexSheet = null;
      if (!info) return;
      this.site = info.site;
      this.siteTab = 'annexes';
    },
    // Skin porté par un bâtiment ('' : apparence d'origine)
    async wearSkin(site, skin) {
      this.busy = true;
      try {
        this.apply(await playService.worldSkin(site.id, skin));
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le skin n’a pas pu être changé.'));
      } finally {
        this.busy = false;
      }
    }
  }
};
</script>

<style scoped>
.world {
  /* De bord à bord : tout l'écran au-dessus de la barre d'onglets (à droite du rail sur PC) ; en plein écran, tout */
  position: fixed; z-index: 20; top: 0; left: 0; right: 0; bottom: var(--oc-tabbar-h); background: #5FB0DD;
}
@media (min-width: 860px) { .world { left: var(--oc-rail-w); bottom: 0; } }
.world--immersive { z-index: 30; left: 0; bottom: 0; }
/* La barre du haut flotte sur l'île : seuls ses boutons et pastilles prennent le doigt */
.world__top {
  position: absolute; z-index: 4; top: 0; left: 0; right: 0; display: grid; gap: 6px;
  padding: calc(env(safe-area-inset-top) + 8px) 10px 12px;
  background: linear-gradient(rgba(24, 17, 12, .5), rgba(24, 17, 12, .22) 72%, rgba(24, 17, 12, 0));
  pointer-events: none;
}
.world__top .world__head, .world__top .world__hud { pointer-events: none; }
.world__top .world__head > *, .world__top .world__hud > * { pointer-events: auto; }
.world--immersive .world__top { display: none; }
.world__head-left { display: flex; align-items: center; gap: 8px; }
.world__purse {
  display: inline-flex; align-items: center; gap: 5px; height: 32px; padding: 0 11px 0 8px; border-radius: 999px;
  background: rgba(251, 246, 234, .94); color: var(--ink-900); font-family: var(--font-ui); font-size: 14px; font-weight: 900;
  font-variant-numeric: tabular-nums;
}
.world__guest { margin: calc(env(safe-area-inset-top) + 72px) 16px 0; }
.world__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.world__eyebrow { display: block; font-family: var(--oc-font-mono); font-weight: 800; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--oc-on-bg-faint); }
.world__coins {
  flex: 0 1 auto; min-width: 0; max-width: 60%; display: inline-flex; align-items: center; gap: 7px; text-align: left;
  min-height: 38px; padding: 6px 14px;
  border: 1px solid rgba(224, 182, 84, .3); border-radius: 999px;
  background: rgba(224, 182, 84, .08); color: var(--oc-text-faint);
  font-family: var(--font-ui); font-weight: 900; font-size: 15px;
  cursor: pointer;
}
.world__coins.is-ready { background: var(--gold-400); border-color: var(--gold-400); color: var(--ink-900); box-shadow: 0 4px 0 var(--gold-600); animation: world-glow 2s ease-in-out infinite; }
.world__coins:disabled { cursor: default; }
.world__coins-icon { flex: none; font-size: 24px; line-height: 1; }
.world__coins-text { display: grid; justify-items: start; gap: 1px; line-height: 1.1; }
.world__coins-label { font-size: 13px; font-weight: 900; white-space: nowrap; }
.world__coins-gains { display: flex; flex-wrap: wrap; gap: 0 7px; font-size: 12px; font-weight: 900; font-variant-numeric: tabular-nums; }
.world__coins-gains > span { display: inline-flex; align-items: center; gap: 2px; }
@keyframes world-glow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
.world__coin { width: 16px; height: 16px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFE7A0, #E9AE2E 70%); box-shadow: inset 0 0 0 1.5px rgba(59, 42, 32, .5); }

.world__hud { display: flex; align-items: stretch; gap: 8px; width: min(100%, 540px); }
.world__stock { flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; margin: 0; padding: 0; list-style: none; }
.world__res {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  min-height: 46px; border-radius: 14px; background: var(--vellum-100); color: var(--ink-900);
  font-family: var(--font-ui); font-size: 17px;
}
.world__res strong { font-size: 15px; font-weight: 900; font-variant-numeric: tabular-nums; }
.world__play {
  flex: none; display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 108px; padding: 4px 12px; border: 0; border-radius: 16px;
  background: var(--gold-400); color: var(--ink-900); box-shadow: 0 4px 0 var(--gold-600);
  font-family: var(--font-ui); cursor: pointer;
}
.world__play:active { transform: translateY(2px); box-shadow: 0 2px 0 var(--gold-600); }
.world__play:disabled { background: #6E6253; color: #D8CCBA; box-shadow: none; cursor: default; }
.world__play-label { font-family: var(--font-display); font-size: 17px; font-weight: 700; line-height: 1.1; }
.world__play-sub { font-size: 11px; font-weight: 800; opacity: .85; white-space: nowrap; }

.world__stage { position: absolute; inset: 0; overflow: hidden; --world-top: 0px; }
.world__canvas { display: block; width: 100%; touch-action: none; cursor: grab; }
.world__perf {
  position: absolute; left: 10px; top: calc(var(--world-top) + 60px); max-width: calc(100% - 80px); margin: 0; padding: 3px 8px; border-radius: 8px; white-space: nowrap;
  background: rgba(20, 14, 10, .7); color: #F6EEDF; font: 600 11px/1.3 ui-monospace, monospace; pointer-events: none;
}
.world__chest-btn {
  position: absolute; left: 10px; top: calc(var(--world-top) + 8px); display: grid; place-items: center;
  width: 46px; height: 46px; border: 0; border-radius: 14px; background: rgba(30, 22, 16, .55); cursor: pointer;
}
.world__chest-btn.is-ready { background: var(--gold-400); box-shadow: 0 3px 0 var(--gold-600); animation: world-chest-call 2.4s ease-in-out infinite; }
.world__log-btn {
  position: absolute; left: 62px; top: calc(var(--world-top) + 8px); display: grid; place-items: center;
  width: 46px; height: 46px; border: 0; border-radius: 14px; background: rgba(30, 22, 16, .55); cursor: pointer;
}
.world__log-btn.is-ready { background: var(--gold-400); box-shadow: 0 3px 0 var(--gold-600); }
.world__finds-btn {
  position: absolute; left: 114px; top: calc(var(--world-top) + 8px); display: grid; place-items: center;
  width: 46px; height: 46px; border: 0; border-radius: 14px; background: rgba(30, 22, 16, .55); cursor: pointer;
}
.world__finds-btn.is-ready { background: var(--gold-400); box-shadow: 0 3px 0 var(--gold-600); }
.world__trip-btn {
  position: absolute; left: 10px; top: calc(var(--world-top) + 62px); display: flex; align-items: center; gap: 5px; height: 36px; padding: 0 10px 0 6px;
  border: 0; border-radius: 12px; background: rgba(30, 22, 16, .6); color: #FFF4C8; font-family: var(--font-ui); font-size: 12px; font-weight: 900; cursor: pointer;
}
.world__trip-note { margin: 8px 0 0; padding: 8px 12px; border-radius: 12px; background: #FFF4D6; font-size: 13px; font-weight: 800; line-height: 1.4; }
.world__climate { margin: 0 0 8px; font-size: 13px; font-weight: 700; line-height: 1.4; color: var(--ink-700); }
.world__chest-badge {
  position: absolute; right: -5px; top: -5px; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 999px;
  background: #D2453A; color: #fff; font-family: var(--font-ui); font-size: 12px; font-weight: 900; line-height: 20px;
}
@keyframes world-chest-call { 0%, 80%, 100% { transform: none; } 86% { transform: rotate(-8deg); } 92% { transform: rotate(8deg); } }
@media (prefers-reduced-motion: reduce) { .world__chest-btn.is-ready { animation: none; } }
.world__zoom { position: absolute; right: 10px; top: calc(var(--world-top) + 8px); display: flex; flex-direction: column; gap: 6px; }
.world__zoom button {
  width: 38px; height: 38px; border: 0; border-radius: 12px;
  background: rgba(251, 246, 234, .92); color: var(--ink-900);
  font-size: 22px; font-weight: 900; line-height: 1; cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
}
.world__banner, .world__error {
  position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%);
  width: max-content; max-width: 92%; margin: 0; padding: 8px 14px; border-radius: 14px;
  background: rgba(30, 22, 16, .82); color: #F6EEDD;
  font-family: var(--font-ui); font-size: 13px; font-weight: 700; text-align: center;
}
.world__link { margin-left: 6px; border: 0; background: none; color: #F2C04B; font: inherit; font-weight: 900; cursor: pointer; text-decoration: underline; }
.world__tip {
  position: absolute; z-index: 3; transform: translate(-50%, -100%); pointer-events: none;
  display: flex; flex-direction: column; gap: 2px; max-width: 220px; padding: 8px 12px; border-radius: 14px;
  background: rgba(30, 22, 16, .9); color: #F6EEDD; font-family: var(--font-ui); text-align: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, .35);
}
.world__tip.is-below { transform: translate(-50%, 0); }
.world__tip-title { font-weight: 900; font-size: 14px; }
.world__tip-text { font-size: 12px; font-weight: 700; line-height: 1.3; color: #E8DCC4; }
.world__tip-hint { margin-top: 2px; font-size: 11px; font-weight: 800; color: #F2C04B; }
.world__tip-btn {
  pointer-events: auto; align-self: center; min-height: 32px; margin-top: 6px; padding: 4px 14px; border: 0; border-radius: 999px;
  background: #F2C04B; color: #3A2A1E; font: inherit; font-size: 13px; font-weight: 900; cursor: pointer;
}
.world-tip-enter-active, .world-tip-leave-active { transition: opacity .18s ease, margin .18s ease; }
.world-tip-enter-from, .world-tip-leave-to { opacity: 0; margin-top: 6px; }
.world__guide { margin: 0; display: grid; gap: 10px; }
.world__guide div { display: grid; grid-template-columns: 80px 1fr; gap: 10px; align-items: baseline; }
.world__guide dt { color: var(--ink-500); font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
.world__guide dd { margin: 0; font-size: 14px; font-weight: 700; line-height: 1.4; }
.world__menu {
  position: absolute; transform: translate(-50%, -100%);
  display: flex; align-items: center; gap: 6px; width: max-content;
  padding: 6px 8px; border-radius: 16px;
  background: var(--vellum-100); color: var(--ink-900);
  box-shadow: 0 10px 26px rgba(0, 0, 0, .45);
  font-family: var(--font-ui);
  z-index: 2;
}
.world__menu-name { font-weight: 900; font-size: 13px; padding: 0 4px; white-space: nowrap; }
.world__menu-btn { min-height: 34px; padding: 4px 12px; border: 0; border-radius: 999px; background: var(--ink-900); color: var(--vellum-50); font: inherit; font-weight: 800; font-size: 13px; cursor: pointer; }
.world__menu-btn--quiet { background: var(--vellum-200); color: var(--ink-500); }
.world__note { margin: 8px 2px 0; color: var(--oc-on-bg-faint); font-size: 13px; font-style: italic; }
.world__guest { padding: 28px 20px; border-radius: 22px; background: var(--vellum-100); color: var(--ink-900); text-align: center; font-family: var(--font-ui); }
.world__guest-title { margin: 0; font-family: var(--font-display); font-size: 26px; font-weight: 700; }
.world__guest-text { margin: 10px 0 18px; color: var(--ink-500); }
.world__btn { min-height: 46px; padding: 10px 22px; border: 0; border-radius: 999px; background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 15px; cursor: pointer; }
.world__btn:disabled { opacity: .45; cursor: default; }
.world__btn--small { min-height: 32px; padding: 4px 12px; font-size: 13px; margin-left: 6px; }
.world__btn--quiet { background: var(--vellum-200); color: var(--ink-900); }

.world__sheet-backdrop { position: fixed; inset: 0; z-index: 70; background: rgba(10, 8, 6, .55); display: flex; align-items: flex-end; justify-content: center; }
.world__sheet {
  width: min(100%, 560px); max-height: 74dvh; display: flex; flex-direction: column;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0; background: var(--vellum-100); color: var(--ink-900);
  font-family: var(--font-ui); overflow-y: auto;
}
.world__sheet-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 10px; }
.world__sheet-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; }
.world__sheet-title small { font-family: var(--font-ui); font-size: 12px; font-weight: 800; color: var(--ink-500); margin-left: 4px; }
.world__sheet .world__link { color: #8A5A1C; }
.world__site-effect { margin: 0 0 10px; padding: 8px 12px; border-radius: 12px; background: var(--vellum-200); font-weight: 700; }
/* Fiche d'un bâtiment : vignette, quartier, niveau en pastilles, onglets */
.world__site-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.world__site-art { width: 76px; height: 84px; flex: none; object-fit: contain; object-position: center bottom; border-radius: 16px; background: radial-gradient(circle at 50% 70%, #CFE8B8, var(--vellum-200) 70%); }
.world__site-id { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.world__site-id .world__eyebrow { color: var(--ink-500); }
.world__pips { display: flex; gap: 5px; margin-top: 4px; }
.world__pip { width: 16px; height: 6px; border-radius: 3px; background: var(--vellum-300); }
.world__pip.is-on { background: linear-gradient(90deg, var(--gold-400), var(--gold-600)); }
.world__tabs { display: flex; gap: 6px; padding: 4px; margin-bottom: 12px; border-radius: 999px; background: var(--vellum-200); }
.world__tab { flex: 1; min-height: 40px; border: 0; border-radius: 999px; background: transparent; color: var(--ink-700); font-family: var(--font-ui); font-weight: 900; font-size: 14px; cursor: pointer; position: relative; touch-action: manipulation; }
.world__tab.is-on { background: var(--vellum-50); color: var(--ink-900); box-shadow: 0 2px 0 var(--vellum-400); }
.world__tab-dot { position: absolute; top: 8px; right: 14px; width: 8px; height: 8px; border-radius: 50%; background: var(--gold-500); box-shadow: 0 0 0 2px var(--vellum-50); }
.world__panel { display: flex; flex-direction: column; gap: 10px; }
.world__prod { display: grid; gap: 6px; }
.world__prod-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; min-height: 40px; padding: 6px 12px; border-radius: 12px; background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .08); font-size: 14px; }
.world__prod-row span { color: var(--ink-500); font-weight: 800; }
.world__prod-row.is-pending { background: var(--gold-200); }
.world__named { display: inline-flex; align-items: center; gap: 6px; }
.world__pen {
  flex: none; display: inline-grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 0; border-radius: 50%;
  background: var(--vellum-200); color: var(--ink-700); cursor: pointer; box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .15);
}
.world__pen--small { width: 24px; height: 24px; }
.world__pen--small svg { width: 12px; height: 12px; }
.world__pen.is-locked { opacity: .45; }
.world__friends { margin-top: 12px; }
.world__friends-title { margin: 0 0 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); }
.world__friends-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 6px; margin: 0; padding: 0; list-style: none; }
.world__friend {
  position: relative; width: 100%; display: grid; justify-items: center; gap: 2px; padding: 6px 4px 8px; border: 0; border-radius: 14px;
  background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .1); font-family: var(--font-ui); color: var(--ink-900); cursor: pointer;
}
.world__friend-face { position: relative; display: block; width: 52px; height: 58px; border-radius: 12px; background: radial-gradient(circle at 50% 75%, #FFE9C4, var(--vellum-200) 74%); }
.world__friend-face img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 3px; box-sizing: border-box; }
.world__friend-name { font-family: var(--font-display); font-weight: 700; font-size: 14px; }
.world__friend-hearts { color: #E8566A; font-size: 11px; letter-spacing: .04em; }
.world__friend-hearts span { color: var(--vellum-300); }
.world__friend-dot { position: absolute; top: 6px; right: 8px; width: 9px; height: 9px; border-radius: 50%; background: #E8566A; box-shadow: 0 0 0 2px var(--vellum-50); }
.world__friend-mood { position: absolute; right: -6px; bottom: -4px; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--vellum-50); box-shadow: 0 1px 4px rgba(60, 40, 25, .25); font-size: 16px; }
.world__friend.is-guest { background: #F1F8FD; box-shadow: inset 0 0 0 1px rgba(62, 110, 156, .25); }
.world__friend-guest { font-size: 11px; font-weight: 800; color: #3E6E9C; }
.world__friend-need.is-quest { background: #FFF6D8; box-shadow: inset 0 0 0 2px #E2A72E; }
.world__friend-need { position: absolute; top: 4px; right: 4px; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: #FFF4E5; box-shadow: inset 0 0 0 2px #F0A84A; font-size: 15px; }
.world__fill-all { width: 100%; margin-top: 8px; display: inline-flex; justify-content: center; align-items: center; gap: 8px; }
.world__fill-cost { display: inline-flex; align-items: center; gap: 2px; }
.world__prod-row.is-happy { background: #EAF6E2; }
.world__prod-row.is-sad { background: #E8EDF6; }
.world__game {
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 10px; margin-top: 10px;
  padding: 10px 12px; border-radius: 16px; background: linear-gradient(135deg, #FFF4D6, var(--vellum-100)); box-shadow: inset 0 0 0 2px var(--gold-300);
}
.world__game.is-locked { background: var(--vellum-100); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .12); }
.world__game.is-locked .world__game-art { filter: grayscale(.7) opacity(.6); }
.world__game-art { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 14px; background: rgba(255, 255, 255, .6); }
.world__game-art img { width: 46px; height: 46px; object-fit: contain; }
.world__game-body { display: grid; gap: 1px; min-width: 0; }
.world__game-kind { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-500); }
.world__game-name { font-family: var(--font-display); font-weight: 700; font-size: 17px; line-height: 1.15; }
.world__game-text { font-size: 12px; font-weight: 700; color: var(--ink-700); }
.world__game-btn {
  min-height: 40px; min-width: 84px; padding: 6px 16px; border: 0; border-radius: 999px; cursor: pointer;
  background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 14px;
}
.world__game-btn:disabled { background: var(--vellum-300); color: var(--ink-500); cursor: default; font-size: 12px; }
/* Évolution : paliers en frise verticale (atteint, prochain, à venir) */
.world__steps { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.world__step { display: flex; gap: 12px; position: relative; }
.world__step:not(:last-child)::after { content: ''; position: absolute; left: 15px; top: 34px; bottom: -10px; width: 2px; background: var(--vellum-300); }
.world__step-mark { flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--vellum-300); color: var(--ink-700); font-weight: 900; z-index: 1; }
.world__step.is-done .world__step-mark { background: #8FCB6B; color: #FFFFFF; }
.world__step.is-next .world__step-mark { background: linear-gradient(180deg, var(--gold-300), var(--gold-500)); color: var(--ink-900); box-shadow: 0 0 0 3px var(--gold-200); }
.world__step-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; padding-bottom: 4px; }
.world__step-name { font-family: var(--font-display); font-weight: 700; font-size: 18px; }
.world__step-effect { color: var(--ink-500); font-size: 13px; font-weight: 700; }
.world__step.is-later { opacity: .62; }
/* Boutique : rubriques, cartes en deux colonnes (vignette, nom, effet, bouton d'achat en deux touchers) */
.world__shop-note { margin: 0; padding: 8px 12px; border-radius: 12px; background: var(--gold-200); font-weight: 800; font-size: 14px; }
.world__shop-note span { color: var(--ink-500); font-weight: 700; font-size: 12px; }
.world__shop-group { display: flex; flex-direction: column; gap: 8px; }
.world__shop-title { margin: 4px 2px 0; font-family: var(--font-display); font-size: 17px; font-weight: 700; }
.world__cards { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.world__card {
  display: flex; flex-direction: column; gap: 4px; min-width: 0;
  padding: 8px; border-radius: 16px; background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .1);
}
.world__card.is-worn { box-shadow: inset 0 0 0 2px var(--gold-500); }
.world__card.is-locked .world__card-art img { filter: grayscale(.7) opacity(.6); }
.world__card-open {
  appearance: none; display: flex; flex-direction: column; gap: 4px; padding: 0; border: 0; background: none;
  color: inherit; font: inherit; text-align: left; cursor: pointer; touch-action: manipulation;
}
.world__card-palier {
  position: absolute; top: 6px; left: 6px; min-width: 24px; padding: 1px 6px; border-radius: 999px;
  background: var(--ink-900); color: var(--gold-300); font-family: var(--font-display); font-weight: 700; font-size: 12px; text-align: center;
}
.world__card.is-locked .world__card-palier { background: var(--vellum-300); color: var(--ink-700); }
.world__card-palier--rare { background: linear-gradient(135deg, #F2C04B, #C9952A); color: var(--ink-900); }
.world__card.is-rare { box-shadow: inset 0 0 0 1px rgba(201, 149, 42, .55); }
.world__card.is-rare.is-worn { box-shadow: inset 0 0 0 2px var(--gold-500); }
.world__card-art {
  position: relative; display: grid; place-items: center; height: 78px; border-radius: 12px;
  background: radial-gradient(circle at 50% 72%, #CFE8B8, var(--vellum-200) 72%);
}
.world__card-art img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 6px 10px; box-sizing: border-box; object-fit: contain; }
.world__card-badge {
  position: absolute; top: 6px; right: 6px; padding: 1px 7px; border-radius: 999px;
  background: #4E8A3A; color: #FFFFFF; font-size: 11px; font-weight: 900;
}
.world__card-name { font-weight: 900; font-size: 14px; line-height: 1.2; }
.world__card-effect { flex: 1; color: var(--ink-500); font-size: 12px; font-weight: 700; line-height: 1.3; }
.world__card-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  min-height: 40px; padding: 6px 10px; border: 0; border-radius: 999px;
  background: var(--ink-900); color: var(--vellum-50);
  font-family: var(--font-ui); font-weight: 900; font-size: 14px; cursor: pointer; touch-action: manipulation;
}
.world__card-btn:disabled, .world__card-btn.is-off { background: var(--vellum-300); color: var(--ink-500); cursor: default; font-size: 12px; }
/* Bandeau d'annulation d'un achat (4 s) */
.world__undo {
  position: sticky; bottom: 0; margin-top: 10px; padding: 8px 8px 8px 14px; border-radius: 999px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  background: var(--ink-900); color: var(--vellum-50); font-weight: 800;
  box-shadow: 0 6px 18px rgba(40, 28, 18, .3);
}
.world__undo-btn { appearance: none; border: 0; cursor: pointer; min-height: 34px; padding: 4px 14px; border-radius: 999px; background: var(--gold-400); color: var(--ink-900); font-weight: 900; }
.world-undo-enter-active, .world-undo-leave-active { transition: opacity .2s ease, transform .2s ease; }
.world-undo-enter-from, .world-undo-leave-to { opacity: 0; transform: translateY(8px); }
.world__card-btn--quiet { background: var(--vellum-200); color: var(--ink-900); }
.world__card-owned { display: grid; place-items: center; min-height: 40px; color: #4E8A3A; font-size: 13px; font-weight: 900; }
.world__coin--small { width: 13px; height: 13px; }
.world__needs { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
/* Fiche de Brume : sa réplique, puis l'objectif, son avancée et la récompense */
.world__quest-eyebrow { color: var(--ink-500); margin-bottom: 6px; }
.world__brume-title { display: inline-flex; align-items: center; gap: 8px; }
.world__brume-say { margin: 0 0 12px; font-family: var(--font-display); font-style: italic; font-size: 17px; line-height: 1.4; }
.world__quest { display: grid; grid-template-columns: 1fr auto; gap: 6px 10px; padding: 10px 12px; border-radius: 14px; background: var(--vellum-200); }
.world__quest-label { font-weight: 900; }
.world__quest-count { font-family: var(--oc-font-mono); font-weight: 800; }
.world__quest-bar { grid-column: 1 / -1; height: 8px; border-radius: 999px; background: var(--vellum-300, #E6D8B8); overflow: hidden; }
.world__quest-bar i { display: block; height: 100%; border-radius: inherit; background: var(--oc-gold); transition: width var(--oc-fast) var(--oc-ease-out); }
.world__quest-reward { grid-column: 1 / -1; font-size: 14px; color: var(--ink-500); }
.world__need { display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 6px 12px; border-radius: 12px; background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .08); }
.world__need em { margin-left: auto; font-size: 12px; font-weight: 800; font-style: normal; }
.world__need.is-ok em, .world__need.is-ok strong { color: #4E8A3A; }
.world__need.is-missing em, .world__need.is-missing strong { color: #B0503A; }
.world__need-glyph { width: 28px; font-size: 22px; text-align: center; }
.world__sheet-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.world-sheet-enter-active, .world-sheet-leave-active { transition: opacity .25s ease; }
.world-sheet-enter-active .world__sheet, .world-sheet-leave-active .world__sheet { transition: transform .3s cubic-bezier(.3, 1.2, .5, 1); }
.world-sheet-enter-from, .world-sheet-leave-to { opacity: 0; }
.world-sheet-enter-from .world__sheet, .world-sheet-leave-to .world__sheet { transform: translateY(100%); }
@media (prefers-reduced-motion: reduce) {
  .world__coins.is-ready { animation: none; }
}
</style>

<style>
/* Plein écran de l'île : la barre d'onglets se cache (hors du composant, d'où ce style global) */
:root.oc-immersive .tabbar { display: none; }
</style>
