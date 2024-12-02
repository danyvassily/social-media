// Importation du modèle utilisateur et de l'objet ObjectID de Mongoose pour la validation des IDs
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Fonction pour récupérer tous les utilisateurs sans leur mot de passe
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password"); // Recherche de tous les utilisateurs et exclusion du champ password
    res.status(200).json(users); // Envoi des utilisateurs en réponse
  } catch (err) {
    res.status(500).json({ message: err.message }); // Envoi de l'erreur en cas d'échec
  }
};

// Fonction pour récupérer les informations d'un utilisateur spécifique
module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id); // Vérification de la validité de l'ID

  try {
    const user = await UserModel.findById(req.params.id).select("-password"); // Recherche de l'utilisateur par ID et exclusion du champ password
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé"); // Envoi d'une erreur si l'utilisateur n'est pas trouvé
    }
    res.send(user); // Envoi des informations de l'utilisateur
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la récupération de l'utilisateur : " + err); // Envoi de l'erreur en cas d'échec
  }
};

// Fonction pour supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id); // Vérification de la validité de l'ID

  try {
    await UserModel.findByIdAndDelete(req.params.id); // Suppression de l'utilisateur par ID
    res.status(200).json({ message: "Utilisateur supprimé avec succès." }); // Message de confirmation
  } catch (err) {
    res.status(500).json({ message: err.message }); // Envoi de l'erreur en cas d'échec
  }
};