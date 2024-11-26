const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// Middleware pour vérifier l'utilisateur à chaque requête
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt; // Récupération du token depuis les cookies
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        // Si le token est invalide
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        try {
          const user = await UserModel.findById(decodedToken.id);
          res.locals.user = user;
          next();
        } catch {
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    // Si pas de token
    res.locals.user = null;
    next();
  }
};

// Middleware pour exiger une authentification
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt; // Récupération du token
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(401).json({ message: "Authentification requise" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Authentification requise" });
  }
};
