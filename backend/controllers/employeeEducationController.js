const EmployeeEducationService = require("../services/employeeEducationService");

const EmployeeEducationController = {
  // ===== GET ALL =====
  getAll: async (req, res) => {
    try {
      const records = await EmployeeEducationService.getAll();
      res.json(records);
    } catch (err) {
      console.error("GET ERROR:", err.message);
      res.status(500).json({
        message: "Failed to fetch employee education info",
        error: err.message,
      });
    }
  },

  // ===== GET BY ID =====
  getById: async (req, res) => {
    try {
      const record = await EmployeeEducationService.getById(req.params.id);

      if (!record)
        return res.status(404).json({ message: "Not found" });

      res.json(record);
    } catch (err) {
      console.error("GET BY ID ERROR:", err.message);
      res.status(500).json({
        message: "Failed to fetch record",
        error: err.message,
      });
    }
  },

  // ===== CREATE =====
  create: async (req, res) => {
    try {
      const record = await EmployeeEducationService.create(
        req.body,
        req.user
      );

      res.status(201).json(record);
    } catch (err) {
      console.error("CREATE ERROR:", err.message);
      res.status(400).json({
        message: err.message || "Failed to create",
      });
    }
  },

  // ===== UPDATE =====
  update: async (req, res) => {
    try {
      const record = await EmployeeEducationService.update(
        req.params.id,
        req.body,
        req.user
      );

      res.json({
        message: "Updated successfully",
        record,
      });
    } catch (err) {
      console.error("UPDATE ERROR:", err.message);
      res.status(400).json({
        message: err.message || "Failed to update",
      });
    }
  },

  // ===== DELETE =====
  delete: async (req, res) => {
    try {
      await EmployeeEducationService.delete(
        req.params.id,
        req.user
      );

      res.json({ message: "Deleted successfully" });
    } catch (err) {
      console.error("DELETE ERROR:", err.message);
      res.status(400).json({
        message: err.message || "Failed to delete",
      });
    }
  },
};

module.exports = EmployeeEducationController;