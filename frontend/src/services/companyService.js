// companyService.js
import API from "./api";

export const getCompany = () => API.get("/company");
export const createCompany = (data) => API.post("/company", data);

// For FormData (with file)
export const updateCompany = (formData) =>
  API.put("/company", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

