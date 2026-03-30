const service = require("../services/purchaseOrdersService");

// GET all
exports.getAll = async (req, res) => {
    try {
        const data = await service.getOrders();
        res.status(200).json(data);
    } catch (err) {
        console.error("GET /purchase-orders error:", err);
        res.status(500).json({ message: err.message || "Failed to load purchase orders" });
    }
};

// CREATE
exports.create = async (req, res) => {
    try {
        const item = await service.createOrder(req.body);
        res.status(201).json(item);
    } catch (err) {
        console.error("POST /purchase-orders error:", err);
        res.status(400).json({ message: err.message || "Failed to create order" });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        const item = await service.updateOrder(req.params.id, req.body);
        res.status(200).json(item);
    } catch (err) {
        console.error(`PUT /purchase-orders/${req.params.id} error:`, err);
        res.status(400).json({ message: err.message || "Failed to update order" });
    }
};

// DELETE
exports.remove = async (req, res) => {
    try {
        await service.deleteOrder(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(`DELETE /purchase-orders/${req.params.id} error:`, err);
        res.status(400).json({ message: err.message || "Failed to delete order" });
    }
};