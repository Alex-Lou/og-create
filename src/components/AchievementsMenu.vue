<template>
    <div id="achievements-menu">
      <p>Succès</p>
      <div id="achievements-content">
        <ul>
          <li v-for="(achievement, index) in achievements" :key="index" :class="{ unlocked: achievement.unlocked }">
            <img v-if="achievement.image" :src="achievement.image" alt="" class="achievement-icon" />
            {{ achievement.name }} - {{ achievement.description }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      achievements: {
        type: Array,
        required: true,
      },
    },
  };
  </script>
  