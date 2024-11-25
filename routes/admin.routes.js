const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { checkUser } = require("../middleware/auth.middleware");
const { checkAdmin } = require("../middleware/admin.middleware");

// Appliquer les middlewares d'authentification
router.use(checkUser);
router.use(checkAdmin);

// Routes admin
router.get("/posts", adminController.getAllPosts);
router.delete("/posts/:id", adminController.deleteAnyPost);
router.put("/posts/:id", adminController.updateAnyPost);
router.put("/users/role/:id", adminController.manageUserRole);

module.exports = router; 