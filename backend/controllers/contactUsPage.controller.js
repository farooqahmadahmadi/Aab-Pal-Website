const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../services/contactUsPage.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await getAll();

    res.json({ data });
  } catch {
    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {
  try {
    const data = await getOne(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(data);
  } catch {
    res.status(500).json({
      message: "Error fetching message",
    });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const result = await create(req.body);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const result = await update(req.params.id, req.body);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    await remove(req.params.id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
