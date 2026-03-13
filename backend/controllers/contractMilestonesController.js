const ContractMilestonesInfo = require("../models/ContractMilestonesInfo");

// GET all milestones
exports.getAllMilestones = async (req, res) => {
    try {
        const milestones = await ContractMilestonesInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(milestones);
    } catch (error) {
        res.status(500).json({ message: "Error fetching milestones", error });
    }
};

// GET milestone by ID
exports.getMilestoneById = async (req, res) => {
    try {
        const milestone = await ContractMilestonesInfo.findByPk(req.params.id);
        if (!milestone || milestone.is_deleted) {
            return res.status(404).json({ message: "Milestone not found" });
        }
        res.status(200).json(milestone);
    } catch (error) {
        res.status(500).json({ message: "Error fetching milestone", error });
    }
};

// CREATE milestone
exports.createMilestone = async (req, res) => {
    try {
        const milestone = await ContractMilestonesInfo.create(req.body);
        res.status(201).json(milestone);
    } catch (error) {
        res.status(500).json({ message: "Error creating milestone", error });
    }
};

// UPDATE milestone
exports.updateMilestone = async (req, res) => {
    try {
        const milestone = await ContractMilestonesInfo.findByPk(req.params.id);
        if (!milestone || milestone.is_deleted) {
            return res.status(404).json({ message: "Milestone not found" });
        }
        await milestone.update(req.body);
        res.status(200).json(milestone);
    } catch (error) {
        res.status(500).json({ message: "Error updating milestone", error });
    }
};

// DELETE milestone (soft delete)
exports.deleteMilestone = async (req, res) => {
    try {
        const milestone = await ContractMilestonesInfo.findByPk(req.params.id);
        if (!milestone) {
            return res.status(404).json({ message: "Milestone not found" });
        }
        await milestone.update({ is_deleted: true });
        res.status(200).json({ message: "Milestone deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting milestone", error });
    }
};
