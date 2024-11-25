const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteAnyPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID inconnu : " + req.params.id });

  try {
    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateAnyPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID inconnu : " + req.params.id });

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: { message: req.body.message } },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.manageUserRole = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID inconnu : " + req.params.id });

  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $set: { isAdmin: req.body.isAdmin } },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 