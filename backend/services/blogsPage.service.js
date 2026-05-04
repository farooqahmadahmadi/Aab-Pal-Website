const BlogsPage = require("../models/BlogsPage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await BlogsPage.findAll({
    order: [["created_at", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await BlogsPage.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await BlogsPage.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await BlogsPage.findByPk(id);

  if (!item) throw new Error("Blog not found");

  await item.update(data);
  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await BlogsPage.findByPk(id);

  if (!item) throw new Error("Blog not found");

  await item.destroy();
  return true;
};
