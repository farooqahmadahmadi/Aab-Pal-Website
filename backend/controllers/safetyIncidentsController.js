const SafetyIncidentsInfo = require("../models/SafetyIncidentsInfo");

// GET all incidents
exports.getAllIncidents = async (req, res) => {
    try {
        const incidents = await SafetyIncidentsInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching incidents", error });
    }
};

// GET incident by ID
exports.getIncidentById = async (req, res) => {
    try {
        const incident = await SafetyIncidentsInfo.findByPk(req.params.id);
        if (!incident || incident.is_deleted) {
            return res.status(404).json({ message: "Incident not found" });
        }
        res.status(200).json(incident);
    } catch (error) {
        res.status(500).json({ message: "Error fetching incident", error });
    }
};

// CREATE incident
exports.createIncident = async (req, res) => {
    try {
        const incident = await SafetyIncidentsInfo.create(req.body);
        res.status(201).json(incident);
    } catch (error) {
        res.status(500).json({ message: "Error creating incident", error });
    }
};

// UPDATE incident
exports.updateIncident = async (req, res) => {
    try {
        const incident = await SafetyIncidentsInfo.findByPk(req.params.id);
        if (!incident || incident.is_deleted) {
            return res.status(404).json({ message: "Incident not found" });
        }
        await incident.update(req.body);
        res.status(200).json(incident);
    } catch (error) {
        res.status(500).json({ message: "Error updating incident", error });
    }
};

// DELETE incident (soft delete)
exports.deleteIncident = async (req, res) => {
    try {
        const incident = await SafetyIncidentsInfo.findByPk(req.params.id);
        if (!incident) {
            return res.status(404).json({ message: "Incident not found" });
        }
        await incident.update({ is_deleted: true });
        res.status(200).json({ message: "Incident deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting incident", error });
    }
};
