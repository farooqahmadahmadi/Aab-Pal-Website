const {
    getAllDocuments,
    getDocumentById,
    addDocument,
    updateDocument,
    softDeleteDocument,
    restoreDocument,
    hardDeleteDocument
} = require("../services/employeeDocumentsService");

exports.listDocuments = async (req, res) => {
    try {
        const docs = await getAllDocuments();
        res.json(docs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
};

exports.getDocument = async (req, res) => {
    try {
        const doc = await getDocumentById(req.params.id);
        if (!doc) return res.status(404).json({ message: "Document not found" });
        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch document" });
    }
};

exports.createDocument = async (req, res) => {
    try {
        const fileUrl = req.file ? `/uploads/documents/employees/${req.file.filename}` : null;
        const data = { ...req.body, doc_file_url: fileUrl };
        const doc = await addDocument(data);
        res.status(201).json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add document" });
    }
};

exports.editDocument = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) data.doc_file_url = `/uploads/documents/employees/${req.file.filename}`;
        const doc = await updateDocument(req.params.id, data);
        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update document" });
    }
};

exports.softDelete = async (req, res) => {
    try {
        await softDeleteDocument(req.params.id);
        res.json({ message: "Document soft deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to soft delete document" });
    }
};

exports.restore = async (req, res) => {
    try {
        await restoreDocument(req.params.id);
        res.json({ message: "Document restored" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to restore document" });
    }
};

exports.hardDelete = async (req, res) => {
    try {
        await hardDeleteDocument(req.params.id);
        res.json({ message: "Document permanently deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to hard delete document" });
    }
};