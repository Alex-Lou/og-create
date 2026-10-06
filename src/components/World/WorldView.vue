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
              <p v-if="site.id === 'foyer' && civStage" class="world__civ world__civ--site">Étape : {{ civStage }}</p>
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

      <!-- Naufrage (bible, § 6.7 et § 14) : une nuit, une épave au loin, la brume, et Brume ; un toucher pour continuer -->
      <transition name="world-wreck">
        <WreckScene v-if="wreck" :wreck="wreck" @close="closeWreck" />
      </transition>
      <!-- Brume : sa réplique, la quête active, son avancée, sa récompense -->
      <transition name="world-sheet">
        <BrumeSheet
          v-if="questOpen && state && state.brume"
          v-model:people-name="peopleName"
          :brume="state.brume"
          :quest="quest"
          :civ-stage="civStage"
          :stage="brumeState.stage"
          :charges="state.charges.count"
          :charges-text="chargesText"
          :action="questAction ? questAction.label : ''"
          :savoir="state.brumeSavoir || null"
          :said="brumeSaid"
          :hint="Boolean(brumeHint)"
          :busy="busy"
          @claim="claimQuest"
          @harvest="questHarvest"
          @name="namePeople"
          @action="runQuestAction"
          @talk="talkBrume"
          @grimoire="openBrumeSavoir"
          @close="questOpen = false"
        />
      </transition>
      <!-- Quartier à acheter : prix en écus et chapitre du Livre -->
      <transition name="world-sheet">
        <ZoneSheet
          v-if="zone"
          :zone="zone"
          :sites="sitesIn(zone)"
          :stock="state.stock"
          :charges="state.charges.count"
          :expedition="state.expedition || null"
          :trip-left="tripLeft"
          :busy="busy"
          @explore="explore(zone)"
          @buy="buyZone(zone)"
          @close="zone = null"
        />
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
      :art="savoirOf(villagerView.id)"
      :savoir="villagerSavoir"
      @talk="talkVillager"
      @gift="giftVillager"
      @fill="fillNeed"
      @grimoire="openSavoir"
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
    <ExplorerLog
      v-if="logOpen && state"
      :landmarks="state.landmarks || []"
      :zones="state.map.zones"
      :focus="logFocus"
      :acts="(state.brume && state.brume.acts) || []"
      :people="state.people || null"
      :elements="elements"
      :heliane="(state.heliane && state.heliane.found) || []"
      :anya="state.anya || null"
      @show="showLandmark"
      @replay="act => { logOpen = false; $emit('replay-vigil', act); }"
      @replay-anya="logOpen = false; $emit('replay-anya')"
      @close="logOpen = false"
    />
    <ChestReveal v-if="reveal" v-bind="reveal" :busy="busy" @wear="wearRevealed" @close="reveal = null" />
    <ChestHaul v-if="haul && state" :items="haulItems" :note="haulNote" :busy="busy" @wear="wearHauled" @close="haul = null" />

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
import WreckScene from './WreckScene.vue';
import BrumeSheet from './BrumeSheet.vue';
import ZoneSheet from './ZoneSheet.vue';
import { villagerSprite, ROLES } from '@/world/villagers';
import { talkLine, giftLine, awaits } from '@/world/friends';
import { heardPages, keepSavoir, savoirLine, artOf as savoirOf } from '@/game/savoirs';
import { NEED_GLYPH, MOOD_GLYPH, MOOD_LABEL, THANKS, missingOf, fillAllOf, askOr } from '@/world/needs';
import { visitorLook, THANKS as VISITOR_THANKS } from '@/world/visitors';
import { craftThumb } from '@/world/craftSprites';
import { landmarkTop, landmarkScale } from '@/world/landmarkSprites';
import { landmarksShown, landmarksWaiting, landmarkTip } from '@/world/landmarks';
import { depositsShown, depositsReady, depositWait } from '@/world/finds';
import { CLIMATE_NAMES } from '@/world/climates';
import { annexReady, annexYield, variantsOf } from '@/world/annexes';
import { noteOf, openableOf } from '@/world/chest';
import GModal from '@/components/ui/GModal.vue';
import { guideOf, guideKind } from '@/world/itemGuide';
import { villageOf } from '@/world/village';
import { clearDrawings } from '@/book/painter';
import { burst, ring, vibrate, center, reducedMotion } from '@/utils/fx';
import { GLYPH, LABEL, RESOURCES } from '@/game/resources';
import { artMake } from '@/world/looks';
import { itemThumb } from '@/world/shopSprites';
import { tintOf } from '@/world/tints';
import { drawSprite, spriteUrl, clearSprites } from '@/world/spriteCache';
import { islandOf, liveOf, TerrainCache, HS } from '@/world/terrain';
import { FLOATING_ZONE, COLONY_ZONE, isletsOf } from '@/world/islets';
import { seaOf, spread } from '@/world/sea';
import { stageOf as civilizationOf } from '@/game/vigils';
import { brumeLook, opusOf, secretDue, SECRET } from '@/game/opus';
import { PRESENTIMENTS, BREATH_LINE } from '@/game/anya';
import { BEASTS } from '@/world/bestiary';
import { faceHref } from '@/world/faces';
import { guide } from '@/game/guide';
import { TIPS } from '@/game/guideTips';
import longpress from '@/directives/longpress';
import { roman } from '@/utils/roman';
import { phaseAt, forcedPhase, hash } from '@/world/scene';
import { perfWanted, perfMeter } from '@/world/perf';
import { clockText } from '@/world/sky';
import cameraMethods from '@/world/view/camera';
import drawMethods from '@/world/view/draw';
import gestureMethods from '@/world/view/gestures';
import { TW } from '@/world/view/constants';
import { memory } from '@/world/view/memory';

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
// Achat d'un quartier : la brume se dissipe (ms)
const UNVEIL_MS = 1600;
// Boutique d'un atelier : rubriques dans l'ordre de la fiche
const SHOP_GROUPS = [['outil', 'Outils'], ['objet', 'Objets'], ['rare', 'Pièces rares'], ['skin', 'Skins'], ['teinte', 'Teintes']];
// Rubrique d'un article : les skins se partagent entre pièces rares, skins dessinés et teintes
const groupOf = item => (item.rare ? 'rare' : item.kind === 'skin' && tintOf(item.id) ? 'teinte' : item.kind);
// Achat en un toucher : « Annuler » reste proposé 4 s (le serveur accepte l'annulation un peu plus longtemps)
const UNDO_MS = 4000;
// Mini-jeux : l'icône de chaque jeu dans la fiche de son bâtiment
const GAME_ICONS = { peche: 'dore', filon: 'diamant', cueillette: 'fraise' };
const BEACH_MIX = [['palm', 0.1], ['mossy', 0.15], ['shells', 0.2], ['driftwood', 0.23]];
const ROCK_MIX = [['rock', 0.3], ['rocks', 0.55], ['crag', 0.72], ['mossy', 1]];
const GRASS_MIX = [['tuft', 0.1], ['flowers', 0.16], ['bush', 0.185], ['mushrooms', 0.205], ['stump', 0.22], ['birch', 0.235], ['apple', 0.245], ['autumn', 0.255], ['log', 0.265]];
// Forêt : deux arbres par case (sapins en hauteur) ; au bord de l'eau douce, roseaux et nénuphars
const FOREST_LOW = ['tree', 'birch', 'pine', 'autumn'];
const FOREST_HIGH = ['pine', 'pine', 'tree'];

