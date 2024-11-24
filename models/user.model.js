const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
  },
  {
    timestamps: true,
  }
);

// bcrypt permet de hasher le mot de passe
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  //là bcrypt va hasher le mot de passe
  this.password = await bcrypt.hash(this.password, salt);
  next();
  //le next veut dire qu'une fois qu'il a fait le hash, il va passer à la suite
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
