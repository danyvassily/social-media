const PostModel = require("../models/post.model"); // Importation du modèle post
const fs = require("fs"); // Importation du module fs pour interagir avec le système de fichiers
const { promisify } = require("util"); // Importation de promisify pour convertir les fonctions callback en promesses
const pipeline = promisify(require("stream").pipeline); // Conversion de stream.pipeline en promesse
const { uploadErrors } = require("../utils/errors.utils"); // Importation des fonctions de gestion des erreurs d'upload

// Contrôleur pour l'upload d'images dans les commentaires
module.exports.uploadCommentImage = async (req, res) => {
  try {
    const { postId, commentId } = req.body; // Extraction de l'ID du post et du commentaire depuis le corps de la requête
    const file = req.file; // Fichier uploadé

    // Vérification du type de fichier
    if (!["image/jpg", "image/png", "image/jpeg"].includes(file.mimetype)) {
      throw Error("invalid file"); // Erreur si le type de fichier n'est pas valide
    }

    // Vérification de la taille du fichier
    if (file.size > 500000) throw Error("max size"); // Erreur si le fichier dépasse 500 Ko

    const fileName = `comment_${commentId}_${Date.now()}.jpg`; // Création d'un nom de fichier unique

    // Sauvegarde du fichier dans le dossier uploads/comments
    await pipeline(
      file.stream, // Flux de lecture du fichier
      fs.createWriteStream(`./client/public/uploads/comments/${fileName}`) // Flux d'écriture vers le fichier
    );

    // Mise à jour de l'URL de l'image dans le commentaire
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId, "comments._id": commentId }, // Recherche du post et du commentaire
      { $set: { "comments.$.picture": `./uploads/comments/${fileName}` } }, // Mise à jour du champ picture du commentaire
      { new: true } // Retourne le document après la mise à jour
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "Post ou commentaire non trouvé" }); // Envoi d'une erreur si le post ou le commentaire n'est pas trouvé
    }

    res.status(200).json(updatedPost); // Envoi du post mis à jour en réponse
  } catch (err) {
    const errors = uploadErrors(err); // Gestion des erreurs spécifiques à l'upload
    res.status(400).json({ errors }); // Envoi des erreurs au client
  }
};