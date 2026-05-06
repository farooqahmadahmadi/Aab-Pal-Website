import API from "./api";

// GET ALL
export const getPages = async () => {
  const res = await API.get("/website-pages");
  return res.data;
};

// GET ONE
export const getPage = async (id) => {
  const res = await API.get(`/website-pages/${id}`);
  return res.data;
};

// CREATE
export const createPage = async (data) => {
  const res = await API.post("/website-pages", data);
  return res.data;
};

// UPDATE
export const updatePage = async (id, data) => {
  const res = await API.put(`/website-pages/${id}`, data);
  return res.data;
};

// DELETE
export const deletePage = async (id) => {
  const res = await API.delete(`/website-pages/${id}`);
  return res.data;
};
