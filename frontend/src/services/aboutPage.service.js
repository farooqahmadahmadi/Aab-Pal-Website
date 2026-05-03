import API from "./api";

// GET ALL
export const getAboutPages = async () => {
  const res = await API.get("/about-page");
  return res.data;
};

// GET ONE
export const getAboutPage = async (id) => {
  const res = await API.get(`/about-page/${id}`);
  return res.data;
};

// CREATE
export const createAboutPage = async (data) => {
  const res = await API.post("/about-page", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// UPDATE
export const updateAboutPage = async (id, data) => {
  const res = await API.put(`/about-page/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE
export const deleteAboutPage = async (id) => {
  const res = await API.delete(`/about-page/${id}`);
  return res.data;
};
