const router = require("express").Router();
const postController = require("../controllers/post.controller");
const uploadController = require("../controllers/upload.controller");
const multer = require("multer");
const { multerConfig } = require("../config/upload.config");

// Configuration de Multer pour les images
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  ...multerConfig
});

// Routes CRUD basiques
router.get("/", postController.readPost);
router.post("/", upload.single("file"), postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

// Route pour l'upload d'image séparé
router.post(
  "/upload/:id",
  upload.single("image"),
  uploadController.uploadPostImage
);

module.exports = router;
