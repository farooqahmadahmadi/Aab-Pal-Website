import API from "./api";

// GET ALL
export const getProjects = async () => {
  const res = await API.get("/our-projects-page");
  return res.data;
};

// GET ONE
export const getProject = async (id) => {
  const res = await API.get(`/our-projects-page/${id}`);
  return res.data;
};

// CREATE
export const createProject = async (data) => {
  const res = await API.post("/our-projects-page", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// UPDATE
export const updateProject = async (id, data) => {
  const res = await API.put(`/our-projects-page/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE
export const deleteProject = async (id) => {
  const res = await API.delete(`/our-projects-page/${id}`);
  return res.data;
};
