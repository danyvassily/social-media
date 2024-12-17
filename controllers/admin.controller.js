// Import des modèles et des types nécessaires
const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;

// ====== GESTION DES UTILISATEURS ======

/**
 * Récupère tous les utilisateurs avec leurs détails (sauf mot de passe)
 * Tri par date de création décroissante
 */
module.exports.getAllUsersDetails = async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("-password")
      .select({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des utilisateurs"
    });
  }
};

/**
 * Supprime un utilisateur et tous ses posts associés
 * @param {string} req.params.id - ID de l'utilisateur à supprimer
 */
module.exports.deleteUserAndPosts = async (req, res) => {
  // Vérifie si l'ID est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    // Recherche l'utilisateur à supprimer
    const userToDelete = await UserModel.findById(req.params.id);
    
    // Vérifie si l'utilisateur existe
    if (!userToDelete) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprime tous les posts de l'utilisateur
    await PostModel.deleteMany({ posterId: req.params.id });
    
    // Supprime l'utilisateur
    await UserModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: "Utilisateur et tous ses posts supprimés avec succès" 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur lors de la suppression de l'utilisateur et de ses posts"
    });
  }
};

// ====== MODÉRATION DES POSTS ======

/**
 * Récupère tous les posts avec les informations de leurs auteurs
 * Tri par date de création décroissante
 */
module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("posterId", "email role");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des posts"
    });
  }
};

/**
 * Supprime un post spécifique
 * @param {string} req.params.id - ID du post à supprimer
 */
module.exports.deletePost = async (req, res) => {
  // Vérifie si l'ID est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    // Recherche le post avec les informations de l'auteur
    const post = await PostModel.findById(req.params.id)
      .populate("posterId", "role");
    
    // Vérifie si le post existe
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Supprime le post
    await post.deleteOne();
    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur lors de la suppression du post"
    });
  }
}; 