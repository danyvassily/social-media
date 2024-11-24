const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const app = express();
const userRoutes = require("./routes/user.routes");
const bodyParser = require("body-parser");

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["sessionId", "Content-Type"],
    exposedHeaders: ["sessionId"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoutes);

//serveur
app.listen(process.env.PORT, () => {
  console.log(`le serveur est lancé sur le port ${process.env.PORT}`);
});
