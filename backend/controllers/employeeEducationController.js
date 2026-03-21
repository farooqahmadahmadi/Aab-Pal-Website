const EmployeeEducationService = require("../services/employeeEducationService");

const EmployeeEducationController = {
    getAll: async (req, res) => {
        try {
            const records = await EmployeeEducationService.getAll();
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch employee education info", error: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const record = await EmployeeEducationService.getById(req.params.id);
            if (!record) return res.status(404).json({ message: "Not found" });
            res.json(record);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch record", error: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const record = await EmployeeEducationService.create(req.body);
            res.status(201).json(record);
        } catch (err) {
            res.status(500).json({ message: "Failed to create", error: err.message });
        }
    },
    update: async (req, res) => {
        try {
            await EmployeeEducationService.update(req.params.id, req.body);
            res.json({ message: "Updated successfully" });
        } catch (err) {
            res.status(500).json({ message: "Failed to update", error: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            await EmployeeEducationService.delete(req.params.id);
            res.json({ message: "Deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: "Failed to delete", error: err.message });
        }
    }
};


module.exports = EmployeeEducationController;
