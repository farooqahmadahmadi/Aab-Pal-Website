const Invoices = require("../models/InvoicesInfo");

// 🔥 helper: recalculate invoice status
exports.recalculateInvoice = async (invoice_id, t = null) => {
    const invoice = await Invoices.findByPk(invoice_id, { transaction: t });
    if (!invoice) throw new Error("Invoice not found");

    const total = parseFloat(invoice.invoice_amount) || 0;
    const paid = parseFloat(invoice.paid_amount) || 0;
    const dueDate = invoice.due_date ? new Date(invoice.due_date) : null;
    const today = new Date();

    let newStatus = "Pending";

    if (paid === 0) {
        newStatus = "Pending";
    } else if (paid < total) {
        newStatus = "Partial";
    } else if (paid >= total) {
        newStatus = "Paid";
    }

    // ✅ Overdue only if not Paid
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
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.create = async (data) => {
    return await Invoices.create(data);
};

// UPDATE
exports.update = async (id, data) => {
    const item = await Invoices.findOne({
        where: { invoice_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Invoice not found");

    // ✅ manually change allowed: only recalc if invoice_status not provided in payload
    const manualStatus = data.invoice_status !== undefined;

    await item.update(data);

    if (!manualStatus) {
        await exports.recalculateInvoice(item.invoice_id);
    }

    return item;
};

// DELETE (soft)
exports.remove = async (id) => {
    const item = await Invoices.findOne({
        where: { invoice_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Invoice not found");

    await item.update({ is_deleted: true });
};