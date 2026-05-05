import API from "./api";

// GET ALL
export const getPrivacyPolicies = async () => {
  const res = await API.get("/privacy-policy");
  return res.data;
};

// GET ONE
export const getPrivacyPolicy = async (id) => {
  const res = await API.get(`/privacy-policy/${id}`);
  return res.data;
};

// CREATE
export const createPrivacyPolicy = async (data) => {
  const res = await API.post("/privacy-policy", data);
  return res.data;
};

// UPDATE
export const updatePrivacyPolicy = async (id, data) => {
  const res = await API.put(`/privacy-policy/${id}`, data);
  return res.data;
};

// DELETE
export const deletePrivacyPolicy = async (id) => {
  const res = await API.delete(`/privacy-policy/${id}`);
  return res.data;
};
