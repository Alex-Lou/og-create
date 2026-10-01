    // services/gameService.js
    import AuthService from './authService';
    import GameDataService from './gameDataService';
    import TimerService from './timerService';

    /**
     * Service principal du jeu qui intègre les autres services
     */
    class GameService {
    constructor() {
        this.cache = {};
        this.loadingPromises = {};
        
        // Référencer les autres services
        this.dataService = GameDataService;
        this.timerService = TimerService;
    }
    
    /**
     * Vérifie si l'utilisateur est authentifié
     * @returns {boolean} - True si l'utilisateur est authentifié
     */
    isAuthenticated() {
      return AuthService.isAuthenticated();
    }
    
    // ----- MÉTHODES GÉNÉRALES (DÉLÉGUÉES À GAMEDATASERVICE) -----
    
    /**
     * Charge un fichier JSON depuis le serveur
     * @param {string} filename - Nom du fichier sans extension
     * @returns {Promise<Object>} - Le contenu du fichier JSON
     */
    async loadFile(filename) {
        return this.dataService.loadFile(filename);
    }
    
    /**
     * Vide le cache côté client
     */
    clearCache() {
        // Vider le cache local et celui du service de données
        this.cache = {};
        this.loadingPromises = {};
        this.dataService.clearCache();
    }
    
    // ----- MÉTHODES SPÉCIFIQUES AU MODE TIMER (DÉLÉGUÉES À TIMERSERVICE) -----
    
    /**
     * Sauvegarde les éléments du mode Timer
     * @param {Array<string>} elements - Éléments à sauvegarder
     * @returns {Promise<Object>} - Confirmation de la sauvegarde
     */
    async saveTimerElements(elements) {
        return this.timerService.saveTimerElements(elements);
    }

    /**
     * Charge la progression du Timer
     * @returns {Promise<Object>} - Progression du Timer
     */
    async loadTimerProgress() {
        return this.timerService.loadTimerProgress();
    }
    
    /**
     * Charge les éléments du Timer
     * @param {number} questionId - ID de la question (optionnel)
     * @returns {Promise<Array<string>>} - Liste des éléments disponibles
     */
    async loadTimerElements(questionId = null) {
        return this.timerService.loadTimerElements(questionId);
    }

    /**
     * Met à jour la progression du timer
     * @param {Object} timerProgress - Nouvelle progression
     * @returns {Promise<Object>} - Confirmation de la mise à jour
     */
    async updateTimerProgress(timerProgress) {
        return this.timerService.updateTimerProgress(timerProgress);
    }

    /**
     * Débloque une catégorie
     * @param {string} difficulty - Niveau de difficulté
     * @param {string} categoryName - Nom de la catégorie
     * @returns {Promise<boolean>} - True si la catégorie a été débloquée
     */
    async unlockCategory(difficulty, categoryName) {
        return this.timerService.unlockCategory(difficulty, categoryName);
    }
    
    /**
     * Obtient l'emoji d'un élément
     * @param {string} elementName - Nom de l'élément
     * @returns {string} - Emoji correspondant
     */
    getElementEmoji(elementName) {
        return this.timerService.getElementEmoji(elementName);
    }
    }

    // Exporter une instance unique du service
    export default new GameService();