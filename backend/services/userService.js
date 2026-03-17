const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (data) => {
    const hash = await bcrypt.hash(data.password, 10);

    const [result] = await db.query(
        "INSERT INTO users (user_name, user_email, password_hash, user_role) VALUES (?, ?, ?, ?)",
        [data.user_name, data.user_email, hash, data.user_role]
    );

    return { user_id: result.insertId, user_name: data.user_name, user_email: data.user_email, user_role: data.user_role };
};

const loginUser = async (data) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE user_email = ?",
        [data.user_email]
    );

    if (rows.length === 0) throw new Error("User not found");

    const user = rows[0];
    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign({ id: user.user_id, role: user.user_role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return { user: { user_id: user.user_id, user_name: user.user_name, user_email: user.user_email, user_role: user.user_role }, token };
};

module.exports = { registerUser, loginUser };