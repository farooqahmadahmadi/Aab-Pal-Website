const EquipmentInfo = require("../models/EquipmentInfo");

// GET all equipment
exports.getAllEquipment = async (req, res) => {
    try {
        const equipment = await EquipmentInfo.findAll();
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching equipment", error });
    }
};

// GET equipment by ID
exports.getEquipmentById = async (req, res) => {
    try {
        const equipment = await EquipmentInfo.findByPk(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching equipment", error });
    }
};

// CREATE equipment
exports.createEquipment = async (req, res) => {
    try {
        const equipment = await EquipmentInfo.create(req.body);
        res.status(201).json(equipment);
    } catch (error) {
        res.status(500).json({ message: "Error creating equipment", error });
    }
};

// UPDATE equipment
exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await EquipmentInfo.findByPk(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        await equipment.update(req.body);
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ message: "Error updating equipment", error });
    }
};

// DELETE equipment
exports.deleteEquipment = async (req, res) => {
    try {
        const equipment = await EquipmentInfo.findByPk(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        await equipment.destroy();
        res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting equipment", error });
    }
};
