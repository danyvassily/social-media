const router = require("express").Router(); // Création d'un routeur Express
const authController = require("../controllers/auth.controller"); // Importation du contrôleur d'authentification
const userController = require("../controllers/user.controller"); // Importation du contrôleur utilisateur
const multer = require("multer"); // Importation de Multer pour gérer les uploads (non utilisé ici)

// Configuration de Multer pour les uploads d'images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes d'authentification
router.post("/register", authController.signUp); // Route pour l'inscription d'un nouvel utilisateur
router.post("/login", authController.signIn); // Route pour la connexion d'un utilisateur existant
router.get("/logout", authController.logout); // Route pour la déconnexion d'un utilisateur

// Routes pour les utilisateurs
router.get("/", userController.getAllUsers); // Route pour récupérer tous les utilisateurs
router.get("/:id", userController.userInfo); // Route pour récupérer les informations d'un utilisateur spécifique
router.delete("/:id", userController.deleteUser); // Route pour supprimer un utilisateur spécifique

module.exports = router; // Exportation du routeur
