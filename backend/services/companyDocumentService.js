const CompanyDocument = require("../models/CompanyDocument");
const path = require("path");
const fs = require("fs");
const logService = require("./systemLogsService");

// Upload directory
const uploadDir = path.join(__dirname, "../uploads/documents/company");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ===== GET all documents =====
exports.getDocuments = async () => {
    return await CompanyDocument.findAll({
        where: { is_deleted: false },
        order: [['created_at', 'DESC']]
    });
};

// ===== CREATE document =====
exports.createDocument = async (data, file, user_id = 0) => {
    if (!file) throw new Error("File is required");

    const doc = await CompanyDocument.create({ ...data, doc_file_url: "" });

    try {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const safeName = data.doc_name.replace(/\s+/g, "_");
        const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
        const uploadPath = path.join(uploadDir, newFileName);

        fs.renameSync(file.path, uploadPath);

        doc.doc_file_url = `/uploads/documents/company/${newFileName}`;
        await doc.save();

        // ===== LOG =====
        await logService.createLog({
            user_id,
            action: "CREATE",
            reference_table: "company_documents",
            reference_record_id: doc.document_id,
            old_value: null,
            new_value: doc.toJSON(),
        });

    } catch (err) {
        await doc.destroy();
        throw new Error("File upload failed: " + err.message);
    }

    return doc;
};

// ===== UPDATE document =====
exports.updateDocument = async (id, data, file, user_id = 0) => {
    const doc = await CompanyDocument.findByPk(id);
    if (!doc || doc.is_deleted) throw new Error("Document not found");

    const oldValue = doc.toJSON();

    try {
        await doc.update(data);

        if (file) {
            if (doc.doc_file_url) {
                const oldPath = path.join(__dirname, "../", doc.doc_file_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            const safeName = data.doc_name.replace(/\s+/g, "_");
            const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
            const uploadPath = path.join(uploadDir, newFileName);

            fs.renameSync(file.path, uploadPath);

            doc.doc_file_url = `/uploads/documents/company/${newFileName}`;
            await doc.save();
        }

        await logService.createLog({
            user_id,
            action: "UPDATE",
            reference_table: "company_documents",
            reference_record_id: doc.document_id,
            old_value: oldValue,
            new_value: doc.toJSON(),
        });

    } catch (err) {
        throw new Error("Update failed: " + err.message);
    }

    return doc;
};

// ===== DELETE document (Soft + Hard) =====
exports.deleteDocument = async (id, user) => {
    const doc = await CompanyDocument.findByPk(id);
    if (!doc || doc.is_deleted) throw new Error("Document not found");

    const oldValue = doc.toJSON();
    const user_id = user.user_id || 0;

    if (user?.role === "Admin") {
        // Hard delete
        if (doc.doc_file_url) {
            const filePath = path.join(__dirname, "../", doc.doc_file_url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await doc.destroy();

        await logService.createLog({
            user_id,
            action: "HARD_DELETE",
            reference_table: "company_documents",
            reference_record_id: id,
            old_value: oldValue,
            new_value: null,
        });
    } else {
        // Soft delete
        await doc.update({ is_deleted: true });

        await logService.createLog({
            user_id,
            action: "SOFT_DELETE",
            reference_table: "company_documents",
            reference_record_id: id,
            old_value: oldValue,
            new_value: null,
        });
    }

    return true;
};