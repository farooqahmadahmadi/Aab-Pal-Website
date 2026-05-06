const WebsiteNotifications = require("../models/WebsiteNotifications");

// ================= GET ALL =================
exports.getAll = async () => {
  return await WebsiteNotifications.findAll({
    order: [["created_at", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await WebsiteNotifications.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await WebsiteNotifications.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await WebsiteNotifications.findByPk(id);

  if (!item) throw new Error("Notification not found");

  await item.update(data);
  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await WebsiteNotifications.findByPk(id);

  if (!item) throw new Error("Notification not found");

  await item.destroy();
  return true;
};
