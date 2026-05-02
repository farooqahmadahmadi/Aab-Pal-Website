const Users = require("../models/Users");
const bcrypt = require("bcrypt");

// LOGIN
exports.loginUser = async (email, password) => {
  const user = await Users.findOne({ where: { user_email: email } });

  if (!user) throw new Error("Invalid credentials");
  if (!user.is_active) throw new Error("User is inactive");

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    user.failed_attempts += 1;
    await user.save();
    throw new Error("Invalid credentials");
  }

  user.failed_attempts = 0;
  await user.save();

  return user;
};

// GET ALL
exports.getUsers = async () => {
  return await Users.findAll({
    order: [["user_id", "ASC"]],
  });
};

// GET BY ID
exports.getUserById = async (id) => {
  return await Users.findByPk(id);
};

// CREATE
exports.createUser = async (data) => {
  data.password_hash = await bcrypt.hash(data.password, 10);
  delete data.password;

  return await Users.create(data);
};

// UPDATE
exports.updateUser = async (id, data) => {
  const user = await Users.findByPk(id);
  if (!user) throw new Error("User not found");

  if (data.password) {
    data.password_hash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }

  await user.update(data);
  return user;
};

// DELETE
exports.deleteUser = async (id) => {
  const user = await Users.findByPk(id);
  if (!user) throw new Error("User not found");

  await user.destroy();
  return true;
};