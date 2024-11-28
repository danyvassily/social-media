const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
require("./config/db");

dotenv.config({ path: "./config/.env" });

const app = express();

// Configuration des options CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["Content-Type"],
  methods: "GET,POST,PUT,DELETE,PATCH",
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Ajouter ces lignes après vos autres middlewares
app.use('/uploads', express.static('client/public/uploads'));

// Vérifier l'utilisateur pour toutes les routes
app.get("*", checkUser);

// Route pour obtenir l'ID de l'utilisateur authentifié
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// Routes principales
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || process.env.DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
