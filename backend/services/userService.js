const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const getUserId = (user) => user?.user_id || user?.id || 0;

// ---------------- LOGIN ----------------
exports.loginUser = async (email, password) => {
  const user = await Users.findOne({ where: { user_email: email } });

  if (!user) throw new Error("Invalid credentials");
  if (!user.is_active) throw new Error("User is inactive");

  const now = new Date();
  const time = now.toTimeString().split(" ")[0];

  if (user.access_time_start && user.access_time_end) {
    if (!(time >= user.access_time_start && time <= user.access_time_end)) {
      throw new Error("Login not allowed at this time");
    }
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    user.failed_attempts += 1;
    await user.save();

    await logService.createLog({
      user_id: user.user_id,
      action: "LOGIN_FAILED",
      reference_table: "users",
      reference_record_id: user.user_id,
      old_value: null,
      new_value: { failed_attempts: user.failed_attempts },
    });

    if (user.failed_attempts >= 6) {
      user.is_active = false;
      await user.save();

      await logService.createLog({
        user_id: user.user_id,
        action: "USER_DEACTIVATED",
        reference_table: "users",
        reference_record_id: user.user_id,
        old_value: null,
        new_value: { is_active: false },
      });

      throw new Error("User deactivated by system");
    }

    throw new Error("Invalid credentials");
  }

  const oldValue = user.toJSON();

  user.failed_attempts = 0;
  user.login_status = "Online";
  user.last_login_at = new Date();
  await user.save();

  await logService.createLog({
    user_id: user.user_id,
    action: "LOGIN",
    reference_table: "users",
    reference_record_id: user.user_id,
    old_value: oldValue,
    new_value: {
      login_status: "Online",
      last_login_at: user.last_login_at,
    },
  });

  const token = jwt.sign(
    { id: user.user_id, role: user.user_role },
    JWT_SECRET,
    { expiresIn: "8h" },
  );

  return { user, token };
};

// ---------------- GET ALL USERS (NO SEARCH, NO PAGINATION) ----------------
exports.getUsersList = async () => {
  const users = await Users.findAll({
    order: [["user_id", "ASC"]],
  });

  return { users };
};

// ---------------- GET BY ID ----------------
exports.getUserById = async (id) => await Users.findByPk(id);

// ---------------- CREATE + LOG ----------------
exports.addUser = async (data, actor = {}) => {
  data.password_hash = await bcrypt.hash(data.password, 10);

  const newUser = await Users.create(data);

  await logService.createLog({
    user_id: getUserId(actor),
    action: "CREATE",
    reference_table: "users",
    reference_record_id: newUser.user_id,
    old_value: null,
    new_value: newUser.toJSON(),
  });

  return newUser;
};

// ---------------- UPDATE + LOG ----------------
exports.updateUser = async (id, data, actor = {}) => {
  const user = await Users.findByPk(id);
  if (!user) throw new Error("User not found");

  const oldValue = user.toJSON();

  delete data.created_at;
  delete data.last_login_at;
  delete data.failed_attempts;

  if (data.password) {
    data.password_hash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }

  await user.update(data);

  await logService.createLog({
    user_id: getUserId(actor),
    action: "UPDATE",
    reference_table: "users",
    reference_record_id: user.user_id,
    old_value: oldValue,
    new_value: user.toJSON(),
  });

  return user;
};

// ---------------- DELETE ----------------
exports.deleteUser = async (id, actor = {}) => {
  const user = await Users.findByPk(id);
  if (!user) throw new Error("User not found");

  await handleDelete(user, actor, "users", getUserId(actor));

  return true;
};

// ---------------- LOGOUT ----------------
exports.logoutUser = async (id) => {
  const user = await Users.findByPk(id);
  if (!user) throw new Error("User not found");

  const oldValue = user.toJSON();

  user.login_status = "Offline";
  await user.save();

  await logService.createLog({
    user_id: user.user_id,
    action: "LOGOUT",
    reference_table: "users",
    reference_record_id: user.user_id,
    old_value: oldValue,
    new_value: { login_status: "Offline" },
  });

  return true;
};
