const service = require("../services/purchaseOrdersService");

// ===== GET =====
exports.getAll = async (req, res) => {
  try {
    const data = await service.getOrders();
    res.status(200).json(data);
  } catch (err) {
    console.error("GET PURCHASE ORDERS ERROR:", err.message);
    res
      .status(500)
      .json({ message: err.message || "Failed to load purchase orders" });
  }
};

// ===== CREATE =====
exports.create = async (req, res) => {
  try {
    const user = req.user;
    const item = await service.createOrder(req.body, user);
    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE PURCHASE ORDER ERROR:", err.message);
    res.status(400).json({ message: err.message || "Failed to create order" });
  }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  try {
    const user = req.user;
    const item = await service.updateOrder(req.params.id, req.body, user);
    res.status(200).json(item);
  } catch (err) {
    console.error("UPDATE PURCHASE ORDER ERROR:", err.message);
    res.status(400).json({ message: err.message || "Failed to update order" });
  }
};

// ===== DELETE =====
exports.remove = async (req, res) => {
  try {
    const user = req.user;
    await service.deleteOrder(req.params.id, user);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE PURCHASE ORDER ERROR:", err.message);
    res.status(400).json({ message: err.message || "Failed to delete order" });
  }
};
