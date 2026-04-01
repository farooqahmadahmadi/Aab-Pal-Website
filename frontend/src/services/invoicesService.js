import API from "./api";

export const getInvoices = () => API.get("/invoices");
export const addInvoice = (data) => API.post("/invoices", data);
export const updateInvoice = (id, data) => API.put(`/invoices/${id}`, data);
export const deleteInvoice = (id) => API.delete(`/invoices/${id}`);