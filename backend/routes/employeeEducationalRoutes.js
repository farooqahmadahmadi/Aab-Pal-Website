const express = require("express");
const router = express.Router();

const employeeEducationalController = require("../controllers/employeeEducationalController");

router.get("/", employeeEducationalController.getAllEducation);
router.get("/:id", employeeEducationalController.getEducationById);
router.post("/", employeeEducationalController.createEducation);
router.put("/:id", employeeEducationalController.updateEducation);
router.delete("/:id", employeeEducationalController.deleteEducation);

module.exports = router;