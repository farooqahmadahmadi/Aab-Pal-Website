const fs = require("fs");
const path = require("path");
const ProjectDocuments = require("../models/ProjectDocuments");

// GET all
exports.getDocuments = async (req, res) => {
    try {
        const docs = await ProjectDocuments.findAll({ order: [["created_at", "DESC"]] });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
exports.createDocument = async (req, res) => {
    try {
        const data = { ...req.body };
        if (!req.file) return res.status(400).json({ message: "File required" });

        data.document_file_url = `/uploads/documents/projects/${req.file.filename}`;
        const doc = await ProjectDocuments.create(data);
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.updateDocument = async (req, res) => {
    try {
        const doc = await ProjectDocuments.findByPk(req.params.id);
        if (!doc) return res.status(404).json({ message: "Document not found" });

        const data = { ...req.body };
        if (req.file) {
            if (doc.document_file_url) {
                const oldPath = path.join(__dirname, "../", doc.document_file_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            data.document_file_url = `/uploads/documents/projects/${req.file.filename}`;
        }

        await doc.update(data);
        res.json(doc);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
exports.deleteDocument = async (req, res) => {
    try {
        const doc = await ProjectDocuments.findByPk(req.params.id);
        if (!doc) return res.status(404).json({ message: "Document not found" });

        if (doc.document_file_url) {
            const filePath = path.join(__dirname, "../", doc.document_file_url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await doc.destroy();
        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};