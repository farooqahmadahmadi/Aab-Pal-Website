import API from "./api";

export const getMaintenances = () => API.get("/equipment-maintenance");
export const addMaintenance = (data) => API.post("/equipment-maintenance", data);
export const updateMaintenance = (id, data) => API.put(`/equipment-maintenance/${id}`, data);
export const deleteMaintenance = (id) => API.delete(`/equipment-maintenance/${id}`);