const service = require("../services/contractService");

// GET
exports.getAll = async (req, res) => {
  try {
    const data = await service.getContracts();
    res.json(data);
  } catch (err) {
    console.error("GET CONTRACT ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const user = req.user;

    if (!req.file)
      return res.status(400).json({ message: "File required" });

    const data = {
      ...req.body,
      contract_file_url: `/uploads/documents/contracts/${req.file.filename}`,
    };

    const item = await service.createContract(data, user);

    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE CONTRACT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const user = req.user;
    const data = { ...req.body };

    if (req.file) {
      data.contract_file_url = `/uploads/documents/contracts/${req.file.filename}`;
    }

    const item = await service.updateContract(
      req.params.id,
      data,
      user
    );

    res.json(item);
  } catch (err) {
    console.error("UPDATE CONTRACT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const user = req.user;

    await service.deleteContract(req.params.id, user);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE CONTRACT ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};