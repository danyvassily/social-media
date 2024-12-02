const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

dotenv.config({ path: "./config/.env" });

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

app.use('/uploads', express.static('client/public/uploads'));

app.get("*", checkUser);

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

module.exports = app; 