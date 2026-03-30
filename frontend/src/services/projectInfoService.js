import API from "./api";

// CRUD
export const getProjects = () => API.get("/project-info");
export const addProject = (data) => API.post("/project-info", data);
export const updateProject = (id, data) => API.put(`/project-info/${id}`, data);
export const deleteProject = (id) => API.delete(`/project-info/${id}`);

// Dropdowns
export const getClients = () => API.get("/client-info");
export const getEmployees = () => API.get("/employees");
