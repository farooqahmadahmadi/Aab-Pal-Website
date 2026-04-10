const SystemLogs = require("../models/SystemLogs");
const Notification = require("../models/Notifications");

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
    const log = await SystemLogs.create({
      user_id: user_id || null,
      action,
      reference_table,
      reference_record_id,
      old_value: old_value ? JSON.stringify(old_value) : null,
      new_value: new_value ? JSON.stringify(new_value) : null,
    });

    // ✅ SAFE NOTIFICATION CREATE (NON-BREAKING)
    try {
      let title = "";
      let message = "";

      if (action === "CREATE") {
        title = "Record Created";
        message = `In ${reference_table}, Record ${reference_record_id} created by User ${user_id}, See Details in System Log Center.`;
      } else if (action === "UPDATE") {
        title = "Record Updated";
        message = `In ${reference_table}, Record ${reference_record_id} updated by User ${user_id}, See Details in System Log Center.`;
      } else if (action === "DELETE") {
        title = "Record Deleted";
        message = `In ${reference_table}, Record ${reference_record_id} deleted by User ${user_id}, See Details in System Log Center.`;
      } else {
        title = `${action}`;
        message = `In ${reference_table}, Record ${reference_record_id} affected by User ${user_id}, See Details in System Log Center.`;
      }

      await Notification.create({
        notification_recipients: "Admin",
        user_id: user_id || null,
        notification_title: title,
        notification_message: message,
        is_read: false,
        created_at: log.created_at,
      });
    } catch (notifErr) {
      // ❗ مهم: که notification fail شي، system باید ونه دریږي
      console.error("NOTIFICATION ERROR:", notifErr.message);
    }

    return log;
  } catch (err) {
    console.error("LOG ERROR:", err.message);
  }
};

// ---------------- GET LOGS ----------------
exports.getSystemLogs = async () => {
  try {
    const logs = await SystemLogs.findAll({
      order: [["created_at", "DESC"]],
    });

    return logs;
  } catch (err) {
    console.error("GET LOG ERROR:", err.message);
    throw new Error("Failed to fetch logs");
  }
};

// ---------------- DELETE LOG ----------------
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
