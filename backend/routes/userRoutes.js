const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validations/userValidation");

// Register
router.post("/register", validate(registerSchema), userController.register);

// Login
router.post("/login", validate(loginSchema), userController.login);

module.exports = router;