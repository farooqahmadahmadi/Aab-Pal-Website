const {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} = require("../services/companyDocumentService");

// ================= GET Documents =================
exports.getDocuments = async (req, res) => {
    try {
        const docs = await getDocuments();
        res.json(docs);
    } catch (err) {
        console.error("GET DOCUMENTS ERROR:", err.message);
        res.status(500).json({ message: "Failed to load documents" });
    }
};

// ================= CREATE Document =================
exports.createDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "File required" });

        const user_id = req.user?.user_id || 0;
        const data = { ...req.body };

        const doc = await createDocument(data, req.file, user_id);

        res.status(201).json(doc);
    } catch (err) {
        console.error("CREATE DOCUMENT ERROR:", err.message);
        res.status(400).json({ message: err.message || "Failed to create document" });
    }
};

// ================= UPDATE Document =================
exports.updateDocument = async (req, res) => {
    try {
        const user_id = req.user?.user_id || 0;
        const id = req.params.id;
        const data = { ...req.body };

        const doc = await updateDocument(id, data, req.file, user_id);

        res.json(doc);
    } catch (err) {
        console.error("UPDATE DOCUMENT ERROR:", err.message);
        res.status(400).json({ message: err.message || "Failed to update document" });
    }
};

// ================= DELETE Document =================
exports.deleteDocument = async (req, res) => {
    try {
        const user_id = req.user?.user_id || 0;
        const id = req.params.id;

        await deleteDocument(id, user_id);

        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        console.error("DELETE DOCUMENT ERROR:", err.message);
        res.status(500).json({ message: err.message || "Failed to delete document" });
    }
};