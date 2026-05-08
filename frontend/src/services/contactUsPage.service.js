import API from "./api";

// ================= GET ALL =================
export const getContactMessages = async () => {
  const res = await API.get("/contact-us");
  return res.data;
};

// ================= GET ONE =================
export const getContactMessage = async (id) => {
  const res = await API.get(`/contact-us/${id}`);
  return res.data;
};

// ================= CREATE =================
export const createContactMessage = async (data) => {
  const res = await API.post("/contact-us", data);
  return res.data;
};

// ================= UPDATE =================
export const updateContactMessage = async (id, data) => {
  const res = await API.put(`/contact-us/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteContactMessage = async (id) => {
  const res = await API.delete(`/contact-us/${id}`);
  return res.data;
};
