import API from "./api";

export const getEquipments = () => API.get("/equipment");
export const addEquipment = (data) => API.post("/equipment", data);
export const updateEquipment = (id, data) => API.put(`/equipment/${id}`, data);
export const deleteEquipment = (id) => API.delete(`/equipment/${id}`);