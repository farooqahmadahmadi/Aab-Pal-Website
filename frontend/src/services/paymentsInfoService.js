import API from "./api";

export const getPayments = () => API.get("/finance-payments");
export const addPayment = (data) => API.post("/finance-payments", data);
export const updatePayment = (id, data) => API.put(`/finance-payments/${id}`, data);
export const deletePayment = (id) => API.delete(`/finance-payments/${id}`);