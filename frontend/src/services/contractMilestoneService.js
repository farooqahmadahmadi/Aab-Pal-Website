import API from "./api";

export const getMilestones = () => API.get("/contract-milestones");

export const addMilestone = (data) => API.post("/contract-milestones", data);

export const updateMilestone = (id, data) => API.put(`/contract-milestones/${id}`, data);

export const deleteMilestone = (id) => API.delete(`/contract-milestones/${id}`);