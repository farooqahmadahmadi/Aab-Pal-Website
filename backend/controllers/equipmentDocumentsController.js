const service = require("../services/equipmentDocumentsService");

// GET ALL
exports.getAll = async (req, res) => {
    try {
        const data = await service.getDocuments();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
exports.create = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "File required" });

        const data = {
            ...req.body,
            doc_file_url: `/uploads/documents/equipments/${req.file.filename}`
        };

        const item = await service.createDocument(data);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const data = { ...req.body };

        if (req.file) {
            data.doc_file_url = `/uploads/documents/equipments/${req.file.filename}`;
        }

        const item = await service.updateDocument(req.params.id, data);
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
exports.remove = async (req, res) => {
    try {
        await service.deleteDocument(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
