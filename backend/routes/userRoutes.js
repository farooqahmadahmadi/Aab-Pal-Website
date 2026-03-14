/* Access Controls
Admin - Full Access
HR - Read and Edit Self Access
Financial - Read and Edit Self Access
Project Manager - Read and Edit Self Access
Employee - Read and Edit Self Access
Client - Read and Edit Self Access
*/

const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.get("/users", role("Admin"), usersController.getAllUsers);
router.get("/users/:id", role("Admin", "HR"), usersController.getUserById);
router.post("/users", role("Admin"), usersController.createUser);
router.put("/users/:id", role("Admin", "HR"), usersController.updateUser);
router.delete("/users/:id", role("Admin"), usersController.deleteUser);

module.exports = router;