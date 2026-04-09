const DepartmentService = require("../services/departmentService");

// ===== GET ALL =====
exports.getAll = async (req, res) => {
    try {
        const data = await DepartmentService.getDepartments();
        res.json(data);
    } catch (err) {
        console.error("GET DEPARTMENTS ERROR:", err.message);
        res.status(500).json({ message: "Failed to fetch departments" });
    }
};

// ===== GET BY ID =====
exports.getById = async (req, res) => {
    try {
        const dept = await DepartmentService.getDepartmentById(req.params.id);

        if (!dept)
            return res.status(404).json({ message: "Department not found" });

        res.json(dept);
    } catch (err) {
        console.error("GET DEPARTMENT ERROR:", err.message);
        res.status(500).json({ message: "Failed to fetch department" });
    }
};

// ===== CREATE =====
exports.create = async (req, res) => {
    try {
        const user_id = req.user?.user_id || 0;
        const dept = await DepartmentService.createDepartment(req.body, user_id);

        res.status(201).json(dept);
    } catch (err) {
        console.error("CREATE DEPARTMENT ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
    try {
        const user_id = req.user?.user_id || 0;
        const dept = await DepartmentService.updateDepartment(req.params.id, req.body, user_id);

        res.json(dept);
    } catch (err) {
        console.error("UPDATE DEPARTMENT ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// ===== DELETE =====
exports.remove = async (req, res) => {
    try {
        const user = req.user;
        await DepartmentService.deleteDepartment(req.params.id, user);

        res.json({ message: "Department deleted successfully" });
    } catch (err) {
        console.error("DELETE DEPARTMENT ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
};