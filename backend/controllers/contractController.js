const ContractInfo = require("../models/ContractInfo");

// GET all contracts
exports.getAllContracts = async (req, res) => {
    try {
        const contracts = await ContractInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(contracts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contracts", error });
    }
};

// GET contract by ID
exports.getContractById = async (req, res) => {
    try {
        const contract = await ContractInfo.findByPk(req.params.id);
        if (!contract || contract.is_deleted) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json(contract);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contract", error });
    }
};

// CREATE contract
exports.createContract = async (req, res) => {
    try {
        const contract = await ContractInfo.create(req.body);
        res.status(201).json(contract);
    } catch (error) {
        res.status(500).json({ message: "Error creating contract", error });
    }
};

// UPDATE contract
exports.updateContract = async (req, res) => {
    try {
        const contract = await ContractInfo.findByPk(req.params.id);
        if (!contract || contract.is_deleted) {
            return res.status(404).json({ message: "Contract not found" });
        }
        await contract.update(req.body);
        res.status(200).json(contract);
    } catch (error) {
        res.status(500).json({ message: "Error updating contract", error });
    }
};

// DELETE contract (soft delete)
exports.deleteContract = async (req, res) => {
    try {
        const contract = await ContractInfo.findByPk(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        await contract.update({ is_deleted: true });
        res.status(200).json({ message: "Contract deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting contract", error });
    }
};
