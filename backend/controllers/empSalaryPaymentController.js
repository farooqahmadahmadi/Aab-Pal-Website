const EmpSalaryPaymentService = require("../services/empSalaryPaymentService");

// ===== GET ALL =====
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await EmpSalaryPaymentService.getAllPayments();
    res.json(payments);
  } catch (err) {
    console.error("GET PAYMENTS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// ===== GET BY ID =====
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await EmpSalaryPaymentService.getPaymentById(req.params.id);

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.json(payment);
  } catch (err) {
    console.error("GET PAYMENT ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch payment" });
  }
};

// ===== CREATE =====
exports.createPayment = async (req, res) => {
  try {
    const user = req.user; // 🔥 مهم د logging لپاره

    const payment = await EmpSalaryPaymentService.createPayment(req.body, user);

    res.status(201).json(payment);
  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to create payment",
    });
  }
};

// ===== UPDATE =====
exports.updatePayment = async (req, res) => {
  try {
    const user = req.user; // 🔥 مهم

    const payment = await EmpSalaryPaymentService.updatePayment(
      req.params.id,
      req.body,
      user,
    );

    res.json(payment);
  } catch (err) {
    console.error("UPDATE PAYMENT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to update payment",
    });
  }
};

// ===== DELETE =====
exports.deletePayment = async (req, res) => {
  try {
    const user = req.user; // 🔥 مهم

    await EmpSalaryPaymentService.deletePayment(req.params.id, user);

    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("DELETE PAYMENT ERROR:", err.message);
    res.status(400).json({
      message: err.message || "Failed to delete payment",
    });
  }
};

// ===== GET ACTIVE SALARY INFOS =====
exports.getActiveSalaryInfos = async (req, res) => {
  try {
    const salaries = await EmpSalaryPaymentService.getActiveSalaryInfos();
    res.json(salaries);
  } catch (err) {
    console.error("GET ACTIVE SALARIES ERROR:", err.message);
    res.status(500).json({
      message: "Failed to fetch active salary infos",
    });
  }
};
