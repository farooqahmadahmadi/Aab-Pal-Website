const Payments = require("../models/PaymentsInfo");
const Invoice = require("../models/InvoicesInfo");
const CashTransaction = require("../models/CashTransactionsInfo");
const db = require("../models");
const { recalculateInvoice } = require("../services/invoicesService");

// 🔥 helper: update invoice paid_amount
const updateInvoicePaid = async (invoice_id, amount, type, t) => {
  const invoice = await Invoice.findByPk(invoice_id, { transaction: t });
  if (!invoice) throw new Error("Invoice not found");

  const currentPaid = parseFloat(invoice.paid_amount) || 0;

  let newPaid = currentPaid;
  if (type === "add") newPaid = currentPaid + amount;
  if (type === "subtract") newPaid = currentPaid - amount;

  if (newPaid < 0) newPaid = 0;

  await invoice.update({ paid_amount: newPaid }, { transaction: t });
};

// 🔥 helper: validate invoice status
const validateInvoice = async (invoice_id, t) => {
  const invoice = await Invoice.findByPk(invoice_id, { transaction: t });
  if (!invoice) throw new Error("Invoice not found");

  if (["Paid", "Cancelled"].includes(invoice.invoice_status)) {
    throw new Error("Cannot modify payment: Invoice is closed");
  }

  return invoice;
};

// 🔥 helper: create/update cash transaction (FIXED)
const upsertCashTransaction = async (payment, invoice, t) => {
  const type = invoice.invoice_type === "In" ? "Income" : "Expense";

  const existing = await CashTransaction.findOne({
    where: {
      reference_id: payment.payment_id,
      reference_type: "InvoicePayment",
    },
    transaction: t,
  });

  const payload = {
    project_id: invoice.project_id || null,
    transaction_type: type,
    amount: payment.payment_amount,
    reference_id: payment.payment_id,
    reference_type: "InvoicePayment",
    transaction_description: "Invoice Payment",
    transaction_date: new Date(),
    is_deleted: false,
  };

  if (existing) {
    await existing.update(payload, { transaction: t });
  } else {
    await CashTransaction.create(payload, { transaction: t });
  }
};

// 🔥 helper: soft delete cash transaction
const softDeleteCashTransaction = async (payment_id, t) => {
  await CashTransaction.update(
    { is_deleted: true },
    {
      where: {
        reference_id: payment_id,
        reference_type: "InvoicePayment",
      },
      transaction: t,
    },
  );
};

// GET ALL
exports.getAll = async () => {
  return await Payments.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// CREATE
exports.create = async (data) => {
  return await db.sequelize.transaction(async (t) => {
    const invoice = await validateInvoice(data.invoice_id, t);

    const payment = await Payments.create(data, { transaction: t });

    if (payment.payment_status === "Completed") {
      await updateInvoicePaid(
        payment.invoice_id,
        parseFloat(payment.payment_amount) || 0,
        "add",
        t,
      );

      await upsertCashTransaction(payment, invoice, t);
    }

    await recalculateInvoice(payment.invoice_id, t);

    return payment;
  });
};

// UPDATE
exports.update = async (id, data) => {
  return await db.sequelize.transaction(async (t) => {
    const item = await Payments.findOne({
      where: { payment_id: id, is_deleted: false },
      transaction: t,
    });

    if (!item) throw new Error("Payment not found");

    const invoice = await validateInvoice(item.invoice_id, t);

    const oldStatus = item.payment_status;
    const newStatus = data.payment_status ?? oldStatus;

    const oldAmount = parseFloat(item.payment_amount) || 0;

    // 🔻 remove old effect
    if (oldStatus === "Completed") {
      await updateInvoicePaid(item.invoice_id, oldAmount, "subtract", t);
    }

    await item.update(data, { transaction: t });

    const newAmount = parseFloat(item.payment_amount) || 0;

    // 🔺 apply new effect
    if (newStatus === "Completed") {
      await updateInvoicePaid(item.invoice_id, newAmount, "add", t);
      await upsertCashTransaction(item, invoice, t);
    } else {
      await softDeleteCashTransaction(item.payment_id, t);
    }

    await recalculateInvoice(item.invoice_id, t);

    return item;
  });
};

// DELETE (soft)
exports.remove = async (id) => {
  return await db.sequelize.transaction(async (t) => {
    const item = await Payments.findOne({
      where: { payment_id: id, is_deleted: false },
      transaction: t,
    });

    if (!item) throw new Error("Payment not found");

    await validateInvoice(item.invoice_id, t);

    const amount = parseFloat(item.payment_amount) || 0;

    if (item.payment_status === "Completed") {
      await updateInvoicePaid(item.invoice_id, amount, "subtract", t);
      await softDeleteCashTransaction(item.payment_id, t);
    }

    await item.update({ is_deleted: true }, { transaction: t });

    await recalculateInvoice(item.invoice_id, t);
  });
};
