const SystemLogs = require("../models/SystemLogs");

exports.createLog = async ({
    user_id,
    action,
    reference_table,
    reference_record_id,
    old_value,
    new_value
}) => {

    try {

        await SystemLogs.create({
            user_id,
            action,
            reference_table,
            reference_record_id,
            old_value: JSON.stringify(old_value),
            new_value: JSON.stringify(new_value)
        });

    } catch (error) {

        console.error("Log error:", error);

    }

};