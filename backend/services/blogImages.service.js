const BlogImages = require("../models/BlogImages");

// ================= GET ALL =================
exports.getAll = async () => {
  return await BlogImages.findAll({
    order: [["blog_image_id", "DESC"]],
  });
};

// ================= GET BY BLOG =================
exports.getByBlog = async (blog_id) => {
  return await BlogImages.findAll({
    where: { blog_id },
    order: [["blog_image_id", "ASC"]],
  });
};

// ================= GET ONE =================
exports.getOne = async (id) => {
  return await BlogImages.findByPk(id);
};

// ================= CREATE =================
exports.create = async (data) => {
  return await BlogImages.create(data);
};

// ================= UPDATE =================
exports.update = async (id, data) => {
  const item = await BlogImages.findByPk(id);

  if (!item) throw new Error("Blog image not found");

  await item.update(data);

  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await BlogImages.findByPk(id);

  if (!item) throw new Error("Blog image not found");

  await item.destroy();

  return true;
};
