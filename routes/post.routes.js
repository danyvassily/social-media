const router = require("express").Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");

// Configuration de Multer pour les images
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Format de fichier non autorisé (JPEG, PNG ou GIF uniquement)"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

// Routes CRUD
router.get("/", postController.readPost);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

// Upload d'images
router.post("/upload-image", upload.single("image"), postController.uploadImage);

// Gestion des commentaires
router.patch("/comment-post/:id", postController.commentPost);
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);

module.exports = router;