import API from "./api";

export const getIncidents = () => API.get("/safety-incidents");
export const addIncident = (data) => API.post("/safety-incidents", data);
export const updateIncident = (id, data) => API.put(`/safety-incidents/${id}`, data);
export const deleteIncident = (id) => API.delete(`/safety-incidents/${id}`);