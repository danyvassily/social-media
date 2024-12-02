const PostModel = require("../models/post.model"); // Importation du modèle post
const { uploadErrors } = require("../utils/errors.utils"); // Importation des fonctions de gestion des erreurs d'upload
const ObjectID = require("mongoose").Types.ObjectId; // Importation de ObjectID pour la validation des IDs
const fs = require("fs"); // Importation du module fs pour interagir avec le système de fichiers
const { promisify } = require("util"); // Importation de promisify pour convertir les fonctions callback en promesses
const pipeline = promisify(require("stream").pipeline); // Conversion de stream.pipeline en promesse

// Fonction d'initialisation des répertoires d'uploads
const initUploadDirectories = () => {
  const dirs = [
    './uploads/posts',
    './uploads/comments',
    './client/public/uploads/posts',
    './client/public/uploads/comments'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) { // Vérification si le répertoire existe
      fs.mkdirSync(dir, { recursive: true }); // Création du répertoire si non existant
    }
  });
};

// Appel de la fonction d'initialisation au démarrage
initUploadDirectories();

// Fonction pour récupérer tous les posts, triés par date de création décroissante
module.exports.readPost = (req, res) => {
  PostModel.find() // Recherche de tous les posts
    .sort({ createdAt: -1 }) // Tri par date de création décroissante
    .then((docs) => res.send(docs)) // Envoi des posts en réponse
    .catch((err) =>
      console.log("Erreur lors de la récupération des données : " + err) // Journalisation de l'erreur
    );
};

// Fonction pour créer un nouveau post avec possibilité d'ajouter une image
module.exports.createPost = async (req, res) => {
  try {
    const post = await PostModel.create({
      posterId: req.body.posterId,
      message: req.body.message
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ errors: err.message });
  }
};

// Fonction pour supprimer un post
module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id); // Vérification de la validité de l'ID

  PostModel.findByIdAndDelete(req.params.id) // Suppression du post par ID
    .then((docs) => res.send(docs)) // Envoi du post supprimé en réponse
    .catch((err) => console.log("Erreur lors de la suppression : " + err)); // Journalisation de l'erreur
};

// Fonction pour ajouter un commentaire à un post
module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID invalide" }); // Vérification de la validité de l'ID

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id, // ID du post à commenter
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId, // ID du commentateur
            commenterPseudo: req.body.commenterPseudo, // Pseudo du commentateur
            text: req.body.text, // Texte du commentaire
            timestamp: Date.now(), // Horodatage du commentaire
            picture: req.body.picture || "", // Chemin de l'image optionnelle
          },
        },
      },
      { new: true } // Retourne le document après la mise à jour
    );
    res.status(200).json(updatedPost); // Envoi du post mis à jour en réponse
  } catch (err) {
    res.status(400).json({ message: err.message }); // Envoi de l'erreur en cas d'échec
  }
};

// Fonction pour supprimer un commentaire d'un post
module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID invalide" }); // Vérification de la validité de l'ID

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id, // ID du post
      {
        $pull: {
          comments: { _id: req.body.commentId }, // Suppression du commentaire par ID
        },
      },
      { new: true } // Retourne le document après la mise à jour
    );
    res.status(200).json(updatedPost); // Envoi du post mis à jour en réponse
  } catch (err) {
    res.status(400).json({ message: err.message }); // Envoi de l'erreur en cas d'échec
  }
};

// Fonction pour mettre à jour le message d'un post
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID invalide : " + req.params.id }); // Vérification de la validité de l'ID

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id, // ID du post à mettre à jour
      { message: req.body.message }, // Nouveau message
      { new: true } // Retourne le document après la mise à jour
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trouvé" }); // Envoi d'une erreur si le post n'est pas trouvé
    }

    res.status(200).json(updatedPost); // Envoi du post mis à jour en réponse
  } catch (err) {
    res.status(500).json({ message: err.message }); // Envoi de l'erreur en cas d'échec
  }
};