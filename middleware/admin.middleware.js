const UserModel = require("../models/user.model");

module.exports.checkAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(res.locals.user._id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Accès non autorisé: droits administrateur requis" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
