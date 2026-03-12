const EmployeeInfo = require("../models/EmployeeInfo");

// GET all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await EmployeeInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error });
    }
};

// GET employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await EmployeeInfo.findByPk(req.params.id);
        if (!employee || employee.is_deleted) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employee", error });
    }
};

// CREATE employee
exports.createEmployee = async (req, res) => {
    try {
        const employee = await EmployeeInfo.create(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error creating employee", error });
    }
};

// UPDATE employee
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await EmployeeInfo.findByPk(req.params.id);
        if (!employee || employee.is_deleted) {
            return res.status(404).json({ message: "Employee not found" });
        }
        await employee.update(req.body);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error });
    }
};

// DELETE employee (Soft Delete)
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await EmployeeInfo.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        await employee.update({ is_deleted: true });
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error });
    }
};
