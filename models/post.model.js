const mongoose = require('mongoose');
const UserModel = require("../models/user.model");

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    picture: {
      type: String,
    },
    comments: {
      type: [
        {
          commenterId:String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        }
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('post', PostSchema);

module.exports.checkAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(res.locals.user._id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Accès non autorisé: droits administrateur requis" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};