// Import des modules nécessaires
const fs = require("fs");
const PostModel = require("../models/post.model");
const { UPLOAD_DIRS, FILE_CONFIG, isValidFileType } = require("../config/upload.config");

// Création des dossiers nécessaires pour le stockage des fichiers uploadés
Object.values(UPLOAD_DIRS).forEach(dir => {
  // Vérifie si le dossier existe
  if (!fs.existsSync(dir)) {
    // Crée le dossier s'il n'existe pas
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Contrôleur pour gérer l'upload d'une image associée à un post
module.exports.uploadPostImage = async (req, res) => {
  try {
    // Vérifie si un fichier a été fourni dans la requête
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    // Vérifie si le type de fichier est autorisé (JPG, PNG ou GIF)
    if (!isValidFileType(req.file.mimetype)) {
      return res.status(400).json({ message: "Format d'image non valide (JPG, PNG ou GIF uniquement)" });
    }

    // Vérifie si la taille du fichier ne dépasse pas la limite (3Mo)
    if (req.file.size > FILE_CONFIG.maxSize) {
      return res.status(400).json({ message: "Image trop volumineuse (max 3Mo)" });
    }

    // Génère un nom de fichier unique avec l'ID du post et un timestamp
    const fileName = `post_${req.body.postId}_${Date.now()}.jpg`;
    const filePath = `${UPLOAD_DIRS.posts}/${fileName}`;
    
    // Écrit le fichier sur le disque
    await fs.promises.writeFile(filePath, req.file.buffer);

    // Met à jour le post dans la base de données avec le chemin de l'image
    const post = await PostModel.findByIdAndUpdate(
      req.body.postId,
      { picture: `/uploads/posts/${fileName}` },
      { new: true }
    );

    // Vérifie si le post existe
    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    // Renvoie le post mis à jour
    res.status(200).json(post);
  } catch (err) {
    // Gestion des erreurs
    res.status(500).json({ message: "Erreur lors de l'upload de l'image" });
  }
};