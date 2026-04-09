const EquipmentDocuments = require("../models/EquipmentDocuments");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/documents/equipments");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// helper for deleting old file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[File Deleted] ${filePath}`);
    }
  } catch (err) {
    console.error(`[File Delete Error] ${filePath}:`, err.message);
  }
};

const EquipmentDocumentsService = {
  // ===== GET ALL =====
  getDocuments: async () => {
    return await EquipmentDocuments.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  },

  // ===== CREATE =====
  createDocument: async (data, user = {}) => {
    const record = await EquipmentDocuments.create(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "CREATE",
      reference_table: "equipment_documents",
      reference_record_id: record.document_id,
      old_value: null,
      new_value: record.toJSON(),
    });

    console.log(`[Document Created] ID: ${record.document_id}`);
    return record;
  },

  // ===== UPDATE =====
  updateDocument: async (id, data, user = {}) => {
    const doc = await EquipmentDocuments.findOne({
      where: { document_id: id, is_deleted: false },
    });
    if (!doc) throw new Error("Document not found");

    const oldValue = doc.toJSON();

    // File replacement
    if (data.document_file_url && doc.document_file_url) {
      const oldFilePath = path.join(__dirname, "..", doc.document_file_url);
      deleteFile(oldFilePath);
    }

    await doc.update(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "UPDATE",
      reference_table: "equipment_documents",
      reference_record_id: doc.document_id,
      old_value: oldValue,
      new_value: doc.toJSON(),
    });

    console.log(`[Document Updated] ID: ${doc.document_id}`);
    return doc;
  },

  // ===== DELETE (soft + helper) =====
  deleteDocument: async (id, user = {}) => {
    const doc = await EquipmentDocuments.findOne({
      where: { document_id: id, is_deleted: false },
    });
    if (!doc) throw new Error("Document not found");

    // Delete file if exists
    if (doc.document_file_url) {
      const filePath = path.join(__dirname, "..", doc.document_file_url);
      deleteFile(filePath);
    }

    // Use deleteHelper for soft delete + log
    await handleDelete(doc, user, "equipment_documents", getUserId(user));

    console.log(`[Document Deleted] ID: ${doc.document_id}`);
    return true;
  },
};

module.exports = EquipmentDocumentsService;