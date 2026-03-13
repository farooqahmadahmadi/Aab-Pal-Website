const ProjectPhasesInfo = require("../models/ProjectPhasesInfo");

// GET all phases
exports.getAllPhases = async (req, res) => {
    try {
        const phases = await ProjectPhasesInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(phases);
    } catch (error) {
        res.status(500).json({ message: "Error fetching phases", error });
    }
};

// GET phase by ID
exports.getPhaseById = async (req, res) => {
    try {
        const phase = await ProjectPhasesInfo.findByPk(req.params.id);
        if (!phase || phase.is_deleted) {
            return res.status(404).json({ message: "Phase not found" });
        }
        res.status(200).json(phase);
    } catch (error) {
        res.status(500).json({ message: "Error fetching phase", error });
    }
};

// CREATE phase
exports.createPhase = async (req, res) => {
    try {
        const phase = await ProjectPhasesInfo.create(req.body);
        res.status(201).json(phase);
    } catch (error) {
        res.status(500).json({ message: "Error creating phase", error });
    }
};

// UPDATE phase
exports.updatePhase = async (req, res) => {
    try {
        const phase = await ProjectPhasesInfo.findByPk(req.params.id);
        if (!phase || phase.is_deleted) {
            return res.status(404).json({ message: "Phase not found" });
        }
        await phase.update(req.body);
        res.status(200).json(phase);
    } catch (error) {
        res.status(500).json({ message: "Error updating phase", error });
    }
};

// DELETE phase (soft delete)
exports.deletePhase = async (req, res) => {
    try {
        const phase = await ProjectPhasesInfo.findByPk(req.params.id);
        if (!phase) {
            return res.status(404).json({ message: "Phase not found" });
        }
        await phase.update({ is_deleted: true });
        res.status(200).json({ message: "Phase deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting phase", error });
    }
};
