const fs = require("fs");
const PostModel = require("../models/post.model");

// Dossiers pour les uploads
const UPLOAD_DIRS = {
  comments: "./client/public/uploads/comments",
  posts: "./client/public/uploads/posts"
};

// Création des dossiers nécessaires
Object.values(UPLOAD_DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Vérifier le type de fichier
const isValidFileType = (mimetype) => {
  return ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(mimetype);
};

// Upload d'image pour un post
module.exports.uploadPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    if (!isValidFileType(req.file.mimetype)) {
      return res.status(400).json({ message: "Format d'image non valide (JPG, PNG ou GIF uniquement)" });
    }

    if (req.file.size > 3 * 1024 * 1024) {
      return res.status(400).json({ message: "Image trop volumineuse (max 3Mo)" });
    }

    const fileName = `post_${req.body.postId}_${Date.now()}.jpg`;
    const filePath = `${UPLOAD_DIRS.posts}/${fileName}`;
    
    await fs.promises.writeFile(filePath, req.file.buffer);

    const post = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { picture: `/uploads/posts/${fileName}` },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'upload de l'image" });
  }
};