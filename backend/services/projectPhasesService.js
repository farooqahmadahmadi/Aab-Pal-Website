const ProjectPhasesInfo = require("../models/ProjectPhasesInfo");

// Get all phases
const getAllPhases = async () => {
    return await ProjectPhasesInfo.findAll({ where: { is_deleted: false } });
};

// Get phase by ID
const getPhaseById = async (phase_id) => {
    return await ProjectPhasesInfo.findOne({ where: { phase_id, is_deleted: false } });
};

// Add new phase
const addPhase = async (data) => {
    return await ProjectPhasesInfo.create(data);
};

// Update phase
const updatePhase = async (phase_id, data) => {
    return await ProjectPhasesInfo.update(data, { where: { phase_id, is_deleted: false } });
};

// Soft delete phase
const deletePhase = async (phase_id) => {
    return await ProjectPhasesInfo.update({ is_deleted: true }, { where: { phase_id } });
};

module.exports = {
    getAllPhases,
    getPhaseById,
    addPhase,
    updatePhase,
    deletePhase
};
