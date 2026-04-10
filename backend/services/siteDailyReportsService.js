const SiteDailyReport = require("../models/SiteDailyReportsInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// GET ALL
exports.getReports = async () => {
  return await SiteDailyReport.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// CREATE
exports.createReport = async (data, user = {}) => {
  if (
    !data.project_id ||
    !data.employee_id ||
    !data.report_date ||
    !data.report_title
  ) {
    throw new Error("Required fields missing");
  }

  const item = await SiteDailyReport.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "site_daily_reports_info",
    reference_record_id: item.report_id,
    old_value: null,
    new_value: item.toJSON(),
  });

  return item;
};

// UPDATE
exports.updateReport = async (id, data, user = {}) => {
  const item = await SiteDailyReport.findOne({
    where: { report_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Report not found");

  const oldValue = item.toJSON();

  await item.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "site_daily_reports_info",
    reference_record_id: item.report_id,
    old_value: oldValue,
    new_value: item.toJSON(),
  });

  return item;
};

// DELETE (soft/hard via helper)
exports.deleteReport = async (id, user = {}) => {
  const item = await SiteDailyReport.findOne({
    where: { report_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Report not found");

  await handleDelete(item, user, "site_daily_reports_info", getUserId(user));

  return true;
};
