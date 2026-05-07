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

// ================= ADMIN CREATE =================
export const createFaq = async (data) => {
  const res = await API.post("/faqs", data);
  return res.data;
};

// ================= PUBLIC ASK QUESTION =================
// 🔥 NO AUTH REQUIRED
export const askFaqQuestion = async (data) => {
  const res = await API.post("/faqs/ask", data);
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