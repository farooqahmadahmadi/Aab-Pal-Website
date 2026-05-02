import API from "./api";

// GET all languages
export const getLanguages = async () => {
  const res = await API.get("/languages");
  return res.data;
};

// GET single language
export const getLanguage = async (id) => {
  const res = await API.get(`/languages/${id}`);
  return res.data;
};

// CREATE language
export const createLanguage = async (data) => {
  const res = await API.post("/languages", data);
  return res.data;
};

// UPDATE language
export const updateLanguage = async (id, data) => {
  const res = await API.put(`/languages/${id}`, data);
  return res.data;
};

// DELETE language
export const deleteLanguage = async (id) => {
  const res = await API.delete(`/languages/${id}`);
  return res.data;
};
