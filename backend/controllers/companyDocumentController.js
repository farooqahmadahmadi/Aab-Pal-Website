const CompanyDocument = require("../models/CompanyDocument");

// GET all documents
exports.getAllDocuments = async (req, res) => {
    try {
        const docs = await CompanyDocument.findAll();
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents", error });
    }
};

// GET document by ID
exports.getDocumentById = async (req, res) => {
    try {
        const doc = await CompanyDocument.findByPk(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: "Error fetching document", error });
    }
};

// CREATE document
exports.createDocument = async (req, res) => {
    try {
        const doc = await CompanyDocument.create(req.body);
        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json({ message: "Error creating document", error });
    }
};

// UPDATE document
exports.updateDocument = async (req, res) => {
    try {
        const doc = await CompanyDocument.findByPk(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }
        await doc.update(req.body);
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: "Error updating document", error });
    }
};

// DELETE document
exports.deleteDocument = async (req, res) => {
    try {
        const doc = await CompanyDocument.findByPk(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }
        await doc.destroy();
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting document", error });
    }
};
