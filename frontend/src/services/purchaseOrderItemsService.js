import API from "./api";

export const getItems = () => API.get("/purchase-order-items");
export const addItem = (data) => API.post("/purchase-order-items", data);
export const updateItem = (id, data) => API.put(`/purchase-order-items/${id}`, data);
export const deleteItem = (id) => API.delete(`/purchase-order-items/${id}`);