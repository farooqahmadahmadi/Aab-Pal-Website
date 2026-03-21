const EmployeeService = require("../services/employeeService");

const EmployeeController = {
    getAll: async (req, res) => {
        try {
            const employees = await EmployeeService.getAll();
            res.json(employees);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch employees" });
        }
    },

    getById: async (req, res) => {
        try {
            const employee = await EmployeeService.getById(req.params.id);
            if (!employee) return res.status(404).json({ message: "Employee not found" });
            res.json(employee);
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch employee" });
        }
    },

    create: async (req, res) => {
        try {
            const emp = await EmployeeService.create(req.body);
            res.status(201).json(emp);
        } catch (err) {
            res.status(500).json({ message: "Failed to create employee", error: err.message });
        }
    },

    update: async (req, res) => {
        try {
            await EmployeeService.update(req.params.id, req.body);
            res.json({ message: "Employee updated" });
        } catch (err) {
            res.status(500).json({ message: "Failed to update employee", error: err.message });
        }
    },

    delete: async (req, res) => {
        try {
            await EmployeeService.delete(req.params.id);
            res.json({ message: "Employee deleted" });
        } catch (err) {
            res.status(500).json({ message: "Failed to delete employee", error: err.message });
        }
    }
};

module.exports = EmployeeController;