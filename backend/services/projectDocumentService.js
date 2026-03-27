const ProjectDocuments = require("../models/ProjectDocuments");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/documents/projects");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// GET all
exports.getDocuments = async () => {
    return await ProjectDocuments.findAll({ order: [["created_at", "DESC"]] });
};

// CREATE
exports.createDocument = async (data, file) => {
    if (!file) throw new Error("File is required");

    const doc = await ProjectDocuments.create({ ...data, document_file_url: "" });

    const timestamp = doc.updatedAt.getTime();
    const ext = path.extname(file.originalname);
    const safeName = data.document_name.replace(/\s+/g, "_");
    const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
    const uploadPath = path.join(uploadDir, newFileName);

    fs.renameSync(file.path, uploadPath);

    doc.document_file_url = `/uploads/documents/projects/${newFileName}`;
    await doc.save();

    return doc;
};

// UPDATE
exports.updateDocument = async (id, data, file) => {
    const doc = await ProjectDocuments.findByPk(id);
    if (!doc) throw new Error("Document not found");

    await doc.update(data);

    if (file) {
        if (doc.document_file_url) {
            const oldPath = path.join(__dirname, "../", doc.document_file_url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const timestamp = doc.updatedAt.getTime();
        const ext = path.extname(file.originalname);
        const safeName = data.document_name.replace(/\s+/g, "_");
        const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
        const uploadPath = path.join(uploadDir, newFileName);

        fs.renameSync(file.path, uploadPath);

        doc.document_file_url = `/uploads/documents/projects/${newFileName}`;
        await doc.save();
    }

    return doc;
};

// DELETE
exports.deleteDocument = async (id) => {
    const doc = await ProjectDocuments.findByPk(id);
    if (!doc) throw new Error("Document not found");

    if (doc.document_file_url) {
        const filePath = path.join(__dirname, "../", doc.document_file_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await doc.destroy();
};
