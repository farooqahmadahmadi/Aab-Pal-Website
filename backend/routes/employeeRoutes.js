const express = require("express");
const router = express.Router();
const EmployeeEducationController = require("../controllers/employeeController");

router.get("/", EmployeeEducationController.getAll);
router.get("/:id", EmployeeEducationController.getById);
router.post("/", EmployeeEducationController.create);
router.put("/:id", EmployeeEducationController.update);
router.delete("/:id", EmployeeEducationController.delete);

module.exports = router;