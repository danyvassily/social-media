// On importe les modules dont on a besoin :
// - UserModel pour interagir avec la base de données des utilisateurs
// - jsonwebtoken pour gérer les tokens d'authentification
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// On définit la durée de validité du token JWT (token d'authentification)
// Calcul : 3 jours * 24 heures * 60 minutes * 60 secondes * 1000 millisecondes
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Cette fonction crée un token JWT qui servira à identifier l'utilisateur
// Elle prend en paramètre l'ID de l'utilisateur et retourne le token
const createToken = (userId) => {
  // On vérifie d'abord que la clé secrète existe dans les variables d'environnement
  if (!process.env.TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET non défini");
  }
  // On crée et retourne le token avec l'ID de l'utilisateur
  return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge // Le token expirera après la durée définie plus haut
  });
};

// Cette fonction gère l'inscription d'un nouvel utilisateur
module.exports.signUp = async (req, res) => {
  try {
    // On récupère l'email et le mot de passe envoyés par l'utilisateur
    const { email, password } = req.body;
    console.log("Données reçues:", { email, password });

    // On vérifie que l'utilisateur a bien fourni un email et un mot de passe
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email et mot de passe requis" 
      });
    }

    // On vérifie si un utilisateur existe déjà avec cet email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "Cet email est déjà utilisé" 
      });
    }

    // Si tout est OK, on crée le nouvel utilisateur dans la base de données
    const user = await UserModel.create({ email, password });
    
    // On crée un token pour ce nouvel utilisateur
    const token = createToken(user._id);
    
    // On envoie le token dans un cookie sécurisé
    // httpOnly: empêche l'accès au cookie via JavaScript
    // secure: cookie uniquement envoyé en HTTPS en production
    // sameSite: protection contre les attaques CSRF
    res.cookie("jwt", token, { 
      httpOnly: true,
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    // On renvoie les informations de l'utilisateur (sans le mot de passe)
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      message: "Inscription réussie !"
    });
  } catch (err) {
    // En cas d'erreur, on log l'erreur et on renvoie un message à l'utilisateur
    console.error("Erreur signup:", err);
    res.status(400).json({ 
      error: err.message || "Erreur lors de l'inscription" 
    });
  }
};

// Cette fonction gère la connexion d'un utilisateur existant
module.exports.signIn = async (req, res) => {
  try {
    // On affiche les données reçues pour le debugging
    console.log("Body reçu:", req.body);
    const { email, password } = req.body;
    console.log("Données extraites:", { email, password });

    // On vérifie que l'utilisateur a fourni un email et un mot de passe
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email et mot de passe requis" 
      });
    }

    // On vérifie les identifiants de l'utilisateur avec la méthode login du modèle
    const user = await UserModel.login(email, password);
    
    // Si la connexion réussit, on crée un nouveau token
    const token = createToken(user._id);
    
    // On envoie le token dans un cookie sécurisé
    res.cookie("jwt", token, { 
      httpOnly: true,
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    // On renvoie les informations de l'utilisateur connecté
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      message: "Connexion réussie !"
    });
  } catch (err) {
    // En cas d'erreur, on log l'erreur et on renvoie un message
    console.error("Erreur signin:", err);
    res.status(400).json({ 
      error: err.message || "Email ou mot de passe incorrect" 
    });
  }
};

// Cette fonction gère la déconnexion d'un utilisateur
module.exports.logout = (req, res) => {
  try {
    // Pour déconnecter l'utilisateur, on remplace le cookie JWT par un cookie vide
    // avec une durée de vie très courte (1ms)
    res.cookie("jwt", "", { 
      maxAge: 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    res.status(200).json({ message: "Déconnexion réussie !" });
  } catch (err) {
    // En cas d'erreur lors de la déconnexion
    console.error("Erreur logout:", err);
    res.status(500).json({ 
      error: "Erreur lors de la déconnexion" 
    });
  }
};
