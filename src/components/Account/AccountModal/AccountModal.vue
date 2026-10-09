<template>
  <GModal eyebrow="Le Sceau" title="Mon compte" :width="520" :dismissible="!left" @close="$emit('close')">
    <!-- Parti (pause ou suppression) : un mot, puis la porte -->
    <div v-if="left" class="acc__left" role="status">
      <p class="g-italic acc__left-text">{{ left }}</p>
      <button type="button" class="g-btn" @click="$emit('left')">À bientôt</button>
    </div>

    <p v-else-if="!profile && !error" class="g-italic acc__wait">Un instant…</p>
    <div v-else-if="!profile" class="acc__wait">
      <p class="g-note g-note--error" role="alert">{{ error }}</p>
      <button type="button" class="g-btn g-btn--ghost g-btn--small" @click="load">Réessayer</button>
    </div>

    <template v-else>
      <!-- Qui je suis sur l'île : la photo de la carte d'embarquement et le nom du Grimoire -->
      <section class="acc__who" aria-label="Ton identité">
        <div class="acc__photo">
          <span class="acc__frame"><img v-if="portrait" :src="portrait" alt="" width="48" height="64" /></span>
          <button type="button" class="g-btn g-btn--ghost g-btn--small" :disabled="busy" @click="editing = true">Changer d’apparence</button>
        </div>
        <form class="acc__name" @submit.prevent="saveName">
          <label class="g-mono" for="acc-name">Ton nom sur l’île</label>
          <div class="acc__inline">
            <input id="acc-name" v-model="name" type="text" :maxlength="NAME_MAX" autocomplete="nickname" spellcheck="false" />
            <button type="submit" class="g-btn g-btn--small" :disabled="busy || !nameChanged">Écrire</button>
          </div>
          <p v-if="profile.createdAt" class="g-italic acc__since">Échoué sur l’île le {{ dateOf(profile.createdAt) }}</p>
        </form>
      </section>
      <p v-if="said.who" :class="['g-note', `g-note--${said.who.ok ? 'ok' : 'error'}`]" role="status">{{ said.who.text }}</p>

      <p v-if="profile.provisional" class="g-note acc__provisional">
        Signe d’abord la page de garde du Grimoire : ton compte aura une adresse et un mot de passe, et tu pourras le
        mettre en pause ou le quitter.
      </p>

      <ul class="acc__list">
        <template v-for="part in parts" :key="part.id">
          <li :class="['acc__part', { 'acc__part--open': open === part.id, 'acc__part--danger': part.danger }]">
            <button type="button" class="acc__head" :aria-expanded="open === part.id" :aria-controls="`acc-part-${part.id}`" @click="toggle(part.id)">
              <span class="acc__title">{{ part.title }}</span>
              <span class="acc__note">{{ part.note }}</span>
            </button>
            <div v-if="open === part.id" :id="`acc-part-${part.id}`" class="acc__body">
              <!-- Adresse : elle ne change qu'une fois le lien ouvert -->
              <form v-if="part.id === 'email'" class="acc__form" @submit.prevent="saveEmail">
                <p v-if="profile.pendingEmail" class="g-italic acc__hint">Un lien attend d’être ouvert dans {{ profile.pendingEmail }}.</p>
                <div class="g-field">
                  <label for="acc-email">Nouvelle adresse</label>
                  <input id="acc-email" v-model="email" type="email" autocomplete="email" required />
                </div>
                <div class="g-field">
                  <label for="acc-email-pass">Ton mot de passe</label>
                  <input id="acc-email-pass" v-model="password" type="password" autocomplete="current-password" required />
                </div>
                <div class="acc__actions"><button type="submit" class="g-btn" :disabled="busy">{{ busy ? 'Un instant…' : 'Envoyer le lien' }}</button></div>
              </form>

              <form v-else-if="part.id === 'password'" class="acc__form" @submit.prevent="savePassword">
                <div class="g-field">
                  <label for="acc-current">Mot de passe actuel</label>
                  <input id="acc-current" v-model="password" type="password" autocomplete="current-password" required />
                </div>
                <div class="g-field">
                  <label for="acc-next">Nouveau mot de passe · 8 caractères min.</label>
                  <input id="acc-next" v-model="next" type="password" minlength="8" autocomplete="new-password" required />
                </div>
                <div class="g-field">
                  <label for="acc-again">Encore une fois</label>
                  <input id="acc-again" v-model="again" type="password" minlength="8" autocomplete="new-password" required />
                </div>
                <p class="g-italic acc__hint">Tes autres appareils seront déconnectés.</p>
                <div class="acc__actions"><button type="submit" class="g-btn" :disabled="busy">{{ busy ? 'Un instant…' : 'Changer le mot de passe' }}</button></div>
              </form>

              <div v-else-if="part.id === 'data'" class="acc__form">
                <p class="acc__text">Ton compte, ton île, ton carnet, tes écus : tout ce que le jeu garde sur toi, dans un fichier à garder.</p>
                <div class="acc__actions"><button type="button" class="g-btn" :disabled="busy" @click="download">{{ busy ? 'Un instant…' : 'Télécharger mes données' }}</button></div>
              </div>

              <!-- Recommencer l'île : l'île repart de zéro, le Grimoire et les écus restent, le tutoriel se rejoue -->
              <form v-else-if="part.id === 'restart'" class="acc__form" @submit.prevent="restart">
                <p class="acc__text">
                  Ton île repart de zéro : bâtiments, quartiers, quêtes de Brume, créations, bêtes et habitants. Brume
                  te reprend par la main depuis le début. Ton <strong>Grimoire</strong>, tes <strong>écus</strong>, ton
                  apparence et tes achats restent ; les étoiles des mini-jeux repartent aussi de zéro.
                </p>
                <div class="g-field">
                  <label for="acc-restart">Écris RECOMMENCER pour confirmer</label>
                  <input id="acc-restart" v-model="restartWord" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" required />
                </div>
                <div class="acc__actions">
                  <button type="submit" class="g-btn g-btn--danger" :disabled="busy || restartWord.trim().toUpperCase() !== 'RECOMMENCER'">{{ busy ? 'Un instant…' : 'Recommencer l’île' }}</button>
                </div>
              </form>

              <div v-else-if="part.id === 'pause'" class="acc__form">
                <p class="acc__text">
                  Ton île reste exactement comme elle est, et aucun mail ne part. Tu es déconnecté partout ; pour revenir,
                  reconnecte-toi, tout simplement.
                </p>
                <div class="acc__actions"><button type="button" class="g-btn" :disabled="busy" @click="pause">{{ busy ? 'Un instant…' : 'Mettre en pause' }}</button></div>
              </div>

              <form v-else-if="part.id === 'delete'" class="acc__form" @submit.prevent="remove">
                <p class="acc__text">
                  Ton île, tes habitants, ton carnet et tes écus seront effacés <strong>dans {{ GRACE_DAYS }} jours</strong>.
                  D’ici là, te reconnecter annule tout. Ensuite, plus rien ne pourra être retrouvé.
                </p>
                <div class="g-field">
                  <label for="acc-delete-pass">Ton mot de passe, pour confirmer</label>
                  <input id="acc-delete-pass" v-model="password" type="password" autocomplete="current-password" required />
                </div>
                <div class="acc__actions"><button type="submit" class="g-btn g-btn--danger" :disabled="busy">{{ busy ? 'Un instant…' : 'Supprimer mon compte' }}</button></div>
              </form>
            </div>
          </li>
          <li v-if="said[part.id]" class="acc__said">
            <p :class="['g-note', `g-note--${said[part.id].ok ? 'ok' : 'error'}`]" role="status">{{ said[part.id].text }}</p>
          </li>
        </template>
      </ul>
    </template>
    <!-- Changer d'apparence : l'éditeur de la carte d'embarquement, par-dessus -->
    <Teleport to="body">
      <PrologueAvatar v-if="editing" style="z-index: calc(var(--z-modal) + 10)" editing :start="look" :busy="busy" :error="lookError" @chosen="saveLook" @close="editing = false; lookError = ''" />
    </Teleport>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import accountService from '@/services/accountService';
