const UserModel = require("../models/user.model");

// Middleware pour vérifier si l'utilisateur est un administrateur
module.exports.isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé - Droits d'administrateur requis" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la vérification des droits d'administrateur" });
  }
}; 