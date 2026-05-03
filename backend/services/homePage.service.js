const HomePage = require("../models/HomePage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await HomePage.findAll({
    order: [["display_order", "ASC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await HomePage.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await HomePage.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await HomePage.findByPk(id);

  if (!item) throw new Error("Home page not found");

  await item.update(data);
  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await HomePage.findByPk(id);

  if (!item) throw new Error("Home page not found");

  await item.destroy();
  return true;
};
