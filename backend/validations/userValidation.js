const Joi = require("joi");

const registerSchema = Joi.object({
    user_name: Joi.string().min(3).max(100).required(),
    user_email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    user_role: Joi.string().valid("Admin", "HR", "Financial", "Project Manager", "Employee", "Client").required()
});

const loginSchema = Joi.object({
    user_email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };