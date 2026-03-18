const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.loginUser = async (email, password) => {
    const user = await Users.findOne({ where: { user_email: email } });
    if (!user) throw new Error("Invalid credentials");

    if (!user.is_active) throw new Error("User is inactive");

    // Access time check
    const now = new Date();
    const time = now.toTimeString().split(" ")[0];
    if (user.access_time_start && user.access_time_end) {
        if (!(time >= user.access_time_start && time <= user.access_time_end)) {
            throw new Error("Login not allowed at this time");
        }
    }

    // Password check
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        // update failed attempts
        user.failed_attempts += 1;
        await user.save();

        if (user.failed_attempts === 3) throw new Error("Too many attempts, try after 30s");
        if (user.failed_attempts === 5) throw new Error("Too many attempts, try after 1m");
        if (user.failed_attempts >= 6) {
            user.is_active = false;
            await user.save();
            throw new Error("User deactivated by system");
        }

        throw new Error("Invalid credentials");
    }

    // Reset failed attempts
    user.failed_attempts = 0;
    user.login_status = "Online";
    user.last_login_at = new Date();
    await user.save();

    // JWT token
    const token = jwt.sign({ id: user.user_id, role: user.user_role }, JWT_SECRET, { expiresIn: "8h" });

    return { user, token };
};

exports.logoutUser = async (id) => {
    const user = await Users.findByPk(id);
    if (!user) throw new Error("User not found");
    user.login_status = "Offline";
    await user.save();
    return true;
};
