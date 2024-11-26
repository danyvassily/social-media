const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail, "Email invalide"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: 1024,
      minlength: 6,
    },
    bio: {
      type: String,
      maxlength: 1024,
    },
    role: {
      type: String,
      default: "user"
    }
  },
  {
    timestamps: true,
  }
);

// Hashage du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Méthode statique pour la connexion d'un utilisateur
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Le mot de passe est incorrect");
  }
  throw Error("Cet email n'existe pas");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
