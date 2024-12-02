const UserModel = require("../models/user.model"); // Importation du modèle utilisateur
const jwt = require("jsonwebtoken"); // Importation de jsonwebtoken pour créer des tokens JWT
const { signUpErrors, signInErrors } = require("../utils/errors.utils"); // Importation des fonctions de gestion des erreurs

// Durée de validité du token : 1 heure (3600 secondes)
const maxAge = 3600;

// Fonction pour créer un token JWT avec l'ID de l'utilisateur
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge, // Durée de validité du token
  });
};

// Fonction pour gérer l'inscription d'un nouvel utilisateur
module.exports.signUp = async (req, res) => {
  console.log("Tentative d'inscription:", req.body); // Journalisation de la tentative d'inscription
  const { email, password } = req.body; // Extraction de l'email et du mot de passe depuis le corps de la requête

  try {
    const user = await UserModel.create({ email, password }); // Création d'un nouvel utilisateur
    const token = createToken(user._id); // Créer le token
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // Définir le cookie
    res.status(201).json({ 
      user: user._id, // Envoi de l'ID de l'utilisateur en réponse
      token: token, // Inclure le token dans la réponse
      message: "Utilisateur créé avec succès" // Message de confirmation
    });
  } catch (err) {
    console.error("Erreur d'inscription:", err); // Journalisation de l'erreur
    const errors = signUpErrors(err); // Gestion des erreurs spécifiques à l'inscription
    res.status(400).json({ errors }); // Envoi des erreurs au client
  }
};

// Fonction pour gérer la connexion d'un utilisateur
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body; // Extraction de l'email et du mot de passe depuis le corps de la requête

  try {
    const user = await UserModel.login(email, password); // Tentative de connexion de l'utilisateur
    const token = createToken(user._id); // Création d'un token JWT
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // Stockage du token dans un cookie sécurisé
    res.status(200).json({ user: user._id }); // Envoi de l'ID de l'utilisateur en réponse
  } catch (err) {
    const errors = signInErrors(err); // Gestion des erreurs spécifiques à la connexion
    res.status(400).json({ errors }); // Envoi des erreurs au client
  }
};

// Fonction pour gérer la déconnexion d'un utilisateur
module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); // Suppression du cookie JWT en le vidant et en le rendant expiré
  res.status(200).json({ message: "Déconnexion réussie" }); // Message de confirmation
};