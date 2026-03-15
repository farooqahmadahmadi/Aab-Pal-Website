const SystemLogs = require("../models/SystemLogs");

// Create Log
exports.createLog = async ({
    user_id,
    action,
    reference_table = null,
    reference_record_id = null,
    old_value = null,
    new_value = null
}) => {

    try {
        const log = await SystemLogs.create({
            user_id,
            action,
            reference_table,
            reference_record_id,
            old_value: old_value ? JSON.stringify(old_value) : null,
            new_value: new_value ? JSON.stringify(new_value) : null
        });
        return log;
    } catch (error) {
        console.error("Log Service Error:", error);
        throw error;
    }

};