// Le Monde : l'île du joueur en isométrique (Canvas 2D), avec une caméra qu'on fait glisser et zoomer.
// L'état vient du serveur (chantiers, réserves, parties, créations d'île) ; le dessin, la caméra et la boucle
// d'animation sont non réactifs et s'arrêtent quand l'onglet est caché ou le composant démonté.
export default {
  name: 'WorldView',
  components: { ElementGlyph, HarvestGame, ShopItemSheet, IslandClock, GModal, ChestList, ChestReveal, ChestHaul, AnnexPanel, AnnexSheet, NameSignPanel, MiniGame, GameIcon, VillagerSheet, VisitorSheet, RenameSheet, CraftBench, CraftPuzzle, ExplorerLog, FindsSheet, WreckScene, BrumeSheet, ZoneSheet },
  directives: { longpress },
  props: {
    // Glyphes des éléments du Livre (savoir-faire demandé à l'établi)
    elementEmojis: { type: Object, required: true },
    // Éléments écrits dans le Grimoire : le Bestiaire vivant et les familiers (bible, § 6.5)
    elements: { type: Array, default: () => [] },
    isLoggedIn: { type: Boolean, default: false },
    // Solde d'écus (en-tête) : grise les articles hors de portée ; le serveur reste seul juge
    coins: { type: Number, default: null }
  },
  emits: ['coins-updated', 'show-alert', 'login', 'go', 'quest', 'replay-vigil', 'replay-anya'],
  data() {
    return {
      GLYPH, LABEL, RESOURCES, GAME_ICONS, NEED_GLYPH, MOOD_GLYPH,
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
      // Savoir que le maître vient de souffler (bible, § 6.4) : { page, chapter, ingredient | family } ou null
      villagerSavoir: null,
      // Le Savoir de Brume, après le Phare : sa réplique et l'indice soufflé
      brumeSaid: '',
      brumeHint: null,
      visitorOpen: false,
      visitorSaid: '',
      clock: Date.now(),
      // Horloge de l'en-tête (heure, moment, temps, soleil) ; journée en accéléré
      skyClock: null,
      warping: false,
      // Fiche de Brume (quête active) ouverte
      questOpen: false,
      // Nom du peuple en cours de saisie (quête « peuple »)
      peopleName: '',
      // Naufrage annoncé (bible, § 6.7) : { id, zone, wreck, text } ou null
      wreck: null,
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
    // Ce que propose Brume pour la quête active pas encore faite (hors Récolte et nom du peuple) : { label, run } ou null
    questAction() {
      const quest = this.quest;
      const state = this.state;
      if (!quest || quest.done || !state) return null;
      const target = quest.target || {};
      const grimoire = { label: quest.ariane ? 'Voir dans le Grimoire' : 'Ouvrir le Grimoire', run: () => this.$emit('go', 'infinite') };
      const sheetOf = id => ({ label: 'Fiche du Foyer', run: () => this.openSiteSheet(id, 'annexes') });
      const look = (label, cell) => (cell ? { label, run: () => this.lookAtCell(cell.x, cell.y) } : null);
      if (quest.chapter || quest.ariane || quest.kind === 'stars' || quest.kind === 'element') return grimoire;
      if (quest.kind === 'need' || quest.kind === 'wake') {
        const who = (state.villagers || []).find(v => v.id === target.villager);
        return who ? { label: `Voir ${who.name}`, run: () => this.openVillager(who.id) } : null;
      }
      if (quest.kind === 'heart') {
        const best = (state.villagers || []).reduce((a, b) => (!a || b.points > a.points ? b : a), null);
        return best ? { label: `Voir ${best.name}`, run: () => this.openVillager(best.id) } : null;
      }
      if (quest.kind === 'crafts' || quest.kind === 'craft') return { label: 'Ouvrir l’établi', run: () => this.openBench() };
      if (quest.kind === 'annex' || quest.kind === 'house') return sheetOf('foyer');
      if (quest.kind === 'visitor' || quest.kind === 'settle') {
        return state.visitor ? { label: 'Voir le voyageur', run: () => this.openVisitor() } : look('Montrer le Ponton', state.sites.find(s => s.id === 'ponton'));
      }
      if (quest.kind === 'expedition') {
        const zone = state.map.zones.find(z => z.known === false && z.explorable && z.anchor);
        return look('Montrer une terre à explorer', zone && zone.anchor);
      }
      if (quest.kind === 'landmark' && !target.landmark) return look('Montrer un lieu', landmarksWaiting(state)[0]);
      if (quest.kind === 'gather') return look('Montrer un gisement', depositsReady(state)[0]);
      return quest.target ? { label: 'Montrer', run: () => this.showQuestTarget() } : null;
    },
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
    // L'étape de civilisation (bible, § 6.10) : déduite des actes finis et du nom du peuple
    civStage() {
      return this.state && this.state.brume ? civilizationOf(this.state.brume.acts, this.state.people) : null;
    },
    quest() {
      return this.state && this.state.brume ? this.state.brume.quest : null;
    },
    // Les actes finis (Brume) : le Grand Œuvre, la lumière de l'île et le stade de Brume (game/opus.js)
    actsDone() {
      return (this.state && this.state.brume && this.state.brume.acts) || [];
    },
    brumeState() {
      return brumeLook({ acts: this.actsDone, quest: this.quest, elements: this.elements });
    },
    // Un mot d'Héliane dans la bouteille ouverte par « Tout ouvrir » (bible, § 6.13)
    haulNote() {
      const bottle = (this.haul || []).find(chest => chest.story);
      return bottle ? noteOf(bottle.source, bottle.story) : '';
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
    // La quête qui ouvre un acte annonce son naufrage, une fois par appareil ; jamais par-dessus un coffre : il attend
    // que le coffre se referme
    'quest.id'() {
      this.checkWreck();
    },
    // Un coffre refermé : le naufrage, puis la veillée qui l'attendait (App.vue)
    reveal(open) {
      if (open) return;
      this.checkWreck();
      this.emitQuest();
    },
    haul(open) {
      if (open) return;
      this.checkWreck();
      this.emitQuest();
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
    if (this.cam) memory.view = { cam: { ...this.cam }, site: this.site ? this.site.id : null, siteTab: this.siteTab };
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
        this.bestiaryTips(state);
        // Acte VI : Galet a lu la dernière rune ; Brume comprend (dit une fois)
        if (secretDue(state.brume && state.brume.acts, state.brume && state.brume.quest)) {
          SECRET.forEach(line => guide.say({ id: line.id, text: line.text, ...(line.who ? { who: line.who, face: faceHref(line.face) } : {}) }));
        }
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
      // Un dormeur qu'on vient de réveiller (bible, § 6.7) : l'île le dit
      if (this.state) {
        const slept = new Set((this.state.villagers || []).filter(v => v.asleep).map(v => v.id));
        (state.villagers || []).filter(v => slept.has(v.id) && !v.asleep).forEach(v => this.$emit('show-alert', `${v.name} se réveille !`));
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
      if (!this.state && memory.view && memory.view.site) {
        this.site = state.sites.find(s => s.id === memory.view.site) || null;
        this.siteTab = memory.view.siteTab || 'overview';
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
        climates: state.map.zones.map(z => z.climate || null), avoid: [...landmarksShown(state), ...depositsShown(state)],
        // La troupe rencontrée (serveur) : bâtie, au camp, ou endormie
        troupe: (state.villagers || []).filter(v => v.seed === undefined).map(v => ({ id: v.id, built: v.built !== false, asleep: Boolean(v.asleep) })),
        written: this.elements,
        // Anya révélée : au Cercle de menhirs ; le bol de la Dame, dès qu'on la pressent (le Cercle trouvé, une trace)
        anya: state.anya && state.anya.revealed ? (state.landmarks || []).find(l => l.id === 'menhirs' && l.x !== undefined) || null : null,
        dame: Boolean((state.landmarks || []).some(l => l.id === 'menhirs' && l.found) || (state.anya && state.anya.traces.length))
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
      this.emitQuest();
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
      // La lumière suit le Grand Œuvre (?oeuvre= pour l'imposer pendant les essais)
      return phaseAt(date, { weather: this.forced ? this.forced.weather : null, opus: (this.forced && this.forced.opus) || opusOf(this.actsDone) });
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

    ...cameraMethods,

    ...drawMethods,

    ...gestureMethods,
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
      const look = resident ? resident.look : { skin: '#F6D3B3', hair: '#7A4E2C', ...ROLES[id] };
      return spriteUrl(`portrait-${id}-${look.skin}-${look.hair}`, () => villagerSprite(look));
    },
    openVillager(id) {
      this.site = null;
      this.villagerId = id;
      this.villagerSaid = '';
      this.villagerPopped = 0;
      this.villagerSavoir = null;
    },
    savoirOf,
    // Les Savoirs et le Bestiaire, dits une fois (bible, § 6.4 et § 6.5) : un maître à qui bavarder ; Bulle revenu dans
    // le bocal d'Ondin ; une bête écrite qui vit sur l'île (Sylve la présente, si elle est là)
    bestiaryTips(state) {
      const troupe = new Set((state.villagers || []).map(v => v.id));
      if (troupe.size) guide.tip('savoirs');
      const written = new Set(this.elements);
      if (troupe.has('puits') && written.has('Poisson')) guide.tip('bulle');
      if (BEASTS.some(name => name !== 'Poisson' && written.has(name))) {
        const sylve = troupe.has('bosquet');
        guide.say({ id: 'bestiaire', ...(sylve ? { text: TIPS.bestiaireSylve, who: 'Sylve', face: faceHref('bosquet') } : { text: TIPS.bestiaire }) });
        // Le troisième pressentiment d'Anya (bible, § 10, acte IV) : les bêtes se tournent vers la Lande aux Menhirs
        // (plus de pressentiment une fois Anya éveillée)
        if (!(state.anya && state.anya.awake)) PRESENTIMENTS.betes.forEach(line => guide.say(line));
      }
      // Le deuxième (acte III) : au Cercle de menhirs, la rune de Celle-qui-donne-souffle
      if ((state.landmarks || []).some(l => l.id === 'menhirs' && l.found) && !(state.anya && state.anya.awake)) {
        PRESENTIMENTS.rune.forEach(line => guide.say({ id: line.id, text: line.text, who: line.who, face: faceHref(line.face) }));
      }
    },
    // Bavarder : au premier bavardage du jour, un maître souffle un Savoir sur une page de son Art ; l'appareil le
    // garde (comme l'Encre) et dit au serveur les pages dont il a déjà un indice
    async talkVillager() {
      await this.befriend(() => playService.villagerTalk(this.villagerId, heardPages()), (v, hearts, { savoir }) => {
        if (!savoir) return talkLine(v.id, hearts);
        keepSavoir(savoir, v.name);
        this.villagerSavoir = savoir;
        return savoirLine(v.id, savoir);
      });
    },
    // Le Souffle d'Anya (bible, § 6.14) : une fois par jour, un ingrédient sur n'importe quelle page à portée, gardé comme
    // un Savoir
    async breatheAnya(px, py) {
      if (this.busy) return;
      if (this.state.anya && this.state.anya.breathed) {
        this.showTip(px, py, { title: 'Anya', text: 'Demain. La terre se repose aussi.' });
        return;
      }
      this.busy = true;
      try {
        const { savoir, world } = await playService.villagerTalk('anya', heardPages());
        this.apply(world);
        if (savoir) keepSavoir(savoir, 'Anya');
        const text = savoir ? `${BREATH_LINE} Sur une page du chapitre ${savoir.chapter}, il faut « ${savoir.ingredient} ».` : 'Le Grimoire n’a pas de page qui m’attende. Écris encore.';
        this.showTip(px, py, { title: 'Anya', text });
        vibrate([8, 30, 8]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Anya n’a pas pu souffler.'));
      } finally {
        this.busy = false;
      }
    },
    // Bavarder avec Brume, le Phare allumé : un Savoir par jour sur les Légendes ; s'il n'y a pas de page, rien n'est compté
    async talkBrume() {
      if (this.busy) return;
      this.busy = true;
      try {
        const { savoir, world } = await playService.villagerTalk('brume', heardPages());
        this.apply(world);
        this.brumeHint = savoir;
        if (savoir) keepSavoir(savoir, 'Brume');
        this.brumeSaid = savoir ? savoirLine('brume', savoir) : 'Aucune page des Légendes n’est encore à portée : écris encore, et reviens me voir.';
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Brume n’a pas pu répondre.'));
      } finally {
        this.busy = false;
      }
    },
    openBrumeSavoir() {
      const { page } = this.brumeHint;
      this.questOpen = false;
      this.$emit('go', 'infinite', page);
    },
    // « Voir dans le Grimoire » : le Grimoire s'ouvre sur la page soufflée
    openSavoir() {
      const { page } = this.villagerSavoir;
      this.villagerId = null;
      this.$emit('go', 'infinite', page);
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
        const reply = await call();
        const { hearts, rewards, coins, world } = reply;
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.villagerSaid = lineOf(friend, hearts, reply);
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
      // Le coffre va s'ouvrir : ni naufrage ni scène par-dessus (ils attendent qu'il se referme)
      const held = this.holdWreck;
      this.holdWreck = true;
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
        this.holdWreck = held;
        this.emitQuest();
      }
    },
    // « Tout ouvrir » : le serveur ouvre tout ce qui attend (jour, chapitres, quêtes, bouteille), l'île montre la rafale
    async openAllChests() {
      if (this.busy) return;
      this.busy = true;
      const held = this.holdWreck;
      this.holdWreck = true;
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
        this.holdWreck = held;
        this.emitQuest();
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
        note: source.startsWith('bouteille:') ? noteOf(source, chest.story) : '',
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

<!-- Styles de l'île, globaux : toutes les classes sont préfixées world__, et les fiches peuvent devenir des composants
     enfants qui s'en servent (un style « scoped » n'atteint pas l'intérieur d'un composant enfant) -->
<style>
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
.world__brume-art { margin: 0 0 8px; font-size: 13px; font-weight: 700; color: var(--ink-500); }
.world__quest { display: grid; grid-template-columns: 1fr auto; gap: 6px 10px; padding: 10px 12px; border-radius: 14px; background: var(--vellum-200); }
.world__quest-label { font-weight: 900; }
.world__wreck {
  position: absolute; inset: 0; z-index: 40; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  padding: 0 20px 18%; background: #0B1630; color: #F4EEDC; cursor: pointer; text-align: center;
}
.world__wreck-scene { position: absolute; inset: 0; width: 100%; height: 100%; }
.world__wreck-text {
  position: relative; max-width: 420px; margin: 0 0 10px; font-family: var(--font-display); font-style: italic; font-size: 19px; line-height: 1.4;
  text-shadow: 0 2px 8px rgba(0, 0, 0, .6);
}
.world__wreck-hint { position: relative; font-size: 13px; font-weight: 800; letter-spacing: .08em; opacity: .7; }
.world__wreck-ship { animation: world-wreck-bob 3.2s ease-in-out infinite; }
.world__wreck-fog { animation: world-wreck-fog 9s ease-in-out infinite alternate; }
@keyframes world-wreck-bob { 50% { transform: translateY(3px); } }
@keyframes world-wreck-fog { to { transform: translateX(-24px); } }
.world-wreck-enter-active, .world-wreck-leave-active { transition: opacity .6s ease; }
.world-wreck-enter-from, .world-wreck-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .world__wreck-ship, .world__wreck-fog { animation: none; }
}
.world__quest-lock { margin: 10px 0 0; font-size: 14px; font-weight: 700; color: var(--oc-text-muted, #7A6A58); }
.world__people { display: flex; gap: 8px; width: 100%; }
.world__civ { display: block; margin: -2px 0 6px; font-family: var(--font-display); font-style: italic; font-size: 14px; color: var(--ink-700); }
.world__civ--site { margin: 0 0 10px; font-size: 15px; }
.world__people-input {
  flex: 1; min-width: 0; padding: 10px 12px; border: 2px solid var(--vellum-300, #E6D8B8); border-radius: 12px;
  font: inherit; font-weight: 700; background: #FFFDF6; color: inherit;
}
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
