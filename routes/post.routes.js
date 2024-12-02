const router = require("express").Router(); // Création d'un routeur Express
const postController = require("../controllers/post.controller"); // Importation du contrôleur des posts
const uploadController = require("../controllers/upload.controller"); // Importation du contrôleur des uploads
const multer = require("multer"); // Importation de Multer pour gérer les uploads de fichiers

// Configuration de Multer pour les uploads d'images dans les commentaires
const storage = multer.memoryStorage(); // Utilisation du stockage en mémoire
const upload = multer({ storage }); // Initialisation de Multer avec le stockage défini

// Routes CRUD basiques pour les posts
router.get("/", postController.readPost); // Route pour récupérer tous les posts
router.post("/", upload.single("file"), postController.createPost); // Route pour créer un nouveau post avec un fichier image
router.put("/:id", postController.updatePost); // Route pour mettre à jour un post spécifique
router.delete("/:id", postController.deletePost); // Route pour supprimer un post spécifique

// Routes pour les commentaires
router.patch("/comment-post/:id", postController.commentPost); // Route pour ajouter un commentaire à un post spécifique
router.patch("/delete-comment-post/:id", postController.deleteCommentPost); // Route pour supprimer un commentaire d'un post spécifique

// Route pour l'upload d'image dans les commentaires
router.post(
  "/upload-comment-image",
  upload.single("file"), // Middleware pour gérer l'upload d'un seul fichier nommé "file"
  uploadController.uploadCommentImage // Contrôleur pour traiter l'upload de l'image dans le commentaire
);

module.exports = router; // Exportation du routeur