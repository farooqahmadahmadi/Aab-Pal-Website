const {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} = require("../services/departmentService");

// ================= GET =================
exports.getAll = async (req, res) => {
    try {
        const data = await getDepartments();
        res.json(data);
    } catch (err) {
        console.error("GET DEPARTMENTS ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const user_id = req.user?.user_id || 0;
        const data = await createDepartment(req.body, user_id);
        res.status(201).json(data);
    } catch (err) {
        console.error("CREATE DEPARTMENT ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const user_id = req.user?.user_id || 0;
        const data = await updateDepartment(req.params.id, req.body, user_id);
        res.json(data);
    } catch (err) {
        console.error("UPDATE DEPARTMENT ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
    try {
        const user = req.user;
        const user_id = req.user?.user_id || 0;

        await deleteDepartment(req.params.id, user, user_id);

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("DELETE DEPARTMENT ERROR:", err.message);
        res.status(400).json({ message: err.message });
    }
};