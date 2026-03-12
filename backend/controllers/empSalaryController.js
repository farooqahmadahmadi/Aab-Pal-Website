const EmpSalaryInfo = require("../models/EmpSalaryInfo");

// GET all salaries
exports.getAllSalaries = async (req, res) => {
    try {
        const records = await EmpSalaryInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching salaries", error });
    }
};

// GET salary by ID
exports.getSalaryById = async (req, res) => {
    try {
        const record = await EmpSalaryInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching record", error });
    }
};

// CREATE salary record
exports.createSalary = async (req, res) => {
    try {
        const record = await EmpSalaryInfo.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error creating salary record", error });
    }
};

// UPDATE salary record
exports.updateSalary = async (req, res) => {
    try {
        const record = await EmpSalaryInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Record not found" });
        }
        await record.update(req.body);
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error updating salary record", error });
    }
};

// DELETE salary record (soft delete)
exports.deleteSalary = async (req, res) => {
    try {
        const record = await EmpSalaryInfo.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }
        await record.update({ is_deleted: true });
        res.status(200).json({ message: "Salary record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting salary record", error });
    }
};
