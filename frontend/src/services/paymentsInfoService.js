import API from "./api";

export const getPayments = () => API.get("/payments");
export const addPayment = (data) => API.post("/payments", data);
export const updatePayment = (id, data) => API.put(`/payments/${id}`, data);
export const deletePayment = (id) => API.delete(`/payments/${id}`);