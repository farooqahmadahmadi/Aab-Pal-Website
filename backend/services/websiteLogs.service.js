const WebsiteLogs = require("../models/WebsiteLogs");

// ================= GET ALL =================
exports.getAll = async () => {
  return await WebsiteLogs.findAll({
    order: [["created_at", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await WebsiteLogs.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await WebsiteLogs.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await WebsiteLogs.findByPk(id);

  if (!item) throw new Error("Log not found");

  await item.update(data);
  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await WebsiteLogs.findByPk(id);

  if (!item) throw new Error("Log not found");

  await item.destroy();
  return true;
};
