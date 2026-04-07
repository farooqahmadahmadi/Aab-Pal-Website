const logService = require("../services/systemLogsService");

async function handleDelete(record, user, tableName, user_id = 0) {
    if (!record) throw new Error(`${tableName} not found`);

    const oldValue = record.toJSON();

    if (user?.role === "Admin") {
        //  HARD DELETE
        await record.destroy();

        await logService.createLog({
            user_id,
            action: "HARD_DELETE",
            reference_table: tableName,
            reference_record_id: oldValue.id || oldValue[`${tableName}_id`],
            old_value: oldValue,
            new_value: null,
        });
    } else {
        //  SOFT DELETE
        await record.update({ is_deleted: true });

        await logService.createLog({
            user_id,
            action: "SOFT_DELETE",
            reference_table: tableName,
            reference_record_id: oldValue.id || oldValue[`${tableName}_id`],
            old_value: oldValue,
            new_value: null,
        });
    }

    return true;
}

module.exports = { handleDelete };