import API from "./api";

export const getUsers = (params) => API.get("/users", { params });
export const getUserById = (id) => API.get(`/users/${id}`);
export const addUser = (data) => API.post("/users", data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const changePassword = (data) => API.post("/users/change-password", data);
export const resetPasswordAdmin = (id) => API.post(`/users/${id}/reset-password`);