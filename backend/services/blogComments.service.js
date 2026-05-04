const BlogComments = require("../models/BlogComments");

// ================= GET ALL =================
exports.getAll = async () => {
  return await BlogComments.findAll({
    order: [["comment_id", "DESC"]],
  });
};

// ================= GET BY BLOG =================
exports.getByBlog = async (blog_id) => {
  return await BlogComments.findAll({
    where: { blog_id },
    order: [["comment_id", "DESC"]],
  });
};

// ================= CREATE =================
exports.create = async (data) => {
  return await BlogComments.create(data);
};

// ================= APPROVE =================
exports.approve = async (id) => {
  const item = await BlogComments.findByPk(id);
  if (!item) throw new Error("Comment not found");

  await item.update({
    is_approved: true,
    approved_at: new Date(),
  });

  return item;
};

// ================= DELETE =================
exports.remove = async (id) => {
  const item = await BlogComments.findByPk(id);
  if (!item) throw new Error("Comment not found");

  await item.destroy();
  return true;
};
