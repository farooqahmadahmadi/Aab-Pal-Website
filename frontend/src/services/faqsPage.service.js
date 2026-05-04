import API from "./api";

// ================= GET ALL =================
export const getFaqs = async () => {
  const res = await API.get("/faqs");
  return res.data;
};

// ================= GET ONE =================
export const getFaq = async (id) => {
  const res = await API.get(`/faqs/${id}`);
  return res.data;
};

// ================= CREATE =================
export const createFaq = async (data) => {
  const res = await API.post("/faqs", data);
  return res.data;
};

// ================= UPDATE =================
export const updateFaq = async (id, data) => {
  const res = await API.put(`/faqs/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteFaq = async (id) => {
  const res = await API.delete(`/faqs/${id}`);
  return res.data;
};
