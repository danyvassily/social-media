/**
 * Importation des modèles et types nécessaires
 */
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

/**
 * Récupère la liste de tous les utilisateurs
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>} Liste des utilisateurs sans leurs mots de passe
 */
module.exports.getAllUsers = async (req, res) => {
  try {
    // Recherche tous les utilisateurs en excluant le champ password
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    // Retourne une erreur en cas d'échec
    res.status(400).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

/**
 * Récupère les informations d'un utilisateur spécifique
 * @param {Request} req - Requête Express contenant l'ID en paramètre
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>} Informations de l'utilisateur sans le mot de passe
 */
module.exports.userInfo = async (req, res) => {
  // Vérifie si l'ID fourni est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    // Recherche l'utilisateur par son ID en excluant le mot de passe
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (err) {
    // Retourne une erreur en cas d'échec
    res.status(400).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

/**
 * Supprime un utilisateur de la base de données
 * @param {Request} req - Requête Express contenant l'ID en paramètre
 * @param {Response} res - Réponse Express
 * @returns {Promise<void>} Message de confirmation ou d'erreur
 */
module.exports.deleteUser = async (req, res) => {
  // Vérifie si l'ID fourni est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    // Tente de supprimer l'utilisateur
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    // Retourne une erreur en cas d'échec
    res.status(400).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};