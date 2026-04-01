const SafetyIncident = require("../models/SafetyIncidentsInfo");

// GET
exports.getAll = async () => {
    return await SafetyIncident.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.create = async (data) => {
    return await SafetyIncident.create(data);
};

// UPDATE
exports.update = async (id, data) => {
    const item = await SafetyIncident.findOne({
        where: { incident_id: id, is_deleted: false }
    });
    if (!item) throw new Error("Incident not found");

    await item.update(data);
    return item;
};

// DELETE (soft delete)
exports.remove = async (id) => {
    const item = await SafetyIncident.findOne({
        where: { incident_id: id, is_deleted: false }
    });
    if (!item) throw new Error("Incident not found");

    await item.update({ is_deleted: true });
};