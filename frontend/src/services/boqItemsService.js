import API from "./api";

export const getItems = () => API.get("/boq-items");
export const addItem = (data) => API.post("/boq-items", data);
export const updateItem = (id, data) => API.put(`/boq-items/${id}`, data);
export const deleteItem = (id) => API.delete(`/boq-items/${id}`);
