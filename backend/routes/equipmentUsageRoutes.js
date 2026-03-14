/* Access Controls
Admin - Full Access
HR - Create, Read Access
Financial - Create, Read Access
Project Manager - Create and Read Access
Employee - No Access
Client - No Access
const role = require("../middlewares/roleMiddleware");
*/

const express = require("express");
const router = express.Router();

const equipmentUsageController = require("../controllers/equipmentUsageController");
const role = require("../middlewares/roleMiddleware");

router.get("/", role("Admin", "HR", "Financial", "Project Manager"), equipmentUsageController.getAllUsage);
router.get("/:id", role("Admin", "HR", "Financial", "Project Manager"), equipmentUsageController.getUsageById);
router.post("/", role("Admin", "HR", "Financial", "Project Manager"), equipmentUsageController.createUsage);
router.put("/:id", role("Admin", "HR", "Financial", "Project Manager"), equipmentUsageController.updateUsage);
router.delete("/:id", role("Admin"), equipmentUsageController.deleteUsage);

module.exports = router;