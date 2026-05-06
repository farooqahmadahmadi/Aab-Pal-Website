const WebPageViewStats = require("../models/WebPageViewStats");

// ================= GET ALL =================
exports.getAll = async () => {
  return await WebPageViewStats.findAll({
    order: [["view_date", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await WebPageViewStats.findByPk(id);
};

// ================= GET BY PAGE =================
exports.getByPage = async (pageId) => {
  return await WebPageViewStats.findAll({
    where: { web_page_id: pageId },
    order: [["view_date", "DESC"]],
  });
};

// ================= CREATE =================
exports.create = async (data) => {
  if (!data.web_page_id || !data.view_date) {
    throw new Error("Page ID & Date required");
  }

  return await WebPageViewStats.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await WebPageViewStats.findByPk(id);

  if (!item) throw new Error("Stats not found");

  await item.update(data);
  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await WebPageViewStats.findByPk(id);

  if (!item) throw new Error("Stats not found");

  await item.destroy();
  return true;
};
