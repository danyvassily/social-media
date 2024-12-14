const PostModel = require("../models/post.model");
const fs = require("fs");

// Dossier pour les images
const UPLOAD_DIR = "./client/public/uploads/posts";

// Création des dossiers nécessaires
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Lire tous les posts
module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: "Impossible de récupérer les posts" });
  }
};

// Créer un post
module.exports.createPost = async (req, res) => {
  try {
    let imagePath = "";
    
    // Gérer l'upload d'image si présente
    if (req.file) {
      const fileName = `${req.body.posterId}-${Date.now()}.jpg`;
      imagePath = `/uploads/posts/${fileName}`;
      
      await fs.promises.writeFile(
        `${UPLOAD_DIR}/${fileName}`,
        req.file.buffer
      );
    }

    // Créer le post
    const newPost = await PostModel.create({
      posterId: req.body.posterId,
      message: req.body.message,
      picture: imagePath
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: "Impossible de créer le post" });
  }
};

// Modifier un post
module.exports.updatePost = async (req, res) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      { message: req.body.message },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: "Impossible de modifier le post" });
  }
};

// Supprimer un post
module.exports.deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    // Supprimer l'image si elle existe
    if (post.picture) {
      const imagePath = `./client/public${post.picture}`;
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post supprimé" });
  } catch (err) {
    res.status(400).json({ message: "Impossible de supprimer le post" });
  }
};

// Ajouter un commentaire
module.exports.commentPost = async (req, res) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            text: req.body.text,
            timestamp: new Date().getTime()
          }
        }
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: "Impossible d'ajouter le commentaire" });
  }
};

// Supprimer un commentaire
module.exports.deleteCommentPost = async (req, res) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId
          }
        }
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post introuvable" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: "Impossible de supprimer le commentaire" });
  }
};
