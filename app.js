// Importation des dépendances nécessaires
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const adminRoutes = require("./routes/admin.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

// Création de l'application Express
const app = express();

// Configuration des options CORS pour la sécurité cross-origin
const corsOptions = {
  // URL du client autorisé, par défaut localhost:3000
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  // Autorise l'envoi de cookies
  credentials: true,
  // Headers autorisés
  allowedHeaders: ["Content-Type", "Authorization"],
  // Headers exposés au client
  exposedHeaders: ["Set-Cookie"],
  // Méthodes HTTP autorisées
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Application des middlewares globaux
app.use(cors(corsOptions));
app.use(express.json()); // Pour parser le JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les données de formulaire
app.use(cookieParser()); // Pour gérer les cookies

// Middleware de logging pour débuggage
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Configuration des routes publiques
app.use("/api/user", userRoutes);

// Route protégée pour vérifier le JWT
app.get("/api/jwtid", requireAuth, (req, res) => {
  res.status(200).json({ id: res.locals.user._id });
});

// Configuration des routes protégées nécessitant une authentification
app.use("/api/post", requireAuth, postRoutes);
app.use("/api/admin", requireAuth, adminRoutes);

// Middleware de gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  res.status(500).json({
    error: "Une erreur est survenue sur le serveur",
  });
});

// Export de l'application pour utilisation dans d'autres fichiers
module.exports = app;
