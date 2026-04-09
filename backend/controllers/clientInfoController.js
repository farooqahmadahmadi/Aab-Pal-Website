const ClientService = require("../services/clientInfoService");
const fs = require("fs");
const path = require("path");

// ===== GET ALL =====
exports.getAllClients = async (req, res) => {
  try {
    const data = await ClientService.getAll();
    res.json(data);
  } catch (err) {
    console.error("GET CLIENTS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

// ===== GET BY ID =====
exports.getClientById = async (req, res) => {
  try {
    const client = await ClientService.getById(req.params.id);

    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json(client);
  } catch (err) {
    console.error("GET CLIENT ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch client" });
  }
};

// ===== CREATE =====
exports.addClient = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;

    if (req.file) {
      data.client_photo_url = req.file.filename;
    }

    const newClient = await ClientService.create(data, user);

    res.status(201).json(newClient);
  } catch (err) {
    console.error("CREATE CLIENT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to add client",
    });
  }
};

// ===== UPDATE =====
exports.updateClient = async (req, res) => {
  try {
    const user = req.user;

    const existing = await ClientService.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Client not found" });

    const data = req.body;

    if (req.file) {
      data.client_photo_url = req.file.filename;

      // delete old image
      if (existing.client_photo_url) {
        const oldPath = path.join(
          __dirname,
          "../uploads/documents/client",
          existing.client_photo_url,
        );

        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updated = await ClientService.update(req.params.id, data, user);

    res.json(updated);
  } catch (err) {
    console.error("UPDATE CLIENT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to update client",
    });
  }
};

// ===== DELETE =====
exports.deleteClient = async (req, res) => {
  try {
    const user = req.user;

    const existing = await ClientService.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Client not found" });

    // delete image
    if (existing.client_photo_url) {
      const filePath = path.join(
        __dirname,
        "../uploads/documents/client",
        existing.client_photo_url,
      );

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await ClientService.delete(req.params.id, user);

    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("DELETE CLIENT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to delete client",
    });
  }
};
