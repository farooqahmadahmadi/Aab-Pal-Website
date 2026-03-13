const EquipmentMaintenanceInfo = require("../models/EquipmentMaintenanceInfo");

// GET all maintenance records
exports.getAllMaintenance = async (req, res) => {
    try {
        const maintenance = await EquipmentMaintenanceInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching maintenance records", error });
    }
};

// GET maintenance by ID
exports.getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await EquipmentMaintenanceInfo.findByPk(req.params.id);
        if (!maintenance || maintenance.is_deleted) {
            return res.status(404).json({ message: "Maintenance record not found" });
        }
        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching maintenance record", error });
    }
};

// CREATE maintenance
exports.createMaintenance = async (req, res) => {
    try {
        const maintenance = await EquipmentMaintenanceInfo.create(req.body);
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(500).json({ message: "Error creating maintenance record", error });
    }
};

// UPDATE maintenance
exports.updateMaintenance = async (req, res) => {
    try {
        const maintenance = await EquipmentMaintenanceInfo.findByPk(req.params.id);
        if (!maintenance || maintenance.is_deleted) {
            return res.status(404).json({ message: "Maintenance record not found" });
        }
        await maintenance.update(req.body);
        res.status(200).json(maintenance);
    } catch (error) {
        res.status(500).json({ message: "Error updating maintenance record", error });
    }
};

// DELETE maintenance (soft delete)
exports.deleteMaintenance = async (req, res) => {
    try {
        const maintenance = await EquipmentMaintenanceInfo.findByPk(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ message: "Maintenance record not found" });
        }
        await maintenance.update({ is_deleted: true });
        res.status(200).json({ message: "Maintenance record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting maintenance record", error });
    }
};
