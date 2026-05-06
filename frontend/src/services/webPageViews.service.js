import API from "./api";

// ================= GET ALL =================
export const getViews = async () => {
  const res = await API.get("/web-page-views");
  return res.data;
};

// ================= GET ONE =================
export const getView = async (id) => {
  const res = await API.get(`/web-page-views/${id}`);
  return res.data;
};

// ================= CREATE =================
export const createView = async (data) => {
  const res = await API.post("/web-page-views", data);
  return res.data;
};

// ================= UPDATE =================
export const updateView = async (id, data) => {
  const res = await API.put(`/web-page-views/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteView = async (id) => {
  const res = await API.delete(`/web-page-views/${id}`);
  return res.data;
};
