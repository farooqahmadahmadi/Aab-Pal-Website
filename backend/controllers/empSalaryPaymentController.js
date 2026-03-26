const EmpSalaryPaymentService = require("../services/empSalaryPaymentService");

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await EmpSalaryPaymentService.getAllPayments();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await EmpSalaryPaymentService.getPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = await EmpSalaryPaymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await EmpSalaryPaymentService.updatePayment(req.params.id, req.body);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const deleted = await EmpSalaryPaymentService.deletePayment(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get active EmployeeSalaryInfos
exports.getActiveSalaryInfos = async (req, res) => {
  try {
    const salaries = await EmpSalaryPaymentService.getActiveSalaryInfos();
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
