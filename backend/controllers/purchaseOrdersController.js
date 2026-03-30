const service = require("../services/purchaseOrdersService");

exports.getAll = async (req, res) => {
    try {
        const data = await service.getOrders();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const item = await service.createOrder(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await service.updateOrder(req.params.id, req.body);
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await service.deleteOrder(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};