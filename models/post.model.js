const mongoose = require("mongoose");

// Schéma pour les commentaires
const CommentSchema = new mongoose.Schema({
  commenterId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  timestamp: {
    type: Number,
    default: Date.now
  }
});

// Schéma pour les posts
const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    picture: {
      type: String,
      default: ""
    },
    comments: {
      type: [CommentSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("post", PostSchema);