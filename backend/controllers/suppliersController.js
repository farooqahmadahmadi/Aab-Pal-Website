const SuppliersInfo = require("../models/SuppliersInfo");

// GET all suppliers
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await SuppliersInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching suppliers", error });
    }
};

// GET supplier by ID
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await SuppliersInfo.findByPk(req.params.id);
        if (!supplier || supplier.is_deleted) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: "Error fetching supplier", error });
    }
};

// CREATE supplier
exports.createSupplier = async (req, res) => {
    try {
        const supplier = await SuppliersInfo.create(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ message: "Error creating supplier", error });
    }
};

// UPDATE supplier
exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await SuppliersInfo.findByPk(req.params.id);
        if (!supplier || supplier.is_deleted) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        await supplier.update(req.body);
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: "Error updating supplier", error });
    }
};

// DELETE supplier (soft delete)
exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await SuppliersInfo.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        await supplier.update({ is_deleted: true });
        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting supplier", error });
    }
};
