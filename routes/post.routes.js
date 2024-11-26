const router = require("express").Router();
const postController = require("../controllers/post.controller");
const uploadController = require("../controllers/upload.controller");
const multer = require("multer");

// Configuration de Multer pour les uploads d'images dans les commentaires
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes CRUD basiques
router.get("/", postController.readPost);
router.post("/", upload.single("file"), postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

// Routes pour les commentaires
router.patch("/comment-post/:id", postController.commentPost);
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);

// Route pour l'upload d'image dans les commentaires
router.post(
  "/upload-comment-image",
  upload.single("file"),
  uploadController.uploadCommentImage
);

module.exports = router;
