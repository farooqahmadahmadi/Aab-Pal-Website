const Contract = require("../models/ContractInfo");
const path = require("path");
const fs = require("fs");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// GET
exports.getContracts = async () => {
  return await Contract.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// CREATE
exports.createContract = async (data, user = {}) => {
  const item = await Contract.create(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "contract_info",
    reference_record_id: item.contract_id,
    old_value: null,
    new_value: item.toJSON(),
  });

  return item;
};

// UPDATE
exports.updateContract = async (id, data, user = {}) => {
  const item = await Contract.findOne({
    where: { contract_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Contract not found");

  const oldValue = item.toJSON();

  // 🔥 replace file
  if (data.contract_file_url && item.contract_file_url) {
    const oldPath = path.join(__dirname, "..", item.contract_file_url);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  await item.update(data);

  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "contract_info",
    reference_record_id: item.contract_id,
    old_value: oldValue,
    new_value: item.toJSON(),
  });

  return item;
};

// DELETE (soft/hard via helper + file delete)
exports.deleteContract = async (id, user = {}) => {
  const item = await Contract.findOne({
    where: { contract_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Contract not found");

  const oldFile = item.contract_file_url;

  // 🔥 delete from DB (soft/hard + log)
  await handleDelete(item, user, "contract_info", getUserId(user));

  // 🔥 delete physical file AFTER DB success
  if (oldFile) {
    const filePath = path.join(__dirname, "..", oldFile);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  return true;
};
