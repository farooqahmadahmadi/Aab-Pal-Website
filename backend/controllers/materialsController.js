const MaterialsInfo = require("../models/MaterialsInfo");

// GET all materials
exports.getAllMaterials = async (req, res) => {
    try {
        const materials = await MaterialsInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: "Error fetching materials", error });
    }
};

// GET material by ID
exports.getMaterialById = async (req, res) => {
    try {
        const material = await MaterialsInfo.findByPk(req.params.id);
        if (!material || material.is_deleted) {
            return res.status(404).json({ message: "Material not found" });
        }
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ message: "Error fetching material", error });
    }
};

// CREATE material
exports.createMaterial = async (req, res) => {
    try {
        const material = await MaterialsInfo.create(req.body);
        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: "Error creating material", error });
    }
};

// UPDATE material
exports.updateMaterial = async (req, res) => {
    try {
        const material = await MaterialsInfo.findByPk(req.params.id);
        if (!material || material.is_deleted) {
            return res.status(404).json({ message: "Material not found" });
        }
        await material.update(req.body);
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ message: "Error updating material", error });
    }
};

// DELETE material (soft delete)
exports.deleteMaterial = async (req, res) => {
    try {
        const material = await MaterialsInfo.findByPk(req.params.id);
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        await material.update({ is_deleted: true });
        res.status(200).json({ message: "Material deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting material", error });
    }
};
