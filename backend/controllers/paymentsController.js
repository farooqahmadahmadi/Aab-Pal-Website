const Payments = require("../models/PaymentsInfo");

// GET all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payments.findAll({ where: { is_deleted: false } });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error });
    }
};

// GET payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payments.findByPk(req.params.id);
        if (!payment || payment.is_deleted) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payment", error });
    }
};

// CREATE payment
exports.createPayment = async (req, res) => {
    try {
        const payment = await Payments.create(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Error creating payment", error });
    }
};

// UPDATE payment
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payments.findByPk(req.params.id);
        if (!payment || payment.is_deleted) {
            return res.status(404).json({ message: "Payment not found" });
        }
        await payment.update(req.body);
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Error updating payment", error });
    }
};

// DELETE payment (soft delete)
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payments.findByPk(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        await payment.update({ is_deleted: true });
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting payment", error });
    }
};
