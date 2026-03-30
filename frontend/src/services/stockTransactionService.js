import API from "./api";

export const getTransactions = () => API.get("/stock-transactions");
export const addTransaction = (data) => API.post("/stock-transactions", data);
export const updateTransaction = (id, data) => API.put(`/stock-transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/stock-transactions/${id}`);
