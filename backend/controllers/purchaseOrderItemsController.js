const PurchaseOrderItemsInfo = require("../models/PurchaseOrderItemsInfo");

// GET all purchase order items
exports.getAllPurchaseOrderItems = async (req, res) => {
    try {
        const items = await PurchaseOrderItemsInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase order items", error });
    }
};

// GET purchase order item by ID
exports.getPurchaseOrderItemById = async (req, res) => {
    try {
        const item = await PurchaseOrderItemsInfo.findByPk(req.params.id);
        if (!item || item.is_deleted) {
            return res.status(404).json({ message: "Purchase order item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase order item", error });
    }
};

// CREATE purchase order item
exports.createPurchaseOrderItem = async (req, res) => {
    try {
        const item = await PurchaseOrderItemsInfo.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error creating purchase order item", error });
    }
};

// UPDATE purchase order item
exports.updatePurchaseOrderItem = async (req, res) => {
    try {
        const item = await PurchaseOrderItemsInfo.findByPk(req.params.id);
        if (!item || item.is_deleted) {
            return res.status(404).json({ message: "Purchase order item not found" });
        }
        await item.update(req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error updating purchase order item", error });
    }
};

// DELETE purchase order item (soft delete)
exports.deletePurchaseOrderItem = async (req, res) => {
    try {
        const item = await PurchaseOrderItemsInfo.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Purchase order item not found" });
        }
        await item.update({ is_deleted: true });
        res.status(200).json({ message: "Purchase order item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting purchase order item", error });
    }
};
