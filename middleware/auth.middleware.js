// Import des modules nécessaires
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

/**
 * Middleware qui vérifie si l'utilisateur est connecté
 * Stocke les informations de l'utilisateur dans res.locals.user
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express  
 * @param {Function} next - Fonction suivante
 */
module.exports.checkUser = async (req, res, next) => {
  // Récupère le token JWT depuis les cookies
  const token = req.cookies.jwt;
  
  // Si pas de token, l'utilisateur n'est pas connecté
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    // Vérifie et décode le token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // Récupère l'utilisateur depuis la BDD
    const user = await UserModel.findById(decodedToken.id);
    // Stocke l'utilisateur dans res.locals
    res.locals.user = user;
  } catch (err) {
    // En cas d'erreur, réinitialise l'utilisateur et le cookie
    res.locals.user = null;
    res.cookie("jwt", "", { maxAge: 1 });
  }
  
  next();
};

/**
 * Middleware qui vérifie si l'accès est autorisé
 * Bloque l'accès si l'utilisateur n'est pas connecté
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
module.exports.requireAuth = (req, res, next) => {
  // Récupère le token JWT depuis les cookies
  const token = req.cookies.jwt;
  
  // Si pas de token, renvoie une erreur
  if (!token) {
    return res.status(401).json({ message: "Veuillez vous connecter" });
  }

  try {
    // Vérifie si le token est valide
    jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    // En cas d'erreur, renvoie un message d'erreur
    res.status(401).json({ message: "Token invalide" });
  }
};