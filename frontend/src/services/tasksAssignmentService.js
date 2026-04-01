import API from "./api";

export const getTasks = (params) => API.get("/tasks", { params });
export const addTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);