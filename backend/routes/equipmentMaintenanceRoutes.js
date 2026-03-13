const express = require("express");
const router = express.Router();

const equipmentMaintenanceController = require("../controllers/equipmentMaintenanceController");

router.get("/", equipmentMaintenanceController.getAllMaintenance);
router.get("/:id", equipmentMaintenanceController.getMaintenanceById);
router.post("/", equipmentMaintenanceController.createMaintenance);
router.put("/:id", equipmentMaintenanceController.updateMaintenance);
router.delete("/:id", equipmentMaintenanceController.deleteMaintenance);

module.exports = router;