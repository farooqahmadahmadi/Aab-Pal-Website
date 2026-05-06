import API from "./api";

// ================= GET ALL =================
export const getStats = async () => {
  const res = await API.get("/web-page-view-stats");
  return res.data;
};

// ================= GET ONE =================
export const getStat = async (id) => {
  const res = await API.get(`/web-page-view-stats/${id}`);
  return res.data;
};

// ================= GET BY PAGE =================
export const getStatsByPage = async (pageId) => {
  const res = await API.get(`/web-page-view-stats/page/${pageId}`);
  return res.data;
};

// ================= CREATE =================
export const createStat = async (data) => {
  const res = await API.post("/web-page-view-stats", data);
  return res.data;
};

// ================= UPDATE =================
export const updateStat = async (id, data) => {
  const res = await API.put(`/web-page-view-stats/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteStat = async (id) => {
  const res = await API.delete(`/web-page-view-stats/${id}`);
  return res.data;
};