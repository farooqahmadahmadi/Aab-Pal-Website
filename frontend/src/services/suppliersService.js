import API from "./api";

export const getSuppliers = () => API.get("/suppliers");
export const addSupplier = (data) => API.post("/suppliers", data);
export const updateSupplier = (id, data) => API.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => API.delete(`/suppliers/${id}`);