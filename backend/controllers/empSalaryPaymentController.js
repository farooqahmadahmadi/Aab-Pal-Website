const EmpSalaryPaymentInfo = require("../models/EmpSalaryPaymentInfo");

// GET all salary payments
exports.getAllPayments = async (req, res) => {
    try {
        const records = await EmpSalaryPaymentInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching salary payments", error });
    }
};

// GET payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const record = await EmpSalaryPaymentInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Payment record not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payment", error });
    }
};

// CREATE payment
exports.createPayment = async (req, res) => {
    try {
        const record = await EmpSalaryPaymentInfo.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error creating payment", error });
    }
};

// UPDATE payment
exports.updatePayment = async (req, res) => {
    try {
        const record = await EmpSalaryPaymentInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Payment record not found" });
        }
        await record.update(req.body);
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error updating payment", error });
    }
};

// DELETE payment (soft delete)
exports.deletePayment = async (req, res) => {
    try {
        const record = await EmpSalaryPaymentInfo.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Payment record not found" });
        }
        await record.update({ is_deleted: true });
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting payment", error });
    }
};
