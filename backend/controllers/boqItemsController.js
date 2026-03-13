const BoqItemsInfo = require("../models/BoqItemsInfo");

// GET all BOQ items
exports.getAllBoqItems = async (req, res) => {
    try {
        const boqItems = await BoqItemsInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(boqItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching BOQ items", error });
    }
};

// GET BOQ item by ID
exports.getBoqItemById = async (req, res) => {
    try {
        const boqItem = await BoqItemsInfo.findByPk(req.params.id);
        if (!boqItem || boqItem.is_deleted) {
            return res.status(404).json({ message: "BOQ item not found" });
        }
        res.status(200).json(boqItem);
    } catch (error) {
        res.status(500).json({ message: "Error fetching BOQ item", error });
    }
};

// CREATE BOQ item
exports.createBoqItem = async (req, res) => {
    try {
        const boqItem = await BoqItemsInfo.create(req.body);
        res.status(201).json(boqItem);
    } catch (error) {
        res.status(500).json({ message: "Error creating BOQ item", error });
    }
};

// UPDATE BOQ item
exports.updateBoqItem = async (req, res) => {
    try {
        const boqItem = await BoqItemsInfo.findByPk(req.params.id);
        if (!boqItem || boqItem.is_deleted) {
            return res.status(404).json({ message: "BOQ item not found" });
        }
        await boqItem.update(req.body);
        res.status(200).json(boqItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating BOQ item", error });
    }
};

// DELETE BOQ item (soft delete)
exports.deleteBoqItem = async (req, res) => {
    try {
        const boqItem = await BoqItemsInfo.findByPk(req.params.id);
        if (!boqItem) {
            return res.status(404).json({ message: "BOQ item not found" });
        }
        await boqItem.update({ is_deleted: true });
        res.status(200).json({ message: "BOQ item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting BOQ item", error });
    }
};
