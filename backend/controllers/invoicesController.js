const InvoicesInfo = require("../models/InvoicesInfo");

// GET all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await InvoicesInfo.findAll({ where: { is_deleted: false } });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoices", error });
    }
};

// GET invoice by ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await InvoicesInfo.findByPk(req.params.id);
        if (!invoice || invoice.is_deleted) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoice", error });
    }
};

// CREATE invoice
exports.createInvoice = async (req, res) => {
    try {
        const invoice = await InvoicesInfo.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error creating invoice", error });
    }
};

// UPDATE invoice
exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await InvoicesInfo.findByPk(req.params.id);
        if (!invoice || invoice.is_deleted) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        await invoice.update(req.body);
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error updating invoice", error });
    }
};

// DELETE invoice (soft delete)
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await InvoicesInfo.findByPk(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        await invoice.update({ is_deleted: true });
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting invoice", error });
    }
};
