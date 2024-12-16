const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
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
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Hash le mot de passe avant la sauvegarde
userSchema.pre("save", async function (next) {
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

// Vérification du mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Erreur lors de la comparaison du mot de passe");
  }
};

// Méthode de connexion
userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Email non trouvé");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Mot de passe incorrect");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("user", userSchema);
