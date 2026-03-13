const PurchaseOrdersInfo = require("../models/PurchaseOrdersInfo");

// GET all purchase orders
exports.getAllPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrdersInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase orders", error });
    }
};

// GET purchase order by ID
exports.getPurchaseOrderById = async (req, res) => {
    try {
        const order = await PurchaseOrdersInfo.findByPk(req.params.id);
        if (!order || order.is_deleted) {
            return res.status(404).json({ message: "Purchase order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase order", error });
    }
};

// CREATE purchase order
exports.createPurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrdersInfo.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error creating purchase order", error });
    }
};

// UPDATE purchase order
exports.updatePurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrdersInfo.findByPk(req.params.id);
        if (!order || order.is_deleted) {
            return res.status(404).json({ message: "Purchase order not found" });
        }
        await order.update(req.body);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error updating purchase order", error });
    }
};

// DELETE purchase order (soft delete)
exports.deletePurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrdersInfo.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Purchase order not found" });
        }
        await order.update({ is_deleted: true });
        res.status(200).json({ message: "Purchase order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting purchase order", error });
    }
};
