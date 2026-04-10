const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const {
  loginUser,
  logoutUser,
  getUsersList,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} = require("../services/userService");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    const data = await loginUser(user_email, password);

    const user = data.user;

    const token = jwt.sign(
      {
        id: user.user_id,
        employee_id: user.employee_id,
        role: user.user_role,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// ---------------- LOGOUT ----------------
exports.logout = async (req, res) => {
  try {
    const userId = req.user.user_id;

    await logoutUser(userId);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// ---------------- FORGOT PASSWORD ----------------
exports.forgotPassword = async (req, res) => {
  const { user_email } = req.body;

  if (!user_email)
    return res.status(400).json({ message: "Email is required" });

  try {
    const user = await Users.findOne({ where: { user_email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, {
      expiresIn: "10m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"Construction Company" <${process.env.SMTP_USER}>`,
      to: user_email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.user_name},</p>
        <p>Click the link below to reset your password.</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
      `,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
};

// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { new_password } = req.body;

  if (!new_password)
    return res.status(400).json({ message: "New password is required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await Users.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hash = await bcrypt.hash(new_password, 10);

    await user.update({ password_hash: hash });

    res.json({ message: "Password has been reset successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// ---------------- CHANGE PASSWORD ----------------
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res
        .status(400)
        .json({ message: "Both old and new password are required" });
    }

    const user = await Users.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(old_password, user.password_hash);

    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hash = await bcrypt.hash(new_password, 10);

    await user.update({ password_hash: hash });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to change password" });
  }
};

// ---------------- USERS LIST ----------------
exports.getUsers = async (req, res) => {
  try {
    const data = await getUsersList(req.query);

    res.json({
      total: data.total,
      users: data.users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ---------------- GET USER BY ID ----------------
exports.getUserById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ---------------- ADD USER ----------------
exports.addUser = async (req, res) => {
  try {
    const newUser = await addUser(req.body, req.user);

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE USER ----------------
exports.updateUser = async (req, res) => {
  try {
    const updated = await updateUser(req.params.id, req.body, req.user);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE USER (SOFT + LOG) ----------------
exports.deleteUser = async (req, res) => {
  try {
    await deleteUser(req.params.id, req.user);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- ADMIN RESET PASSWORD ----------------
exports.adminResetPassword = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findByPk(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const defaultPassword = "12345";

    const hash = await bcrypt.hash(defaultPassword, 10);

    await user.update({ password_hash: hash });

    res.json({
      message: `Password reset to default: ${defaultPassword}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
