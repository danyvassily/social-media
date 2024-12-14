const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// Vérifie si l'utilisateur est connecté
module.exports.checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await UserModel.findById(decodedToken.id);
    res.locals.user = user;
  } catch (err) {
    res.locals.user = null;
    res.cookie("jwt", "", { maxAge: 1 });
  }
  
  next();
};

// Vérifie si l'accès est autorisé
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ message: "Veuillez vous connecter" });
  }

  try {
    jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};