const service = require("../services/purchaseOrderItemsService");

// GET all
exports.getAll = async (req, res) => {
  try {
    const data = await service.getItems();
    res.json(data);
  } catch (err) {
    console.error("GET PO ITEMS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const user = req.user;
    const item = await service.createItem(req.body, user);
    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE PO ITEM ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const user = req.user;
    const item = await service.updateItem(req.params.id, req.body, user);
    res.json(item);
  } catch (err) {
    console.error("UPDATE PO ITEM ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const user = req.user;
    await service.deleteItem(req.params.id, user);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE PO ITEM ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};