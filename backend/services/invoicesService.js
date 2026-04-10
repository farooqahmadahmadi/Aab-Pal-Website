const Invoices = require("../models/InvoicesInfo");

const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helper
const getUserId = (user) => user?.user_id || user?.id || 0;

//🔹 helper: recalc invoice status
exports.recalculateInvoice = async (invoice_id, t = null) => {
  const invoice = await Invoices.findByPk(invoice_id, { transaction: t });
  if (!invoice) throw new Error("Invoice not found");

  const total = parseFloat(invoice.invoice_amount) || 0;
  const paid = parseFloat(invoice.paid_amount) || 0;
  const dueDate = invoice.invoice_due_date
    ? new Date(invoice.invoice_due_date)
    : null;
  const today = new Date();

  let newStatus = "Pending";

  if (paid === 0) newStatus = "Pending";
  else if (paid < total) newStatus = "Partial";
  else if (paid >= total) newStatus = "Paid";

  if (newStatus !== "Paid" && dueDate && today > dueDate) {
    newStatus = "Overdue";
  }

  await invoice.update({ invoice_status: newStatus }, { transaction: t });
  return invoice;
};

// GET
exports.getAll = async () => {
  return await Invoices.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// CREATE
exports.create = async (data, user = {}) => {
  // normalize nullable fields
  if (!data.invoice_due_date) data.invoice_due_date = null;
  if (!data.reference_type || data.reference_type === "")
    data.reference_type = null;
  if (!data.reference_id || data.reference_id === "") data.reference_id = null;

  const invoice = await Invoices.create(data);

  // 🔥 LOG
  await logService.createLog({
    user_id: getUserId(user),
    action: "CREATE",
    reference_table: "invoices_info",
    reference_record_id: invoice.invoice_id,
    old_value: null,
    new_value: invoice.toJSON(),
  });

  return invoice;
};

// UPDATE
exports.update = async (id, data, user = {}) => {
  const item = await Invoices.findOne({
    where: { invoice_id: id, is_deleted: false },
  });
  if (!item) throw new Error("Invoice not found");

  // normalize nullable fields
  if (!data.invoice_due_date) data.invoice_due_date = null;
  if (!data.reference_type || data.reference_type === "")
    data.reference_type = null;
  if (!data.reference_id || data.reference_id === "") data.reference_id = null;

  const manualStatus = data.invoice_status !== undefined;

  const oldValue = item.toJSON();

  await item.update(data);

  // 🔥 recalc 
  if (!manualStatus) {
    await exports.recalculateInvoice(item.invoice_id);
  }

  // 🔥 LOG
  await logService.createLog({
    user_id: getUserId(user),
    action: "UPDATE",
    reference_table: "invoices_info",
    reference_record_id: item.invoice_id,
    old_value: oldValue,
    new_value: item.toJSON(),
  });

  return item;
};

// DELETE
exports.remove = async (id, user = {}) => {
  const item = await Invoices.findOne({
    where: { invoice_id: id, is_deleted: false },
  });
  if (!item) throw new Error("Invoice not found");

  // 🔥 deleteHelper (soft delete + log)
  await handleDelete(item, user, "invoices_info", getUserId(user));

  return true;
};
