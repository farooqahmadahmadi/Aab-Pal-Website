const SiteDailyReport = require("../models/SiteDailyReportsInfo");

// GET ALL
exports.getReports = async () => {
    return await SiteDailyReport.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createReport = async (data) => {
    if (!data.project_id || !data.employee_id || !data.report_date || !data.report_title) {
        throw new Error("Required fields missing");
    }
    return await SiteDailyReport.create(data);
};

// UPDATE
exports.updateReport = async (id, data) => {
    const item = await SiteDailyReport.findOne({
        where: { report_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Report not found");

    await item.update(data);
    return item;
};

// DELETE
exports.deleteReport = async (id) => {
    const item = await SiteDailyReport.findOne({
        where: { report_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Report not found");

    await item.update({ is_deleted: true });
};
