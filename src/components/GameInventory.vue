<template>
    <div id="inventory">
      <h2>Inventory</h2>
      <div v-for="(category, index) in filteredCategories" :key="index" class="category">
        <div
          class="category-header"
          @mouseenter="showCategory(index)"
          @mouseleave="hideCategory(index)"
        >
          <span class="category-title">{{ category.name }}</span>
          <div class="progress-bar">
            <div class="progress-bar-fill" :style="{ width: category.progress + '%' }"></div>
          </div>
        </div>
        <div class="category-content" v-show="category.visible">
          <div
            v-for="resource in category.resources"
            :key="resource.name"
            class="inventory-item"
            @click="selectResource(resource.name)"
          >
            {{ resource.emoji }} {{ resource.name }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      categories: {
        type: Object,
        required: true,
      },
      discoveredCategories: {
        type: Array,
        required: true,
      },
      discoveredElements: {
        type: Array,
        required: true,
      },
      elementEmojis: {
        type: Object,
        required: true,
      },
    },
    emits: ["selectResource"],
    data() {
      return {
        visibleCategories: {}, // Gestion de la visibilité des catégories
      };
    },
    computed: {
      filteredCategories() {
        return Object.entries(this.categories).map(([name, elements]) => {
          if (!this.discoveredCategories.includes(name)) return null;
  
          const discoveredResources = elements.filter((resource) =>
            this.discoveredElements.includes(resource)
          );
          const progress = Math.floor((discoveredResources.length / elements.length) * 100);
  
          return {
            name: name.replace(/_/g, " "),
            progress,
            resources: discoveredResources.map((resource) => ({
              name: resource,
              emoji: this.elementEmojis[resource] || "",
            })),
            visible: false,
          };
        }).filter(Boolean); // Filtre les catégories non découvertes
      },
    },
    methods: {
      showCategory(index) {
        this.filteredCategories[index].visible = true;
      },
      hideCategory(index) {
        this.filteredCategories[index].visible = false;
      },
      selectResource(resource) {
        this.$emit("selectResource", resource); // Remonte l'élément sélectionné à App.vue
      },
    },
  };
  </script>
