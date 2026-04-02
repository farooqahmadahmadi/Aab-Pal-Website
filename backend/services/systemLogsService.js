const SystemLogs = require('../models/SystemLogs');

// get all logs
async function getSystemLogs() {
    return await SystemLogs.findAll({ order: [['created_at', 'DESC']] });
}

// delete log by id
async function deleteSystemLog(log_id) {
    const log = await SystemLogs.findByPk(log_id);
    if (!log) throw new Error('Log not found');
    await log.destroy();
}

module.exports = {
    getSystemLogs,
    deleteSystemLog
};