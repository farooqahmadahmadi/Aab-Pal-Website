const WebsitePages = require("../models/WebsitePages");

// GET ALL
exports.getAll = async () => {
  return await WebsitePages.findAll({
    order: [["web_page_id", "DESC"]],
  });
};

// GET ONE
exports.getOne = async (id) => {
  return await WebsitePages.findByPk(id);
};

// CREATE
exports.create = async (data) => {
  return await WebsitePages.create(data);
};

// UPDATE
exports.update = async (id, data) => {
  const row = await WebsitePages.findByPk(id);
  if (!row) throw new Error("Not found");

  return await row.update(data);
};

// DELETE
exports.remove = async (id) => {
  const row = await WebsitePages.findByPk(id);
  if (!row) throw new Error("Not found");

  return await row.destroy();
};
