const EmployeeService = require("../services/employeeService");

// ===== GET ALL =====
exports.getAll = async (req, res) => {
  try {
    const employees = await EmployeeService.getAll();
    res.json(employees);
  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// ===== GET BY ID =====
exports.getById = async (req, res) => {
  try {
    const employee = await EmployeeService.getById(req.params.id);

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (err) {
    console.error("GET EMPLOYEE ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};

// ===== CREATE =====
exports.create = async (req, res) => {
  try {
    const user_id = req.user?.user_id || 0;

    const emp = await EmployeeService.create(req.body, user_id);

    res.status(201).json(emp);
  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err.message);
    res.status(500).json({
      message: "Failed to create employee",
      error: err.message,
    });
  }
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  try {
    const user_id = req.user?.user_id || 0;

    const emp = await EmployeeService.update(req.params.id, req.body, user_id);

    res.json(emp);
  } catch (err) {
    console.error("UPDATE EMPLOYEE ERROR:", err.message);
    res.status(500).json({
      message: "Failed to update employee",
      error: err.message,
    });
  }
};

// ===== DELETE =====
exports.delete = async (req, res) => {
  try {
    const user = req.user; // is need a helper
    await EmployeeService.delete(req.params.id, user);

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("DELETE EMPLOYEE ERROR:", err.message);
    res.status(500).json({
      message: "Failed to delete employee",
      error: err.message,
    });
  }
};
