import API from "./api";

export const getCompany = () => API.get("/company");
export const createCompany = (data) => API.post("/company", data);
export const updateCompany = (data) => API.put("/company", data);