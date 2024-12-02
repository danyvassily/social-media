const jwt = require("jsonwebtoken"); // Importation de jsonwebtoken pour gérer les JWT
const UserModel = require("../models/user.model"); // Importation du modèle utilisateur

// Middleware pour vérifier l'utilisateur à chaque requête
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt; // Récupération du token depuis les cookies
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => { // Vérification du token
      if (err) { // Si le token est invalide
        res.locals.user = null; // Aucun utilisateur connecté
        res.cookie("jwt", "", { maxAge: 1 }); // Suppression du cookie
        next(); // Passer au middleware suivant
      } else {
        try {
          const user = await UserModel.findById(decodedToken.id); // Recherche de l'utilisateur par ID
          res.locals.user = user; // Ajout de l'utilisateur aux variables locales de la réponse
          next(); // Passer au middleware suivant
        } catch {
          res.locals.user = null; // Aucun utilisateur connecté en cas d'erreur
          next(); // Passer au middleware suivant
        }
      }
    });
  } else {
    // Si pas de token
    res.locals.user = null; // Aucun utilisateur connecté
    next(); // Passer au middleware suivant
  }
};

// Middleware pour exiger une authentification
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt; // Récupération du token
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => { // Vérification du token
      if (err) { // Si le token est invalide
        console.log(err); // Affichage de l'erreur
        res.status(401).json({ message: "Authentification requise" }); // Réponse 401 Unauthorized
      } else {
        next(); // Passer au middleware suivant si le token est valide
      }
    });
  } else {
    res.status(401).json({ message: "Authentification requise" }); // Réponse 401 Unauthorized si aucun token
  }
};