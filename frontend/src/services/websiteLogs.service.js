import API from "./api";

// ================= GET ALL =================
export const getLogs = async () => {
  const res = await API.get("/website-logs");
  return res.data;
};

// ================= GET ONE =================
export const getLog = async (id) => {
  const res = await API.get(`/website-logs/${id}`);
  return res.data;
};

// ================= CREATE =================
export const createLog = async (data) => {
  const res = await API.post("/website-logs", data);
  return res.data;
};

// ================= UPDATE =================
export const updateLog = async (id, data) => {
  const res = await API.put(`/website-logs/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteLog = async (id) => {
  const res = await API.delete(`/website-logs/${id}`);
  return res.data;
};
