const UserModel = require("../models/user.model");

// Vérifie les droits administrateur
module.exports.isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(res.locals.user._id);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ 
        message: "Accès refusé : droits administrateur requis" 
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur serveur" 
    });
  }
}; 