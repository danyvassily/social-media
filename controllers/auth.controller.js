const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Durée du token : 3 jours
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Création du token JWT
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge
  });
};

// Inscription
module.exports.signUp = async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    const token = createToken(user._id);
    
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(201).json({ 
      userId: user._id,
      message: "Inscription réussie !" 
    });
  } catch (err) {
    res.status(400).json({ 
      error: "Email déjà utilisé ou mot de passe invalide" 
    });
  }
};

// Connexion
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ 
      userId: user._id,
      message: "Connexion réussie !" 
    });
  } catch (err) {
    res.status(400).json({ 
      error: "Email ou mot de passe incorrect" 
    });
  }
};

// Déconnexion
module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Déconnexion réussie !" });
};
