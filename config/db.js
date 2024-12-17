// Chargement des variables d'environnement depuis le fichier .env
require('dotenv').config({ path: './config/.env' });

// Importation de Mongoose
const mongoose = require("mongoose");

// Fonction de connexion à la base de données MongoDB
const connectDB = async (url) => {
  try {
    // Vérifie si une connexion existe déjà
    if (mongoose.connection.readyState !== 0) {
      return;
    }
    // Connexion à MongoDB avec les options de configuration
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Message de confirmation de connexion réussie
    console.log("Connecté à MongoDB");
  } catch (err) {
    // Gestion des erreurs de connexion
    console.log("Erreur de connexion à MongoDB:", err);
    // Arrêt du processus en cas d'erreur
    process.exit(1);
  }
};

// Export de la fonction de connexion
module.exports = connectDB;