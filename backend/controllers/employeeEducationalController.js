const EmployeeEducationalInfo = require("../models/EmployeeEducationalInfo");

// GET all education records
exports.getAllEducation = async (req, res) => {
    try {
        const records = await EmployeeEducationalInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching education records", error });
    }
};

// GET education record by ID
exports.getEducationById = async (req, res) => {
    try {
        const record = await EmployeeEducationalInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching record", error });
    }
};

// CREATE new education record
exports.createEducation = async (req, res) => {
    try {
        const record = await EmployeeEducationalInfo.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error creating record", error });
    }
};

// UPDATE education record
exports.updateEducation = async (req, res) => {
    try {
        const record = await EmployeeEducationalInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Record not found" });
        }
        await record.update(req.body);
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error updating record", error });
    }
};

// DELETE education record (soft delete)
exports.deleteEducation = async (req, res) => {
    try {
        const record = await EmployeeEducationalInfo.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }
        await record.update({ is_deleted: true });
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting record", error });
    }
};
