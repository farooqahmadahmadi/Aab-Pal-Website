const express = require("express");
const router = express.Router();

const empSalaryController = require("../controllers/empSalaryController");

router.get("/", empSalaryController.getAllSalaries);
router.get("/:id", empSalaryController.getSalaryById);
router.post("/", empSalaryController.createSalary);
router.put("/:id", empSalaryController.updateSalary);
router.delete("/:id", empSalaryController.deleteSalary);

module.exports = router;