const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");


router.get(
    "/users",
    auth,
    role("Admin"),
    usersController.getAllUsers
);

router.get("/users/:id", auth, usersController.getUserById);
router.post("/users", auth, role("Admin"), usersController.createUser);
router.put("/users/:id", auth, role("Admin"), usersController.updateUser);
router.delete("/users/:id", auth, role("Admin"), usersController.deleteUser);

module.exports = router;