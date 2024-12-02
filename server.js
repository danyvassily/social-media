const express = require("express"); // Importation d'Express
const bodyParser = require("body-parser"); // Importation de body-parser pour analyser les requêtes
const cookieParser = require("cookie-parser"); // Importation de cookie-parser pour gérer les cookies
const cors = require("cors"); // Importation de CORS pour gérer les requêtes cross-origin
const dotenv = require("dotenv"); // Importation de dotenv pour charger les variables d'environnement
const userRoutes = require("./routes/user.routes"); // Importation des routes utilisateur
const postRoutes = require("./routes/post.routes"); // Importation des routes post
const { checkUser, requireAuth } = require("./middleware/auth.middleware"); // Importation des middlewares d'authentification
require("./config/db"); // Connexion à la base de données MongoDB

dotenv.config({ path: "./config/.env" }); // Chargement des variables d'environnement depuis le fichier .env

const app = express(); // Création de l'application Express

// Configuration des options CORS
const corsOptions = {
  origin: process.env.CLIENT_URL, // Origine autorisée (frontend)
  credentials: true, // Autoriser les cookies à être envoyés
  allowedHeaders: ["Content-Type"], // Types d'en-têtes autorisés
  methods: "GET,POST,PUT,DELETE,PATCH", // Méthodes HTTP autorisées
  preflightContinue: false, // Indique si le serveur doit passer au middleware suivant ou non après la réponse preflight
};

app.use(cors(corsOptions)); // Application des options CORS
app.use(bodyParser.json()); // Middleware pour analyser les requêtes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Middleware pour analyser les requêtes URL-encodées
app.use(cookieParser()); // Middleware pour analyser les cookies

// Servir les fichiers statiques dans le dossier uploads
app.use('/uploads', express.static('client/public/uploads'));

// Middleware pour vérifier l'utilisateur pour toutes les routes
app.get("*", checkUser);

// Route pour obtenir l'ID de l'utilisateur authentifié
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id); // Envoie de l'ID de l'utilisateur authentifié
});

// Routes principales
app.use("/api/user", userRoutes); // Routes pour les utilisateurs
app.use("/api/post", postRoutes); // Routes pour les posts

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});

module.exports = app; // Export de l'application Express