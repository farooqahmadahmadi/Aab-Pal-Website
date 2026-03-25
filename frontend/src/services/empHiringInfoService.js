import API from "./api"; // د Axios instance

export const getEmpHiringInfo = async () => {
    return await API.get("/emp-hiring-info");
};

export const getEmpHiringById = async (id) => {
    return await API.get(`/emp-hiring-info/${id}`);
};

export const addEmpHiring = async (data) => {
    return await API.post("/emp-hiring-info", data);
};

export const updateEmpHiring = async (id, data) => {
    return await API.put(`/emp-hiring-info/${id}`, data);
};

export const deleteEmpHiring = async (id) => {
    return await API.delete(`/emp-hiring-info/${id}`);
};
