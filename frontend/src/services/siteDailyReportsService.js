import API from "./api";

export const getReports = () => API.get("/site-daily-reports");
export const addReport = (data) => API.post("/site-daily-reports", data);
export const updateReport = (id, data) => API.put(`/site-daily-reports/${id}`, data);
export const deleteReport = (id) => API.delete(`/site-daily-reports/${id}`);