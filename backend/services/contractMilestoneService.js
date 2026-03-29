const Milestone = require("../models/ContractMilestonesInfo");

// GET
exports.getMilestones = async () => {
    return await Milestone.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createMilestone = async (data) => {
    return await Milestone.create(data);
};

// UPDATE
exports.updateMilestone = async (id, data) => {
    const item = await Milestone.findOne({
        where: { milestone_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Milestone not found");

    await item.update(data);
    return item;
};

// DELETE (soft)
exports.deleteMilestone = async (id) => {
    const item = await Milestone.findOne({
        where: { milestone_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Milestone not found");

    await item.update({ is_deleted: true });
};
