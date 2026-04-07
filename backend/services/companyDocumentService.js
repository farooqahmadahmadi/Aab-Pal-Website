const CompanyDocument = require("../models/CompanyDocument");
const path = require("path");
const fs = require("fs");
const logService = require("./systemLogsService");

// Upload directory
const uploadDir = path.join(__dirname, "../uploads/documents/company");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ===== GET all documents =====
exports.getDocuments = async () => {
    return await CompanyDocument.findAll({ order: [['created_at', 'DESC']] });
};

// ===== CREATE document =====
exports.createDocument = async (data, file, user_id = 0) => {
    if (!file) throw new Error("File is required");

    // Step 1: create record with empty file URL
    const doc = await CompanyDocument.create({ ...data, doc_file_url: "" });

    try {
        // Step 2: rename file
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const safeName = data.doc_name.replace(/\s+/g, "_");
        const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
        const uploadPath = path.join(uploadDir, newFileName);

        fs.renameSync(file.path, uploadPath);

        // Step 3: update record with real file path
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
        // که فایل اپلوډ ناکام شو، DB ریکارډ پاک کړئ
        await doc.destroy();
        throw new Error("File upload failed: " + err.message);
    }

    return doc;
};

// ===== UPDATE document =====
exports.updateDocument = async (id, data, file, user_id = 0) => {
    const doc = await CompanyDocument.findByPk(id);
    if (!doc) throw new Error("Document not found");

    const oldValue = doc.toJSON();

    try {
        // Step 1: update data first
        await doc.update(data);

        // Step 2: handle file if uploaded
        if (file) {
            // Delete old file if exists
            if (doc.doc_file_url) {
                const oldPath = path.join(__dirname, "../", doc.doc_file_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            // Rename new file
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            const safeName = data.doc_name.replace(/\s+/g, "_");
            const newFileName = `${doc.document_id}-${safeName}-${timestamp}${ext}`;
            const uploadPath = path.join(uploadDir, newFileName);

            fs.renameSync(file.path, uploadPath);

            doc.doc_file_url = `/uploads/documents/company/${newFileName}`;
            await doc.save();
        }

        // ===== LOG =====
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

// ===== DELETE document =====
exports.deleteDocument = async (id, user_id = 0) => {
    const doc = await CompanyDocument.findByPk(id);
    if (!doc) throw new Error("Document not found");

    const oldValue = doc.toJSON();

    // Delete file if exists
    if (doc.doc_file_url) {
        const filePath = path.join(__dirname, "../", doc.doc_file_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Delete DB record
    await doc.destroy();

    // ===== LOG =====
    await logService.createLog({
        user_id,
        action: "DELETE",
        reference_table: "company_documents",
        reference_record_id: id,
        old_value: oldValue,
        new_value: null,
    });

    return true;
};