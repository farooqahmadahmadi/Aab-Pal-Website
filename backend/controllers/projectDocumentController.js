const ProjectService = require("../services/projectDocumentService");

// ===== GET ALL =====
exports.getDocuments = async (req, res) => {
  try {
    const docs = await ProjectService.getDocuments();
    res.json(docs);
  } catch (err) {
    console.error("GET DOCS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// ===== GET BY ID =====
exports.getDocumentById = async (req, res) => {
  try {
    const doc = await ProjectService.getById(req.params.id);

    if (!doc)
      return res.status(404).json({ message: "Document not found" });

    res.json(doc);
  } catch (err) {
    console.error("GET DOC ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch document" });
  }
};

// ===== CREATE =====
exports.createDocument = async (req, res) => {
  try {
    const user = req.user;

    const doc = await ProjectService.createDocument(
      req.body,
      req.file,
      user
    );

    res.status(201).json(doc);
  } catch (err) {
    console.error("CREATE DOC ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to create document",
    });
  }
};

// ===== UPDATE =====
exports.updateDocument = async (req, res) => {
  try {
    const user = req.user;

    const doc = await ProjectService.updateDocument(
      req.params.id,
      req.body,
      req.file,
      user
    );

    res.json(doc);
  } catch (err) {
    console.error("UPDATE DOC ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to update document",
    });
  }
};

// ===== DELETE =====
exports.deleteDocument = async (req, res) => {
  try {
    const user = req.user;

    await ProjectService.deleteDocument(req.params.id, user);

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("DELETE DOC ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to delete document",
    });
  }
};