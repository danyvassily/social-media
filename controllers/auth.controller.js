const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Durée du token : 3 jours
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Création du token JWT
const createToken = (userId) => {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET non défini");
  }
  return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge
  });
};

// Inscription
module.exports.signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Données reçues:", { email, password });

    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email et mot de passe requis" 
      });
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "Cet email est déjà utilisé" 
      });
    }

    // Création de l'utilisateur
    const user = await UserModel.create({ email, password });
    
    // Création du token
    const token = createToken(user._id);
    
    // Configuration du cookie
    res.cookie("jwt", token, { 
      httpOnly: true,
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    // Réponse sans le mot de passe
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      message: "Inscription réussie !"
    });
  } catch (err) {
    console.error("Erreur signup:", err);
    res.status(400).json({ 
      error: err.message || "Erreur lors de l'inscription" 
    });
  }
};

// Connexion
module.exports.signIn = async (req, res) => {
  try {
    console.log("Body reçu:", req.body);
    const { email, password } = req.body;
    console.log("Données extraites:", { email, password });

    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email et mot de passe requis" 
      });
    }

    // Tentative de connexion
    const user = await UserModel.login(email, password);
    
    // Création du token
    const token = createToken(user._id);
    
    // Configuration du cookie
    res.cookie("jwt", token, { 
      httpOnly: true,
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    // Réponse sans le mot de passe
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      message: "Connexion réussie !"
    });
  } catch (err) {
    console.error("Erreur signin:", err);
    res.status(400).json({ 
      error: err.message || "Email ou mot de passe incorrect" 
    });
  }
};

// Déconnexion
module.exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "", { 
      maxAge: 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    res.status(200).json({ message: "Déconnexion réussie !" });
  } catch (err) {
    console.error("Erreur logout:", err);
    res.status(500).json({ 
      error: "Erreur lors de la déconnexion" 
    });
  }
};
