import API from "./api";

// Get all documents
export const getDocuments = () => API.get("/company-documents");

// Create a new document
export const createDocument = (formData) => API.post("/company-documents", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// Update a document
export const updateDocument = (id, formData) => API.put(`/company-documents/${id}`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// Delete a document
export const deleteDocument = (id) => API.delete(`/company-documents/${id}`);