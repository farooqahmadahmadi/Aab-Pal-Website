import API from "./api";

// ================= GET ALL =================
export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

// ================= GET ONE =================
export const getNotification = async (id) => {
  const res = await API.get(`/notifications/${id}`);
  return res.data;
};

// ================= CREATE =================
export const createNotification = async (data) => {
  const res = await API.post("/notifications", data);
  return res.data;
};

// ================= UPDATE =================
export const updateNotification = async (id, data) => {
  const res = await API.put(`/notifications/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteNotification = async (id) => {
  const res = await API.delete(`/notifications/${id}`);
  return res.data;
};
