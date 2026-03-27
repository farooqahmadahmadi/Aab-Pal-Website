const service = require("../services/projectPhasesService");

const getPhases = async (req, res) => {
    try {
        const data = await service.getAllPhases();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load project phases" });
    }
};

const getPhase = async (req, res) => {
    try {
        const data = await service.getPhaseById(req.params.id);
        if (!data) return res.status(404).json({ message: "Phase not found" });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load phase" });
    }
};

const createPhase = async (req, res) => {
    try {
        const data = await service.addPhase(req.body);
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add phase" });
    }
};

const updatePhase = async (req, res) => {
    try {
        await service.updatePhase(req.params.id, req.body);
        res.json({ message: "Phase updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update phase" });
    }
};

const deletePhase = async (req, res) => {
    try {
        await service.deletePhase(req.params.id);
        res.json({ message: "Phase deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete phase" });
    }
};

module.exports = { getPhases, getPhase, createPhase, updatePhase, deletePhase };
