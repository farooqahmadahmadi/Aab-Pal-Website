import API from "./api";

// GET ALL
export const getBlogs = async () => {
  const res = await API.get("/blogs-page");
  return res.data;
};

// GET ONE
export const getBlog = async (id) => {
  const res = await API.get(`/blogs-page/${id}`);
  return res.data;
};

// CREATE
export const createBlog = async (data) => {
  const res = await API.post("/blogs-page", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// UPDATE
export const updateBlog = async (id, data) => {
  const res = await API.put(`/blogs-page/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE
export const deleteBlog = async (id) => {
  const res = await API.delete(`/blogs-page/${id}`);
  return res.data;
};
