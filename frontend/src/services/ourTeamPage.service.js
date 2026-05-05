import API from "./api";

// ================= GET ALL =================
export const getTeamMembers = async () => {
  const res = await API.get("/our-team-page");
  return res.data;
};

// ================= GET ONE =================
export const getTeamMember = async (id) => {
  const res = await API.get(`/our-team-page/${id}`);
  return res.data;
};

// ================= CREATE =================
export const createTeamMember = async (data) => {
  const res = await API.post("/our-team-page", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ================= UPDATE =================
export const updateTeamMember = async (id, data) => {
  const res = await API.put(`/our-team-page/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ================= DELETE =================
export const deleteTeamMember = async (id) => {
  const res = await API.delete(`/our-team-page/${id}`);
  return res.data;
};
