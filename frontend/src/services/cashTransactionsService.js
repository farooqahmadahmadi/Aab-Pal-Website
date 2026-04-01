import API from "./api";

export const getTransactions = () => API.get("/cash-transactions");
export const addTransaction = (data) => API.post("/cash-transactions", data);
export const updateTransaction = (id, data) => API.put(`/cash-transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/cash-transactions/${id}`);