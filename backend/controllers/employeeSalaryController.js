const {
  getAllSalaries,
  getSalaryById,
  addSalary,
  updateSalary,
  deleteSalary,
} = require("../services/employeeSalaryService");

// ===== LIST ALL =====
exports.listSalaries = async (req, res) => {
  try {
    const salaries = await getAllSalaries();
    res.json(salaries);
  } catch (err) {
    console.error("LIST SALARY ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch salaries" });
  }
};

// ===== GET BY ID =====
exports.getSalary = async (req, res) => {
  try {
    const salary = await getSalaryById(req.params.id);
    if (!salary)
      return res.status(404).json({ message: "Salary record not found" });
    res.json(salary);
  } catch (err) {
    console.error("GET SALARY ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch salary" });
  }
};

// ===== CREATE =====
exports.createSalary = async (req, res) => {
  try {
    const salary = await addSalary(req.body, req.user);
    res.status(201).json(salary);
  } catch (err) {
    console.error("CREATE SALARY ERROR:", err.message);
    res.status(500).json({ message: err.message || "Failed to add salary" });
  }
};

// ===== UPDATE =====
exports.editSalary = async (req, res) => {
  try {
    const salary = await updateSalary(req.params.id, req.body, req.user);
    res.json(salary);
  } catch (err) {
    console.error("UPDATE SALARY ERROR:", err.message);
    res.status(500).json({ message: err.message || "Failed to update salary" });
  }
};

// ===== DELETE (SOFT/HARD) =====
exports.deleteSalary = async (req, res) => {
  try {
    await deleteSalary(req.params.id, req.user);
    res.json({ message: "Salary deleted successfully" });
  } catch (err) {
    console.error("DELETE SALARY ERROR:", err.message);
    res.status(500).json({ message: err.message || "Failed to delete salary" });
  }
};
