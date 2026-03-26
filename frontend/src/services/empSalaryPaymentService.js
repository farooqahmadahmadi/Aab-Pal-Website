import API from "./api";

export const getAllPayments = () => API.get("/payments").then(res => res.data);
export const getPaymentById = (id) => API.get(`/payments/${id}`).then(res => res.data);
export const createPayment = (data) => API.post("/payments", data).then(res => res.data);
export const updatePayment = (id, data) => API.put(`/payments/${id}`, data).then(res => res.data);
export const deletePayment = (id) => API.delete(`/payments/${id}`).then(res => res.data);

// Active EmployeeSalaryInfo
export const getActiveSalaryInfos = () => API.get("/payments/activeSalaryInfos").then(res => res.data);