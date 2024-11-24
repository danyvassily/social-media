require('dotenv').config();
const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL)
    .then(() => console.log("Connecté à MongoDB"))
    .catch((err) => console.log("Erreur de connexion à MongoDB:", err));
