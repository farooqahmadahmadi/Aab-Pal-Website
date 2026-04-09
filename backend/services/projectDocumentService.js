const ProjectDocuments = require("../models/ProjectDocuments");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/documents/projects");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🔥 helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// ===== GET ALL =====
exports.getDocuments = async () => {
  return await ProjectDocuments.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// ===== GET BY ID =====
exports.getById = async (id) => {
  return await ProjectDocuments.findOne({
    where: { document_id: id, is_deleted: false },
  });
};

// ===== CREATE =====
exports.createDocument = async (data, file, user = {}) => {
  if (!file) throw new Error("File is required");

  const doc = await ProjectDocuments.create({
    ...data,
    document_file_url: "",
  });

  const timestamp = Date.now();
  const ext = path.extname(file.originalname);
  const safeName = (data.document_name || "doc").replace(/\s+/g, "_");

  const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
  const uploadPath = path.join(uploadDir, newFileName);

  fs.renameSync(file.path, uploadPath);

  doc.document_file_url = `/uploads/documents/projects/${newFileName}`;
  await doc.save();

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "project_documents",
    reference_record_id: doc.document_id,
    old_value: null,
    new_value: doc.toJSON(),
  });

  return doc;
};

// ===== UPDATE =====
exports.updateDocument = async (id, data, file, user = {}) => {
  const doc = await ProjectDocuments.findOne({
    where: { document_id: id, is_deleted: false },
  });

  if (!doc) throw new Error("Document not found");

  const oldValue = doc.toJSON();

  await doc.update(data);

  if (file) {
    // delete old file
    if (doc.document_file_url) {
      const oldPath = path.join(__dirname, "../", doc.document_file_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const safeName = (data.document_name || doc.document_name || "doc").replace(/\s+/g, "_");

    const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
    const uploadPath = path.join(uploadDir, newFileName);

    fs.renameSync(file.path, uploadPath);

    doc.document_file_url = `/uploads/documents/projects/${newFileName}`;
    await doc.save();
  }

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "project_documents",
    reference_record_id: doc.document_id,
    old_value: oldValue,
    new_value: doc.toJSON(),
  });

  return doc;
};

// ===== DELETE (Soft + Hard via helper) =====
exports.deleteDocument = async (id, user = {}) => {
  const doc = await ProjectDocuments.findOne({
    where: { document_id: id, is_deleted: false },
  });

  if (!doc) throw new Error("Document not found");

  // delete file first
  if (doc.document_file_url) {
    const filePath = path.join(__dirname, "../", doc.document_file_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await handleDelete(
    doc,
    user,
    "project_documents",
    getUserId(user)
  );

  return true;
};