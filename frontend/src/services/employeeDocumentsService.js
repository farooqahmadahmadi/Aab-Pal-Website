import API from "./api";

// ===== Employee Documents =====
export const getEmployeeDocuments = () => API.get("/employee-documents");

export const addEmployeeDocument = (data) =>
  API.post("/employee-documents", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateEmployeeDocument = (id, data) =>
  API.put(`/employee-documents/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteEmployeeDocument = (id) =>
  API.delete(`/employee-documents/${id}`);
