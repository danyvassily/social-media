require('dotenv').config({ path: './config/.env' });
const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("Erreur : MONGODB_URL n'est pas définie dans le fichier .env");
  process.exit(1); // Arrête le serveur si MONGODB_URL n'est pas définie
}


// Connexion à MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.log("Erreur de connexion à MongoDB:", err));
