import axios from "./api"; // base axios instance

export const getProjectPhases = () => axios.get("/project-phases");
export const addProjectPhase = (data) => axios.post("/project-phases", data);
export const updateProjectPhase = (id, data) => axios.put(`/project-phases/${id}`, data);
export const deleteProjectPhase = (id) => axios.delete(`/project-phases/${id}`);

