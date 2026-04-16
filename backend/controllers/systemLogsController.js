const systemLogsService = require("../services/systemLogsService");

async function getLogs(req, res) {
  try {
    const logs = await systemLogsService.getSystemLogs();
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteLog(req, res) {
  try {
    const { id } = req.params;

    await systemLogsService.deleteSystemLog(id);

    // 🔥 SOCKET EMIT (correct way for your setup)
    const io = req.app.get("io");
    io.emit("delete_system_log", { id: Number(id) });

    res.json({
      success: true,
      message: "Log deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getLogs,
  deleteLog,
};
