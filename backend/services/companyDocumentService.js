// backend/services/companyDocumentService.js
const CompanyDocument = require("../models/CompanyDocument");
const path = require("path");
const fs = require("fs");

// Upload directory
const uploadDir = path.join(__dirname, "../uploads/documents/company");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// GET all documents
exports.getDocuments = async () => {
    return await CompanyDocument.findAll({ order: [['created_at', 'DESC']] });
};

// CREATE document
exports.createDocument = async (data, file) => {
    if (!file) throw new Error("File is required");

    // Step 1: create record with empty file URL
    const doc = await CompanyDocument.create({ ...data, doc_file_url: "" });

    // Step 2: rename file with doc_id, doc_name, updatedAt
    const timestamp = doc.updatedAt.getTime();
    const ext = path.extname(file.originalname);
    const safeName = data.doc_name.replace(/\s+/g, "_");
    const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
    const uploadPath = path.join(uploadDir, newFileName);

    fs.renameSync(file.path, uploadPath);

    // Step 3: update record with real file path
    doc.doc_file_url = `/uploads/documents/company/${newFileName}`;
    await doc.save();

    return doc;
};

// UPDATE document
exports.updateDocument = async (id, data, file) => {
    const doc = await CompanyDocument.findByPk(id);
    if (!doc) throw new Error("Document not found");

    // Step 1: update data first (doc_name, description etc.)
    await doc.update(data);

    if (file) {
        // Delete old file if exists
        if (doc.doc_file_url) {
            const oldPath = path.join(__dirname, "../", doc.doc_file_url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Step 2: rename new file
        const timestamp = doc.updatedAt.getTime(); // updatedAt is now correct
        const ext = path.extname(file.originalname);
        const safeName = data.doc_name.replace(/\s+/g, "_");
        const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
        const uploadPath = path.join(uploadDir, newFileName);

        fs.renameSync(file.path, uploadPath);

        // Step 3: update DB with new file path
        doc.doc_file_url = `/uploads/documents/company/${newFileName}`;
        await doc.save();
    }

    return doc;
};

// DELETE document
exports.deleteDocument = async (id) => {
    const doc = await CompanyDocument.findByPk(id);
    if (!doc) throw new Error("Document not found");

    if (doc.doc_file_url) {
        const filePath = path.join(__dirname, "../", doc.doc_file_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await doc.destroy();
};