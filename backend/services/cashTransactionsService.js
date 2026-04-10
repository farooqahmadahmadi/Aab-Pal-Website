const CashTransaction = require("../models/CashTransactionsInfo");

const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

// GET ALL
exports.getAll = async () => {
  return await CashTransaction.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// CREATE
exports.create = async (data, user = {}) => {
  const item = await CashTransaction.create(data);

  // 🔥 LOG
  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "cash_transactions_info",
    reference_record_id: item.transaction_id,
    old_value: null,
    new_value: item.toJSON(),
  });

  return item;
};

// UPDATE
exports.update = async (id, data, user = {}) => {
  const item = await CashTransaction.findOne({
    where: { transaction_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Transaction not found");

  const oldValue = item.toJSON();

  await item.update(data);

  // 🔥 LOG
  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "cash_transactions_info",
    reference_record_id: item.transaction_id,
    old_value: oldValue,
    new_value: item.toJSON(),
  });

  return item;
};

// DELETE
exports.remove = async (id, user = {}) => {
  const item = await CashTransaction.findOne({
    where: { transaction_id: id, is_deleted: false },
  });

  if (!item) throw new Error("Transaction not found");

  // 🔥 deleteHelper (soft delete + log)
  await handleDelete(item, user, "cash_transactions_info", getUserId(user));

  return true;
};
