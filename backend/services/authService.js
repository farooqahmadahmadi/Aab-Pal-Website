const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");

const SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// Generate JWT Token
exports.generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            user_role: user.user_role
        },
        SECRET,
        { expiresIn: "8h" }
    );
};

// Hash Password
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare Password
exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Login Service
exports.loginUser = async (user_name, password) => {
    const user = await Users.findOne({
        where: { user_name }
    });
    if (!user) {
        throw new Error("Invalid username or password");
    }
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
        throw new Error("Invalid username or password");
    }
    const token = this.generateToken(user);
    return {
        user,
        token
    };
};