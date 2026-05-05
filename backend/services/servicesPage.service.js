const ServicesPage = require("../models/ServicesPage");

// ================= GET ALL =================
exports.getAll = async () => {
  return await ServicesPage.findAll({
    order: [
      ["display_order", "ASC"],
      ["service_id", "DESC"],
    ],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await ServicesPage.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await ServicesPage.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await ServicesPage.findByPk(id);
  if (!item) throw new Error("Service not found");

  return await item.update(data);
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await ServicesPage.findByPk(id);
  if (!item) throw new Error("Service not found");

  return await item.destroy();
};
