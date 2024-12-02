require('dotenv').config({ path: './config/.env' });
const app = require('./app');
const connectDB = require("./config/db");

// Ne connecter à MongoDB que si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
  connectDB(process.env.MONGODB_URL);
}

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});

module.exports = { app, server };