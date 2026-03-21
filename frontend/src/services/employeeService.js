import API from "./api";

const EmployeeService = {
    getAll: () => API.get("/employees"),
    getById: (id) => API.get(`/employees/${id}`),
    create: (data) => API.post("/employees", data),
    update: (id, data) => API.put(`/employees/${id}`, data),
    delete: (id) => API.delete(`/employees/${id}`)
};

export default EmployeeService;