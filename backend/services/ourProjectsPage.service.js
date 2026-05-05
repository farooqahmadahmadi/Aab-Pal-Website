const OurProjectsPage = require("../models/OurProjectsPage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await OurProjectsPage.findAll({
    order: [["project_id", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await OurProjectsPage.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await OurProjectsPage.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await OurProjectsPage.findByPk(id);
  if (!item) throw new Error("Project not found");

  return await item.update(data);
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await OurProjectsPage.findByPk(id);
  if (!item) throw new Error("Project not found");

  return await item.destroy();
};
