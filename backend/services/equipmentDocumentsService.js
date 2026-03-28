const EquipmentDocuments = require("../models/EquipmentDocuments");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/documents/equipments");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// GET
exports.getDocuments = async () => {
    return await EquipmentDocuments.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createDocument = async (data) => {
    return await EquipmentDocuments.create(data);
};

// UPDATE
exports.updateDocument = async (id, data) => {
    const doc = await EquipmentDocuments.findOne({
        where: { document_id: id, is_deleted: false }
    });
    if (!doc) throw new Error("Document not found");

    // که نوی فایل موجود وي، زاړه فایل پاک کړه
    if (data.doc_file_url && doc.doc_file_url) {
        const oldFilePath = path.join(__dirname, "..", doc.doc_file_url);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    }

    await doc.update(data);
    return doc;
};

// DELETE (soft delete)
exports.deleteDocument = async (id) => {
    const doc = await EquipmentDocuments.findOne({
        where: { document_id: id, is_deleted: false }
    });
    if (!doc) throw new Error("Document not found");

    // File Replace
    if (doc.doc_file_url) {
        const filePath = path.join(__dirname, "..", doc.doc_file_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await doc.update({ is_deleted: true });
};