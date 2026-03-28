import API from "./api";

export const getDocuments = () => API.get("/equipment-documents");

export const addDocument = (formData) => API.post("/equipment-documents", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

export const updateDocument = (id, formData) => API.put(`/equipment-documents/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

export const deleteDocument = (id) => API.delete(`/equipment-documents/${id}`);