const service = require("../services/paymentsInfoService");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    console.error("GET ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const user = req.user;

    const payload = {
      invoice_id: Number(req.body.invoice_id),
      payment_amount: Number(req.body.payment_amount),
      payment_date: req.body.payment_date,

      payment_method: req.body.payment_method
        ? req.body.payment_method.charAt(0).toUpperCase() +
          req.body.payment_method.slice(1).toLowerCase()
        : "Cash",

      payment_status: req.body.payment_status
        ? req.body.payment_status.charAt(0).toUpperCase() +
          req.body.payment_status.slice(1).toLowerCase()
        : "Pending",
    };

    const data = await service.create(payload, user);

    res.status(201).json(data);
  } catch (err) {
    console.error("CREATE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const user = req.user;

    const payload = {
      ...req.body,
      invoice_id: Number(req.body.invoice_id),
      payment_amount: Number(req.body.payment_amount),
    };

    const data = await service.update(req.params.id, payload, user);

    res.json(data);
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.remove(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};
