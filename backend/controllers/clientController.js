const ClientInfo = require("../models/ClientInfo");

// GET all clients
exports.getAllClients = async (req, res) => {
    try {
        const clients = await ClientInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching clients", error });
    }
};

// GET client by ID
exports.getClientById = async (req, res) => {
    try {
        const client = await ClientInfo.findByPk(req.params.id);
        if (!client || client.is_deleted) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Error fetching client", error });
    }
};

// CREATE client
exports.createClient = async (req, res) => {
    try {
        const client = await ClientInfo.create(req.body);
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: "Error creating client", error });
    }
};

// UPDATE client
exports.updateClient = async (req, res) => {
    try {
        const client = await ClientInfo.findByPk(req.params.id);
        if (!client || client.is_deleted) {
            return res.status(404).json({ message: "Client not found" });
        }
        await client.update(req.body);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Error updating client", error });
    }
};

// DELETE client (soft delete)
exports.deleteClient = async (req, res) => {
    try {
        const client = await ClientInfo.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        await client.update({ is_deleted: true });
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting client", error });
    }
};
