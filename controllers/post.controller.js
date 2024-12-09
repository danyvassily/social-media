const PostModel = require("../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

// Récupérer tous les posts
module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la récupération des posts" });
  }
};

// Créer un nouveau post
module.exports.createPost = async (req, res) => {
  try {
    const post = await PostModel.create({
      posterId: req.body.posterId,
      message: req.body.message,
      picture: req.body.picture || "",
      comments: []
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création du post" });
  }
};

// Upload d'une image
module.exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Format de fichier non autorisé (JPEG, PNG ou GIF uniquement)" });
    }

    const extension = req.file.mimetype.split('/')[1];
    const fileName = `${req.body.posterId}-${Date.now()}.${extension}`;
    const filePath = `uploads/posts/${fileName}`;

    if (!fs.existsSync("uploads/posts")) {
      fs.mkdirSync("uploads/posts", { recursive: true });
    }

    await pipeline(
      req.file.stream,
      fs.createWriteStream(`${__dirname}/../../client/public/${filePath}`)
    );

    res.status(200).json({ imageUrl: filePath });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'upload de l'image" });
  }
};

// Supprimer un post
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const post = await PostModel.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    if (post.picture) {
      const imagePath = `${__dirname}/../../client/public/${post.picture}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la suppression du post" });
  }
};

// Ajouter un commentaire
module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: Date.now()
          }
        }
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout du commentaire" });
  }
};

// Supprimer un commentaire
module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.body.commentId }
        }
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la suppression du commentaire" });
  }
};

// Mettre à jour un post
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      { 
        message: req.body.message,
        picture: req.body.picture || undefined
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du post" });
  }
};
