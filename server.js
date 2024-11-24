const express = require("express");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const app = express();
const userRoutes = require("./routes/user.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// il faut bodyparser pour pouvoir envoyer des requêtes, cela permet la data à envoyer
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/user", userRoutes);


//serveur
app.listen(process.env.PORT, () => {
  console.log(`le serveur est lancé sur le port ${process.env.PORT}`);
});
