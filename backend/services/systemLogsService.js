const SystemLogs = require("../models/SystemLogs");

// ---------------- CREATE LOG ----------------
exports.createLog = async ({
  user_id,
  action,
  reference_table,
  reference_record_id,
  old_value,
  new_value,
}) => {
  try {
    await SystemLogs.create({
      user_id: user_id || 0,
      action,
      reference_table,
      reference_record_id,
      old_value: old_value ? JSON.stringify(old_value) : null,
      new_value: new_value ? JSON.stringify(new_value) : null,
    });
  } catch (err) {
    console.error("LOG ERROR:", err.message);
  }
};

// ---------------- GET LOGS (FIX ADDED) ----------------
exports.getSystemLogs = async () => {
  try {
    const logs = await SystemLogs.findAll({
      order: [["created_at", "DESC"]], // if your column is createdAt change it
    });

    return logs;
  } catch (err) {
    console.error("GET LOG ERROR:", err.message);
    throw new Error("Failed to fetch logs");
  }
};

// ---------------- DELETE LOG (FIX ADDED) ----------------
exports.deleteSystemLog = async (id) => {
  try {
    const log = await SystemLogs.findByPk(id);
    if (!log) throw new Error("Log not found");

    await log.destroy();

    return true;
  } catch (err) {
    console.error("DELETE LOG ERROR:", err.message);
    throw new Error("Failed to delete log");
  }
};