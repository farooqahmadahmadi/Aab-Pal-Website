const Contract = require("../models/ContractInfo");
const path = require("path");
const fs = require("fs");

// GET
exports.getContracts = async () => {
    return await Contract.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createContract = async (data) => {
    return await Contract.create(data);
};

// UPDATE (🔥 file replace logic)
exports.updateContract = async (id, data) => {
    const item = await Contract.findOne({
        where: { contract_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Contract not found");

    // replace file
    if (data.contract_file_url && item.contract_file_url) {
        const oldPath = path.join(__dirname, "..", item.contract_file_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await item.update(data);
    return item;
};

// DELETE
exports.deleteContract = async (id) => {
    const item = await Contract.findOne({
        where: { contract_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Contract not found");

    if (item.contract_file_url) {
        const filePath = path.join(__dirname, "..", item.contract_file_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await item.update({ is_deleted: true });
};