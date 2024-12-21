<template>
    <div v-if="achievement" id="achievement-popup" class="xyz-in"
        xyz="appear-front-5 fade flip-down-50% duration-5 ease-elastic-out-10">
        <div ref="particleContainer" class="gsap-particles-container"></div>
        <div class="popup-content">
            <button class="close-button" @click="closePopup">&times;</button>
            <img v-if="achievement?.image" :src="achievement.image" :alt="achievement.name" class="xyz-nested"
                xyz="fade small flip-down-50% duration-10 delay-2 ease-out-back" />
            <div class="achievement-text xyz-nested" xyz="fade up small-75% delay-3">
                <h3>{{ achievement?.name }}</h3>
                <p>{{ achievement?.description }}</p>
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
    },
    emits: ["close", "achievements-loaded"], // Ajout d'un événement pour signaler les succès chargés
    data() {
        return {
            achievements: [], // Contiendra la liste des succès
        };
    },
    methods: {
        closePopup() {
            this.$emit("close");
        },
        async loadAchievements() {
            try {
                const response = await fetch("/data/achievements.json");
                const data = await response.json();

                this.achievements = data.map((achievement) => ({
                    ...achievement,
                    image: require(`@/assets/success/${achievement.name}.png`),
                    condition: new Function("return " + achievement.condition).bind(this),
                }));

                this.$emit("achievements-loaded", this.achievements); // Informer le parent que les succès sont chargés
            } catch (error) {
                console.error("Erreur lors du chargement des succès :", error);
            }
        },
    },
    mounted() {
        this.loadAchievements(); // Charger automatiquement les succès au montage
    },
};
</script>
