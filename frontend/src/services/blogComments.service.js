import API from "./api";

// GET ALL
export const getBlogComments = async () => {
  const res = await API.get("/blog-comments");
  return res.data;
};

// GET BY BLOG (recommended if needed in future)
export const getBlogCommentsByBlog = async (blogId) => {
  const res = await API.get(`/blog-comments/blog/${blogId}`);
  return res.data;
};

// CREATE
export const createBlogComment = async (data) => {
  const res = await API.post("/blog-comments", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// UPDATE
export const updateBlogComment = async (id, data) => {
  const res = await API.put(`/blog-comments/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// APPROVE
export const approveBlogComment = async (id) => {
  const res = await API.put(`/blog-comments/approve/${id}`);
  return res.data;
};

// DELETE
export const deleteBlogComment = async (id) => {
  const res = await API.delete(`/blog-comments/${id}`);
  return res.data;
};

// ================= LIKE COMMENT (NEW - FINAL) =================
export const likeBlogComment = async (id) => {
  const res = await API.patch(`/blog-comments/${id}/like`);
  return res.data;
};
