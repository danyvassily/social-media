require('dotenv').config({ path: './config/.env' }); // Chargement des variables d'environnement depuis le fichier .env
const mongoose = require("mongoose"); // Importation de Mongoose

const connectDB = async (url) => {
  try {
    if (mongoose.connection.readyState !== 0) {
      return;
    }
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connecté à MongoDB");
  } catch (err) {
    console.log("Erreur de connexion à MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;