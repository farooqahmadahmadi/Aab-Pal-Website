import API from "./api";

export const getMaterials = () => API.get("/materials");
export const addMaterial = (data) => API.post("/materials", data);
export const updateMaterial = (id, data) => API.put(`/materials/${id}`, data);
export const deleteMaterial = (id) => API.delete(`/materials/${id}`);