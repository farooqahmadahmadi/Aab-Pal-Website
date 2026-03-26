const ClientService = require("../services/clientInfoService");
const fs = require("fs");
const path = require("path");

// ===== GET ALL =====
exports.getAllClients = async (req, res) => {
    try {
        const data = await ClientService.getAll();
        res.json(data);
    } catch {
        res.status(500).json({ message: "Failed to fetch clients" });
    }
};

// ===== GET BY ID =====
exports.getClientById = async (req, res) => {
    try {
        const client = await ClientService.getById(req.params.id);
        if (!client) return res.status(404).json({ message: "Not found" });
        res.json(client);
    } catch {
        res.status(500).json({ message: "Failed to fetch client" });
    }
};

// ===== CREATE =====
exports.addClient = async (req, res) => {
    try {
        const data = req.body;

        if (req.file) {
            data.client_photo_url = req.file.filename;
        }

        const newClient = await ClientService.create(data);
        res.status(201).json(newClient);
    } catch {
        res.status(500).json({ message: "Failed to add client" });
    }
};

// ===== UPDATE =====
exports.updateClient = async (req, res) => {
    try {
        const existing = await ClientService.getById(req.params.id);
        if (!existing) return res.status(404).json({ message: "Not found" });

        const data = req.body;

        if (req.file) {
            data.client_photo_url = req.file.filename;

            // DELETE OLD IMAGE
            if (existing.client_photo_url) {
                const oldPath = path.join(__dirname, "../uploads/documents/client", existing.client_photo_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        const updated = await ClientService.update(req.params.id, data);
        res.json(updated);

    } catch {
        res.status(500).json({ message: "Failed to update client" });
    }
};

// ===== DELETE =====
exports.deleteClient = async (req, res) => {
    try {
        const existing = await ClientService.getById(req.params.id);
        if (!existing) return res.status(404).json({ message: "Not found" });

        // delete image
        if (existing.client_photo_url) {
            const filePath = path.join(__dirname, "../uploads/documents/client", existing.client_photo_url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await ClientService.delete(req.params.id);
        res.json({ message: "Deleted successfully" });

    } catch {
        res.status(500).json({ message: "Failed to delete client" });
    }
};
