/* Access Controls
Admin - Full Access
HR - No Access
Financial - Full Access
Project Manager - No Access
Employee - No Access
Client - No Access
*/

const express = require("express");
const router = express.Router();

const equipmentMaintenanceController = require("../controllers/equipmentMaintenanceController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "Financial"), equipmentMaintenanceController.getAllMaintenance);
router.get("/:id", role("Admin", "Financial"), equipmentMaintenanceController.getMaintenanceById);
router.post("/", role("Admin", "Financial"), equipmentMaintenanceController.createMaintenance);
router.put("/:id", role("Admin", "Financial"), equipmentMaintenanceController.updateMaintenance);
router.delete("/:id", role("Admin", "Financial"), equipmentMaintenanceController.deleteMaintenance);

module.exports = router;