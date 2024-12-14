const router = require("express").Router();
const postController = require("../controllers/post.controller");
const uploadController = require("../controllers/upload.controller");
const multer = require("multer");

// Configuration de Multer pour les images
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500000 // 500Ko max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Format non supporté"), false);
    }
  }
});

// Routes CRUD basiques
router.get("/", postController.readPost);
router.post("/", upload.single("image"), postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

// Route pour l'upload d'image séparé
router.post("/upload/:id", upload.single("image"), uploadController.uploadPostImage);

// Routes pour les commentaires
router.patch("/comment/:id", postController.commentPost);
router.patch("/uncomment/:id", postController.deleteCommentPost);

module.exports = router;