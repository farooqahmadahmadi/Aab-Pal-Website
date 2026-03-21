import API from "./api";

// ===== Employee Educational Info =====
export const getEmployeeEducation = () => API.get("/employee-educational-info");
export const getEmployeeEducationById = (id) => API.get(`/employee-educational-info/${id}`);
export const createEmployeeEducation = (data) => API.post("/employee-educational-info", data);
export const updateEmployeeEducation = (id, data) => API.put(`/employee-educational-info/${id}`, data);
export const deleteEmployeeEducation = (id) => API.delete(`/employee-educational-info/${id}`);

// ===== Employee List for Dropdown =====
export const getEmployees = () => API.get("/employees");

export default {
    getEmployeeEducation,
    getEmployeeEducationById,
    createEmployeeEducation,
    updateEmployeeEducation,
    deleteEmployeeEducation,
    getEmployees
};
