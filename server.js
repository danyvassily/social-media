require("dotenv").config({ path: "./config/.env" });
const app = require("./app");
const connectDB = require("./config/db");

// Connexion à la base de données
connectDB(process.env.MONGODB_URL);

// Démarrage du serveur
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});

module.exports = { app, server };
