import API from "./api";

// GET ALL
export const getHomePages = async () => {
  const res = await API.get("/home-page");
  return res.data;
};

// GET ONE
export const getHomePage = async (id) => {
  const res = await API.get(`/home-page/${id}`);
  return res.data;
};

// CREATE
export const createHomePage = async (data) => {
  const res = await API.post("/home-page", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// UPDATE
export const updateHomePage = async (id, data) => {
  const res = await API.put(`/home-page/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE
export const deleteHomePage = async (id) => {
  const res = await API.delete(`/home-page/${id}`);
  return res.data;
};
