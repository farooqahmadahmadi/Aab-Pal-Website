const WebPageViews = require("../models/WebPageViews");

// ================= GET ALL =================
exports.getAll = async () => {
  return await WebPageViews.findAll({
    order: [["view_id", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await WebPageViews.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  if (!data.web_page_id) throw new Error("Page ID required");

  return await WebPageViews.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await WebPageViews.findByPk(id);

  if (!item) throw new Error("View not found");

  await item.update(data);
  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await WebPageViews.findByPk(id);

  if (!item) throw new Error("View not found");

  await item.destroy();
  return true;
};
