const DepartmentInfo = require("../models/DepartmentInfo");

// GET all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await DepartmentInfo.findAll();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error });
    }
};

// GET department by ID
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await DepartmentInfo.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: "Error fetching department", error });
    }
};

// CREATE department
exports.createDepartment = async (req, res) => {
    try {
        const department = await DepartmentInfo.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: "Error creating department", error });
    }
};

// UPDATE department
exports.updateDepartment = async (req, res) => {
    try {
        const department = await DepartmentInfo.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        await department.update(req.body);
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: "Error updating department", error });
    }
};

// DELETE department
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await DepartmentInfo.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        await department.destroy();
        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting department", error });
    }
};
