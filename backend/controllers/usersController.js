const Users = require("../models/Users");

// GET all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.user_role !== "Admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// GET user by ID (Admin or self)
exports.getUserById = async (req, res) => {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.user.user_role !== "Admin" && req.user.user_id != req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// CREATE user (Admin only)
exports.createUser = async (req, res) => {
    try {
        if (req.user.user_role !== "Admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await Users.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

// UPDATE user (Admin or self)
exports.updateUser = async (req, res) => {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.user.user_role !== "Admin" && req.user.user_id != req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        await user.update(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

// DELETE user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        if (req.user.user_role !== "Admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};