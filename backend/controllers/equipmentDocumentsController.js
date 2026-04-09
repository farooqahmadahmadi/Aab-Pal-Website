const service = require("../services/equipmentDocumentsService");

// ===== GET ALL =====
exports.getAll = async (req, res) => {
  try {
    const data = await service.getDocuments();
    res.json(data);
  } catch (err) {
    console.error("GET DOCUMENTS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ===== CREATE =====
exports.create = async (req, res) => {
  try {
    const user = req.user;
    if (!req.file) return res.status(400).json({ message: "File required" });

    const data = {
      equipment_id: req.body.equipment_id,
      document_name: req.body.doc_name,
      document_description: req.body.doc_description || null,
      document_file_url: `/uploads/documents/equipments/${req.file.filename}`,
    };

    const item = await service.createDocument(data, user);
    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE DOCUMENT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const data = {
      equipment_id: req.body.equipment_id,
      document_name: req.body.doc_name,
      document_description: req.body.doc_description,
    };

    if (req.file) {
      data.document_file_url = `/uploads/documents/equipments/${req.file.filename}`;
    }

    const item = await service.updateDocument(req.params.id, data, user);
    res.json(item);
  } catch (err) {
    console.error("UPDATE DOCUMENT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ===== DELETE =====
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.deleteDocument(req.params.id, user);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE DOCUMENT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};