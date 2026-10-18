<template>
  <!-- L'accueil d'un arrivant, venu en barque au Ponton (serveur : services/world/people.js, welcomeArrival) : on compose
       son allure dans l'éditeur de l'avatar (d'abord celle que tire sa graine, assorti ; « Au hasard » en tire une autre),
       on choisit son métier (un bâtiment bâti) et son prénom. Il s'installe dans une maison libre ; sans elle, on ne
       peut que revenir plus tard -->
  <div class="arw" role="dialog" aria-modal="true" aria-labelledby="arw-title">
    <AvatarMaker v-if="choices" v-model="choices" :castaway="false" :vague="false" class="arw__editor">
      <template #thought>
        <p id="arw-title" class="arw__thought">{{ T.moments[arrival.moment] || T.moments.ponton }}</p>
      </template>
      <template #actions>
        <form class="arw__form" @submit.prevent="submit">
          <label class="arw__name">
            <span class="arw__label">{{ T.name }}</span>
            <input v-model="name" type="text" :maxlength="arrival.nameMax" autocomplete="off" spellcheck="false" required />
          </label>
          <div class="arw__roles" role="radiogroup" :aria-label="T.work">
            <button
              v-for="r in roles" :key="r.site" type="button" role="radio" :aria-checked="site === r.site"
              :class="['arw__role', { 'is-on': site === r.site }]" @click="site = r.site"
            >{{ T.role(r.role, r.place) }}</button>
          </div>
          <p v-if="!freeHouse" class="arw__note">{{ T.noHouse }}</p>
          <p v-if="nameError || error" class="arw__error" role="alert">{{ nameError || error }}</p>
          <div class="arw__actions">
            <button type="button" class="arw__back" @click="$emit('close')">{{ T.later }}</button>
            <button type="submit" class="arw__ok" :disabled="busy || !freeHouse || !site">{{ T.welcome }}</button>
          </div>
        </form>
      </template>
    </AvatarMaker>
    <p v-else class="arw__wait g-italic">{{ T.wait }}</p>
  </div>
</template>

<script>
import AvatarMaker from '@/components/Prologue/AvatarMaker/AvatarMaker.vue';
import { loadKit } from '@/game/avatarKit';
import { cleanName } from '@/utils/names';
import { NAME_RULE } from '@/texts/ui/names';
import { ARRIVAL_WELCOME as T } from '@/texts/world/screens/folk';

export default {
  name: 'ArrivalWelcome',
  components: { AvatarMaker },
  props: {
    // Vue du serveur : { id, moment, seed, name (le prénom qu'on lui propose), nameMax, roles }
    arrival: { type: Object, required: true },
    // Les métiers possibles : [{ site, role, place (le nom du bâtiment) }]
    roles: { type: Array, required: true },
    // Maisons du Foyer : { total, used }
    houses: { type: Object, default: () => ({ total: 0, used: 0 }) },
    busy: { type: Boolean, default: false },
    error: { type: String, default: '' }
  },
  // welcome : { site, name, look } ; close : plus tard (il attend au Ponton)
  emits: ['welcome', 'close'],
  data() {
    return { T, choices: null, name: this.arrival.name || '', site: (this.roles[0] || {}).site || null, nameError: '' };
  },
  computed: {
    freeHouse() {
      return this.houses.total > this.houses.used;
    }
  },
  created() {
    // Son allure de départ : celle que sa graine tire, la même que sur l'île (world/arrivantArt.js)
    loadKit().then(kit => {
      if (kit && !this.choices) this.choices = kit.assorti(this.arrival.seed, { gratuit: true });
    });
  },
  methods: {
    submit() {
      // Même règle que le serveur (services/world/people.js : cleanName)
      const name = cleanName(this.name, this.arrival.nameMax);
      if (!name) {
        this.nameError = NAME_RULE(this.arrival.nameMax);
        return;
      }
      this.nameError = '';
      if (!this.site || !this.freeHouse || this.busy) return;
      this.$emit('welcome', { site: this.site, name, look: this.choices });
    }
  }
};
</script>

<style scoped src="./ArrivalWelcome.css"></style>
