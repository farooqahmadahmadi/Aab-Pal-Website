const AboutPage = require("../models/AboutPage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await AboutPage.findAll({
    order: [["display_order", "ASC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await AboutPage.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await AboutPage.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await AboutPage.findByPk(id);

  if (!item) throw new Error("About page not found");

  await item.update(data);
  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await AboutPage.findByPk(id);

  if (!item) throw new Error("About page not found");

  await item.destroy();
  return true;
};
