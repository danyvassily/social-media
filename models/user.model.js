const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "L'email est requis"],
      validate: [isEmail, "Email invalide"],
      lowercase: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "au moins 6 caractères"],
      maxlength: [1024, "Le mot de passe est trop long"]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

// Hash le mot de passe avant la sauvegarde
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Erreur lors de la comparaison des mots de passe");
  }
};

// Méthode statique pour la connexion
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  
  if (!user) {
    throw new Error("Email non trouvé");
  }
  
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    throw new Error("Mot de passe incorrect");
  }
  
  return user;
};

module.exports = mongoose.model("user", userSchema);
