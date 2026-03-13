const ProjectDocuments = require("../models/ProjectDocuments");

// GET all documents
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await ProjectDocuments.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents", error });
    }
};

// GET document by ID
exports.getDocumentById = async (req, res) => {
    try {
        const document = await ProjectDocuments.findByPk(req.params.id);
        if (!document || document.is_deleted) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ message: "Error fetching document", error });
    }
};

// CREATE document
exports.createDocument = async (req, res) => {
    try {
        const document = await ProjectDocuments.create(req.body);
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: "Error creating document", error });
    }
};

// UPDATE document
exports.updateDocument = async (req, res) => {
    try {
        const document = await ProjectDocuments.findByPk(req.params.id);
        if (!document || document.is_deleted) {
            return res.status(404).json({ message: "Document not found" });
        }
        await document.update(req.body);
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ message: "Error updating document", error });
    }
};

// DELETE document (soft delete)
exports.deleteDocument = async (req, res) => {
    try {
        const document = await ProjectDocuments.findByPk(req.params.id);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        await document.update({ is_deleted: true });
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting document", error });
    }
};
