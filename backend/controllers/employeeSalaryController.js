const {
    getAllSalaries,
    getSalaryById,
    addSalary,
    updateSalary,
    softDeleteSalary
} = require("../services/employeeSalaryService");

exports.listSalaries = async (req, res) => {
    try {
        const salaries = await getAllSalaries();
        res.json(salaries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch salaries" });
    }
};

exports.getSalary = async (req, res) => {
    try {
        const salary = await getSalaryById(req.params.id);
        if (!salary) return res.status(404).json({ message: "Salary record not found" });
        res.json(salary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch salary" });
    }
};

exports.createSalary = async (req, res) => {
    try {
        const salary = await addSalary(req.body);
        res.status(201).json(salary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Failed to add salary" });
    }
};

exports.editSalary = async (req, res) => {
    try {
        const salary = await updateSalary(req.params.id, req.body);
        res.json(salary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Failed to update salary" });
    }
};

exports.softDelete = async (req, res) => {
    try {
        await softDeleteSalary(req.params.id);
        res.json({ message: "Salary soft deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to soft delete salary" });
    }
};

