const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

//create token prend l'id de l'utilisateur et le token secret fais un melange et retourne un token
const maxAge = 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};

module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(200).json({ errors });
  }
};

// Cette fonction gère la déconnexion de l'utilisateur
// Elle supprime le cookie JWT en le remplaçant par un cookie vide avec une durée de vie très courte
module.exports.logout = async (req, res) => {
  try {
    // On définit un nouveau cookie 'jwt' avec les paramètres suivants:
    // - Une valeur vide ""
    // - maxAge: 1 milliseconde (expire immédiatement) 
    // - httpOnly: true (cookie inaccessible via JavaScript)
    // - secure: true en production (cookie envoyé uniquement en HTTPS)
    // - sameSite: strict (cookie envoyé uniquement pour les requêtes même site)
    res.cookie("jwt", "", {
      maxAge: 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    // Renvoie un message de succès
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (err) {
    // En cas d'erreur, renvoie un statut 500 avec le message d'erreur
    res.status(500).json({ error: err.message });
  }
};
