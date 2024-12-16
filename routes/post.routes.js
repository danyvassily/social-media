const router = require("express").Router();
const postController = require("../controllers/post.controller");
const uploadController = require("../controllers/upload.controller");
const multer = require("multer");

// Configuration de Multer pour les images
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3Mo max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Format non supporté. Seuls les formats JPEG, JPG, PNG et GIF sont acceptés"
        ),
        false
      );
    }
  },
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
