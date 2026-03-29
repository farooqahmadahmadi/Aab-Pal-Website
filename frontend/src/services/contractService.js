import API from "./api";

export const getContracts = () => API.get("/contracts");

export const addContract = (formData) =>
    API.post("/contracts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const updateContract = (id, formData) =>
    API.put(`/contracts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const deleteContract = (id) =>
    API.delete(`/contracts/${id}`);
