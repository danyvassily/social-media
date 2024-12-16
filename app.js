const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const adminRoutes = require("./routes/admin.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log des requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Routes publiques
app.use("/api/user", userRoutes);

// Routes protégées
app.get("/api/jwtid", requireAuth, (req, res) => {
  res.status(200).json({ id: res.locals.user._id });
});

app.use("/api/post", requireAuth, postRoutes);
app.use("/api/admin", requireAuth, adminRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  res.status(500).json({
    error: "Une erreur est survenue sur le serveur",
  });
});

module.exports = app;
