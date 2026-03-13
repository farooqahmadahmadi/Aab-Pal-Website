const express = require("express");
const router = express.Router();

const equipmentUsageController = require("../controllers/equipmentUsageController");

router.get("/", equipmentUsageController.getAllUsage);
router.get("/:id", equipmentUsageController.getUsageById);
router.post("/", equipmentUsageController.createUsage);
router.put("/:id", equipmentUsageController.updateUsage);
router.delete("/:id", equipmentUsageController.deleteUsage);

module.exports = router;