<template>
    <div>
      <!-- Menu déroulant des succès -->
      <div id="achievements-menu">
        <p>Succès</p>
        <div id="achievements-content">
          <ul>
            <li
              v-for="(achievement, index) in achievements"
              :key="index"
              :class="{ unlocked: achievement.unlocked }"
            >
              <img
                v-if="achievement.image"
                :src="achievement.image"
                alt=""
                class="achievement-icon"
              />
              {{ achievement.name }} - {{ achievement.description }}
            </li>
          </ul>
        </div>
      </div>
  
      <!-- Popup pour un succès spécifique -->
      <div
        v-if="achievement"
        id="achievement-popup"
        class="xyz-in"
        xyz="appear-front-5 fade flip-down-50% duration-5 ease-elastic-out-10"
      >
        <div ref="particleContainer" class="gsap-particles-container"></div>
        <div class="popup-content">
          <button class="close-button" @click="closePopup">&times;</button>
          <img
            v-if="achievement?.image"
            :src="achievement.image"
            :alt="achievement.name"
            class="xyz-nested"
            xyz="fade small flip-down-50% duration-10 delay-2 ease-out-back"
          />
          <div
            class="achievement-text xyz-nested"
            xyz="fade up small-75% delay-3"
          >
            <h3>{{ achievement?.name }}</h3>
            <p>{{ achievement?.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      achievement: {
        type: Object,
        default: null,
      },
      achievements: {
        type: Array,
        default: () => [],
      },
    },
    emits: ["close"],
    methods: {
      closePopup() {
        this.$emit("close");
      },
    },
  };
  </script>
  