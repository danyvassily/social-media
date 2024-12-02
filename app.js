const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

const app = express();

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

app.get("*", checkUser);
app.use("/api/user", userRoutes);

module.exports = app; 