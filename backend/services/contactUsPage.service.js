const ContactUsPage = require("../models/ContactUsPage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await ContactUsPage.findAll({
    order: [["created_at", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await ContactUsPage.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await ContactUsPage.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await ContactUsPage.findByPk(id);

  if (!item) {
    throw new Error("Message not found");
  }

  await item.update(data);

  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await ContactUsPage.findByPk(id);

  if (!item) {
    throw new Error("Message not found");
  }

  await item.destroy();

  return true;
};
