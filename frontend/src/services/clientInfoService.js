import API from "./api";

export const getClients = () => API.get("/client-info");

export const addClient = (data) => API.post("/client-info", data);

export const updateClient = (id, data) => API.put(`/client-info/${id}`, data);

export const deleteClient = (id) => API.delete(`/client-info/${id}`);
