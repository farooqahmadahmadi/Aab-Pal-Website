const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

// GET all users → Admin only
router.get(
    "/users",
    role("Admin"),
    usersController.getAllUsers
);

// GET user by ID → Admin + HR
router.get(
    "/users/:id",
    role("Admin", "HR"),
    usersController.getUserById
);

// CREATE user → Admin only
router.post(
    "/users",
    role("Admin"),
    usersController.createUser
);

// UPDATE user → Admin + HR
router.put(
    "/users/:id",
    role("Admin", "HR"),
    usersController.updateUser
);

// DELETE user → Admin only
router.delete(
    "/users/:id",
    role("Admin"),
    usersController.deleteUser
);

module.exports = router;