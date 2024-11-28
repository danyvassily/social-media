const PostModel = require("../models/post.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

// Ajouter cette fonction d'initialisation
const initUploadDirectories = () => {
  const dirs = [
    './uploads/posts',
    './uploads/comments',
    './client/public/uploads/posts',
    './client/public/uploads/comments'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Appeler la fonction au démarrage
initUploadDirectories();

// Récupérer tous les posts, triés par date de création décroissante
module.exports.readPost = (req, res) => {
  PostModel.find()
    .sort({ createdAt: -1 })
    .then((docs) => res.send(docs))
    .catch((err) =>
      console.log("Erreur lors de la récupération des données : " + err)
    );
};

// Créer un nouveau post avec possibilité d'image
module.exports.createPost = async (req, res) => {
  let fileName = "";

  if (req.file) {
    try {
      if (!["image/jpg", "image/png", "image/jpeg"].includes(req.file.mimetype)) {
        throw Error("invalid file");
      }

      if (req.file.size > 500000) throw Error("max size");

      fileName = `${req.body.posterId}_${Date.now()}.jpg`;

      // Modification ici : utiliser req.file.buffer au lieu de req.file.stream
      const uploadPath = './client/public/uploads/posts';
      const filePath = `${uploadPath}/${fileName}`;
      
      // Vérifier si le répertoire existe
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Écrire le fichier directement depuis le buffer
      fs.writeFileSync(filePath, req.file.buffer);

    } catch (err) {
      console.error("Erreur lors de l'upload:", err);
      const errors = uploadErrors(err);
      return res.status(400).json({ errors });
    }
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: fileName ? `/uploads/posts/${fileName}` : "",
    comments: [],
  });

  try {
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Supprimer un post
module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  PostModel.findByIdAndDelete(req.params.id)
    .then((docs) => res.send(docs))
    .catch((err) => console.log("Erreur lors de la suppression : " + err));
};

// Ajouter un commentaire
module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID invalide" });

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: Date.now(),
            picture: req.body.picture || "", // Ajout optionnel d'une image dans le commentaire
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un commentaire
module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID invalide" });

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.body.commentId },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour un post
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ message: "ID invalide : " + req.params.id });

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      { message: req.body.message },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
