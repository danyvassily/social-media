const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const multer = require("multer");

// Configuration de Multer pour les uploads d'images dans les commentaires
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes d'authentification
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// Routes pour les utilisateurs
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.delete("/:id", userController.deleteUser);

module.exports = router;
