const EmployeeDocuments = require("../models/EmployeeDocuments");
const Employee = require("../models/EmployeeInfo");

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
    return await EmployeeDocuments.findByPk(id, {
        include: [
            {
                model: Employee,
                attributes: ["employee_id", "emp_full_name"]
            }
        ]
    });
};

// ===== ADD NEW DOCUMENT =====
exports.addDocument = async (data) => {
    return await EmployeeDocuments.create(data);
};

// ===== UPDATE DOCUMENT =====
exports.updateDocument = async (id, data) => {
    const doc = await EmployeeDocuments.findByPk(id);
    if (!doc) throw new Error("Document not found");
    return await doc.update(data);
};

// ===== SOFT DELETE =====
exports.softDeleteDocument = async (id) => {
    const doc = await EmployeeDocuments.findByPk(id);
    if (!doc) throw new Error("Document not found");
    return await doc.update({ is_deleted: true });
};

// ===== RESTORE =====
exports.restoreDocument = async (id) => {
    const doc = await EmployeeDocuments.findByPk(id);
    if (!doc) throw new Error("Document not found");
    return await doc.update({ is_deleted: false });
};

// ===== HARD DELETE =====
exports.hardDeleteDocument = async (id) => {
    const doc = await EmployeeDocuments.findByPk(id);
    if (!doc) throw new Error("Document not found");
    return await doc.destroy();
};




