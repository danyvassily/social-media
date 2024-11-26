// Importation du modèle utilisateur et de l'objet ObjectID de Mongoose pour la validation des IDs
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Récupérer tous les utilisateurs (sans leur mot de passe)
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les informations d'un utilisateur spécifique
module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.send(user);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la récupération de l'utilisateur : " + err);
  }
};

// Supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
