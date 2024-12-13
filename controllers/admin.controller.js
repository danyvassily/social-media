const UserModel = require("../models/user.model");
const PostModel = require("../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Gestion des utilisateurs
module.exports.getAllUsersDetails = async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

// Supprimer un utilisateur (avec ses posts)
module.exports.deleteUserAndPosts = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const user = await UserModel.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer tous les posts de l'utilisateur
    await PostModel.deleteMany({ posterId: req.params.id });
    
    // Supprimer l'utilisateur
    await UserModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: "Utilisateur et tous ses posts supprimés avec succès" 
    });
  } catch (err) {
    console.log("Erreur détaillée:", err);
    res.status(400).json({ 
      message: "Erreur lors de la suppression de l'utilisateur et de ses posts",
      error: err.message 
    });
  }
};

// Modération des posts
module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la récupération des posts" });
  }
};

// Supprimer un post
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const post = await PostModel.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la suppression du post" });
  }
}; 