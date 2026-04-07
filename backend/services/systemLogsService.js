const SystemLogs = require("../models/SystemLogs");

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
      user_id: user_id || 0, // ✅ مهم fix
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
