const mongoose = require("mongoose"); // Importation de Mongoose

// Définition du schéma des posts
const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String, // ID de l'utilisateur qui crée le post
      required: true, // Champ obligatoire
    },
    message: {
      type: String, // Texte du post
      trim: true, // Suppression des espaces
      maxlength: 500, // Longueur maximale
      required: true, // Ajout de cette ligne pour rendre le message obligatoire
    },
    picture: {
      type: String, // Chemin vers une image associée au post
    },
    comments: {
      type: [
        {
          commenterId: String, // ID du commentateur
          commenterPseudo: String, // Pseudo du commentateur
          text: String, // Texte du commentaire
          timestamp: Number, // Horodatage du commentaire
          picture: String, // Chemin vers une image optionnelle dans le commentaire
        },
      ],
      required: true, // Champ obligatoire
      default: [], // Valeur par défaut (tableau vide)
    },
  },
  {
    timestamps: true, // Ajout des timestamps (createdAt, updatedAt)
  }
);

module.exports = mongoose.model("post", PostSchema); // Création et exportation du modèle post