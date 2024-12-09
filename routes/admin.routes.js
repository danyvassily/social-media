const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { isAdmin } = require("../middleware/admin.middleware");
const { requireAuth } = require("../middleware/auth.middleware");

// Protection de toutes les routes admin
router.use(requireAuth, isAdmin);

// Gestion des utilisateurs
router.get("/users", adminController.getAllUsersDetails);
router.delete("/users/:id", adminController.deleteUserAndPosts);

// Modération des posts
router.get("/posts", adminController.getAllPosts);
router.delete("/posts/:id", adminController.deletePost);

module.exports = router; 