import playService from '@/services/playService';
import { defineAsyncComponent } from 'vue';
import { LOOKS, DEFAULT_LOOK, avatarFrames } from '@/game/sceneArt';
import { isCustom } from '@/game/avatarKit';
import { NAME_MAX, cleanName } from '@/utils/names';
import { messageOf } from '@/utils/errors';

// L'éditeur d'avatar (et son catalogue) : chargé seulement quand on modifie son avatar
const PrologueAvatar = defineAsyncComponent(() => import('@/components/Prologue/PrologueAvatar/PrologueAvatar.vue'));

const GRACE_DAYS = 7;
const dateOf = iso => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

// « Mon compte », ouvert depuis le Sceau : nom et photo sur l'île, adresse, mot de passe, mes données, recommencer l'île,
// pause, départ.
// Une seule rubrique ouverte à la fois ; chaque réponse s'écrit sous sa rubrique
export default {
  name: 'AccountModal',
  components: { GModal, PrologueAvatar },
  // look : l'avatar gardé (ses choix) ; left : le compte est en pause ou en partance (l'appli se déconnecte) ;
  // restarted : l'île est recommencée (le jeu reprend le tutoriel)
  emits: ['close', 'look', 'left', 'restarted'],
  data() {
    return {
      NAME_MAX, GRACE_DAYS,
      profile: null, error: '', open: null, busy: false, left: '',
      name: '', look: DEFAULT_LOOK, editing: false, lookError: '', email: '', password: '', next: '', again: '', restartWord: '',
      said: {}
    };
  },
  computed: {
    parts() {
      if (this.profile.provisional) return [{ id: 'data', title: 'Mes données', note: 'Tout ce que le jeu garde sur toi' }];
      return [
        { id: 'email', title: 'Adresse e-mail', note: this.profile.email },
        { id: 'password', title: 'Mot de passe', note: 'Le changer' },
        { id: 'data', title: 'Mes données', note: 'Tout ce que le jeu garde sur toi' },
        { id: 'restart', title: 'Recommencer l’île', note: 'Ton Grimoire et tes écus restent ; le tutoriel se rejoue', danger: true },
        { id: 'pause', title: 'Faire une pause', note: 'Ton île t’attend, telle quelle' },
        { id: 'delete', title: 'Supprimer mon compte', note: `Effacé dans ${GRACE_DAYS} jours, sauf si tu reviens`, danger: true }
      ];
    },
    portrait() {
      return avatarFrames(this.look, { naufrage: false })[0];
    },
    nameChanged() {
      return this.name.trim() !== (this.profile.name || '');
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    dateOf,
    async load() {
      this.error = '';
      try {
        this.profile = await accountService.profile();
        this.name = this.profile.name || '';
        this.look = isCustom(this.profile.look) || LOOKS.includes(this.profile.look) ? this.profile.look : DEFAULT_LOOK;
      } catch (error) {
        this.error = messageOf(error, 'Ton compte n’a pas pu être lu.');
      }
    },
    toggle(id) {
      this.open = this.open === id ? null : id;
      this.password = this.next = this.again = this.restartWord = '';
    },
    // Une action : occupé pendant, sa réponse écrite sous sa rubrique ; rend le résultat, ou null si refusée
    async act(where, run, fallback) {
      this.busy = true;
      this.said = { ...this.said, [where]: null };
      try {
        return await run();
      } catch (error) {
        this.said = { ...this.said, [where]: { ok: false, text: messageOf(error, fallback) } };
        return null;
      } finally {
        this.busy = false;
      }
    },
    tell(where, text) {
      this.said = { ...this.said, [where]: { ok: true, text } };
    },
    async saveName() {
      // Même règle que les noms de l'île (serveur : services/naming.js)
      const name = cleanName(this.name);
      if (!name) {
        this.said = { ...this.said, who: { ok: false, text: `Un nom de 2 à ${NAME_MAX} lettres ou chiffres (espace, tiret ou apostrophe entre deux).` } };
        return;
      }
      if (await this.act('who', () => playService.worldPlayer(name), 'Le nom n’a pas pu être écrit.')) {
        this.profile = { ...this.profile, name };
        this.name = name;
        this.tell('who', 'Ton nom est écrit dans le Grimoire.');
      }
    },
    // L'éditeur rend ses choix : le serveur les vérifie un à un, puis les garde
    async saveLook({ look }) {
      this.busy = true;
      this.lookError = '';
      try {
        const world = await playService.worldAvatar(look);
        this.look = world.avatar || look;
        this.profile = { ...this.profile, look: this.look };
        this.$emit('look', this.look);
        this.editing = false;
        this.tell('who', 'Nouvelle allure, même naufragé.');
      } catch (error) {
        this.lookError = messageOf(error, 'Ton apparence n’a pas pu être gardée.');
      } finally {
        this.busy = false;
      }
    },
    async saveEmail() {
      const done = await this.act('email', () => accountService.changeEmail(this.password, this.email.trim()), 'L’adresse n’a pas pu être changée.');
      if (!done) return;
      this.profile = { ...this.profile, pendingEmail: done.pendingEmail };
      this.open = null;
      this.email = this.password = '';
      this.tell('email', done.message);
    },
    async savePassword() {
      if (this.next !== this.again) {
        this.said = { ...this.said, password: { ok: false, text: 'Les deux mots de passe ne sont pas identiques.' } };
        return;
      }
      const done = await this.act('password', () => accountService.changePassword(this.password, this.next), 'Le mot de passe n’a pas pu être changé.');
      if (!done) return;
      this.open = null;
      this.password = this.next = this.again = '';
      this.tell('password', done.message);
    },
    async download() {
      const data = await this.act('data', () => accountService.exportData(), 'Tes données n’ont pas pu être préparées.');
      if (!data) return;
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = Object.assign(document.createElement('a'), { href: url, download: 'brumelune-mes-donnees.json' });
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.tell('data', 'Le fichier est parti dans tes téléchargements.');
    },
    async restart() {
      const done = await this.act('restart', () => playService.worldRestart('RECOMMENCER'), 'L’île n’a pas pu être recommencée.');
      if (done) this.$emit('restarted');
    },
    async pause() {
      const done = await this.act('pause', () => accountService.suspend(), 'Le compte n’a pas pu être mis en pause.');
      if (done) this.left = 'Ton île s’endort sous la brume, telle quelle. Reconnecte-toi quand tu veux : Brume veille.';
    },
    async remove() {
      const done = await this.act('delete', () => accountService.remove(this.password), 'La suppression n’a pas pu être prévue.');
      if (done) this.left = `Ton compte sera effacé le ${dateOf(done.deleteAt)}. D’ici là, te reconnecter suffit pour tout garder.`;
    }
  }
};
</script>

<style scoped src="./AccountModal.css"></style>
