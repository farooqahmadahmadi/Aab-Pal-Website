import API from "./api";

// ================= GET ALL =================
export const getBlogImages = async () => {
  const res = await API.get("/blog-images");
  return res.data;
};

// ================= GET BY BLOG =================
export const getBlogImagesByBlog = async (blogId) => {
  const res = await API.get(`/blog-images/blog/${blogId}`);
  return res.data;
};

// ================= GET ONE =================
export const getBlogImage = async (id) => {
  const res = await API.get(`/blog-images/${id}`);
  return res.data;
};

// ================= CREATE =================
export const createBlogImage = async (data) => {
  const res = await API.post("/blog-images", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ================= UPDATE =================
export const updateBlogImage = async (id, data) => {
  const res = await API.put(`/blog-images/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ================= DELETE =================
export const deleteBlogImage = async (id) => {
  const res = await API.delete(`/blog-images/${id}`);
  return res.data;
};
