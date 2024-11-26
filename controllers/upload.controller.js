const PostModel = require("../models/post.model");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");

// Contrôleur pour l'upload d'images dans les commentaires
module.exports.uploadCommentImage = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const file = req.file;

    // Vérification du type de fichier
    if (!["image/jpg", "image/png", "image/jpeg"].includes(file.mimetype)) {
      throw Error("invalid file");
    }

    // Vérification de la taille du fichier
    if (file.size > 500000) throw Error("max size");

    const fileName = `comment_${commentId}_${Date.now()}.jpg`;

    // Sauvegarde du fichier dans le dossier uploads/comments
    await pipeline(
      file.stream,
      fs.createWriteStream(`./client/public/uploads/comments/${fileName}`)
    );

    // Mise à jour de l'URL de l'image dans le commentaire
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId, "comments._id": commentId },
      { $set: { "comments.$.picture": `./uploads/comments/${fileName}` } },
      { new: true }
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "Post ou commentaire non trouvé" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    const errors = uploadErrors(err);
    res.status(400).json({ errors });
  }
};
