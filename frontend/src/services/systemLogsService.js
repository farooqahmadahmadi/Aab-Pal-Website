import API from "./api";

export const getSystemLogs = () => API.get("/system-logs");
export const deleteSystemLog = (id) => API.delete(`/system-logs/${id}`);