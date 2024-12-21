<template>
    <div id="inventory">
        <h2>Inventory</h2>
        <div v-for="(category, index) in filteredCategories" :key="index" class="category">
            <div class="category-header">
                <span class="category-title">{{ category.name }}</span>
                <div class="progress-bar">
                    <div class="progress-bar-fill" :style="{ width: category.progress + '%' }"></div>
                </div>
            </div>
            <div class="category-content">
                <div v-for="element in category.elements" :key="element" class="inventory-item"
                    @click="$emit('selectResource', element)">
                    {{ elementEmojis[element] || '' }} {{ element }}
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
    computed: {
        filteredCategories() {
            return Object.entries(this.categories)
                .map(([name, elements]) => {
                    const filteredElements = Array.isArray(elements)
                        ? elements.filter((el) => this.discoveredElements.includes(el))
                        : []; // Assure-toi que `elements` est un tableau

                    return {
                        name: name.replace(/_/g, " "),
                        progress: (filteredElements.length / elements.length) * 100,
                        elements: filteredElements,
                    };
                })
                .filter((category) => this.discoveredCategories.includes(category.name));
        },
    },
};
</script>