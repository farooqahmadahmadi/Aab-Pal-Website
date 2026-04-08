const EmployeeDocuments = require("../models/EmployeeDocuments");
const Employee = require("../models/EmployeeInfo");
const { handleDelete } = require("../utils/deleteHelper");
const logService = require("./systemLogsService");

// ===== GET ALL DOCUMENTS =====
exports.getAllDocuments = async () => {
    return await EmployeeDocuments.findAll({
        where: { is_deleted: false },
        include: [
            {
                model: Employee,
                attributes: ["employee_id", "emp_full_name"]
            }
        ],
        order: [["document_id", "DESC"]]
    });
};

// ===== GET DOCUMENT BY ID =====
exports.getDocumentById = async (id) => {
    return await EmployeeDocuments.findOne({
        where: { document_id: id, is_deleted: false },
        include: [
            {
                model: Employee,
                attributes: ["employee_id", "emp_full_name"]
            }
        ]
    });
};

// ===== ADD NEW DOCUMENT =====
exports.addDocument = async (data, user = {}) => {
    const record = await EmployeeDocuments.create(data);

    await logService.createLog({
        user_id: user.user_id || 0,
        action: "CREATE",
        reference_table: "employee_documents",
        reference_record_id: record.document_id,
        old_value: null,
        new_value: record.toJSON(),
    });

    return record;
};

// ===== UPDATE DOCUMENT =====
exports.updateDocument = async (id, data, user = {}) => {
    const doc = await EmployeeDocuments.findByPk(id);

    if (!doc || doc.is_deleted)
        throw new Error("Document not found");

    const oldValue = doc.toJSON();

    await doc.update(data);

    await logService.createLog({
        user_id: user.user_id || 0,
        action: "UPDATE",
        reference_table: "employee_documents",
        reference_record_id: doc.document_id,
        old_value: oldValue,
        new_value: doc.toJSON(),
    });

    return doc;
};

// ===== DELETE (Soft + Hard via helper) =====
exports.deleteDocument = async (id, user = {}) => {
    const doc = await EmployeeDocuments.findByPk(id);

    if (!doc || doc.is_deleted)
        throw new Error("Document not found");

    const user_id = user.user_id || 0;

    await handleDelete(
        doc,
        user,
        "employee_documents",
        user_id
    );

    return true;
};