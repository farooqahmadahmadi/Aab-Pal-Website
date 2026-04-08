const {
    getAllDocuments,
    getDocumentById,
    addDocument,
    updateDocument,
    deleteDocument
} = require("../services/employeeDocumentsService");

// ===== GET ALL =====
exports.listDocuments = async (req, res) => {
    try {
        const docs = await getAllDocuments();
        res.json(docs);
    } catch (err) {
        console.error("GET ERROR:", err.message);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
};

// ===== GET BY ID =====
exports.getDocument = async (req, res) => {
    try {
        const doc = await getDocumentById(req.params.id);

        if (!doc)
            return res.status(404).json({ message: "Document not found" });

        res.json(doc);
    } catch (err) {
        console.error("GET BY ID ERROR:", err.message);
        res.status(500).json({ message: "Failed to fetch document" });
    }
};

// ===== CREATE =====
exports.createDocument = async (req, res) => {
    try {
        const fileUrl = req.file
            ? `/uploads/documents/employees/${req.file.filename}`
            : null;

        const data = { ...req.body, doc_file_url: fileUrl };

        const doc = await addDocument(data, req.user);

        res.status(201).json(doc);
    } catch (err) {
        console.error("CREATE ERROR:", err.message);
        res.status(400).json({
            message: err.message || "Failed to add document",
        });
    }
};

// ===== UPDATE =====
exports.editDocument = async (req, res) => {
    try {
        const data = { ...req.body };

        if (req.file)
            data.doc_file_url = `/uploads/documents/employees/${req.file.filename}`;

        const doc = await updateDocument(
            req.params.id,
            data,
            req.user
        );

        res.json(doc);
    } catch (err) {
        console.error("UPDATE ERROR:", err.message);
        res.status(400).json({
            message: err.message || "Failed to update document",
        });
    }
};

// ===== DELETE (Soft + Hard auto) =====
exports.deleteDocument = async (req, res) => {
    try {
        await deleteDocument(req.params.id, req.user);

        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        console.error("DELETE ERROR:", err.message);
        res.status(400).json({
            message: err.message || "Failed to delete document",
        });
    }
};