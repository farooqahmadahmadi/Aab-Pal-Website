import API from "./api";

export const getEquipmentUsage = () => API.get("/equipment-usage");
export const addEquipmentUsage = (data) => API.post("/equipment-usage", data);
export const updateEquipmentUsage = (id, data) => API.put(`/equipment-usage/${id}`, data);
export const deleteEquipmentUsage = (id) => API.delete(`/equipment-usage/${id}`);