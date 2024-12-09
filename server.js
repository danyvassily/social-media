/**
 * Configuration des variables d'environnement
 */
require("dotenv").config({ path: "./config/.env" });

/**
 * Import des dépendances principales
 * @const {Express} app - L'application Express
 */
const app = require("./app");

/**
 * Import de la fonction de connexion à la base de données
 * @const {Function} connectDB - Fonction de connexion à MongoDB
 */
const connectDB = require("./config/db");

/**
 * Connexion à MongoDB seulement si l'environnement n'est pas en mode test
 */
if (process.env.NODE_ENV !== "test") {
  connectDB(process.env.MONGODB_URL);
}

/**
 * Configuration du port du serveur
 * @const {number} PORT - Le port sur lequel le serveur va écouter
 */
const PORT = process.env.PORT || 3000;

/**
 * Démarrage du serveur
 * @const {http.Server} server - L'instance du serveur HTTP
 */
const server = app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});

/**
 * Export des modules pour les tests
 * @exports {Object} - Contient l'application Express et l'instance du serveur
 */
module.exports = { app, server };
