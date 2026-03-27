import API from "./api";

// Get all documents
export const getDocuments = () => API.get("/project-documents");

// Create a new document
export const createDocument = (formData) => API.post("/project-documents", formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

// Update a document
export const updateDocument = (id, formData) => API.put(`/project-documents/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
});

// Delete a document
export const deleteDocument = (id) => API.delete(`/project-documents/${id}`);