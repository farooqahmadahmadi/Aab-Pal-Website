const WebsitePages = require("../models/WebsitePages");
const { Op } = require("sequelize");

// ================= SLUG HELPER =================
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ================= GET ALL =================
exports.getAll = async () => {
  return await WebsitePages.findAll({
    order: [["web_page_id", "DESC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await WebsitePages.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  if (!data.page_slug && data.page_title) {
    data.page_slug = slugify(data.page_title);
  }

  const exists = await WebsitePages.findOne({
    where: { page_slug: data.page_slug },
  });

  if (exists) throw new Error("Slug already exists");

  return await WebsitePages.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await WebsitePages.findByPk(id);

  if (!item) throw new Error("Page not found");

  if (data.page_title && !data.page_slug) {
    data.page_slug = slugify(data.page_title);
  }

  if (data.page_slug) {
    const exists = await WebsitePages.findOne({
      where: {
        page_slug: data.page_slug,
        web_page_id: { [Op.ne]: id },
      },
    });

    if (exists) throw new Error("Slug already exists");
  }

  await item.update(data);
  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await WebsitePages.findByPk(id);

  if (!item) throw new Error("Page not found");

  await item.destroy();
  return true;
};