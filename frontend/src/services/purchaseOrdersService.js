import API from "./api";

export const getOrders = () => API.get("/purchase-orders");
export const addOrder = (data) => API.post("/purchase-orders", data);
export const updateOrder = (id, data) => API.put(`/purchase-orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/purchase-orders/${id}`);

export const getProjects = () => API.get("/project-info");