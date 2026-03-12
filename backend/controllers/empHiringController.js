const EmpHiringInfo = require("../models/EmpHiringInfo");

// GET all hiring records
exports.getAllHirings = async (req, res) => {
    try {
        const records = await EmpHiringInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hiring records", error });
    }
};

// GET hiring by ID
exports.getHiringById = async (req, res) => {
    try {
        const record = await EmpHiringInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Hiring record not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hiring record", error });
    }
};

// CREATE hiring
exports.createHiring = async (req, res) => {
    try {
        const record = await EmpHiringInfo.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error creating hiring record", error });
    }
};

// UPDATE hiring
exports.updateHiring = async (req, res) => {
    try {
        const record = await EmpHiringInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Hiring record not found" });
        }
        await record.update(req.body);
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error updating hiring record", error });
    }
};

// DELETE hiring (soft delete)
exports.deleteHiring = async (req, res) => {
    try {
        const record = await EmpHiringInfo.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Hiring record not found" });
        }
        await record.update({ is_deleted: true });
        res.status(200).json({ message: "Hiring record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting hiring record", error });
    }
};
